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
                    <span class="warning-text">暂无任何权限，请和管理员联系</span>
                </div>
                
                <!-- 菜单区 -->
                <el-menu class="menu-area" :collapse="show.isCollapse" v-if="menus && menus.length > 0" 
                    router :default-active="$route.path" :default-openeds="show.menuOpen" 
                    @select="selectMenuItem">
                    <el-menu-item index="/rear/user">
                        <span slot="title">用户列表</span>
                    </el-menu-item>
                    <el-submenu v-for="(menuGroup, i) in menus" :key="menuGroup.name" :index="i">
                        <span slot="title" v-html="menuGroup.name"></span>
                        <el-menu-item v-for="menu in menuGroup.menus" :key="menu.name" :index="menu.url">
                            <span slot="title" v-html="menu.name"></span>
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

        <!-- 登录弹窗 -->
        <el-dialog width="20%" top="4vh" destroy-on-close 
            :close-on-click-modal="false"
            title="重新登录" :visible.sync="$store.state.common.showSignInDialog">
            <div class="dialog-context">
                <!-- 加载动画 -->
                <loading :IsLoading="show.isLoading" :AutoHideTime="0" Msg=""></loading>

                <el-form ref="signInDialogForm" label-width="85px" :model="dialog.form" :rules="dialog.rules" @keyup.enter="signIn">
                    <el-form-item label="名称" prop="username">
                        <el-input v-model="dialog.form.username" placeholder="请输入名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="dialog.form.password" placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部按钮 -->
                <div class="dialog-footer">
                    <!-- <el-button @click="ROUTER_TO_SIGNIN()">返回登录页</el-button> -->
                    <el-button type="primary" @click="signIn">登 录</el-button>
                </div>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from "components/base/Loading";
import Status from "api/status";
import * as AuthorityApi from "api/authority";

export default {
    name: 'Rear',
    // 注册子组件
    components: {},
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            msg: '',
            show: {
                isLoading: false,
                dialog: {
                    userInfo: false
                },
                isCollapse: false,
                menuOpen: []
            },
            dialog: {
                title: '',
                form: {},
                rules: {
                    username: [
                        { required: true, message: '请输入帐号', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }
            },
            entity: {},
            menus: []
        };
    },
    // 组件函数
    methods: {
        // 引入Vuex的方法
        ...mapGetters(['GET_USER_INFO', 'GET_PLATFORM_NAME']),
        ...mapActions(['USER_IN', 'USER_OUT', 'HIDE_SIGNIN_DIALOG', 'ROUTER_TO_SIGNIN']),
        init() {
            // 获取用户信息，获取不到就返回登录
            this.user = this.GET_USER_INFO();
            if(!this.user || !this.user.module) {
                this.ROUTER_TO_SIGNIN();
                return;
            } 

            // 展开所有菜单
            this.menus = this.user.module;
            for(let i=0, iLen=this.menus.length; i<iLen; i++) {
                this.show.menuOpen.push(i);
            }

            // 指定默认路由
            if(this.$route.path === '/rear') this.$router.push({ name: 'summary' });
        },
        // 选中菜单项
        selectMenuItem(index, path, item) {
            
        },
        showLoading() {
            this.show.isLoading = true;
        },
        hideLoading() {
            this.show.isLoading = false;
        },
        // 校验（名称在表单的ref属性上配置）
        validate(formRefName) {
            let ok = true;
            if(!formRefName) return ok;
            this.$refs[formRefName].validate(valid => {
                ok = valid;
            });
            return ok;
        },
        // 重置指定名称的表单（名称在表单的ref属性上配置）
        resetForm(formRefName) {
            this.$refs[formRefName].resetFields();
        },
        async signIn() {
            try {
                // 显示加载动画
                this.showLoading();
                // 校验表单
                if(!this.validate('signInDialogForm')) {
                    // 隐藏加载动画
                    this.hideLoading();
                    return;
                }
                // 请求接口
                let response = await AuthorityApi.signIn(this.dialog.form);
                let data = response.data;
                if(response.status === Status.HTTP_STATUS.OK) {
                    // 隐藏加载动画
                    this.hideLoading();
                    // 保存用户信息
                    this.USER_IN(data || this.user);
                    // 隐藏登录弹窗
                    this.HIDE_SIGNIN_DIALOG();
                }
            } catch(err) {
                // 隐藏加载动画
                this.hideLoading();
                this.$message({ type: 'error', showClose: true, message: '登录失败' });
            }
        }
    },
    computed: {
        currentUser(){
            return this.$store.state.user.userInfo;
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

