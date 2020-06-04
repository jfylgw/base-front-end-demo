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

        <!-- 登录弹窗 -->
        <el-dialog width="20%" top="4vh" 
            :close-on-click-modal="false"
            title="重新登录" :visible.sync="$store.state.common.showSignInDialog"
            :before-close="beforeDialogClose">
            <div class="dialog-context" v-if="$store.state.common.showSignInDialog">
                <!-- 加载动画 -->
                <loading :IsLoading="show.isLoading" :AutoHideTime="0" Msg=""></loading>

                <el-form ref="signInDialogForm" label-width="85px" :model="dialog.form" :rules="dialog.rules" @keyup.enter="signIn">
                    <el-form-item label="名称" prop="username">
                        <el-input v-model.trim="dialog.form.username" placeholder="请输入名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model.trim="dialog.form.password" placeholder="请输入密码" show-password clearable></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部按钮 -->
                <div class="dialog-footer">
                    <el-button @click="ROUTER_TO_SIGNIN()">返回登录页</el-button>
                    <el-button type="primary" @click="signIn">登 录</el-button>
                </div>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from "components/base/Loading";
import Status from "assets/js/base/status";
import * as AuthorityApi from "api/authority";

export default {
    name: 'App',
    // 注册子组件
    components: {
        Loading
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isLoading: false
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
            }
        }
    },
    // 组件函数
    methods: {
        // 引入Vuex的方法
        ...mapActions(['USER_IN', 'USER_OUT', 'HIDE_SIGNIN_DIALOG', 'ROUTER_TO_SIGNIN']),
        init() {},
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
        // 关闭弹窗前
        beforeDialogClose(done) {
            // 隐藏登录弹窗
            this.HIDE_SIGNIN_DIALOG();
            done();
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
                if(response) {
                    let data = response.data;
                    if(response.status === Status.HTTP_STATUS.OK) {
                        // 隐藏加载动画
                        this.hideLoading();
                        // 保存用户信息
                        this.USER_IN(data);
                        // 隐藏登录弹窗
                        this.HIDE_SIGNIN_DIALOG();
                    }
                }
            } catch(err) {
                // 隐藏加载动画
                this.hideLoading();
                this.$message({ type: 'error', showClose: true, message: '登录失败' });
            }
        }
    }
}
</script>

<style lang="scss">
.app-context {
    overflow: hidden;
}
</style>
