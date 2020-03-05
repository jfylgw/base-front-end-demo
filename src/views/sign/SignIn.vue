/**
* @name 登录视图
* @description
* @author: gongjf
* @since: 2019年6月24日 11:09:06
*/

<template>
    <div class="context signin-context">
        <!-- 粒子特效组件 -->
        <vue-particles 
            color="#fff"
            particleOpacity="0.7"
            particlesNumber="60"
            shapeType="circle"
            particleSize="4"
            linesColor="#fff"
            linesWidth="1"
            lineLinked="true"
            lineOpacity="0.4"
            linesDistance="150"
            moveSpeed="2"
            hoverEffect="true"
            hoverMode="grab"
            clickEffect="true"
            clickMode="push"
            class="lizi"
        ></vue-particles>

        <!-- 加载组件 -->
        <Loading :IsLoading="show.isLoading" @hideLoading="hideLoading"></Loading>

        <!-- 页头 -->
        <div class="head-area">
            <span class="title">{{platformName}}</span>
        </div>

        <!-- 主体 -->
        <div class="body-area">
            <!-- 表单 -->
            <el-form ref="signInForm" class="form-input-area" v-if="show.interface === 'signIn'"
                :model="dialog.form" :rules="dialog.rules" 
                @keyup.enter="signIn">
                <el-form-item class="form-item" prop="username">
                    <template slot="label"><i class="iconfont xia-people"></i></template>
                    <el-input class="input-text" clearable placeholder="帐 号" v-model="dialog.form.username"/>
                </el-form-item>
                <el-form-item class="form-item" prop="password">
                    <template slot="label"><i class="iconfont xia-lock"></i></template>
                    <el-input class="input-text" clearable show-password placeholder="密 码" v-model="dialog.form.password"/>
                </el-form-item>
                <div class="btns-area">
                    <a class="btn btn-theme btn-submit" @click="signIn">登 入</a>
                </div>
                <div class="links-area">
                    <el-link type="primary" class="link" @click="showRegisterInterface">注册帐号</el-link>
                    <el-link type="primary" class="link" @click="showEditPassInterface">忘记密码</el-link>
                </div>
            </el-form>
            <!-- 系统消息 -->
            <span v-html="msg"></span>
        </div>

        <!-- 页脚 -->
        <div class="foot-area">
            <div class="info-area">
                <div class="links-area"></div>
                <span class="copyright" v-html="GET_COPYRIGHT()"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Loading from "components/base/Loading";
import Status from "api/base/status";
import * as AuthorityApi from "api/authority";

export default {
    name: "SignIn",
    // 注册子组件
    components: {
        Loading
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            msg: "",
            show: {
                isLoading: false
            },
            user: {
                name: "123",
                password: "123"
            }
        };
    },
    // 组件函数
    methods: {
        // 引入Vuex的Getter方法
        ...mapGetters(['GET_PLATFORM_NAME', 'GET_COPYRIGHT']),
        // 引入Vuex的Action方法
        ...mapActions(["USER_IN", "USER_OUT"]),
        init() {},
        showLoading() {
            this.show.isLoading = true;
        },
        hideLoading() {
            this.show.isLoading = false;
        },
        validate() {
            if (!this.user || !this.user.password) {
                this.$message({ type: "error", showClose: true, message: "请填写密码" });
                return false;
            }
            return true;
        },
        async signIn() {
            try {
                // 显示加载动画
                this.showLoading();
                // 校验表单
                if(!this.validate()) {
                    // 隐藏加载动画
                    this.hideLoading();
                    return;
                }
                // 请求接口
                let response = await AuthorityApi.signIn(this.user);
                if(response) {
                    let data = response.data;
                    if(response.status === Status.SERVER_STATUS.OK) {
                        // 隐藏加载动画
                        this.hideLoading();
                        // 存到全局变量中
                        this.USER_IN(data || this.user);
                        // 跳转到主页（参数键值要跟子组件的props中的键值一致）
                        this.$router.push({ name: "rear" });
                    }
                }
                
            } catch(err) {
                // 隐藏加载动画
                this.hideLoading();
                this.$message({ type: "error", showClose: true, message: "登入失败" });
            }
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    },
    // 登录后再调用该页面，就先登出
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 清除页面用户信息
            vm.USER_OUT();
            // 清除标签页信息
            vm.CLEAR_TABS();
            // 调用登出接口
            AuthorityApi.signOut();
        });
    }
};
</script>

<style scoped lang="scss">
.signin-context {
    background: url(~@/assets/image/background/map.png) no-repeat;
    -moz-background-size: 100% 100%;  
    background-size: 100% 100%;

    .head-area {
        display: block;
        height: 25%;

        .title {
            top: 170px;
            text-align: center;
            padding: 16px 161px;
            font-size: 36px;
            color: white;
            text-shadow: 1px 1px 3px #000000;
        }
    }

    .body-area {
        display: block;
        height: 47%;

        .form {
            display: block;
            top: 20px;
            width: 432px;
            padding: 36px 14px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            box-shadow: rgba(0, 0, 0, 0.1) 0 0 20px 2px;

            .form-item {
                width: fit-content;
                max-width: 300px;
                
                .input-text, .input-text input {
                    border-bottom: 1px solid $color-theme;
                }
            }

            .login-code {
                width: 160px;
                left: -60px;

                .input-text {
                    width: 65%;
                }

                .login-code-img {
                    position: absolute;
                    top: 0;
                    right: -120px;
                }
            }

            .btns-area {
                text-align: center;

                .btn-submit {
                    width: 265px;
                    padding: 12px 16px;
                    border-radius: 56px;
                }

                .btn-cancel {
                    width: 112px;
                    border-radius: 56px;
                    margin-left: 8px;
                    background-color: transparent;
                    &:hover {
                        background-color: $color-white;
                    }
                    &:active {
                        background-color: #dddddd;
                    }
                }
            }
            .links-area {
                padding: 16px;

                .link {
                    padding: 6px 14px;
                    margin: auto 8px;
                    font-size: 16px;
                    color: $color-theme;
                    border-radius: 20px;
                    &:hover {
                        background-color: $color-white;
                    }
                    &:active {
                        background-color: lightgray;
                    }
                }
            }
        }
    }
    
    .foot-area {
        display: block;
        height: 28%;

        .info-area {
            position: fixed;
            width: 100%;
            margin: auto;
            bottom: 20px;

            .links-area {
                margin: 6px auto;
                width: 100%;
                justify-content: center;

                .link {
                    margin: 0 2px;
                    font-size: 12px;
                    color: $color-white;
                    &:hover {
                        color: $color-theme !important;
                    }
                    &:active {
                        color: $color-theme-hover !important;
                    }

                    span {}

                    .link-hr {
                        height: 16px;
                    }
                }
            }

            .copyright {
                font-size: 12px;
                color: $color-white;
                text-align: center;
                text-shadow: 1px 1px 2px #000000;
            }
        }
    }
}

</style>
