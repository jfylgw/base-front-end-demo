/**
* @name Leaflet单瓦片地图组件
* @description
* @author gongjf
* @since 2019年9月25日 11:12:38
*/

<template>
    <div class="context leafletmap-context">
        <!-- 地图 -->
        <div class="map" :id="Id" :ref="Id"></div>
    </div>
</template>

<script>
import * as L from 'leaflet';
import * as LOption from 'assets/js/map/leaflet-option';
import * as LUtil from 'assets/js/map/leaflet-util';
import { dateFormat } from 'assets/js/base/formatter';
import { parse } from 'wellknown'

import Status from "api/status";
import * as AerialApi from "api/aerial";

// 引入Leaflet样式
import 'leaflet/dist/leaflet.css';

export default {
    name: 'LeafletMap',
    // 注册子组件
    components: {},
    // 外部注入属性
    props: {
        Id: {
            type: String,
            default: 'map'
        },
        // 业务UUID
        BizUuid: {
            type: String,
            default: ''
        },
        // 范围，WKT
        Extent: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            show: {
                mapCoords: true
            },
            mapParams: {},
            auth: {
                token: null,
                date: dateFormat(new Date(), 'yyyy-MM-dd')
            },
            center: null,
            geojson: null
        };
    },
    methods: {
        init() {
            // 初始化地图
            this.initMap();
        },
        // 初始化地图
        async initMap() {
            // 销毁之前的地图
            if(this.map) return;
            // 获取token
            await this.getTileToken();
            // 获取参数
            this.mapParams = LOption.getParams({
                id: this.Id
            });
            // 创建地图
            this.map = L.map(this.mapParams.id);
            // 初始化图层
            this.initLayerGroup();
            // 定位
            this.map.setView(this.center || this.mapParams.center, this.mapParams.zoomLv);
            // 传递地图加载完成事件
            this.$emit('MapLoaded', {});
        },
        initLayerGroup() {
            if(!this.layerGroup) {
                this.layerGroup = L.layerGroup().addTo(this.map);
            }
            // 加入基础图层
            this.layerGroup.addLayer(L.tileLayer(this.mapParams.imageBaseUrl, { subdomains: this.mapParams.tdtServerDomains }));
            // 加入注记图层
            this.layerGroup.addLayer(L.tileLayer(this.mapParams.imageLandMarkBaseUrl, { subdomains: this.mapParams.tdtServerDomains }));
        },
        // 获取token
        async getTileToken() {
            try {
                // 如果已有token，而且日期相等，就不再请求token
                let now = dateFormat(new Date(), 'yyyy-MM-dd');
                if(this.auth.token && now === this.auth.date) return;

                // 请求接口
                let response = await AerialApi.getTileToken(Object.assign({}, this.entity, this.pagination));
                let data = response.data;
                if(response.status === Status.HTTP_STATUS.OK) {
                    this.auth.token = data.token;
                }
            } catch(err) {
                this.$message({ type: 'error', showClose: true, message: err.message || '操作失败' });
            }
        },
        // 获取瓦片地址
        getUrl(uuid, token) {
            return `http://tile{s}.agis.xaircraft.com/data/hmap/private/${uuid || this.BizUuid}/{z}/{x}/{y}?v=1${token || this.auth.token}`;
        }
    },
    watch: {
        async BizUuid(newVal, oldVal) {
            if(!this.map) {
                await this.initMap();
            } 

            // 移除之前的图层
            if(this.layerGroup) this.layerGroup.clearLayers();

            if(newVal) {
                // 加入XAG图层
                this.layerGroup.addLayer(L.tileLayer(this.getUrl(newVal), { subdomains: this.mapParams.xagServerDomains }));
                // 加入注记图层
                this.layerGroup.addLayer(L.tileLayer(this.mapParams.imageLandMarkBaseUrl, { subdomains: this.mapParams.tdtServerDomains }));
            } else {
                // 初始化图层
                this.initLayerGroup();
            }
            
        },
        async Extent(newVal, oldVal) {
            if(!this.map) {
                await this.initMap();
            } 
            
            // 移除之前的标注
            if(this.geojson) this.map.removeLayer(this.geojson);

            if(newVal) {
                // 转换WKT
                let json = parse(newVal);
                // 绘制标注
                this.geojson = L.geoJSON(json, {
                    style: function (feature) {
                        return {
                            weight: 3, // 线条粗度
                            color: 'red', // 线条颜色
                            opacity: 1, // 线条透明度（1为100%，不透明）
                            fillColor: feature.properties.fillColor,
                            fillOpacity: 0 // 填充面透明度
                        };
                    }
                }).addTo(this.map);
                // 定位
                this.map.fitBounds(this.geojson.getBounds());
            }
        }
    },
    computed: {},
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
};
</script>

<style scoped lang="scss">
.leafletmap-context {
    
}
</style>