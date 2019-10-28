/**
* @name 总览视图
* @description
* @author gongjf
* @since 2019年10月9日 14:50:32
*/

<template>
    <el-container class="context summary-context">

    </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Summary',
    // 注册子组件
    components: {
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {},
            dialog: {
                title: '',
                form: {},
            },
        };
    },
    // 组件函数
    methods: {
        init() {}
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
}
</script>

<style scoped lang="scss">
.summary-context {
    
}
</style>

