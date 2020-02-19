/**
* @name 文件上传组件
* @description
* @author gongjf
* @since 2019年10月24日 14:50:32
*/

<template>
    <div class="context fileuploader-context">
        <!-- 加载动画 -->
        <loading :IsLoading="show.isLoading" :AutoHideTime="0" Msg=""></loading>
        
        <!-- 顶部 -->
        <div class="list-head-area">
            <div class="left-area">
                <div class="summary area-unit">
                    <span class="summary-label">共&nbsp;</span>
                    <span class="summary-num" v-html="fileList.length"></span>
                    <span class="summary-label">&nbsp;项，已上传&nbsp;</span>
                    <span class="summary-num" v-html="uploadedFileList.length"></span>
                    <span class="summary-label">&nbsp;项</span>
                </div>
            </div>
            <div class="right-area">
                <el-button class="area-unit" title="顶置"
                    @click="$refs.elUpload.$el.scrollTop = 0;">
                    <i class="iconfont el-icon-caret-top"></i>顶置
                </el-button>
                <!-- <el-button class="area-unit" title="清空" @click="clearFileList">
                    <i class="iconfont el-icon-delete"></i>清空
                </el-button> -->
                <!-- <el-button class="area-unit" type="primary" title="上传" @click="submitUpload">
                    <i class="iconfont el-icon-upload2"></i>上传
                </el-button> -->
            </div>
        </div>

        <!-- 主体 -->
        <div class="list-body-area">
            <!-- 上传控件 -->
            <el-upload ref="elUpload" class="upload-area" list-type="picture-card" multiple 
                :headers="upload.headers" :action="upload.url" :data="upload.data" :auto-upload="upload.autoUpload"
                :limit="TotalLimit" :accept="FileType" :file-list="fileList" 
                :on-preview="onFilePreview" :on-remove="onFileRemove" :on-exceed="onFileExceed" :on-change="onUploadChange"
                :on-success="onFileSuccess" :on-error="onFileError" :before-upload="beforeFileUpload">
                <i class="el-icon-plus"></i>
            </el-upload>
            
            <!-- 备注 -->
            <div class="remark">
                <span>1. 单次上传不能选择{{this.TotalLimit}}个以上的文件；</span>
                <span>2. 每个文件不能大于{{this.SizeLimit / 1024}}KB；</span>
            </div>
        </div>

        <div class="dialog-footer">
            <el-button @click="clearFileList()">重 置</el-button>
            <el-button type="primary" @click="submitUpload()">上 传</el-button>
            <el-button type="primary" v-if="show.choiceBtn" @click="returnUploadedFiles()">确 定</el-button>
        </div>
        
        <!-- 预览弹窗 -->
        <el-dialog top="5vh" width="40%" append-to-body 
            :title="dialog.title" :visible.sync="show.dialog.filePreview">
            <el-image style="display: block;" lazy v-if="show.dialog.filePreview" :src="current.url" alt=""></el-image>
        </el-dialog>
    </div>
</template>

<script>
import Loading from "components/base/Loading";
import { dateFormat } from 'assets/js/base/formatter';
import * as Utils from "assets/js/base/util";
import Status from "api/status";
import * as OssApi from "api/oss";

export default {
    name: 'FileUploader',
    // 注册子组件
    components: {
        Loading
    },
    props: {
        Url: {
            type: String,
            default: '#'
        },
        Data: {
            type: Object,
            default: null
        },
        FileType: {
            type: String,
            default: '*'
        },
        TotalLimit: {
            type: Number,
            default: 50
        },
        SizeLimit: {
            type: Number,
            default: 100 * 1024 // 100KB
        }
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isLoading: false,
                choiceBtn: false,
                dialog: {
                    filePreview: false
                }
            },
            entity: {},
            // 弹窗参数
            dialog: {
                title: '',
                form: {},
            },
            // 上传参数
            upload: {
                url: this.Url,
                headers: {},
                data: {},
                autoUpload: false
            },
            fileList: [], // 上传文件列表
            uploadedFileList: [], // 已上传文件列表
            readyFileList: [], // 准备上传文件列表
            failFileList: [], // 上传失败文件列表
            current: {},
        };
    },
    // 组件函数
    methods: {
        init() {
            
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
        // 更新文件列表
        updateFileList(fileList) {
            fileList = fileList || this.$refs.elUpload.uploadFiles;
            this.fileList = fileList;
            // 清空旧记录
            this.readyFileList.splice(0, this.readyFileList.length);
            this.uploadedFileList.splice(0, this.uploadedFileList.length);
            this.failFileList.splice(0, this.failFileList.length);
            // 遍历追加新纪录
            fileList.map((v,i) => {
                if(v.status === 'ready') {
                    this.readyFileList.push(v);
                }
                else if(v.status === 'success') {
                    this.uploadedFileList.push(v);
                }
                else if(v.status === 'fail') {
                    this.failFileList.push(v);
                }
            });
        },
        // 通知全部文件已经处理完成
        emitAllFileHandle(fileList) {
            let handleFileNum = this.uploadedFileList.length + this.failFileList.length;
            if(handleFileNum === fileList.length) {
                this.hideLoading();
                if(this.uploadedFileList.length > 0) {
                    this.show.choiceBtn = true;
                    this.$emit('AllFileHandle', {});
                }
            } else {
                this.show.choiceBtn = false;
            }
        },
        // 返回已传项
        returnUploadedFiles() {
            // 筛选已传项
            let files = this.uploadedFileList.map((v, i) => {
                if(v.response) {
                    return v.response.data;
                }
            });

            if(files.length >0) {
                this.$message({ type: "success", showClose: true, message: `已选中${files.length}项` });
                this.$emit('ReturnUploadedFiles', { files });
            }
            else {
                this.$message({ type: "error", showClose: true, message: '没有已上传项可供选中' });
            }
        },
        // 清除文件
        clearFileList() {
            this.$refs.elUpload.clearFiles();
            // 更新文件列表
            this.updateFileList();
        },
        formatterDate(date) {
            return dateFormat(new Date(date));
        },
        // 上传文件
        submitUpload() {
            let count = this.readyFileList.length;
            if(count) {
                this.$confirm(`确认上传：${count}个文件？`).then(async () => {
                    await this.$refs.elUpload.submit();
                }).catch(() => {});
            }
            else this.$message({ type: 'error', showClose: true, message: '未选择任何文件' });
        },
        // 文件上传前
        async beforeFileUpload(file) {
            try{
                // 显示加载动画
                this.showLoading();

                // 组织参数
                let { name } = file;
                let data = {
                    fileName: name, 
                    ...(this.Data)
                }

                // 请求接口
                let response = await OssApi.getUploadToken(data);
                if(response.status === Status.HTTP_STATUS.OK) {
                    let { url } = response.data;
                    this.upload.url = url;
                    this.upload.data = response.data;
                    this.upload.headers['Content-Disposition'] = response.data['Content-Disposition'];
                }
            } catch(err) {
                this.$message({ type: 'error', showClose: true, message: err.message || '请求Token失败' });
            }
        },
        // 文件状态变更
        onUploadChange(file, fileList) {
            // 过滤文件大小
            if(this.SizeLimit < file.size) {
                this.$message({ type: 'error', showClose: true, message: `单个文件不能大于${this.SizeLimit / 1024}KB` });
                Utils.arrayRemoveByValue(fileList, file);
            }
            // 过滤文件类型
            let fileNameArray = file.name.split('.');
            let fileExt = ''; 
            if (fileNameArray.length > 1) {
                fileExt = fileNameArray[fileNameArray.length - 1];
                if(fileExt.length>0) {
                    if(this.FileType && this.FileType !== '*' && this.FileType.indexOf(fileExt)<0) {
                        this.$message({ type: 'error', showClose: true, message: `文件类型不正确，请选择${this.FileType}类型的文件` });
                        Utils.arrayRemoveByValue(fileList, file);
                    }
                }
                else {
                    this.$message({ type: 'error', showClose: true, message: `文件名称有问题` });
                    Utils.arrayRemoveByValue(fileList, file);
                }
            } else {
                this.$message({ type: 'error', showClose: true, message: `文件名称有问题` });
                Utils.arrayRemoveByValue(fileList, file);
            }
            // 更新文件列表
            this.updateFileList(fileList);
        },
        // 移除文件
        onFileRemove(file, fileList) {
            // 更新文件列表
            this.updateFileList(fileList);
        },
        // 文件上传成功
        onFileSuccess(response, file, fileList) {
            // 更新文件列表
            this.updateFileList(fileList);
            this.$message({ type: 'success', showClose: true, message: `${file.name} 上传成功` });
            // 判断是否处理完所有文件
            this.emitAllFileHandle(fileList);
        },
        // 文件上传失败
        onFileError(err, file, fileList) {
            // 更新文件列表
            this.updateFileList(fileList);
            this.$message({ type: 'error', showClose: true, message: `${file.name} 上传失败：${err.message}` });
            // 判断是否处理完所有文件
            this.emitAllFileHandle(fileList);
        },
        // 预览文件
        onFilePreview(file) {
            this.dialog.title = file.name;
            this.current.url = file.url;
            this.show.dialog.filePreview = true;
        },
        // 文件超过数量限制
        onFileExceed(files, fileList) {
            // 更新文件列表
            this.updateFileList(fileList);
            this.$message({ type: 'error', showClose: true, message: `一次上传不能超过${this.TotalLimit}个文件` });
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
}
</script>

<style scoped lang="scss">

.el-button {
    padding: 10px;
}

.fileuploader-context {
    position: relative;

    .list-head-area {
        position: relative;
        border: 1px solid #eeeeee;
    }

    .list-body-area {
        position: relative;
        overflow: hidden;
    }

    .upload-area {
        max-height: 500px;
        overflow-y: auto;
        margin: 10px 0 !important;
    }
    
    .remark {
        margin-top: 10px;

        span {
            justify-content: unset;
        }
    }

}
</style>
