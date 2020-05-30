const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

module.exports = function override(config, env) {
    config.plugins.push(new MonacoWebpackPlugin({
        // We only import the languages that are actually used to reduce the size of the bundle.
        // Default value: https://github.com/microsoft/monaco-editor-webpack-plugin#options
        languages: ["cpp", "asm"]
    }))
    return rewireYarnWorkspaces(config, env);
}
