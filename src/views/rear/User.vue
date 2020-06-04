/**
* @name 用户视图
* @description
* @author gongjf
* @since 2019年6月24日 14:51:05
*/

<template>
    <div class="context user-context">
        <!-- 加载组件 -->
        <loading :IsLoading="show.isLoading" @hideLoading="hideLoading" Msg=""></loading>
        <!-- 顶部 -->
        <div class="list-head-area">
            <div class="left-area"></div>
            <div class="right-area">
                <el-input class="area-unit" placeholder="请输入关键字" prefix-icon="el-icon-search"
                    show-word-limit clearable
                    @keydown.enter.native="search" v-model.trim="entity.keyword"
                >
                    <el-button slot="append" type="primary" icon="el-icon-search" @click="search"></el-button>
                </el-input>
                <el-button class="area-unit" type="primary" @click="showAddDialog">创 建
                </el-button>
            </div>
        </div>
        <!-- 主体 -->
        <div class="list-body-area">
            <!-- 列表 -->
            <el-table class="" tooltip-effect="dark" stripe v-loading="loading"
                :data="tableData" :default-sort = "{prop: 'createTime', order: 'descending'}"
                @sort-change="sortChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="用户" sortable="custom">
                    <template slot-scope="scope">
                        <span :title="scope.row.name">{{scope.row.name | ellipsis(12)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="手机号" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="注册时间" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{formatterDate(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="authNames" label="权限" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :title="scope.row.authNames">{{scope.row.authNames | ellipsis(12)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showDetailDialog(scope.$index, scope.row)">详情</el-button>
                        <el-button size="mini" @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="remove(scope.$index, scope.row)">删除</el-button>
                        <!-- <el-link class="column-option" type="primary" title="编辑" @click="showEditDialog(scope.row, scope.$index)">
                            <i class="iconfont el-icon-edit-outline"></i>
                        </el-link>
                        <el-link class="column-option" type="primary" title="详情" @click="showDetailDialog(scope.row, scope.$index)">
                            <i class="iconfont el-icon-tickets"></i>
                        </el-link>
                        <el-link class="column-option" type="danger" title="删除" @click="remove(scope.row, scope.$index)">
                            <i class="iconfont el-icon-delete"></i>
                        </el-link> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination class="" layout="total, sizes, prev, pager, next, jumper" background
                :total="pagination.totalCount" :page-size="pagination.pageSize" :current-page.sync="pagination.pageNo"
                @size-change="sizeChange" @current-change="pageChange">
            </el-pagination>
        </div>
        
        <!-- 用户信息弹窗 -->
        <el-dialog top="4vh" width="30%" 
            :title="form.title" :visible.sync="show.detail">
            <div class="dialog-context" v-if="show.detail">
                <el-form :model="form.params" ref="detailDialogForm" label-width="85px">
                    <el-form-item label="ClientId" prop="clientId">
                        <el-input v-model.trim="form.params.clientId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="Secret" prop="secret">
                        <el-input v-model.trim="form.params.secret" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="Telephone" prop="telephone">
                        <el-input v-model.trim="form.params.telephone" readonly></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!-- <span class="summary area-unit">
                    <span class="summary-label">（不超过10条） 已选：</span>
                    <span class="summary-num area-unit">{{form.params.subscribeRules ? form.params.subscribeRules.length : 0}}</span>
                </span> -->
                <!-- <el-button :disabled="this.show.isLoading" @click="clearRule()">清 空</el-button>
                <el-button type="primary" :disabled="this.show.isLoading" @click="save">保 存</el-button> -->
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import listMixin from 'assets/js/mixin/list-mixin';
import formMixin from 'assets/js/mixin/form-mixin';
import validateMixin from 'assets/js/mixin/validate-mixin';

// import { dateFormat } from 'assets/js/base/formatter';

import Status from "assets/js/base/status";
import * as UserApi from "api/user";

export default {
    name: "User",
    // 注册子组件
    components: {},
    mixins: [listMixin, formMixin, validateMixin],
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {},
            entity: {},
        };
    },
    // 组件函数
    methods: {
        init() {
            this.refreshPageData();
        },
        formatterDate(date) {
            // return dateFormat(new Date(date));
        },
        async getPageData() {
            try {
                // 显示加载动画
                this.showLoading();
                // 校验输入
                if(!this.validate()) {
                    // 隐藏加载动画
                    this.hideLoading();
                    return;
                }
                // 请求接口
                let response = await UserApi.page(Object.assign(this.user, this.pagination));
                if(response) {
                    let data = response.data;
                    if(response.status === Status.SERVER_STATUS.OK) {
                        // 隐藏加载动画
                        this.hideLoading();
                        // 处理内容，展示分页列表
                        this.tableData = data.result;
                    }
                }
            } catch(err) {
                // 隐藏加载动画
                this.hideLoading();
                this.$message({ type: "error", showClose: true, message: "查询失败" });
            }
        },
        showAddDialog() {
            this.form.params = {};
            this.form.title = '新增用户';
            this.show.add = true;
        },
        async detailRecord(index, row) {
            let id = row.id;
        },
        async editRecord(index, row) {
            let id = row.id;
        },
        async remove(index, row) {
            this.$confirm(`确认删除：${row.name}？`).then(_ => {
                // 显示加载动画
                this.showLoading();
                // 请求接口
                // let response = await UserApi.remove(row.id);
                // if(response.status === 0) {
                //     // 隐藏加载动画
                //     this.hideLoading();
                //     this.$message({ type: "success", showClose: true, message: "删除成功" });
                // }
            }).catch(_ => {});
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
}
</script>

<style scoped lang="scss">
.user-context {
    
}
</style>

