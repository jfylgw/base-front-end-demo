/**
* @name 单瓦片地图组件
* @description
* @author gongjf
* @since 2019年9月25日 11:12:38
*/

<template>
    <div class="context singletilemap-context map-context">
        <!-- 地图 -->
        <div class="map" :id="Id" :ref="Id"></div>
        
        <!-- 经纬度坐标框 -->
        <div class="map-coords" v-show="show.mapCoords">
            <div id="feature-wkt" class="feature-wkt"></div>
            <div id="mouse-click-position" class="mouse-position"></div>
            <div id="mouse-position" class="mouse-position mouse-position-custom"></div>
        </div>

        <!-- 定位工具栏 -->
        <div class="map-tools location-tools" v-show="show.locationTools">
            <div class="map-tool" v-for="tool in mapTools.location" :key="tool.name">
                <a class="tool-btn" :title="tool.name" v-show="tool.show" @click="tool.func()">
                    <i :class="tool.iconfont" v-if="tool.iconfont"></i>
                    <span :class="tool.spanClass" v-if="tool.spanClass"></span>
                </a>
            </div>
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
import * as OlUtil from "assets/js/map/ol-util";
import * as OlOption from "assets/js/map/ol-option";
import mapMixin  from 'assets/js/mixin/mapMixin';

import "ol/ol.css";

export default {
    name: 'SingleTileMap',
    // 注册子组件
    components: {},
    // 外部注入属性
    props: {
        Id: {
            type: String,
            default: 'SingleTileMap'
        },
        Token: {
            type: String,
            default: ''
        },
        UpdateSize: {
            type: Boolean
        },
        // 范围
        Extent: {
            type: String,
            default: null
        }
    },
    mixins: [mapMixin],
    data(){
        return {}
    },
    watch: {
        UpdateSize() {
            this.map.updateSize()
        }
    },
    methods: {
        async init() {
            // 创建地图
            this.map = OlUtil.mapUtil.createMap(this.Id);
            // 地图设置
            this.mapSetting();
            // 图层设置
            await this.layerSetting();
            // 传播事件：地图已准备就绪
            this.$emit(`${this.Id}Loaded`, {});
            // 加载范围
            this.loadExtent();
        },
        /**
         * 图层设置
         */
        async layerSetting() {
            // 瓦片图层
            this.tileLayerGroup = await new OlLayer.Group({
                layers: [
                    OlUtil.mapUtil.createTileLayer()
                ],
                attributes: {
                    name: 'tileLayerGroup'
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
                ],
                attributes: {
                    name: 'extentLayerGroup'
                }
            });

            let mapLayers = this.map.getLayers();
            mapLayers.insertAt(0, this.tileLayerGroup);
            mapLayers.insertAt(1, this.annoLayerGroup);
            mapLayers.insertAt(2, this.extentLayerGroup);
        },
        /**
         * 地图设置
         */
        mapSetting() {
            // 定位到指定位置
            if(this.Extent) this.fitByWkt(this.Extent);
            else this.setCenter(OlOption.mapParams.center);
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
            if(zoom) zoom.style.display = "none";
            if(attribution) attribution.style.display = "none";
        },
        /**
         * 设置中心点
         * coord_：业务坐标对，格式为[x,y]，坐标类型见变量 dataCoordSystem 的值，默认给预设中心点
         * view_：类型为 ol.View
         */
        setCenter(coord) {
            let transCoord = OlUtil.transformUtil.coord_biz2map(coord);
            this.map.getView().animate({
                center: transCoord,
                duration: 250
            });
        },
        /**
         * 加载范围到指定图层中
         */
        loadExtent(extent) {
            extent = extent || this.Extent;
            if(extent && extent.length >0) {
                let feature = OlUtil.transformUtil.wkt2feature(extent);
                let layer = this.getExtentGroupLayerByName('extent')[0];
                layer.getSource().addFeature(feature);
            }
        },
        /**
         * 获取范围图层组中指定名称的图层
         */
        getTileGroupLayerByName(name) {
            let layers = this.tileLayerGroup.getLayers().getArray();
            return layers.filter((layer) => {
                if(layer.attributes && layer.attributes.name === `${name}-tile-layer`) {
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
        changeTile(bizUuid) {
            let url = OlOption.mapParams.baseTileUrl;

            if(bizUuid) {
                // 私有库图层地址
                url = OlOption.getXagPrivateTileUrl(bizUuid, this.Token);
            }

            // 设置新瓦片源
            let layer = this.getTileGroupLayerByName('base')[0];
            let source = OlUtil.mapUtil.createSource({
                type: "XYZ",
                url: url,
                attributions: {
                    vectorName: 'base-tile-source'
                },
            });
            layer.setSource(source);
        },
        changeExtent(extent) {
            // 移除之前的标注
            let layer = this.getExtentGroupLayerByName('extent')[0];
            layer.getSource().clear();

            if(extent) {
                this.Extent = extent;
                // 加载范围
                this.loadExtent(extent);
                // 定位到指定位置
                this.fitByWkt(extent);
            }
        },
        /**
         * 显隐范围图层
         */
        toggleExtentLayer() {
            let layer = this.getExtentGroupLayerByName('extent')[0];
            if(layer.getVisible()) layer.setVisible(false);
            else layer.setVisible(true);
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
};
</script>