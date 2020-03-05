/**
* @name 验证码组件
* @description
* @author gongjf
* @since 2020年3月2日 14:50:32
*/

<template>
    <div class="context verificationcode-context">
        <div class="codeMask" @click="refreshCode"></div>
        <div class="validCode disabled-select" :style="`width:${Width}; height:${Height}`" @click="refreshCode">
            <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VerificationCode',
    // 注册子组件
    components: {},
    props: {
        Width: {
            type: String,
            default: 'fit-content'
        },
        Height: {
            type: String,
            default: '40px'
        },
        Length: {
            type: Number,
            default: 4
        }
    },
    // 页面model字段（必须写在return的集合中，集合中的键值会挂载到this中）
    data() {
        return {
            show: {},
            codeList: []
        };
    },
    // 组件函数
    methods: {
        init() {
            this.refreshCode();
        },
        refreshCode() {
            this.createdCode();
        },
        createdCode() {
            let len = this.Length,
            codeList = [],
            chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
            charsLen = chars.length;
            // 生成
            for (let i = 0; i < len; i++) {
                let rgb = [Math.round(Math.random() * 200), Math.round(Math.random() * 200), Math.round(Math.random() * 200)]
                codeList.push({
                    code: chars.charAt(Math.floor(Math.random() * charsLen)),
                    color: `rgb(${rgb})`,
                    fontSize: `${14 + Math.ceil(Math.random() * 6)}px`,
                    padding: `${Math.ceil(Math.random() * 10)}px`,
                    transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
                });
            }
            // 指向
            this.codeList = codeList;
            // 将当前数据派发出去
            this.$emit('update:value', codeList.map(item => item.code).join(''));
        },
        getStyle (data) {
            return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`;
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    }
}
</script>

<style scoped lang="scss">
.verificationcode-context {
    position: relative;
    width: fit-content;

    .codeMask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
    }

    .validCode{
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        min-width: 100px;
        min-height: 40px;
        cursor: pointer;
        -moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;

        span{
            display: inline-block;
        }
    }
}
</style>
