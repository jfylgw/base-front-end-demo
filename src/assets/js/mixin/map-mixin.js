
import * as OlInteraction from "ol/interaction";
import * as OlUtil from "assets/js/map/ol-util";
import * as OlOption from "assets/js/map/ol-option";

export default {
  props: {
    BizUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: {
        mapCoords: false, // 地图坐标框
        zoomTools: true // 缩放工具条
      },
      mapTools: {
        zoomIn: {
          name: "放大",
          show: true,
          iconfont: "iconfont xia-plus",
          func: () => {
            this.zoomIn();
          }
        },
        zoomLv: {
          name: "缩放级别",
          show: true,
          spanClass: "zoom-lv",
          func: () => {},
          children: [],
          isChildVertical: false
        },
        zoomOut: {
          name: "缩小",
          show: true,
          iconfont: "iconfont xia-minus",
          func: () => {
            this.zoomOut();
          }
        }
      },
      interaction: {
        zoom: OlOption.mapParams.zoomLv,
        interactionType: 'None', // 互动类型，可选：None、Draw、Select、DrawSelect、Modify
        drawFeatureType: 'Polygon', // 绘制类型，可选：None、Point、LineString、Polygon、Circle、RegularPolygon，Rectangle
        selectFeatureType: 'Point', // 选择类型，可选：None、Point、LineString、Polygon、Circle、RegularPolygon，Rectangle
        selectTimes: 'Single' // 选择次数，可选：Single、Many
      },
      selectFeatures: []
    };
  },
  methods: {
    /**
     * 变更地图视图时获取缩放等级的功能
     */
    getZoomLvOnChange() {
      this.map.getView().un("change:resolution", this.getZoomLv);
      this.map.getView().on("change:resolution", this.getZoomLv.bind(this));
    },
    /**
     * 获取缩放等级
     */
    getZoomLv(event) {
      this.interaction.zoom = parseInt(event.target.getZoom());
      let zoomDom = this.$el.querySelector(".zoom-lv");
      if (zoomDom) zoomDom.innerHTML = this.interaction.zoom;
    },
    /**
     * 设置获取点击坐标的功能
     */
    getCoordOnClick() {
      this.map.removeEventListener("click", this.getClickCoord);
      this.map.addEventListener("click", this.getClickCoord.bind(this));
    },
    /**
     * 获取点击位置坐标
     */
    getClickCoord(event) {
      let coordinate = event.coordinate;
      let coord = OlUtil.transformUtil.coord_map2biz(coordinate);
      coord[0] = coord[0].toFixed(6);
      coord[1] = coord[1].toFixed(6);
      document.querySelector("#mouse-click-position").innerHTML = `${
        coord[0]
      }, ${coord[1]}`;

      // 查找点击位置的标注
      event.target.forEachFeatureAtPixel(
        event.pixel,
        (feature, layer) => {
          return feature;
        }, {
          layerFilter(layer) {
            return true;
          }
        }
      );
    },
    /**
     * 让地图跳转到指定范围
     */
    fitByWkt(wkt) {
      if (!wkt || wkt === "") return;
      let geometry = OlUtil.transformUtil.wkt2geometry(wkt);
      this.map.getView().fit(geometry.getExtent(), {
        padding: [5, 5, 5, 5]
      });
    },
    /**
     * 放大
     */
    zoomIn(lv_) {
      let lv = parseInt(lv_) || 1;
      let view = this.map.getView();
      lv = view.getZoom() + lv;
      view.animate({
        zoom: lv,
        duration: 250
      });
    },
    /**
     * 缩小
     */
    zoomOut(lv_) {
      let lv = parseInt(lv_) || 1;
      let view = this.map.getView();
      lv = view.getZoom() - lv;
      view.animate({
        zoom: lv,
        duration: 250
      });
    },
    /**
     * 键位设置
     */
    keySetting() {
      let this_ = this;
      document.onkeydown = e => {
        let k = e.keyCode;
        if (k === 32) {
          this_.removeLastPoint();
        } else if (k === 27) {
          this_.clearInteractions();
        } else if (k === 8) {
          this_.deleteFeature();
        }
      };
    },
    /**
     * 清除互动
     */
    clearInteractions(event) {
      // 清除指定类型互动对象
      OlUtil.mapUtil.clearInteractions(this.map);
      // 移除事件
      this.map.removeEventListener("contextmenu", this.clearInteractions);
      // 清除选中标注
      if(this.selectInteraction) {
        this.selectInteraction.getFeatures().clear();
      }
      // 禁止原生事件
      if (event) {
        event.originalEvent.returnValue = false;
      }
      return event;
    },
    /**
     * 绘制模式
     */
    drawMode(featureType_, layerName_, option) {
      // 设置当前互动模式为绘制（不给类型默认取消互动）
      this.interaction.interactionType = featureType_ ? "Draw" : "None";
      this.interaction.drawFeatureType = featureType_ || "None";

      // 清除之前的地图互动
      this.clearInteractions();
      // 监听右击事件，清除互动
      this.map.addEventListener("contextmenu", this.clearInteractions);

      // 指定互动图层
      let target = this.getFeatureGroupLayerByName(layerName_)[0];
      if (!target) target = this.getExtentGroupLayerByName(layerName_)[0];

      // 创建绘制互动对象并加入到地图中
      this.drawInteraction = OlUtil.mapUtil.createDrawInteraction(
        target,
        Object.assign({
          mode: this.interaction.drawFeatureType
        }, option),
        this.onFeatureDrawEnd.bind(this)
      );
      if (this.drawInteraction) {
        this.map.addInteraction(this.drawInteraction);
      }
    },
    /**
     * 选择模式
     */
    selectMode(option) {
      // 设置当前互动模式为选择（不给类型默认取消互动）
      this.interaction.interactionType = "Select";
      this.interaction.selectTimes =
        option && option.selectTimes_ ? option.selectTimes_ : "Single";

      // 清除之前的地图互动
      this.clearInteractions();
      // 监听右击事件，清除互动
      this.map.addEventListener("contextmenu", this.clearInteractions);

      // 创建选择互动对象并加入到地图中
      this.selectInteraction = OlUtil.mapUtil.createSelectInteraction(
        Object.assign({}, option),
        this.onFeatureSelectEnd.bind(this)
      );
      if (this.selectInteraction) {
        this.map.addInteraction(this.selectInteraction);
      }

      // 创建修改互动对象并加入到地图中
      this.modifyInteraction = OlUtil.mapUtil.createModifyInteraction(
        this.selectInteraction.getFeatures(),
        Object.assign({}, option),
        this.onFeatureModifyEnd.bind(this)
      );
      if (this.modifyInteraction) {
        this.map.addInteraction(this.modifyInteraction);
      }
    },
    /**
     * 绘制选择模式
     */
    drawSelectMode(featureType_, option) {
      // 设置当前互动模式为选择（不给类型默认取消互动）
      this.interaction.interactionType = featureType_ ? "DrawSelect" : "None";
      this.interaction.drawFeatureType = featureType_ || "None";
      this.interaction.selectTimes =
        option && option.selectTimes_ ? option.selectTimes_ : "Single";

      // 清除之前的地图互动
      this.clearInteractions();
      // 监听右击事件，清除互动
      this.map.addEventListener("contextmenu", this.clearInteractions);

      // 创建绘制选择互动对象并加入到地图中
      let interactions = OlUtil.mapUtil.createDrawSelectInteraction(
        Object.assign({
          mode: this.interaction.drawFeatureType
        }, option),
        this.onFeatureDrawSelectEnd.bind(this)
      );
      this.drawInteraction = interactions.Draw;
      this.selectInteraction = interactions.Select;
      this.map.addInteraction(this.drawInteraction);

      // 创建修改互动对象并加入到地图中
      this.modifyInteraction = OlUtil.mapUtil.createModifyInteraction(
        this.selectInteraction.getFeatures(),
        Object.assign({}, option),
        this.onFeatureModifyEnd.bind(this)
      );
      this.map.addInteraction(this.modifyInteraction);
    },
    /**
     * 移除互动中的最后一个打点
     */
    removeLastPoint(event) {
      if (this.interaction.interactionType === 'Draw' && this.drawInteraction) {
        this.drawInteraction.removeLastPoint();
      } else if(this.interaction.interactionType === 'Modify' && this.modifyInteraction) {
        this.modifyInteraction.removePoint();
      }
    },
    /**
     * 删除标注
     */
    deleteFeature() {
      if(!this.selectFeatures || this.selectFeatures.length === 0) {
        this.$message({ type: 'error', showClose: true, message: '未选中任何标注' });
        return;
      }
      // 删除指定图层中的指定标注
      this.selectFeatures.map(feature => {
        let name = feature.attributes.type;
        let target = this.getFeatureGroupLayerByName(name)[0];
        // 只删除显示图层的标注
        if(target.getVisible()) {
          target.getSource().removeFeature(feature);
          this.$emit("FeatureDeleted", {
            feature
          });
          // 移除对应的选中缓存
          let index = this.selectFeatures.findIndex((f) => {
            return f === feature;
          });
          this.selectFeatures.splice(index, 1);
        }
      });
    },
    /**
     * 清空标注集
     */
    clearFeatures() {
      let layers = this.featureLayerGroup.getLayers().getArray();
      layers.map(layer => {
        layer.getSource().clear();
      });
    },
    /**
     * 获取所有标注图层的标注属性数据
     */
    getAllFeaturesAttributes() {
      let resultSet = [];
      let layers = this.featureLayerGroup.getLayers().getArray();
      layers.map(layer => {
        let features = layer.getSource().getFeatures();
        features.map(f => {
          if (f && f.attributes) resultSet.push(f.attributes);
        });
      });
      return resultSet;
    },
    /**
     * 显示指定标注图层
     */
    showLayer(layerName) {
      let layers = this.getFeatureGroupLayerByName(layerName);
      layers.map(layer => {
        layer.setVisible(true);
      });
    },
    /**
     * 隐藏指定标注图层
     */
    hideLayer(layerName) {
      let layers = this.getFeatureGroupLayerByName(layerName);
      layers.map(layer => {
        layer.setVisible(false);
      });
    }
  }
};
