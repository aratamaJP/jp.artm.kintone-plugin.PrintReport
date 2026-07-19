/* eslint-env node */
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "inline-cheap-module-source-map",
  entry: {
    config: "./src/config.ts",
    desktop: "./src/desktop.ts",
    mobile: "./src/mobile.ts",
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new KintonePlugin({
      manifestJSONPath: "./manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "./dist/plugin.zip",
    }),
  ],
};
