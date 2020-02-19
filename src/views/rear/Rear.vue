/**
* @name 后台框架视图
* @description
* @author gongjf
* @since 2019年6月24日 14:50:32
*/

<template>
    <el-container class="context rear-context">
        <!-- 顶部 -->
        <el-header class="head-area">
            <router-link to="/rear" class="logo-area">
                <i class="logo el-icon-coin"/>
                <span class="logo-title" v-html="GET_PLATFORM_NAME()"></span>
            </router-link>
            <div class="user-info-area">
                <div class="area-unit" style="margin-right: 10px;">
                    <span style="line-height: 26px;" v-html="currentUser.name || currentUser.username"></span>
                </div>
                <router-link class="btn btn-opacity" title="修改密码" to="/change-pass">
                    <i class="iconfont xia-logout"></i>
                </router-link>
                <router-link class="btn btn-opacity" title="登出" to="/sign-in">
                    <i class="iconfont xia-logout"></i>
                </router-link>
            </div>
        </el-header>

        <!-- 主体 -->
        <el-container class="body-area">
            <el-aside class="aside-area">
                <!-- 无权限提示区 -->
                <div class="nothing-area" v-if="!menus || menus.length === 0">
                    <span class="noMore">暂无任何权限，请和管理员联系</span>
                </div>
                
                <!-- 菜单区 -->
                <el-menu class="menu-area" router v-if="menus && menus.length > 0" 
                    :default-active="$route.path" :default-openeds="show.menuOpen" :collapse="show.isCollapse"  
                    @select="selectMenuItem">
                    <el-menu-item index="/rear/user">
                        <span slot="title">用户列表</span>
                    </el-menu-item>
                    <el-submenu v-for="submenu in pageAccess" :key="submenu.routeName" 
                        :index="`/rear/${submenu.routeName}`">
                        <template slot="title">
                            <i :class="`el-icon-${submenu.icon}`" v-if="submenu.icon"></i>
                            <span>{{ submenu.name }}</span>
                        </template>
                        <el-menu-item  v-for="menuitem in submenu.chlidren" :key="menuitem.routeName" 
                            :index="`/rear/${menuitem.routeName}`">
                            <i :class="`el-icon-${menuitem.icon}`" v-if="menuitem.icon"></i> 
                            <span>{{ menuitem.name }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                
                <!-- 底部展开按钮 -->
                <el-menu class="bottom-menu-area" active-text-color="#303133" :collapse="show.isCollapse">
                    <el-menu-item index="collapse" @click="show.isCollapse = !show.isCollapse">
                        <i :class="show.isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"/>
                        <span slot="title" v-html="show.isCollapse ? '展开' : '收起'"></span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-main class="frame-area">
                <!-- 子页面 -->
                <keep-alive>
                    <router-view name="rear"></router-view>
                </keep-alive>
            </el-main>
        </el-container>

        <!-- 页脚部 -->
        <!-- <el-footer class="foot-area"></el-footer> -->

    </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Rear',
    // 注册子组件
    components: {},
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isLoading: false,
                isCollapse: false,
                menuOpen: []
            },
            initRouteName: 'summary',
            menus: []
        };
    },
    // 组件函数
    methods: {
        // 引入Vuex的方法
        ...mapGetters(['GET_USER_INFO', 'GET_PLATFORM_NAME']),
        ...mapActions(['ROUTER_TO_SIGNIN']),
        init() {
            this.getMenus();
        },
        // 获取页面数据
        async getMenus() {
            try {
                // 请求接口
                let response = await UserApi.pageAccess({});
                if(response) {
                    let data = response.data;
                    if(response.status === Status.HTTP_STATUS.OK) {
                        if(data && this.currentUser.uuid === data.uuid) {
                            this.pageAccess = data.pageAccess || [];
                            // 指定默认路由
                            if(this.$route.path === '/rear') this.$router.push({ name: this.initRouteName });
                        }
                    }
                }
            } catch(err) {
                this.$message({ type: 'error', showClose: true, message: err.message || '获取页面权限失败' });
            }
        }
        // 选中菜单项
        selectMenuItem(index, path, item) {
            
        }
    },
    computed: {
        currentUser(){
            return this.$store.state.user.userInfo;
        },
        platformName() {
            return this.$store.state.common.platformName;
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
        width: 100%;
        height: calc(100% - 40px);

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

