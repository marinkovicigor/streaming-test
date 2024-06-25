const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        viewer: './public/viewer/viewer-main.js',
        broadcaster: './public/broadcaster/broadcaster-main.js',
        renderWorker: './public/broadcaster/render-worker.js',
        uiHandler: './public/broadcaster/ui-handler.js',
        webrtcHandler: './public/broadcaster/webrtc-handler.js',
        streamHandler: './public/broadcaster/stream-handler.js',
        backgroundHandler: './public/broadcaster/background-handler.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            io: 'socket.io-client'
        })
    ]
};
