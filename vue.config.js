const isDebug = process.env.NODE_ENV !== 'production';
const proxyUrls = {
  backend: "http://localhost:8192"
};

module.exports = {
  // 部署生产环境和开发环境下的URL
  baseUrl: !isDebug ? "./" : "/",
  // 文件输出路径
  outputDir: "dist",
  // 是否使用eslint
  lintOnSave: isDebug,
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: true,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 调整内部的 webpack 配置
  configureWebpack: {
    output: {
      // 正确缩进多行字符串
      sourcePrefix: ' '
    },
    amd: {
      // 源码模块化使用的requireJs，这个配置可以使webpack打包
      toUrlUndefined: true
    },
    node: {
      // 解决了fs模块的一些第三方用法，该模块的目标是在Node环境而不是浏览器中使用
      fs: "empty"
    },
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'views': '@/views',
        'api': '@/api',
        'router': '@/router',
        'store': '@/store'
      }
    },
    plugins: [],
    module: {
      // 打印载入特定库时候的警告
      unknownContextCritical: true,
      // 解决Cannot find module "."的错误
      unknownContextRegExp: /^.\/.*$/
    }
  },
  // 链式方法调整内部的 webpack 配置
  chainWebpack: config => {
    config
  },
  // 配置 webpack-dev-server
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      "/backend": {
        target: proxyUrls.backend,
        pathRewrite: {
          "^/backend": ""
        },
        // 是否代理 websockets
        ws: true,
        // 是否跨域，若是，将主机标头的原点更改为目标URL
        changeOrigin: true
      }
    }
  },
  // 配置样式参数
  css: {
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    sourceMap: false,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
    extract: !isDebug,
    // 配置样式加载器
    loaderOptions: {
      // 这里的选项会传递给 css-loader
      css: {},
      // 这里的选项会传递给 postcss-loader
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
              viewportWidth: 1920, // 设计稿的宽度 
              unitPrecision: 3, // px转成vw、vh后小数点保留的位数 
              minPixelValue: 3, // 不转化为vw的最小px值
              unitToConvert: "px", // 需要转换的单位
              viewportUnit: "vw", // 全局单位
              fontViewportUnit: "vw", // 字体单位
              // exclude: /(\/|\\)(node_modules)(\/|\\)/, // 避免第三方组件被转换，只支持正则表达式
              propList: ["*"], // 需要转换单位的css属性，默认所有
              selectorBlackList: [], // 忽略指定前缀的css属性
              mediaQuery: false, // 查询多媒体文件时允许转换单位
              replace: true, // replaces rules containing vw instead of adding fallbacks
              // landscape: false,
              // landscapeUnit: 'vw',
              // landscapeWidth: 568
          })
        ]
      },
      // 这里的选项会传递给 sass-loader
      sass: {
        // 引入全局变量
        data: `@import "@/assets/sass/index.scss";$src: "${process.env.VUE_APP_SRC}";`
      }
    }
  }
};
