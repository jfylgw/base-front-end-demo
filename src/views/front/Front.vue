/**
* @name 前台框架视图
* @description
* @author gongjf
* @since 2019年6月24日 14:50:58
*/

<template>
    <div class="context front-context">
        <keep-alive>
            <router-view name="front"/>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "Front"
}
</script>

<style lang="scss">
.front-context {
    
}
</style>

