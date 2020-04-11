const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")

module.exports = function override(config) {
    config.plugins.push(new MonacoWebpackPlugin({
        // We only import the languages that are actually used to reduce the size of the bundle.
        // Default value: https://github.com/microsoft/monaco-editor-webpack-plugin#options
        languages: ["cpp", "asm"]
    }))
    return config
}
