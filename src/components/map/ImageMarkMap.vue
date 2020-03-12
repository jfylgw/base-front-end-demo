/**
* @name 图片标注地图组件
* @description
* @author gongjf
* @since 2019年11月11日 11:12:38
*/

<template>
    <div class="context imagemarkmap-context map-context">
        <!-- 地图 -->
        <div class="map" :id="Id" :ref="Id"></div>

        <!-- 经纬度坐标框 -->
        <div class="map-coords" v-show="show.mapCoords">
            <div id="feature-wkt" class="feature-wkt"></div>
            <div id="mouse-click-position" class="mouse-position"></div>
            <div id="mouse-position" class="mouse-position mouse-position-custom"></div>
        </div>

        <!-- 缩放工具栏 -->
        <div class="map-tools zoom-tools" v-show="show.zoomTools">
            <div class="map-tool" v-for="tool in mapTools.zoom" :key="tool.name">
                <a class="tool-btn" :title="tool.name" v-show="tool.show" @click="tool.func()">
                    <i :class="tool.iconfont" v-if="tool.iconfont"></i>
                    <span :class="tool.spanClass" v-if="tool.spanClass"></span>
                </a>
                <div :class="{'map-panel': tool.isChildVertical, 'map-panel-v': !tool.isChildVertical}"
                    v-if="tool.children && tool.children.length>0">
                    <div class="map-tool" v-for="cTool in tool.children" :key="cTool.name">
                        <a class="tool-btn" :title="cTool.name" v-show="cTool.show" @click.native="cTool.func()">
                            <i :class="cTool.iconfont" v-if="cTool.iconfont"></i>
                            <span :class="cTool.spanClass" v-if="cTool.spanClass"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import * as OlLayer from "ol/layer";
import * as OlFormat from "ol/format";

import * as OlUtil from "assets/js/map/ol-util";
import * as OlOption from "assets/js/map/ol-option";
import mapMixin  from 'assets/js/mixin/mapMixin';
import * as Formatter from "assets/js/base/formatter";

import "ol/ol.css";

export default {
    name: "ImageMarkMap",
    // 注册子组件
    components: {},
    // 外部注入属性
    props: {
        Id: {
            type: String,
            default: 'ImageMarkMap'
        },
        // 标签集
        LabelSet: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {}
    },
    mixins: [mapMixin],
    methods: {
        async init() {
            let option = Object.assign({}, OlOption.olParams, OlOption.getOlControls(), OlOption.getImageViewOptions());
            // 创建地图
            this.map = OlUtil.mapUtil.createMap(this.Id, option);
            // 地图设置
            this.mapSetting();
            // 图层设置
            await this.layerSetting();
            // 键位设置
            this.keySetting();
            // 传播事件：地图已准备就绪
            this.$emit(`${this.Id}Loaded`, {});
            // wkt转换工具
            this.wktUtil = new OlFormat.WKT();
        },
        /**
         * 图层设置
         */
        async layerSetting() {
            let layers = [];
            // 加载模块标签
            this.LabelSet.map((val) => {
                // 设置样式
                let style = val.config.style;
                style.image = style.brush;
                if(style.brush.isCustom) {
                    style.image.type = 'Icon';           
                } else style.image.type = 'Circle';
                style.image.stroke = style.image.stroke || { ...style.image.fill, width: 2 };
                style.image.fill.color = Formatter.colorRgba(style.image.fill.color, 1);
                
                // 整合配置
                let option = {
                    attributes: val,
                    style: style
                };
                // 创建图层
                layers.push(OlUtil.mapUtil.createFeatureLayer(val.name, option));
            });

            // 图片图层
            this.imageLayerGroup = await new OlLayer.Group({
                layers: [
                    OlUtil.mapUtil.createImageLayer('base')
                ],
                attributes: {
                    name: 'imageLayerGroup'
                }
            });
            // 注记图层
            this.annoLayerGroup = await new OlLayer.Group({
                layers: [
                    OlUtil.mapUtil.createAnnoLayer()
                ],
                attributes: {
                    name: 'annoLayerGroup'
                }
            });
            // 范围边界图层
            this.extentLayerGroup = await new OlLayer.Group({
                layers: [
                    OlUtil.mapUtil.createFeatureLayer('extent'),
                    OlUtil.mapUtil.createFeatureLayer('highlight')
                ],
                attributes: {
                    name: 'extentLayerGroup'
                }
            });
            // 标注图层
            this.featureLayerGroup = await new OlLayer.Group({
                layers: layers,
                attributes: {
                    name: 'featureLayerGroup'
                }
            });
            
            let mapLayers = this.map.getLayers();
            mapLayers.insertAt(0, this.imageLayerGroup);
            mapLayers.insertAt(1, this.annoLayerGroup);
            mapLayers.insertAt(2, this.extentLayerGroup);
            mapLayers.insertAt(3, this.featureLayerGroup);
        },
        /**
         * 地图设置
         */
        mapSetting() {
            // 定位到指定位置
            this.fitByWkt(this.Extent);
            // 获取地图初始缩放等级
            this.interaction.zoom = parseInt(Math.ceil(this.map.getView().getZoom()));
            let zoomDom = this.$el.querySelector(".zoom-lv");
            if(zoomDom) zoomDom.innerHTML = this.interaction.zoom || '-';
            // 隐藏默认工具
            setTimeout(() => {
                this.hideDefaultControls();
            }, 1);
            // 设置获取缩放等级的功能
            this.getZoomLvOnChange();
            // 设置获取点击坐标的功能
            this.getCoordOnClick();
        },
        /**
         * 隐藏默认控件
         */
        hideDefaultControls() {
            let zoom = this.$el.querySelector(".ol-zoom");
            let attribution = this.$el.querySelector(".ol-attribution");
            let scale = this.$el.querySelector(".ol-scale-line");
            if (zoom) zoom.style.display = "none";
            if (attribution) attribution.style.display = "none";
            if (scale) scale.style.display = "none";
        },
        /**
         * 加载标注到指定图层中
         */
        loadMarkSet(markSet) {
            markSet.map((val) => {
                let feature = OlUtil.transformUtil.wkt2feature(val.wkt, val.id, val);
                let geometry = this.wktUtil.readGeometry(val.wkt);
                feature.setGeometry(geometry);

                let layer = this.getFeatureGroupLayerByName(val.type)[0];
                if(layer) {
                    layer.getSource().addFeature(feature);
                }
            });
        },
        /**
         * 加载范围到指定图层中
         */
        loadExtent(extent) {
            extent = extent || this.Extent;
            if(extent && extent.length >0) {
                let feature = OlUtil.transformUtil.wkt2feature(this.Extent);
                let geometry = this.wktUtil.readGeometry(this.Extent);
                feature.setGeometry(geometry);

                let layer = this.getExtentGroupLayerByName('extent')[0];
                layer.getSource().addFeature(feature);
            }
        },
        /**
         * 绘制标注后的回调方法
         */
        onFeatureDrawEnd(feature, option) {
            if (!feature) return;
            // 填充数据
            feature.attributes = Object.assign(feature.attributes || {}, {
                wkt: this.wktUtil.writeGeometry(feature.getGeometry()),
                type: option.layer.attributes.name.split("-")[0]
            });
            this.$emit("FeatureDrawed", { feature });
        },
        /**
         * 修改标注后的回调方法
         */
        onFeatureModifyEnd(feature, option) {
            if(!feature) return;
            // 更新数据
            feature.attributes = Object.assign(feature.attributes || {}, {
                wkt: this.wktUtil.writeGeometry(feature.getGeometry()),
            });
            this.$emit("FeatureModified", { feature });
        },
        /**
         * 选中标注后的回调方法
         */
        onFeatureSelectEnd(features, option) {
            this.selectFeatures = features || [];
        },
        /**
         * 绘制选取标注后的回调方法
         */
        onFeatureDrawSelectEnd(features, option) {
            this.selectFeatures = features || [];
        },
        /**
         * 获取标注图层组中指定名称的图层
         */
        getFeatureGroupLayerByName(name) {
            let layers = this.featureLayerGroup.getLayers().getArray();
            return layers.filter((layer) => {
                if(layer.attributes && layer.attributes.name === `${name}-feature-layer`) {
                    return layer;
                }
            });
        },
        /**
         * 获取范围图层组中指定名称的图层
         */
        getExtentGroupLayerByName(name) {
            let layers = this.extentLayerGroup.getLayers().getArray();
            return layers.filter((layer) => {
                if(layer.attributes && layer.attributes.name === `${name}-feature-layer`) {
                    return layer;
                }
            });
        },
        /**
         * 显隐范围图层
         */
        toggleExtentLayer() {
            let layer = this.getExtentGroupLayerByName("extent")[0];
            if (layer.getVisible()) layer.setVisible(false);
            else layer.setVisible(true);
        },
        /**
         * 重设图片图层
         */
        resetImageLayer(item) {
            let extent = [0, -item.height, item.width, 0];
            // 清除地图互动
            this.clearInteractions();
            // 设置地图视图范围
            let projection = this.map.getView().getProjection();
            projection.setExtent(extent);
            // 设置新图片
            let source = OlUtil.mapUtil.createSource({
                type: "ImageStatic",
                url: item.originalUrl,
                projection: projection,
                extent: extent,
                attributions: {
                    vectorName: 'base-image-source'
                },
            });
            // 地图图片加载开始
            source.on('imageloadstart', () => {
                this.$emit('ImageSourceLoadStart');
            });
            // 地图图片加载完成
            source.on('imageloadend', () => {
                this.$emit('ImageSourceLoaded');
            });
            // 地图图片加载错误
            source.on('imageloaderror', () => {
                this.$emit('ImageSourceLoadError');
            });
            let layer = this.imageLayerGroup.getLayers().getArray()[0];
            layer.setSource(source);
            // 定位视窗
            this.map.getView().fit(extent, this.map.getSize(), {
                padding : [ 5, 5, 5, 5 ]
            });
        }
    },
    mounted() {
        this.init();
    }
}
</script>