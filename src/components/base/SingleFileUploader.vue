/**
* @name 单文件上传组件
* @description
* @author gongjf
* @since 2020年01月19日 14:50:32
*/

<template>
    <div class="context singlefileuploader-context">
        <!-- 加载动画 -->
        <loading :IsLoading="show.isLoading" :AutoHideTime="0" Msg=""></loading>
        
        <!-- 上传控件 -->
        <el-upload ref="elUpload" class="file-upload" :auto-upload="upload.autoUpload"
            :headers="upload.headers" :action="upload.url" :data="upload.data"
            :accept="FileType"
            :on-change="onUploadChange" :on-remove="onFileRemove" 
            :on-success="onFileSuccess" :on-error="onFileError" 
            :before-upload="beforeFileUpload">
            <el-button size="small" type="primary" slot="trigger" 
                v-if="fileList.length === 0">
                <span>选择文件</span>
            </el-button>
        </el-upload>

        <div class="dialog-footer">
            <el-button type="primary" @click="submitUpload()">上 传</el-button>
        </div>
        
        <!-- 预览弹窗 -->
        <el-dialog top="2vh" width="40%" append-to-body 
            :title="dialog.title" :visible.sync="show.dialog.filePreview">
            <el-image style="display: block;" lazy v-if="show.dialog.filePreview" :src="current.url" alt=""></el-image>
        </el-dialog>

    </div>
</template>

<script>
import Loading from "components/base/Loading";
import * as Utils from "assets/js/base/util";
import Status from "api/status";
import * as OssApi from "api/oss";

export default {
    name: 'SingleFileUploader',
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
        SizeLimit: {
            type: Number,
            default: 1024 * 1024 * 5 // 5MB
        }
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {
                isLoading: false,
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
            fileList: [] // 上传文件列表
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
        // 清除文件
        clearFileList() {
            this.$refs.elUpload.clearFiles();
            this.fileList = [];
        },
        // 上传文件
        submitUpload() {
            let count = this.$refs.elUpload.uploadFiles.length;
            if(count) this.$refs.elUpload.submit();
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
                    id: this.Data.id,
                    ...(this.Data)
                }

                // 请求接口
                let response = await OssApi.getUploadToken(data);
                if(response.status === Status.HTTP_STATUS.OK) {
                    let { url } = response.data;
                    this.upload.url = url;
                    this.upload.data = response.data;
                    this.upload.headers = {
                        'Content-Disposition': response.data['Content-Disposition']
                    };
                }
            } catch(err) {
                this.$message({ type: 'error', showClose: true, message: err.message || '请求Token失败' });
            }
        },
        // 文件状态变更
        onUploadChange(file, fileList) {
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
            this.fileList = fileList;
        },
        // 移除文件
        onFileRemove(file, fileList) {
            this.fileList = fileList;
        },
        // 文件上传成功
        onFileSuccess(response, file, fileList) {
            if(!response.data || (response instanceof String && response.indexOf('Error'))) {
                this.$message({ type: 'error', showClose: true, message: `${file.name} 上传失败：${response}` });
            }
            else {
                if(response.data) {
                    file = Object.assign({}, file, response.data);
                } 
                this.$message({ type: 'success', showClose: true, message: `${file.name} 上传成功` });
                this.$emit('FileUploadSuccess', {
                    file
                });
            }
            this.fileList = fileList;
            // 隐藏加载动画
            this.hideLoading();
        },
        // 文件上传失败
        onFileError(err, file, fileList) {
            // 隐藏加载动画
            this.hideLoading();
            this.$message({ type: 'error', showClose: true, message: `${file.name} 上传失败：${err.message}` });
            // this.fileList = fileList;
        },
        // 预览文件
        onFilePreview(file) {
            this.dialog.title = file.name;
            this.current.url = file.url;
            this.show.dialog.filePreview = true;
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

.singlefileuploader-context {
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
