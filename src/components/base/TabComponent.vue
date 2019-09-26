/**
* @name 组件标签页组件
* @description
* @author gongjf
* @since 2019年6月24日 11:12:38
*/

<template>
    <div class="context tabcomponent-context">
        <el-tabs type="card" class="" :value="currentTab.name" 
            @tab-click="tabClick" @tab-remove="tabRemove">
            <el-tab-pane class="" :label="initTab.label" :name="initTab.name">
                <!-- <home></home> -->
            </el-tab-pane>
            <el-tab-pane class="" closable v-for="componentTab in componentTabs" :key="componentTab.name" 
                :label="componentTab.label" :name="componentTab.name">
                <user v-if="componentTab.type === 'user'"></user>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import User from 'components/rear/User';

export default {
    name: 'TabComponent',
    // 注册子组件
    components: {
        User
    },
    // 外部注入属性
    props: {},
    data(){
        return {
            initTab: {
                label: '首页', // 展示文本
                name: 'home', // 标签页唯一值，最好用uuid
                type: 'home', // 组件类型
                props: {} // 组件属性
            },
        };
    },
    methods: {
        // 引入Vuex的方法
        ...mapActions(['ADD_COMPONENT_TAB', 'REMOVE_COMPONENT_TAB', 'CHANGE_CURRENT_COMPONENT_TAB']),
        init() {
            // 点击初始标签
            this.tabClick(this.initTab);
        },
        // 点击标签
        tabClick(tab, event) {
            let obj = {
                label: tab.label,
                name: tab.name,
                type: tab.type,
                props: tab.props
            };
            this.CHANGE_CURRENT_COMPONENT_TAB(obj);
        },
        // 关闭标签
        tabRemove(name) {
            // 移除对应标签
            this.REMOVE_COMPONENT_TAB(name);
            // 选中末尾标签
            if(this.componentTabs && this.componentTabs.length>0)
                this.tabClick(this.componentTabs[this.componentTabs.length-1]);
            // 选中初始标签
            else this.tabClick(this.initTab);
        }
    },
    computed: {
        componentTabs(){
            return this.$store.state.common.componentTabs;
        },
        currentTab() {
            return this.$store.state.common.currentComponentTab;
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
};
</script>

<style scoped lang="scss">
.tabcomponent-context {
    
}
</style>