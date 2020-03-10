/**
* @name 用户视图
* @description
* @author gongjf
* @since 2019年6月24日 14:51:05
*/

<template>
    <div class="context user-context">
        <!-- 加载组件 -->
        <loading :IsLoading="show.isLoading" @hideLoading="hideLoading"></loading>
        <!-- 顶部 -->
        <div class="list-head-area">
            <div class="left-area"></div>
            <div class="right-area">
                <div class="input-group">
                    <el-input placeholder="请输入关键字" prefix-icon="el-icon-search"
                        maxlength="10" show-word-limit clearable
                        @keydown.enter.native="search" v-model.trim="user.keyword"></el-input>
                </div>
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
                <el-table-column prop="name" label="用户" sortable="custom"></el-table-column>
                <el-table-column prop="telephone" label="手机号" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="注册时间" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="authNames" label="权限" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" @click="detailRecord(scope.$index, scope.row)">详情</el-button>
                        <el-button size="mini" @click="editRecord(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteRecord(scope.$index, scope.row)">删除</el-button>
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
            :title="dialog.title" :visible.sync="show.dialog.detail">
            <div class="dialog-context" v-if="show.dialog.detail">
                <el-form :model="dialog.form" ref="userInfoDialogForm" label-width="85px">
                    <el-form-item label="ClientId" prop="clientId">
                        <el-input v-model.trim="dialog.form.clientId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="Secret" prop="secret">
                        <el-input v-model.trim="dialog.form.secret" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="Telephone" prop="telephone">
                        <el-input v-model.trim="dialog.form.telephone" readonly></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import Loading from "components/base/Loading";
import Status from "api/base/status";
import * as UserApi from "api/user";

export default {
    name: "User",
    // 注册子组件
    components: {
        Loading
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isLoading: false,
                dialog: {
                    detail: false
                }
            },
            user: {},
            tableData: [],
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 15,
                totalPageCount: 2,
                sortDirect: 'desc',
                sortField: 'create_time'
            }
        };
    },
    // 组件函数
    methods: {
        init() {
            this.refreshPageData();
        },
        showLoading() {
            this.show.isLoading = true;
        },
        hideLoading() {
            this.show.isLoading = false;
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
        validate() {
            // if (!this.user || !this.user.password) {
            //     this.$message({ type: "error", showClose: true, message: "请填写密码" });
            //     return false;
            // }
            return true;
        },
        refreshPageData() {
            this.pagination.pageNo = 1;
            this.getPageData();
        },
        search() {
            this.refreshPageData();
        },
        sortChange(sort) {
            let order = sort.order;
            let prop = sort.prop;
            let column = sort.column;
            this.refreshPageData();
        },
        sizeChange(size) {
            this.pagination.pageSize = size;
            this.refreshPageData();
        },
        pageChange(page) {
            this.pagination.pageNo = page;
            this.getPageData();
        },
        async detailRecord(index, row) {
            let id = row.id;
        },
        async editRecord(index, row) {
            let id = row.id;
        },
        async deleteRecord(index, row) {
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
        },
        async download(index, row) {
            try {
                // 显示加载动画
                this.showLoading();
                // 请求接口
                let response = await DataSetApi.download(row);
                if(response) {
                    let contentDisposition = response.headers['content-disposition'];
                    let blob = new Blob([response.data], {type: response.headers['content-type']});

                    if(contentDisposition && blob) {
                        let filename = contentDisposition.split('filename=')[1];
                        let url = URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.download = decodeURI(filename);
                        a.href = url;
                        a.click();
                    } else {
                        this.$message({ type: 'error', showClose: true, message: '导出失败，请重试或者联系管理员' });
                    }
                }
                // 隐藏加载动画
                this.hideLoading();
            } catch(err) {
                this.$message({ type: 'error', showClose: true, message: err.message || '操作失败' });
                // 隐藏加载动画
                this.hideLoading();
            }
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

