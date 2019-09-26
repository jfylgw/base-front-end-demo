/**
* @name 标签路由组件
* @description
* @author gongjf
* @since 2019年6月24日 11:12:38
*/

<template>
    <div class="context tabrouter-context">
        <el-tabs type="card" class="" :value="currentTab" 
            @tab-click="tabClick" @tab-remove="tabRemove">
            <el-tab-pane class="" :label="initTab.label" :name="initTab.name">
                <keep-alive>
                    <router-view :name="initTab.path"></router-view>
                </keep-alive>
            </el-tab-pane>
            <el-tab-pane class="" closable v-for="routerTab in routerTabs" :key="routerTab.name" 
                :label="routerTab.label" :name="routerTab.name">
                <keep-alive>
                    <router-view :name="routerTab.path"></router-view>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'TabRouter',
    // 注册子组件
    components: {},
    // 外部注入属性
    props: {},
    data(){
        return {
            initTab: {
                label: '首页', // 展示文本
                name: '/rear/home', // 用路由作为标签页唯一值
                path: 'home' // 路由视图名称
            }
        };
    },
    methods: {
        // 引入Vuex的方法
        ...mapActions(['ADD_ROUTER_TAB', 'REMOVE_ROUTER_TAB']),
        init() {
            // 点击初始标签
            this.tabClick(this.initTab);
        },
        // 点击标签
        tabClick(tab, event) {
            // 如果是路由，则进行路由跳转
            if(tab.name.indexOf('/')>-1) {
                this.$router.push(tab.name);
                // 修改导航菜单控件选中项
            }
        },
        // 关闭标签
        tabRemove(name) {
            // 移除对应标签
            this.REMOVE_ROUTER_TAB(name);
            // 选中末尾标签
            if(this.routerTabs && this.routerTabs.length>0) 
            this.tabClick(this.routerTabs[this.routerTabs.length-1]);
            // 选中初始标签
            else this.tabClick(this.initTab);
        }
    },
    computed: {
        routerTabs(){
            return this.$store.state.common.routerTabs;
        },
        currentTab() {
            return this.$route.path;
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
};
</script>

<style scoped lang="scss">
.tabrouter-context {
    
}
</style>