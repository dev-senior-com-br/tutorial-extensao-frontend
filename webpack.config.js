const webpack = require("webpack");
const path = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const packageJson = require("./package");

module.exports = env => {

    const BUILD_FOLDER = "dist";

    const configuration = {
        context: path.join(__dirname, "src"),
        entry: {
            main: "./main.ts",
            vendor: "./vendor.ts",
            polyfills: "./polyfills.ts",
        },
        output: {
            path: path.join(__dirname, BUILD_FOLDER),
            filename: `[name].js`,
        },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: "ts-loader",
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: ["html-loader"],
                },
                {
                    test: /\.(css|scss|sass)$/,
                    use: ["css-hot-loader"].concat(ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "css-loader",
                        }, {
                            loader: "sass-loader",
                            options: {
                                includePaths: ["src/styles"],
                            },
                        }]
                    }))
                },
                {
                    test: /\.(woff2?|ttf|eot|svg)$/,
                    use: [{
                        loader: "file-loader",
                        options: { name: "./fonts/[hash].[ext]" }
                    }]
                },
                {
                    test: /\.(jpe?g|png|gif|svg|ico)$/,
                    use: [{
                        loader: "file-loader",
                        options: { name: "./images/[hash].[ext]" }
                    }]
                },
            ]
        },
        resolve: {
            extensions: [".ts", ".js", ".html"],
            modules: [
                path.join(__dirname, "node_modules"),
            ],
            alias: {
                $locales: path.resolve(__dirname, "./src/locales/locales")
            }
        },
        plugins: [
            new webpack.ContextReplacementPlugin(
                /(.+)?angular(\\|\/)core(.+)?/,
                path.join(__dirname, "src"), {}
            ),
            new ExtractTextPlugin(`style.css`),
            new HtmlWebpackPlugin({
                inject: false,
                template: require("html-webpack-template"),
                baseHref: "./",
                title: packageJson.name,
                meta: [{
                    name: packageJson.name,
                    version: packageJson.version,
                }],
                mobile: true,
            }),
            new webpack.ProvidePlugin({
                $locales: "$locales",
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify(env.mode),
                    "IGNORE_PERMISSIONS": JSON.stringify(env.ignorePermissions),
                },
                $name: JSON.stringify(packageJson.name),
                $version: JSON.stringify(packageJson.version),
                $project: JSON.stringify(packageJson.project),
            }),
            new CopyWebpackPlugin(
                [
                    { from: "./static" },
                    { from: "./locales", to: "./locales" }
                ], { ignore: ["*.gitkeep"] }
            ),
            new webpack.optimize.CommonsChunkPlugin({
                name: [
                    "main",
                    "vendor",
                    "polyfills",
                ]
            }),
        ],
    };

    /** TESTS CONFIGURATION **/
    if (env.mode == "test") {
        configuration.devtool = "inline-source-map";
        configuration.entry = undefined;
    }

    /** DEVELOPMENT CONFIGURATION **/
    if (env.mode == "development") {
        configuration.devtool = "inline-source-map";
        configuration.devServer = {
            historyApiFallback: true,
            contentBase: false,
            compress: true,
            overlay: true,
            open: true,
            openPage: "",
            stats: "minimal"
        };

        configuration.plugins.push(new webpack.NamedModulesPlugin());
    }

    /** PRODUCTION CONFIGURATION **/
    if (env.mode == "production") {
        configuration.devtool = "inline-source-map";
        configuration.plugins.push(new CleanWebpackPlugin([BUILD_FOLDER]));
        configuration.plugins.push(new webpack.optimize.UglifyJsPlugin({ mangle: { keep_fnames: true }, sourceMap: false }));
        configuration.plugins.push(new OptimizeCSSAssets());
    }

    return configuration;
};