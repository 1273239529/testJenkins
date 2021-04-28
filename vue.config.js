const webpack = require('webpack');
const Timestamp = '1.3.1';
module.exports = {
    publicPath :process.env.NODE_ENV === 'production'?'./':'/',
    configureWebpack: {
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号】
			filename: `js/[name].${Timestamp}.js`,
			chunkFilename: `js/[name].${Timestamp}.js`,
		},
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
              }),
        ]
    },
    //跨域配置
    devServer: {
        proxy:{
            '/api': {
				target: 'http://47.105.48.45:1079',
				// target: 'http://cjconsumption.yijinpay.cn',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api':''
				}
            }
        }
    }
}