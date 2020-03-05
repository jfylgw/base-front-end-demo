/**
* @name 后台框架视图
* @description
* @author gongjf
* @since 2019年6月24日 14:50:32
*/

<template>
    <div class="context rear-context">

        <!-- 顶部 -->
        <el-header class="head-area">
            <router-link to="/rear" class="logo-area">
                <i class="logo el-icon-coin"/>
                <span class="logo-title">{{platformName}}</span>
            </router-link>
            <div class="user-info-area">
                <div class="area-unit" style="margin-right: 10px;">
                    <span style="line-height: 26px;" v-html="currentUser.name || currentUser.username"></span>
                </div>
                <!-- <el-dropdown class="btn btn-opacity">
                    <i class="iconfont xia-setting"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <a class="" >
                                <i class="iconfont xia-info"></i> 用户信息
                            </a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <router-link class="btn btn-opacity" title="修改密码" to="/change-pass">
                    <i class="iconfont xia-logout"></i>
                </router-link>
                <router-link class="btn btn-opacity" title="登出" to="/sign-in">
                    <i class="iconfont xia-logout"></i>
                </router-link>
            </div>
        </el-header>

        <!-- 无权限提示区 -->
        <div class="nothing-area" v-if="!currentUser.menus || currentUser.menus.length === 0">
            <span class="noMore">暂无任何权限，请尝试重新登录或与管理员联系</span>
        </div>

        <!-- 主体 -->
        <div class="body-area" v-if="currentUser.menus && currentUser.menus.length > 0">
            <!-- 菜单 -->
            <el-menu class="menu-area" router
                :default-active="$route.path" :default-openeds="show.menuOpen" :collapse="show.isCollapse">
                <el-submenu v-for="submenu in currentUser.menus" :key="submenu.routeName" 
                    :index="`/rear/${submenu.routeName}`">
                    <template slot="title">
                        <i :class="`el-icon-${submenu.icon}`" v-if="submenu.icon"></i>
                        <span>{{ submenu.name }}</span>
                    </template>
                    <el-menu-item :ref="menuItem.routeName" v-for="menuItem in submenu.chlidren" :key="menuItem.routeName" 
                        :index="`/rear/${menuItem.routeName}`" @click="clickMenuItem(menuItem)">
                        <i :class="`el-icon-${menuItem.icon}`" v-if="menuItem.icon"></i> 
                        <span>{{ menuItem.name }}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>

            <!-- 折叠按钮 -->
            <el-link :underline="false" class="bottom-collapse" :title="show.isCollapse ? '展开' : ''"  @click="show.isCollapse = !show.isCollapse">
                <i :class="show.isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" style="margin-right:10px;"></i>
                <span>{{show.isCollapse ? '' : '收起'}}</span>
            </el-link>
            
            <!-- 页面区 -->
            <el-main class="frame-area">
                <keep-alive>
                    <transition name="fade">
                        <router-view/>
                    </transition>
                </keep-alive>
            </el-main>
        </div>

        <!-- 页脚部 -->
        <!-- <el-footer class="foot-area"></el-footer> -->

    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { activeClick } from 'assets/js/base/util';

export default {
    name: 'Rear',
    // 注册子组件
    components: {},
    mixins: [],
    props: {},
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isCollapse: false,
                menuOpen: []
            },
            initRouteName: 'summary',
        };
    },
    computed: {
        currentUser(){
            return this.$store.state.user.userInfo;
        },
        platformName() {
            return this.$store.state.common.platformName;
        }
    },
    // 组件函数
    methods: {
        // 引入Vuex的方法
        ...mapActions(['ROUTER_TO_SIGNIN', 'CHANGE_ROUTE_ACCESS_BTNS']),
        init() {
            // 自动点击指定默认路由菜单项
            let target = this.$refs[this.initRouteName][0].$el;
            activeClick(target);
        },
        // 选中菜单项
        clickMenuItem(item) {
            let { btns } = item;
            // 将选中菜单的需要授权的按钮配置项上传至全局
            this.CHANGE_ROUTE_ACCESS_BTNS(btns);
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss">
i {
    display: inline-flex;
}

.el-aside {
    width: unset !important;
}

.el-menu-item {
    min-width: 180px;
}

.el-menu--collapse>.el-menu-item {
    min-width: unset;
}

.rear-context {
    .head-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background-color: #1a2b4d;

        .logo-area {
            color: $color-white;
            
            .logo-title {
                font-weight: bold;
                font-size: 20px;
            }
        }
        .user-info-area {
            display: flex;

            a {
                font-size: 14px;
                color: $color-white;
                
                i {
                    font-size: 22px;
                }
            }
            span {
                color: $color-white;
            }
            .el-dropdown {
                color: $color-white;
                i {
                    font-size: 22px;
                }
            }
            .area-unit {
                margin-left: 20px;
            }
        }
    }

    .body-area {
        display: flex;
        flex-direction: row;
        flex: 1;
        overflow: hidden;

        .nothing-area {
            width: 100%;
            padding: 20px;

            .warning-text {
                color: red;
            } 
        }
        
        .aside-area {
            position: relative;
            overflow: hidden;

            .menu-area {
                height: 100%;
                background-color: $color-white;

                span {
                    display: inline-flex;
                }
            }

            .bottom-menu-area {
                position: absolute;
                bottom: 0;
                
                span {
                    display: inline-flex;
                }
            }
        }
        
        .frame-area {
            float: right;
            background-color: white;
            padding: 0;
        }

    }

    .foot-area {

    }
    
}
</style>

