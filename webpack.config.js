module.exports = {
    mode: "development",
    entry: "./app.ts",
    devtool: "inline-source-map",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    }
}