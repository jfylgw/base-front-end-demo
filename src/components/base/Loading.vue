/**
* @name 加载动画组件
* @description
* @author gongjf
* @since 2019年6月24日 11:12:38
*/

<template>
    <div class="loading-contain" v-show="IsLoading">
		<div class="loader">
			<span class="" v-html="Msg"></span>
		</div>
	</div>
</template>

<script>
export default {
    name: "Loading",
    props: {
        Msg: {
            type: String,
            default: "Loading..."
        },
        IsLoading: {
            type: Boolean,
            default: true
        },
        AutoHideTime: {
            type: Number,
            default: 5000
        }
    },
    watch: {
        IsLoading(newVal, oldVal) {
            if(newVal) this.autoHide();
        },
    },
    methods: {
        init() {
            if(this.IsLoading) this.autoHide();
        },
        // 一定时间后，自动隐藏
        autoHide() {
            setTimeout(function () {
                this.IsLoading = false;
                // 返回事件通知上层
                this.$emit('hideLoading');
            }.bind(this), this.AutoHideTime);
        }
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
        this.init();
    },
};
</script>

<style scoped lang="scss">
.loading-contain {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 999;
    overflow: hidden;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgba(255,255,255,.5);

    .loader {
        font-size: 20px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;
        -webkit-animation: load5 1.1s infinite ease;
        animation: load5 1.1s infinite ease;
    }
}

.loader {
    &:before, &:after {
        content: '';
        position: absolute;
        top: 0;
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
    }
    span {
        position: relative;
        top: 0;
        left: 0;
        color: #000000;
        font-size: 16px;
    }
}

@-webkit-keyframes loader {
    0%,
    100% {
        box-shadow: 0 -52px 0 0 #000000, 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.5), -36px -36px 0 0 rgba(0, 0, 0, 0.7);
    }
    12.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.7), 36px -36px 0 0 #000000, 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.5);
    }
    25% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.5), 36px -36px 0 0 rgba(0, 0, 0, 0.7), 50px 0 0 0 #000000, 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    37.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.5), 50px 0 0 0 rgba(0, 0, 0, 0.7), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    50% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.5), 35px 35px 0 0 rgba(0, 0, 0, 0.7), 0 50px 0 0 #000000, -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    62.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.5), 0 50px 0 0 rgba(0, 0, 0, 0.7), -36px 36px 0 0 #000000, -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    75% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.5), -36px 36px 0 0 rgba(0, 0, 0, 0.7), -52px 0 0 0 #000000, -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    87.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.5), -52px 0 0 0 rgba(0, 0, 0, 0.7), -36px -36px 0 0 #000000;
    }
}

@keyframes load5 {
    0%,
    100% {
        box-shadow: 0 -52px 0 0 #000000, 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.5), -36px -36px 0 0 rgba(0, 0, 0, 0.7);
    }
    12.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.7), 36px -36px 0 0 #000000, 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.5);
    }
    25% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.5), 36px -36px 0 0 rgba(0, 0, 0, 0.7), 50px 0 0 0 #000000, 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    37.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.5), 50px 0 0 0 rgba(0, 0, 0, 0.7), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    50% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.5), 35px 35px 0 0 rgba(0, 0, 0, 0.7), 0 50px 0 0 #000000, -36px 36px 0 0 rgba(0, 0, 0, 0.2), -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    62.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.5), 0 50px 0 0 rgba(0, 0, 0, 0.7), -36px 36px 0 0 #000000, -52px 0 0 0 rgba(0, 0, 0, 0.2), -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    75% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.5), -36px 36px 0 0 rgba(0, 0, 0, 0.7), -52px 0 0 0 #000000, -36px -36px 0 0 rgba(0, 0, 0, 0.2);
    }
    87.5% {
        box-shadow: 0 -52px 0 0 rgba(0, 0, 0, 0.2), 36px -36px 0 0 rgba(0, 0, 0, 0.2), 50px 0 0 0 rgba(0, 0, 0, 0.2), 35px 35px 0 0 rgba(0, 0, 0, 0.2), 0 50px 0 0 rgba(0, 0, 0, 0.2), -36px 36px 0 0 rgba(0, 0, 0, 0.5), -52px 0 0 0 rgba(0, 0, 0, 0.7), -36px -36px 0 0 #000000;
    }
}

</style>
