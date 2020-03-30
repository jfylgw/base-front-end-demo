/**
 * @name openlayers地图工具
 * @description
 * @author: gongjf
 * @date: 2019年11月5日 10:25:42
 */

import * as Ol from "ol";
import * as OlFormat from "ol/format";
import * as OlProj from "ol/proj";
import * as OlGeom from "ol/geom";
import * as OlStyle from "ol/style";
import * as OlLayer from "ol/layer";
import * as OlSource from "ol/source";
import * as OlInteraction from "ol/interaction";
import { createRegularPolygon } from 'ol/interaction/Draw';
import * as OlControl from "ol/control";
import * as OlOption from "./ol-option";

import * as CalculateApi from "api/calculate";

/**
 * 已知bug：
 *  2019/11/11： 
 *      1.geometry2wkt: Geometry对象为Circle时会出现bug
 *      2.createSource：图片图层
 *      3.getFeaturesByIntersects：相交逻辑待优化
 */

/**
 * 地图
 */
export const mapUtil = {
    createMap(id_, option_) {
        let option = option_ || Object.assign({}, OlOption.olParams, OlOption.getOlControls());
        let view = mapUtil.createView(option.defaults.view);
        let map = new Ol.Map({
            target: id_,
            controls: OlControl.defaults(option.defaults.controls),
            interactions: OlInteraction.defaults(option.defaults.interactions),
            renderer: option.defaults.renderer,
            view: view
        });

        // 创建控件
        if (option.controls && option.controls.length > 0) {
            for (let i = 0, iLen = option.controls.length; i < iLen; i++) {
                let control = option.controls[i];
                if (!control.active) continue;
                let olControl = mapUtil.createControl(control);
                if (olControl) {
                    map.addControl(olControl);
                }
            }
        }

        // 更新地图以自适应
        map.updateSize();
        return map;
    },
    createView(option_) {
        option_ = option_ || OlOption.olParams.defaults.view;
        let viewConfig = {
            projection: option_.projection,
            maxZoom: option_.maxZoom,
            minZoom: option_.minZoom,
            rotation: option_.rotation
        };
    
        if (option_.center) {
            viewConfig.center = option_.center;
        }
        if (option_.extent) {
            viewConfig.extent = option_.extent;
        }
        if (option_.zoom) {
            viewConfig.zoom = option_.zoom;
        }
        if (option_.resolutions) {
            viewConfig.resolutions = option_.resolutions;
        }
    
        return new Ol.View(viewConfig);
    },
    createSource(option_) {
        let oSource;
        // 矢量图形，绘制标注用
        if (option_.type === "Vector") {
            oSource = new OlSource.Vector({
                attributions: option_.attributions,
                features: option_.features || new Ol.Collection(),
                wrapX: option_.wrapX ? option_.wrapX : true
            });
        // 坐标，加载瓦片用
        } else if (option_.type === "XYZ") {
            oSource = new OlSource.XYZ({
                url: option_.url,
                attributions: option_.attributions,
                minZoom: option_.minZoom,
                maxZoom: option_.maxZoom,
                projection: option_.projection,
                tileUrlFunction: option_.tileUrlFunction,
                tileLoadFunction: option_.tileLoadFunction,
                wrapX: option_.wrapX ? option_.wrapX : true
            });
        // 静态图片，加载图片用
        } else if(option_.type === 'ImageStatic') {
            oSource = new OlSource.ImageStatic({
                url: option_.url,
                attributions: option_.attributions,
                projection: option_.projection,
                imageExtent: option_.extent,
                imageLoadFunction: option_.imageLoadFunction,
                crossOrigin: option_.crossOrigin
            });
        }
        return oSource;
    },
    createLayer(option_) {
        let oLayer;
        let type = mapUtil.detectLayerType(option_);
        let oSource = mapUtil.createSource(option_.source);
        if (!oSource) return;
    
        let layerConfig = {};
        if (type === "Vector" && option_.clustering) {
            oSource = new OlSource.Cluster({
                source: oSource,
                distance: option_.clusteringDistance
            });
        }
        layerConfig.source = oSource;
    
        for (let property in option_) {
            if (
                option_.hasOwnProperty(property) &&
                property.indexOf("$", 0) !== 0 &&
                property.indexOf("source", 0) !== 0 &&
                property.indexOf("style", 0) !== 0
            ) {
                layerConfig[property] = option_[property];
            }
        }
    
        if (option_.opacity) {
            layerConfig.opacity = option_.opacity;
        }
        if (option_.visible) {
            layerConfig.visible = option_.visible;
        }
        if (option_.extent) {
            layerConfig.extent = option_.extent;
        }
        if (option_.zIndex) {
            layerConfig.zIndex = option_.zIndex;
        }
        if (option_.minResolution) {
            layerConfig.minResolution = option_.minResolution;
        }
        if (option_.maxResolution) {
            layerConfig.maxResolution = option_.maxResolution;
        }
        if (option_.style && type === "TileVector") {
            layerConfig.style = option_.style;
        } else if (option_.style && type === "Vector") {
            if (
                option_.style instanceof Function ||
                typeof option_.style === OlStyle.Style
            ) {
                layerConfig.style = option_.style;
            } else layerConfig.style = styleUtil.createStyle(option_.style);
        }
    
        if (type === "Image") {
            oLayer = new OlLayer.Image(layerConfig);
        } else if (type === "Tile") {
            oLayer = new OlLayer.Tile(layerConfig);
        } else if (type === "Heatmap") {
            oLayer = new OlLayer.Heatmap(layerConfig);
        } else if (type === "Vector") {
            oLayer = new OlLayer.Vector(layerConfig);
        } else if (type === "TileVector") {
            oLayer = new OlLayer.VectorTile(layerConfig);
        }
    
        oLayer.set("name", option_.name);
        oLayer.attributes = Object.assign({
            name: option_.name
        }, oLayer.attributes || {});
    
        // set custom layer properties if given
        if (option_.customAttributes) {
        for (let key in option_.customAttributes) {
            oLayer.set(key, option_.customAttributes[key]);
        }
        }
    
        return oLayer;
    },
    createTileLayer(name_, url_, option_) {
        let name = name_ || 'base';
        let url = url_ || OlOption.mapParams.baseTileUrl;
        return mapUtil.createLayer(OlOption.getTileLayerOption(
            `${name}-tile`, url, option_
        ));
    },
    createImageLayer(name_, url_, option_) {
        let name = name_ || 'base';
        let url = url_ || OlOption.mapParams.baseImageUrl;
        return mapUtil.createLayer(OlOption.getImageLayerOption(
            `${name}-image`, url, option_
        ));
    },
    createAnnoLayer(name_, url_, option_) {
        let name = name_ || 'base';
        let url = url_ || OlOption.mapParams.baseAnnoUrl;
        return mapUtil.createLayer(OlOption.getTileLayerOption(
            `${name}-anno`, url, option_
        ));
    },
    createFeatureLayer(name_, option_) {
        let name = name_ || 'base';
        return mapUtil.createLayer(OlOption.getVectorLayerOption(
            `${name}-feature`, option_
        ));
    },
    detectLayerType(layer_) {
        if (layer_.type) {
            return layer_.type;
        } else {
            switch (layer_.source.type) {
                case "ImageWMS":
                    return "Image";
                case "ImageStatic":
                    return "Image";
                case "GeoJSON":
                case "JSONP":
                case "TopoJSON":
                case "KML":
                case "WKT":
                case "Vector":    
                    return "Vector";
                case "TileVector":
                case "MVT":
                    return "TileVector";
                default:
                    return "Tile";
            }
        }
    },
    createControl(option_) {
        let controlClasses = {
            attribution: OlControl.Attribution,
            fullscreen: OlControl.FullScreen,
            mouseposition: OlControl.MousePosition,
            overviewmap: OlControl.OverviewMap,
            rotate: OlControl.Rotate,
            scaleline: OlControl.ScaleLine,
            zoom: OlControl.Zoom,
            zoomslider: OlControl.ZoomSlider,
            zoomtoextent: OlControl.ZoomToExtent
        };
        if (option_.control) return option_.control;
        return new controlClasses[option_.name](option_);
    },
    createAttribution(option_) {
        let attributions = [];
        if (option_.attribution) {
            attributions.unshift(new Ol.Attribution(option_.attribution));
        }
        return attributions;
    },
    /**
     * 创建绘制互动对象
     * layer_: 指定图层，类型为 ol.layer.Layer
     * option_: 自定义配置，json对象，必须包含drawMode，默认None
     * fn_: 回调方法，接收参数：coord（中心点，地图坐标系）, coords（坐标集合，地图坐标系）, feature（当前绘制的标注对象，ol.Feature）
     */
    createDrawInteraction(layer_, option_, fn_) {
        let interaction = null;

        // 不指定层，或不是图层对象，不往下执行
        if(!layer_ || !(layer_ instanceof OlLayer.Vector)) return interaction;
        
        if(!option_) {
            option_ = {
                mode: 'None',
                snapTolerance: 12
            };
        } else {
            option_.mode = option_.mode || 'None'; // 可选：None、Point、LineString、Polygon、Circle、RegularPolygon，Rectangle
            option_.snapTolerance = option_.snapTolerance ? parseInt(option_.snapTolerance) : 12;
        }

        let { snapTolerance, mode } = option_;
        let geometryFunction, maxPoints;

        if(mode === 'None') {
            return interaction;
        } 
        // 规则多边形（默认画正方形）
        else if(mode === 'RegularPolygon') {
            let edgeNum = option_ && option_.edgeNum ? parseInt(option_.edgeNum) : 4;
            edgeNum = edgeNum && edgeNum > 2 && edgeNum < 17 ? edgeNum : 4;
            mode = "Circle";
            geometryFunction = createRegularPolygon(edgeNum);
        }
        // 矩形
        else if(mode === 'Rectangle') {
            mode = "LineString";
            maxPoints = 2;
            geometryFunction = function(coordinates, geometry) {
                if (!geometry) {
                    geometry = new OlGeom.Polygon([]);
                }
                let start = coordinates[0];
                let end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);
                return geometry;
            };
        }

        interaction = new OlInteraction.Draw({
            source: layer_.getSource(),
            style: layer_.getStyle(),
            type: mode,
            geometryFunction: geometryFunction,
            maxPoints: maxPoints,
            snapTolerance: snapTolerance
        });
    
        // 绑定绘制完成事件
        interaction.on("drawend", function(evt) {
            // 将结果返回给回调方法
            if (fn_ && fn_ instanceof Function) {
                let feature = evt.feature;
                option_.layer = layer_;
                fn_(feature, option_);
            }
        }, this);

        return interaction;
    },
    /**
     * 创建绘制互动对象
     * features_: 指定标注集合，类型为 ol.Feature
     * option_: 自定义配置，json对象
     * fn_: 回调方法，接收参数：coord（中心点，地图坐标系）, coords（坐标集合，地图坐标系）, feature（当前绘制的标注对象，ol.Feature）
     */
    createModifyInteraction(features, option_, fn_) {
        let interaction = null;

        if(!option_) {
            option_ = {
                pixelTolerance: 10
            };
        } else {
            option_.pixelTolerance = option_.pixelTolerance ? parseInt(option_.pixelTolerance) : 10;
        }
        
        let { pixelTolerance } = option_;
        
        interaction = new OlInteraction.Modify({
            features,
            pixelTolerance
        });
        
        // 绑定绘制完成事件
        interaction.on("modifyend", function(evt) {
            // 将结果返回给回调方法
            if (fn_ && fn_ instanceof Function) {
                let feature = evt.target.features_.array_[0];
                fn_(feature, option_);
            }
        }, this);

        return interaction;
    },
    /**
     * 创建选择互动对象
     * option_: 自定义配置，json对象
     * fn_: 回调方法，接收参数：features（ol.Feature 集合）
     */
    createSelectInteraction(option_, fn_) {
        let interaction = null;

        if(!option_) {
            option_ = {
                hitTolerance: 0,
                multi: false
            };
        } else {
            option_.hitTolerance = option_.hitTolerance ? parseInt(option_.hitTolerance) : 0;
            option_.multi = option_.multi || false;
        }
        
        let { hitTolerance, multi, filter, layers } = option_;
        let style = function(feature, resolutions) {
            return [
                new OlStyle.Style({
                    stroke: new OlStyle.Stroke({
                        color: OlOption.mapParams.selectedStyle.strokeBorder.color,
                        width: OlOption.mapParams.selectedStyle.strokeBorder.width * 2 + OlOption.mapParams.selectedStyle.stroke.width
                    })
                }), styleUtil.createStyle(OlOption.mapParams.selectedStyle),
            ];
        };
        
        interaction = new OlInteraction.Select({
            hitTolerance, multi, filter, layers, style
        });

        // 绑定绘制完成事件
        interaction.on("select", function(evt) {
            // 将结果返回给回调方法
            if (fn_ && fn_ instanceof Function) {
                let features = evt.target.getFeatures().getArray();
                option_.selected = evt.selected;
                option_.deselected = evt.deselected;
                fn_(features, option_);
            }
        }, this);

        return interaction;
    },
    /**
     * 创建绘制选择互动对象
     * option_: 自定义配置，json对象，必须包含drawMode，默认None
     * fn_: 回调方法，接收参数：coord（中心点，地图坐标系）, coords（坐标集合，地图坐标系）, feature（当前绘制的标注对象，ol.Feature）
     */
    createDrawSelectInteraction(option_, fn_) {
        if(!option_) {
            option_ = {
                mode: 'None',
                snapTolerance: 12
            };
        } else {
            option_.mode = option_.mode || 'None'; // 可选：None、Point、LineString、Polygon、Circle、RegularPolygon，Rectangle
            option_.snapTolerance = option_.snapTolerance ? parseInt(option_.snapTolerance) : 12;
        }

        let { snapTolerance, mode, filter, layers } = option_;
        let geometryFunction, maxPoints;
        let style = function(feature, resolutions) {
            return [
                new OlStyle.Style({
                    stroke: new OlStyle.Stroke({
                        color: OlOption.mapParams.selectedStyle.strokeBorder.color,
                        width: OlOption.mapParams.selectedStyle.strokeBorder.width * 2 + OlOption.mapParams.selectedStyle.stroke.width
                    })
                }), styleUtil.createStyle(OlOption.mapParams.selectedStyle),
            ];
        };

        if(mode === 'None') {
            return interaction;
        } 
        // 规则多边形（默认画正方形）
        else if(mode === 'RegularPolygon') {
            let edgeNum = option_ && option_.edgeNum ? parseInt(option_.edgeNum) : 4;
            edgeNum = edgeNum && edgeNum > 2 && edgeNum < 17 ? edgeNum : 4;
            mode = "Circle";
            geometryFunction = createRegularPolygon(edgeNum);
        }
        // 矩形
        else if(mode === 'Rectangle') {
            mode = "LineString";
            maxPoints = 2;
            geometryFunction = function(coordinates, geometry) {
                if (!geometry) {
                    geometry = new OlGeom.Polygon([]);
                }
                let start = coordinates[0];
                let end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);
                return geometry;
            };
        }

        // 新建一个选择互动负责高亮样式
        let selectInteraction = new OlInteraction.Select({ style });
        let collection = selectInteraction.getFeatures();

        // 新建一个绘制互动负责绘制范围
        let interaction = new OlInteraction.Draw({
            source: new OlSource.Vector(),
            type: mode,
            geometryFunction: geometryFunction,
            maxPoints: maxPoints,
            snapTolerance: snapTolerance
        });
        
        interaction.on("drawstart", evt => {
            // 清空之前的选中标注
            collection.clear();
        });
        interaction.on("drawend", evt => {
            // 将结果返回给回调方法
            if (fn_ && fn_ instanceof Function) {
                let feature = evt.feature;
                layers = layers && layers.length > 0 ? layers : evt.target.map_.getLayers().getArray();

                // 遍历所有可见的矢量图层
                layers.map((layer) => {
                    if(layer instanceof OlLayer.Group) {
                        let ls = layer.getLayers().getArray();
                        ls.map((l) => {
                            if(l.getVisible()) {
                                // 获取相交标注
                                let fs = mapUtil.getVectorLayerIntersectsFeatures(l, feature, filter);
                                // 累加选中标注
                                fs.map((f) => {
                                    collection.push(f);
                                });
                            }
                        });
                    } else if(layer.getVisible()) {
                        // 获取相交标注
                        let fs = mapUtil.getVectorLayerIntersectsFeatures(layer, feature, filter);
                        // 累加选中标注
                        fs.map((f) => {
                            collection.push(f);
                        });
                    }
                });

                let features = collection.getArray();
                option_.filterFeature = feature;
                fn_(features, option_);
            }
        });

        return {
            Draw: interaction,
            Select: selectInteraction
        };
    },
    /**
     * 移除所有指定地图互动
     * map_：指定地图对象
     * types_：互动对象类型名称集合
     */
    clearInteractions(map_, types_) {
        if(!map_) return;
        let types = types_ && types_.length>0 ? types_ : [
            OlInteraction.Draw, 
            OlInteraction.Modify, 
            OlInteraction.Select
        ];
        // 过滤指定类型互动对象
        let interactions = map_.getInteractions().getArray();
        interactions = interactions.filter((interaction) => {
            return types.findIndex((type) => {
                return interaction instanceof type;
            }) > -1;
        });
        // 移除互动对象
        interactions.map((v) => {
            if(v.features_) v.features_.clear();
            map_.removeInteraction(v);
        });
    },
    /**
     * 获取相交标注
     * layer: 指定图层
     * feature: 绘制标注，类型为ol.Feature
     * customFilter：自定义过滤方法，接收三个参数：绘制标注、指定图层的相交标注集、指定图层
     */
    getVectorLayerIntersectsFeatures(layer, feature, customFilter) {
        let fs = [];
        if(!(layer instanceof OlLayer.Vector) || !layer.getVisible()) return fs;

        fs = layer.getSource().getFeatures();
        if(!fs || fs.length === 0) return fs;

        // 1.按最大矩形过滤
        fs = mapUtil.getFeaturesByExtent(feature, fs);
        // 2.按点在面内过滤
        fs = mapUtil.getFeaturesByInsidePoints(feature, fs);
        // // 3.按边相交过滤
        // fs = mapUtil.getFeaturesByIntersects(feature, fs);
        // 4.按自定义规则过滤
        if(customFilter && customFilter instanceof Function) {
            fs = customFilter(feature, fs, layer);
        }
        return fs;
    },
    /**
     * 获取与指定标注出现最大矩形相交的情况的标注
     * feature: 绘制标注，类型为ol.Feature
     * features: 选中标注集合，类型为ol.Feature
     */
    getFeaturesByExtent(feature_, features_) {
        let result = [];
        if(!feature_ || !features_ || features_.length === 0) return result;
        
        let geometry = feature_.getGeometry();
        result = features_.filter((f) => {
            let g = f.getGeometry();
            return g.intersectsExtent(geometry.getExtent()) || geometry.intersectsExtent(g.getExtent())
        });
        return result;
    },
    /**
     * 获取与指定标注出现点在面内的情况的标注
     * 不判断点在边上的情况
     * feature_：ol.Feature
     * features_：ol.Feature集合
     */
    getFeaturesByInsidePoints(feature_, features_) {
        let result = [];
        if(!feature_ || !features_ || features_.length === 0) return result;

        let geometry = feature_.getGeometry();
        result = features_.filter((f) => {
            let g = f.getGeometry();
            if(geometry.getType() === 'Polygon') {
                if(g.getType() === 'Polygon') {
                    // 第一次比较：目标多边形的点是否在指定多边形内
                    let points = g.getCoordinates()[0];
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return geometry.intersectsCoordinate(points[i]);
                    }
                    // 第二次比较：指定多边形的点是否在目标多边形内
                    points = geometry.getCoordinates()[0];
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return g.intersectsCoordinate(points[i]);
                    }
                }
                else if(g.getType() === 'Circle') {
                    // 第一次比较：指定多边形的点是否在目标圆形内
                    let points = geometry.getCoordinates()[0];
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return g.intersectsCoordinate(points[i]);
                    }
                    // 第二次比较：目标圆形的中心是否在指定多边形内
                    return geometry.intersectsCoordinate(g.getCenter());
                }
                else if(g.getType() === 'LineString') {
                    let points = g.getCoordinates();
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return geometry.intersectsCoordinate(points[i]);
                    }
                }
                else if(g.getType() === 'Point') {
                    geometry.intersectsCoordinate(g.getCoordinates());
                }
            }
            else if(geometry.getType() === 'Circle') {
                if(g.getType() === 'Polygon') {
                    // 第一次比较：目标多边形的点是否在指定圆形内
                    let points = g.getCoordinates()[0];
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return geometry.intersectsCoordinate(points[i]);
                    }
                    // 第二次比较：指定圆形的中心是否在目标多边形内
                    return g.intersectsCoordinate(geometry.getCenter());
                }
                else if(g.getType() === 'Circle') {
                    // 第一次比较：目标圆形的中心是否在指定圆形内
                    return geometry.intersectsCoordinate(g.getCenter());
                }
                else if(g.getType() === 'LineString') {
                    let points = g.getCoordinates();
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return geometry.intersectsCoordinate(points[i]);
                    }
                }
                else if(g.getType() === 'Point') {
                    geometry.intersectsCoordinate(g.getCoordinates());
                }
            }
            else if(geometry.getType() === 'LineString') {
                if(g.getType() === 'Polygon' || g.getType() === 'Circle') {
                    let points = geometry.getCoordinates();
                    for(let i=0, iLen=points.length; i<iLen; i++) {
                        return g.intersectsCoordinate(points[i]);
                    }
                }
            }
        });
        return result;
    },
    /**
     * 获取与指定标注出现边相交的情况的标注
     * feature_：ol.Feature
     * features_：ol.Feature集合
     */
    getFeaturesByIntersects(feature_, features_) {
        let result = [];
        if(!feature_ || !features_ || features_.length === 0) return result;

        result = features_;

        return result;
    },
    /**
     * 克隆标注到指定标注层
     * feature_：克隆目标，类型为ol.Feature
     * style_：标注样式，类型为ol.style.Style
     */
    cloneFeature(feature_, style_) {
        let feature = feature_.clone();
        feature.setId(feature_.getId());
        // 如果指定了样式，就用指定样式
        if (style_) feature.setStyle(style_);
        return feature;
    },
    /**
   * 获取几何对象中心点
   * geometry_：几何对象，类型为 ol.geom.Geometry
   */
    getCenterByGeometry(geometry_) {
        let type = geometry_.getType();
        if (type === "Point") {
            return geometry_.getCoordinates();
        } else if (type === "Circle") {
            return geometry_.getCenter();
        } else if (type === "LineString") {
            return geometry_.getFirstCoordinate();
        } else if (type === "Polygon") {
            return geometry_
                .getInteriorPoint()
                .getCoordinates()
                .slice(0, 2);
        }
    },
    /**
   * 获取wkt对应的中心点
   * wkt_：wkt字符串
   */
    getCenterByWkt(wkt_) {
        return mapUtil.getCenterByGeometry(transformUtil.wkt2geometry(wkt_));
    },
    /**
     * 添加覆盖物
     * element_：自定义展示内容
     * wkt_：wkt字符串
     * offset_：格式为：[水平偏移，垂直偏移]，默认为[0,0]，起点为展示内容左上角，横轴向右为正，纵轴向下为正
     * 返回ol.Overlay
     */
    addOverlay(element_, wkt_, offset_) {
        if (!element_ || !wkt_) return null;
        let offset = offset_ || [0, 0];
        let overlay = new Ol.Overlay({
            id: element_.id,
            position: mapUtil.getCenterByWkt(wkt_),
            element: element_,
            offset,
            autoPan: true,
            autoPanAnimation: {
                duration: 250 // 当OverLay超出地图边界时，为了OverLay全部可见，地图平移的耗时，单位毫秒.
            }
        });
        return overlay;
    },
};

/**
 * 样式
 */
export const styleUtil = {
    /**
     * 创建样式
     * style：样式集合，类型为键值对
     */
    createStyle(style_) {
        let style = {
            stroke: new OlStyle.Stroke(style_.stroke),
            fill: new OlStyle.Fill(style_.fill),
            image: {}
        };
        let image = style_.image || style_.brush;
        
        if (image && image.type === "Circle") {
            style.image.radius = image.radius || 4;
            style.image.stroke = image.stroke ? new OlStyle.Stroke(image.stroke) : style.stroke;
            style.image.fill = image.fill ? new OlStyle.Fill(image.fill) : style.fill;
            style.image = new OlStyle.Circle(style.image);
        } else if (image && image.type === "Icon") {
            style.image = new OlStyle.Icon(image);
        }
        return new OlStyle.Style(style);
    },
    /**
     * 将样式转换为json对象
     * style_：目标样式，类型为 ol.style.Style
     */
    styleToJson(style_) {
        let style = style_;
        let stroke = {
            color: style.stroke_.getColor(),
            width: style.stroke_.getWidth()
        };
        let fill = {
            color: style.fill_.getColor()
        };
        let image = {
            offset: style.image_.getOffset(),
            size: style.image_.getSize(),
            src: style.image_.getSrc()
        };
        return {
            stroke: stroke,
            fill: fill,
            image: image
        };
    },
    /**
     * 创建样式
     * stroke_：标注线条样式，类型为json字符串
     * fill_：标注填充样式，类型为json字符串
     * image_：标注图标样式，类型为json字符串
     */
    createStyleByJsonString(stroke_, fill_, image_) {
        let stroke = stroke_ ? JSON.parse(stroke_) : null;
        let fill = fill_ ? JSON.parse(fill_) : null;
        let image = image_ ? JSON.parse(image_) : null;
        if (!stroke || !fill) return null;
        let style = { stroke, fill, image };
        return styleUtil.createStyle(style);
    },
    /**
     * 将样式转换为json字符串
     * style_：目标样式，类型为 ol.style.Style，默认为 draw_style
     */
    styleToJsonString(style_) {
        return JSON.stringify(styleUtil.styleToJson(style_));
    }
};

/**
 * 转换
 */
export const transformUtil = {
    /**
     * 将业务用的坐标系转化为地图用的坐标系
     * coord_：业务坐标，坐标类型见变量 OlOption.bizProjection 的值
     * 返回地图坐标，坐标类型见变量 OlOption.mapProjection 的值
     */
    coord_biz2map(coord_) {
        if(OlOption.bizProjection === OlOption.mapProjection) return coord_;
        return OlProj.transform(
            [parseFloat(coord_[0]), parseFloat(coord_[1])],
            OlOption.bizProjection,
            OlOption.mapProjection
        );
    },
    /**
     * 将地图用的坐标系转化为业务用的坐标系
     * coord_：地图坐标，坐标类型见变量 mapCoordSystem 的值
     * 返回业务坐标，坐标类型见变量 dataCoordSystem 的值
     */
    coord_map2biz(coord_) {
        if(OlOption.bizProjection === OlOption.mapProjection) return coord_;
        return OlProj.transform(
            [parseFloat(coord_[0]), parseFloat(coord_[1])],
            OlOption.mapProjection,
            OlOption.bizProjection
        );
    },
    /**
     * 将业务坐标数组转化为地图坐标数组
     * coords_：地图坐标数组，坐标类型见变量 dataCoordSystem 的值
     * 返回业务坐标集合，坐标类型见变量 mapCoordSystem 的值
     */
    coords_biz2map(coords_) {
        let mapCoords = [];
        for (let i = 0, len = coords_.length; i < len; i++) {
            let coord = coords_[i];
            let transCoord = transformUtil.coord_biz2map(coord);
            mapCoords.push(transCoord);
        }
        return mapCoords;
    },
    /**
     * 将地图坐标数组转化为业务坐标数组
     * coords_：地图坐标数组，坐标类型见变量 mapCoordSystem 的值
     * 返回业务坐标集合，坐标类型见变量 dataCoordSystem 的值
     */
    coords_map2biz(coords_) {
        let dataCoords = [];
        for (let i = 0, len = coords_.length; i < len; i++) {
            let coord = coords_[i];
            let transCoord = transformUtil.coord_map2biz(coord);
            dataCoords.push(transCoord);
        }
        return dataCoords;
    },
    /**
     * 业务坐标数组转成屏幕坐标数组
     * coords_:经纬度集合,只接受数组
     */
    coords_biz2screen(coords_, width_, height_) {
            const width = width_ || 200;
            const height = height_ || 200;
            let lonList = [], latList = [];
            let screenCoors = [];
            for (let i = 0; i < coords_.length; i++) {
                let coord = coords_[i];
                lonList.push(parseFloat(coord[0]));
                latList.push(parseFloat(coord[1]));
            }
            let minLon = Math.min.apply(null, lonList), maxLon = Math.max.apply(null, lonList);
            let minLat = Math.min.apply(null, latList), maxLat = Math.max.apply(null, latList);
            let maxX = calculateUtil.distance(maxLat, minLon, maxLat, maxLon);
            let maxY = calculateUtil.distance(maxLat, minLon, minLat, minLon);
            let scale = 1;
            let xDeviation = 0, yDeviation = 0;
            //通过最大的坐标范围来作为转为系数边框,以及计算偏移量作居中
            if (maxX >= maxY) {
                scale = width / maxX;
                //差值小的轴进行偏移
                yDeviation = ((maxX - maxY) * scale) / 2;
            } else {
                scale = height / maxY;
                //差值小的轴进行偏移
                xDeviation = ((maxY - maxX) * scale) / 2;
            }
            //计算偏移距离
            for (let i = 0; i < coords_.length; i++) {
                let coord = coords_[i];
                let xDis =
                    calculateUtil.distance(maxLat, minLon, maxLat, parseFloat(coord[0])) *
                    scale;
                let yDis =
                    calculateUtil.distance(maxLat, minLon, parseFloat(coord[1]), minLon) *
                    scale;
                let screenCoor = xDis + xDeviation + " " + (yDis + yDeviation) + " ";
                screenCoors.push(screenCoor);
            }
            return screenCoors;
    },
    /**
     * 业务坐标范围转换为地图坐标范围
     * extent_：格式为 [x1,y1,x2,y2]
     */
    extent_biz2map(extent_) {
        if(OlOption.bizProjection === OlOption.mapProjection) return extent_;
        return OlProj.transformExtent(
            extent_,
            OlOption.bizProjection,
            OlOption.mapProjection
        );
    },
    /**
     * 地图坐标范围转换为业务坐标范围
     * extent_：格式为 [x1,y1,x2,y2]
     */
    extent_map2biz(extent_) {
        if(OlOption.bizProjection === OlOption.mapProjection) return extent_;
        return OlProj.transformExtent(
            extent_,
            OlOption.mapProjection,
            OlOption.bizProjection
        );
    },
    /**
     * wkt字符串转Geometry对象
     * wkt: wkt字符串
     * sourceProj: 源坐标系，默认 OlOption.bizProjection
     * targetProj: 目标坐标系，默认 OlOption.mapProjection
     */
    wkt2geometry(wkt_, sourceProj_, targetProj_) {
        sourceProj_ = sourceProj_ || OlOption.bizProjection;
        targetProj_ = targetProj_ || OlOption.mapProjection;
        let geometry = new OlFormat.WKT().readGeometry(wkt_);
        if (sourceProj_ !== targetProj_) {
            geometry.transform(sourceProj_, targetProj_);
        }
        return geometry;
    },
    /**
     * Geometry对象转wkt字符串
     * @param geometry_: 几何对象
     * @param sourceProj_: 源坐标系，默认 OlOption.mapProjection
     * @param targetProj_: 目标坐标系，默认 OlOption.bizProjection
     * @return {string}
     */
    geometry2wkt(geometry_, sourceProj_, targetProj_) {
        sourceProj_ = sourceProj_ || OlOption.mapProjection;
        targetProj_ = targetProj_ || OlOption.bizProjection;
        if (sourceProj_ !== targetProj_) {
            geometry_ = geometry_.clone().transform(sourceProj_, targetProj_);
        }
        return new OlFormat.WKT().writeGeometry(geometry_);
    },
    /**
     * 将WKT字符串转化为标注
     * wkt_：WKT字符串，只接受单个标注格式
     * id_：标注ID
     * option_: 自定义配置
     */
    wkt2feature(wkt_, id_, option_) {
        let geometry = transformUtil.wkt2geometry(wkt_);
        let feature = new Ol.Feature(geometry);
        feature.setId(id_);
        option_ = Object.assign({}, option_);
        feature.setStyle(option_.style);
        feature.attributes = option_;
        return feature;
    },
    /**
     * 将标注转化为WKT字符串
     * feature_：标注，类型为ol.Feature
     */
    feature2wkt(feature_) {
        return transformUtil.geometry2wkt(feature_.getGeometry());
    },
    /**
     * 将业务坐标集合转换为WKT字符串
     * coords_：业务坐标集合
     * type_：标注类型
     */
    bizCoords2wkt(coords_, type_) {
        let coords = transformUtil.coords_biz2map(coords_);
        return transformUtil.mapCoords2wkt(coords, type_);
    },
    /**
     * 将地图坐标集合转换为WKT字符串
     * coords_：地图坐标集合
     * type_：标注类型
     */
    mapCoords2wkt(coords_, type_) {
        let coords = coords_ || [];
        let type = type_ || "Point";
        let geometry;
        if (type === "Point") {
            geometry = new OlGeom.Point(coords[0]); // [x,y]
        } else if (type === "Circle") {
            geometry = new OlGeom.Circle([coords[0][0], coords[0][1]], coords[0][2]); // [x,y,r]
        } else if (type === "LineString") {
            geometry = new OlGeom.LineString(coords); // [[x1,y1], [x2,y2]...[xn, yn]]
        } else if (type === "Polygon") {
            geometry = new OlGeom.Polygon([coords]); // [[[x1,y1], [x2,y2]...[xn, yn]]]
        }
        return transformUtil.geometry2wkt(geometry);
    },
    /**
     * 将WKT字符串转化为地图坐标集合
     * wkt_：WKT字符串，只接受单个标注格式
     */
    wkt2mapCoords(wkt_) {
        let geom = transformUtil.wkt2geometry(wkt_);
        return geom.getCoordinates();
    },
    /**
     * 将WKT字符串转化为业务坐标集合
     * wkt_：WKT字符串，只接受单个标注格式
     */
    wkt2bizCoords(wkt_) {
        let geom = transformUtil.wkt2geometry(
            wkt_,
            OlOption.bizProjection,
            OlOption.bizProjection
        );
        return geom.getCoordinates();
    },
    /**
     * 将wkt字符串转化为屏幕坐标集合
     * wkt_：WKT字符串，只接受单个标注格式
     * width_: 宽度,确定屏幕最大宽度,算比例用
     * height_: 高度,确定屏幕最大高度,算比例用
     */
    wkt2screenCoords(wkt_, width_, height_) {
        let width = width_ || 200;
        let height = height_ || 200;
        let coords = transformUtil.wkt2bizCoords(wkt_);
        if (transformUtil.getGeometryTypeByWkt(wkt_) === "Polygon") {
            coords = coords[0];
        }
        return transformUtil.coords_biz2screen(coords, width, height);
    },
    /**
     * 将WKT字符串转化为坐标替换到指定标注中
     * feature_：目标标注，类型为 ol.Feature
     * wkt_：WKT字符串（只接受单个标注形式的字符串，而且要跟目标标注同类型）
     * 返回ol.Feature
     */
    setFeatureGeometryByWkt(feature_, wkt_) {
        if (!feature_ || !wkt_) return null;
        let geom = transformUtil.wkt2geometry(wkt_);
        let f_geom = feature_.getGeometry();
        if (geom.getType() === f_geom.getType()) {
            feature_.setGeometry(geom);
            return feature_;
        }
        return null;
    },
    /**
     * 根据wkt获取几何对象类型
     * wkt_：WKT字符串，只接受单个标注格式
     */
    getGeometryTypeByWkt(wkt_) {
        return wkt_ && wkt_.indexOf("(") > -1
            ? wkt_.substring(0, wkt_.indexOf("("))
            : null;
    }
};

/**
 * 算法
 */
const PI = 3.14159265358979324;
const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
export const calculateUtil = {
    transformLat(x_, y_) {
        let ret = -100.0 +
            2.0 * x_ +
            3.0 * y_ +
            0.2 * y_ * y_ +
            0.1 * x_ * y_ +
            0.2 * Math.sqrt(Math.abs(x_));
            ret += ((20.0 * Math.sin(6.0 * x_ * PI) + 20.0 * Math.sin(2.0 * x_ * PI)) * 2.0) / 3.0;
            ret += ((20.0 * Math.sin(y_ * PI) + 40.0 * Math.sin((y_ / 3.0) * PI)) * 2.0) / 3.0;
            ret += ((160.0 * Math.sin((y_ / 12.0) * PI) + 320 * Math.sin((y_ * PI) / 30.0)) * 2.0) / 3.0;
        return ret;
    },
    transformLon(x_, y_) {
        let ret = 300.0 +
        x_ +
        2.0 * y_ +
        0.1 * x_ * x_ +
        0.1 * x_ * y_ +
        0.1 * Math.sqrt(Math.abs(x_));
        ret += ((20.0 * Math.sin(6.0 * x_ * PI) + 20.0 * Math.sin(2.0 * x_ * PI)) * 2.0) / 3.0;
        ret += ((20.0 * Math.sin(x_ * PI) + 40.0 * Math.sin((x_ / 3.0) * PI)) * 2.0) / 3.0;
        ret += ((150.0 * Math.sin((x_ / 12.0) * PI) + 300.0 * Math.sin((x_ / 30.0) * PI)) * 2.0) / 3.0;
        return ret;
    },
    delta(lat_, lon_) {
        const a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        const ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        let dLat = calculateUtil.transformLat(lon_ - 105.0, lat_ - 35.0);
        let dLon = calculateUtil.transformLon(lon_ - 105.0, lat_ - 35.0);
        const radLat = (lat_ / 180.0) * PI;
        let magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
        dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
        return { lat: dLat, lon: dLon };
    },
    /**
     * WGS-84 to GCJ-02(谷歌经纬度)
     */
    gcj_encrypt(wgsLat_, wgsLon_) {
        if (calculateUtil.outOfChina(wgsLat_, wgsLon_)) return { lat: wgsLat_, lon: wgsLon_ };
        const d = calculateUtil.delta(wgsLat_, wgsLon_);
        return { lat: wgsLat_ + d.lat, lon: wgsLon_ + d.lon };
    },
    /**
     * GCJ-02(谷歌经纬度) to WGS-84(GPS)
     */
    gcj_decrypt(gcjLat_, gcjLon_) {
        if (calculateUtil.outOfChina(gcjLat_, gcjLon_)) return { lat: gcjLat_, lon: gcjLon_ };
        const d = calculateUtil.delta(gcjLat_, gcjLon_);
        return { lat: gcjLat_ - d.lat, lon: gcjLon_ - d.lon };
    },
    /**
     * GCJ-02 to WGS-84 exactly
     */
    gcj_decrypt_exact(gcjLat_, gcjLon_) {
        const initDelta = 0.01;
        const threshold = 0.000000001;
        let dLat = initDelta,
            dLon = initDelta;
        let mLat = gcjLat_ - dLat,
            mLon = gcjLon_ - dLon;
        let pLat = gcjLat_ + dLat,
            pLon = gcjLon_ + dLon;
        let wgsLat, wgsLon;
        let i = 0;
        while (i > 10000) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            const tmp = calculateUtil.gcj_encrypt(wgsLat, wgsLon);
            dLat = tmp.lat - gcjLat_;
            dLon = tmp.lon - gcjLon_;
            if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) break;
        
            if (dLat > 0) pLat = wgsLat;
            else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon;
            else mLon = wgsLon;
            ++i;
        }
        return { lat: wgsLat, lon: wgsLon };
    },
    /**
     * GCJ-02 to BD-09(百度)
     */
    bd_encrypt(gcjLat_, gcjLon_) {
        const x = gcjLon_, y = gcjLat_;
        const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        const bdLon = z * Math.cos(theta) + 0.0065;
        const bdLat = z * Math.sin(theta) + 0.006;
        return { lat: bdLat, lon: bdLon };
    },
    /**
     * BD-09 to GCJ-02
     */
    bd_decrypt(bdLat_, bdLon_) {
        const x = bdLon_ - 0.0065, y = bdLat_ - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        const gcjLon = z * Math.cos(theta);
        const gcjLat = z * Math.sin(theta);
        return { lat: gcjLat, lon: gcjLon };
    },
    /**
     * WGS-84 to Web mercator(谷歌WEB墨卡托)
     * mercatorLat -> y mercatorLon -> x
     */
    mercator_encrypt(wgsLat_, wgsLon_) {
        let x = (wgsLon_ * 20037508.34) / 180;
        let y = Math.log(Math.tan(((90 + wgsLat_) * PI) / 360)) / (PI / 180);
        y = (y * 20037508.34) / 180;
        return { lat: y, lon: x };
    },
    /**
     * Web mercator to WGS-84
     * mercatorLat -> y mercatorLon -> x
     */
    mercator_decrypt(mercatorLat_, mercatorLon_) {
        let x = (mercatorLon_ / 20037508.34) * 180;
        let y = (mercatorLat_ / 20037508.34) * 180;
        y = (180 / PI) * (2 * Math.atan(Math.exp((y * PI) / 180)) - PI / 2);
        return { lat: y, lon: x };
    },
    /**
     * 判断是否在中国之外
     */
    outOfChina(lat_, lon_) {
        if (lon_ < 72.004 || lon_ > 137.8347) return true;
        if (lat_ < 0.8293 || lat_ > 55.8271) return true;
        return false;
    },
    /**
     * 计算地表上两点间距离
     */
    distance(latA_, lonA_, latB_, lonB_) {
        const earthR = 6371000;
        const x =
            Math.cos((latA_ * PI) / 180) *
            Math.cos((latB_ * PI) / 180) *
            Math.cos(((lonA_ - lonB_) * PI) / 180);
        const y = Math.sin((latA_ * PI) / 180) * Math.sin((latB_ * PI) / 180);
        let s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        const alpha = Math.acos(s);
        return alpha * earthR;
    },
    /**
     *  判断一个点是否在多边形内部
     *  @param geometry 多边形几何对象
     *  @param point 测试点坐标
     *  返回true为真，false为假
     *  */
    insidePolygon(geometry, point){
        if(!geometry || geometry.getType() !== 'Polygon') return false;
        let points = geometry.getCoordinates()[0];
        let x = point[0], y = point[1];
        let inside = false;
        for (let i=0, j=points.length-1; i<points.length; j=i++) {
            let xi=points[i][0], yi=points[i][1];
            let xj=points[j][0], yj=points[j][1];
            let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    },
    /**
     *  判断一个点是否在圆的内部
     *  @param geometry 圆形几何对象
     *  @param point 测试点坐标
     *  返回true为真，false为假
     *  */
    insideCircle(geometry, point) {
        if(!geometry 
            || geometry.getType() !== 'Circle' 
            || geometry.getRadius() === 0) return false;
        let center = geometry.getCenter();
        let radius = geometry.getRadius();
        let dx = center[0] - point[0]
        let dy = center[1] - point[1]
        return dx * dx + dy * dy <= radius * radius
    },
    /**
     * 通过接口计算长度
     * 单位：千米，原单位：米
     * geometry_: 目标地理对象（线形）
     * fn_：回调方法
     * id_: 标注的对应id
     */
    async calculateLength(geometry_) {
        if (!geometry_) return;
        let calcResult = await CalculateApi.calculateLength(geometry_);
        let output = parseFloat(calcResult.result) || geometry_.getLength();
        output = (output * 0.001).toFixed(2); // 转为千米，保留两位小数
        return output;
    },
    /**
     * 通过接口计算面积
     * 单位：亩，原单位：平方米
     * geometry_: 目标地理对象（多边形）
     * fn_：回调方法
     * id_: 标注的对应id
     */
    async calculateArea(geometry_) {
        if (!geometry_) return;
        let calcResult = await CalculateApi.calculateArea(geometry_);
        let output = parseFloat(calcResult.result) || geometry_.getArea();
        output = (output * 0.0015).toFixed(2); // 1平方米=0.0015亩，保留两位小数
        return output;
    },
    async calculateGeometry(geometry_) {
        if (!geometry_) return;
        if (geometry_ instanceof OlGeom.LineString)
            return await calculateUtil.calculateLength(geometry_);
        else if (geometry_ instanceof OlGeom.Polygon)
            return await calculateUtil.calculateArea(geometry_);
    }
}

