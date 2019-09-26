/**
* @name APP主框架
* @description
* @author gongjf
* @since 2019年6月24日 11:09:56
*/

<template>
    <div id="app" class="context app-context" @touchmove.prevent>
        <keep-alive>
            <transition name="fade">
                <router-view/>
            </transition>
        </keep-alive>
    </div>
</template>

<script>

</script>

<style lang="scss">
.app-context {
    overflow: hidden;
}
</style>
