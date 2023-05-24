let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    // 目标地址
    target: 'http://localhost:8081',
    // 发送请求头 host 会被设置成target
    changeOrigin: true,

    // 不重写请求地址
    pathRewrite: {
        '^/': "/"
    }


};

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8082,
        proxy: proxyObj
    },
    publicPath: './'
}