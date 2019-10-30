const path = require('path');
const webpack = require('webpack');
const notifier = require('node-notifier');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const laya = require('./webpack.laya')
const info = require('./package.json');
const glob = require('glob')
const os = require('os')

const resolve = function(dir) {
    return path.join(__dirname, '..', dir)
}

const createNotifierCallback = function () {
    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: '你又写bug了！！',
            message: severity + ': ' + error.name,
            subtitle: filename || '',
        })
    }
}

const entries = function () {
    var entryFiles = glob.sync('./release/web/*.js')
    var map = {}
    entryFiles.forEach((filePath) => {
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      map[filename] = filePath
    })
    return map
}

const common_config = {
    context: path.resolve(__dirname, './'),
    entry: {
        laya: laya.entry,
        app: ['./src/main']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".json", ".js"]
    },
    devtool: '#source-map',
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('bin')]
        }, {
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
            }
        }]
    },
    plugins: [
    ]
};

let localhost = ''
try {
    const network = os.networkInterfaces()
    localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
    localhost = '0.0.0.0'
}

const dev_config = {
    devtool: 'cheap-module-eval-source-map',
    watch: true,
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'bin'),//静态文件根目录
        port: 8080,
        host: localhost,
        publicPath: "/",
        compress: true,//服务器返回浏览器时是否启动gzip压缩
        open: true,
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: `http://${localhost}:4040`
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: false,
            template: "./bin/index.html",
            slot: '',
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './bin'),
                to: path.resolve(__dirname, './dist'),
                ignore: ['libs/**']
            }
        ]),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${localhost}:8080`],
            },
            onErrors: createNotifierCallback()
        })
    ]
};


  
const prod_config = {
    entry: entries,
    output: {
        path: path.resolve(__dirname.replace('build','release')),//静态文件根目录
        filename: '[name].js',
        publicPath: '<%=cdn%>'
    },
    optimization: {
        minimize: true,
        nodeEnv: 'production',
        providedExports: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './release/web'),
                to: path.resolve(__dirname.replace('build','release'))
            }
        ]),
        new HtmlWebpackPlugin({
            hash: false,
            template: "./bin/index.html",
            filename: path.resolve(__dirname.replace('build','server').replace(info.name,`views/${info.name}/index.ejs`)),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${localhost}:8080`],
            },
            onErrors: createNotifierCallback()
        })
    ]
};

const prod_ts_compile_option = {
    target: 'es5',
    sourceMap: false,
    lib: ['dom', 'es5', 'es2015.promise'],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        return Object.assign(common_config, dev_config);
    } else {
        common_config.module.rules[1].options.compilerOptions = prod_ts_compile_option;
        return Object.assign(common_config, prod_config);
    }
};
