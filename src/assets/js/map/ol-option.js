/**
 * @name openlayers地图配置
 * @description
 * @author: gongjf
 * @date: 2019年11月5日 10:25:42
 */

import * as OlLayer from "ol/layer";
import * as OlSource from "ol/source";
import * as OlControl from "ol/control";
import * as OlInteraction from "ol/interaction";
import * as OlCoordinate from "ol/coordinate";
import * as OlProj from "ol/proj";
import * as OlExtent from "ol/extent";

// 坐标系
export const mapProjection = "EPSG:3857"; // 球形墨卡托 / Web墨卡托
export const bizProjection = "EPSG:4326"; // WGS84

// xag地图参数
export const xagParams = {
    // 服务器集合
    serverDomains: ['tile1', 'tile2', 'tile3', 'tile4', 'tile5', 'tile6'],
    subdomains: 'tile{1-6}',
}

// 获取xag私有库地址
export function getXagPrivateTileUrl(uuid_, token_) {
    // return `http://${xagParams.subdomains}.agis.xaircraft.com/data/hmap/private/${uuid_}/{z}/{x}/{y}?${token_}`;
    return `http://47.98.160.46:8088/private/${uuid_}/{z}/{x}/{y}`;
}

// 获取xag公有库地址
export function getXagPublicTileUrl(uuid_, token_) {
    return `http://${xagParams.subdomains}.agis.xaircraft.com/data/hmap/public/${uuid_}/{z}/{x}/{y}?${token_}`;
}

// 天地图参数
export const tdtParams = {
    // 序列号
    token: 'd635542c84497826bf250abfe9badd85',
    // token: 'e2ae50c97d63a4b6242a7227c7654012',
    // token: 'a95ff9f355300b8d1fc937a589801a8f',
    // 瓦片类型
    tileType: 'img', // img, vec
    // 注记类型
    annoType: 'cva', // cia, cva
    // 服务器集合
    serverDomains: ["t0","t1","t2","t3","t4","t5","t6","t7"],
    subdomains: 't{0-7}'
}

/**
 * 地图参数
 */
export const mapParams = {
    // 初始中心点（x, y）
    center:
    [113.410170, 23.174826], // 广州
    // 初始放大等级
    zoomLv: 17,
    // 加载数据的指定缩放级别
    zoomLoadData: 15,
    minZoom: 5,
    maxZoom: 22,
    // 地图坐标系
    mapProjection: mapProjection,
    // 业务坐标系
    bizProjection: bizProjection,
    // 基础瓦片地址
    baseTileUrl: 
        `http://agri-map.xaircraft.com/google/{z}/{x}/{y}.jpeg`,
        // `http://${tdtParams.subdomains}.tianditu.com/DataServer?T=${tdtParams.tileType}_w&x={x}&y={y}&l={z}&tk=${tdtParams.token}`,
    // 基础注记地址
    baseAnnoUrl:
        `http://${tdtParams.subdomains}.tianditu.com/DataServer?T=${tdtParams.annoType}_w&x={x}&y={y}&l={z}&tk=${tdtParams.token}`,
    baseImageUrl:
        '',
        // require('@/assets/image/background/map.png'),
    // 高清瓦片地址
    definationTileUrl:
        `http://agis.xair.cn:8080/vdps/imageService.shtml?act=publicTile&z={z}&x={x}&y={y}`,
    // // 多光谱瓦片地址
    // spectrumTileUrl: 
    //     `http://118.190.86.117:8888/spectrum/{z}/{x}/{y}.png`,
    // 鼠标坐标控件配置
    mousePositionControl: {
        id: "mouse-position",
        className: "mouse-position-custom"
    },
    // 标注聚合距离
    clusteringDistance: 20,
    // 标注样式（其他样式配搭请按照本例子自行编写配置）
    defaultStyle: {
        fill: { color: [255, 150, 45, 0] },
        stroke: { color: [255, 150, 45, 1], width: 2 },
        image: {
            type: "Circle",
            radius: 4,
            fill: { color: [255, 150, 45, 0.2] },
            stroke: { color: [255, 150, 45, 1], width: 2 }
        }
    },
    selectedStyle: {
        fill: { color: [255, 255, 255, 0] },
        stroke: { color: [0, 153, 255, 1], width: 2 },
        strokeBorder: { color: [255, 255, 255, 1], width: 1 },
        image: {
            type: "Circle",
            radius: 4,
            fill: { color: [0, 153, 255, 0.2] },
            stroke: { color: [0, 153, 255, 1], width: 2 }
        },
        zIndex: Infinity
    },
    iconStyle: {
        fill: { color: [3, 182, 255, 0] },
        stroke: { color: [3, 182, 255, 1], width: 2 },
        image: {
            type: "Icon",
            anchor: [0.28, 0.46], // 偏移，默认[0.5, 0.5]，起点为展示内容的正中央
            size: [55, 68],
            opacity: 1.0, // 透明度
            rotateWithView: true,
            rotation: 0.0, // 旋转
            scale: 1.0, //
            src: require('@/assets/image/map/marker_red.png')
        }
    }
};

/**
 * ol参数
 */
export const olParams = {
    // 设置默认配置
    defaults: {
        view: {
            projection: mapParams.mapProjection, // 地图投影坐标系
            center: mapParams.center,
            minZoom: mapParams.minZoom, // 最小缩放等级
            maxZoom: mapParams.maxZoom, // 最大缩放等级
            zoom: mapParams.zoomLv, // 缩放等级
            rotation: 0, // 旋转
            extent: undefined,
        },
        // 默认控件
        controls: {
            zoom: true,
            rotate: false,
            attribution: false
        },
        // 默认事件
        events: {
            map: [],
            view: [],
            layers: [],
            markers: []
        },
        // 默认互动
        interactions: {
            dragPan: true, // 拖拽移动地图
            doubleClickZoom: true, // 双击缩放地图
            mouseWheelZoom: true, // 滚轮缩放地图
            shiftDragZoom: true, // 按住 shift + 拖拽以缩放地图
            altShiftDragRotate: false, // 按住 alt + shift + 拖拽以旋转地图
            keyboard: false, // 键盘按键移动/缩放地图
            pinchRotate: false, // 两指旋转地图
            pinchZoom: true // 两指缩放地图
        },
        // 渲染方式
        renderer: "canvas",
    },
    layers: []
};

let imageExtent = [0, -2090, 3585, 0];
let imageProjection = new OlProj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: imageExtent
});

/**
 * 获取ol地图控件
 */
export function getOlControls() {
    return {
        // 自定义控件
        controls: [
            // 鹰眼图
            {
                name: "overviewMap",
                active: false,
                control: new OlControl.OverviewMap({
                    className: "ol-overviewmap ol-custom-overviewmap",
                    layers: [
                        // 天地图矢量图层
                        new OlLayer.Tile({
                            source: new OlSource.XYZ({
                                url: mapParams.baseTileUrl
                            })
                        }),
                        // 天地图地名标注层
                        new OlLayer.Tile({
                            source: new OlSource.XYZ({
                                url: mapParams.baseAnnoUrl
                            })
                        })
                    ],
                    collapseLabel: "\u00BB",
                    label: "\u00AB",
                    collapsed: false
                })
            },
            // 获取鼠标位置对应坐标
            {
                name: "mousePosition",
                active: true,
                control: new OlControl.MousePosition({
                    projection: mapParams.bizProjection,
                    className: mapParams.mousePositionControl.className, // 随便给个名称，使其不使用默认样式
                    target: document.querySelector(`#${mapParams.mousePositionControl.id}`),
                    undefinedHTML: "&nbsp;",
                    coordinateFormat: OlCoordinate.createStringXY(6)
                })
            },
            // 比例尺
            {
                name: "scaleLine",
                active: true,
                control: new OlControl.ScaleLine()
            },
            // 全屏
            {
                name: "fullScreen",
                active: false,
                control: new OlControl.FullScreen()
            },
            // 拖拽旋转（可复位）
            {
                name: "dragRotate",
                active: false,
                control: new OlInteraction.DragRotateAndZoom()
            }
        ]
    };
}

/**
 * 获取图片视图
 */
export function getImageViewOptions(projection, extent) {
    return {
        defaults: {
            view: {
                projection: projection || imageProjection,
                center: OlExtent.getCenter(extent || imageExtent),
                maxZoom: 8,
                minZoom: 1,
                zoom: 1
            }
        }
    };
}

/**
 * 获取标注图层配置
 * name: 图层名称
 * option: json对象
 */
export function getVectorLayerOption(name, option) {
    if (!name) return null;
    const layer = {
        name: `${name}-layer`,
        active: true,
        visible: true,
        opacity: 1,
        customAttributes: {},
        source: {
            type: "Vector",
            wrapX: false,
            attributions: {
                vectorName: `${name}-source`
            }
            // features: [],
        },
        style: option && option.style ? option.style : mapParams.defaultStyle
    };
    return Object.assign(layer, option);
}

/**
 * 获取瓦片图层配置
 * name: 图层名称
 * url: 瓦片地址
 * option: 自定义配置，json对象
 */
export function getTileLayerOption(name, url, option) {
    if (!name) return null;
    const layer = {
        name: `${name}-layer`,
        active: true,
        visible: true,
        opacity: 1,
        customAttributes: {},
        source: {
            type: "XYZ",
            url: url,
            wrapX: false,
            attributions: {
                vectorName: `${name}-source`
            }
            // features: [],
        },
        style: option && option.style ? option.style : mapParams.iconStyle
    };
    return Object.assign(layer, option);
}

/**
 * 获取图片图层配置
 * name: 图层名称
 * url: 图片地址
 * option: 自定义配置，json对象
 */
export function getImageLayerOption(name, url, option) {
    if (!name) return null;
    const layer = {
        name: `${name}-layer`,
        active: true,
        visible: true,
        opacity: 1,
        customAttributes: {},
        source: {
            type: "ImageStatic",
            url: url,
            projection: option && option.projection ? option.projection : imageProjection,
            extent: option && option.extent ? option.extent : imageExtent,
            attributions: {
                vectorName: `${name}-source`
            }
            // features: [],
        },
        style: option && option.style ? option.style : mapParams.iconStyle
    };
    return Object.assign(layer, option);
}
