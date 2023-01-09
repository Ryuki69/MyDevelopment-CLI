const path = require('path');
const MimiCssEcxtractPlugin = require("mini-css-extract-plugin");
const CssMqpackerPlugin = require("css-mqpacker-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const globule = require("globule");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const ImageminMozjpeg = require("imagemin-mozjpeg");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

// =============================
//   HTML Pugの複数ページ対応
// =============================
const templates = [];
const documents = globule.find(["./src/pug/**/*.pug", "./src/html/**/*.html"], {
  ignore: "./src/pug/**/_*.pug", // 除外
});

documents.forEach((document) => {
  const fileName = document.replace("./src/pug/", "").replace("./src/html/", "").replace(".pug", ".html");
  templates.push(
    new HtmlWebpackPlugin({
      filename: fileName, // ファイル名
      template: document, // コンパイル対象になるファイル
      inject: false, // エントリーポイントのファイルを埋め込むか
      minify: false, // ファイルの圧縮
    }),
  );
});


module.exports = {
  // mode: "development", // 開発用 本番では 「production」
  entry: {
    main: ["./src/assets/js/main.js", "./src/assets/scss/common.scss"],
    // main: "./src/assets/ts/main.ts",
  },
  output: {  // 出力先の設定
    path: path.resolve(__dirname, "public"),
    filename: "./assets/js/[name].bundle.js",
  },
  // devtool: "source-map", 開発用
  // watch: true, // 監視モードを有効化 開発用
  module: {
    rules: [
      {
        test: /\.ts$/, // 対象となるファイル
        loader: "ts-loader",
      },
      {
        test: /\.js$/, // 対象となるファイル
        exclude: /node_modules/, // 除外設定
        loader: "babel-loader", // babelのローダー
      },
      {
        test: /\.scss$/, // 対象となるファイル
        use: [
          // "style-loader", // ④ style要素にCSSを注入
          MimiCssEcxtractPlugin.loader, // ④ CSSファイルを分離
          {
            loader: "css-loader", // ③ css をバンドル
            options: {
              url: false, // CSS内の画像をurlを取り込まない
            },
          },
          "postcss-loader", // ② PostCSS
          "sass-loader", // ① sass -> css
        ],
      },
      {
        test: /\.(html|pug)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false, // 画像のバンドルをしない
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        enforce: "pre",
        use: [
          {
            loader: "pug-html-loader",
            options: {
              pretty: true, // フォーマッターの実行
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"], // 拡張子を省略した import の対策 (上書きになる)
  },
  plugins: [
    new EslintPlugin({
      extensions: ['.ts', '.js'],
      exclude: 'node_modules',
      fix: true,
    }),
    new MimiCssEcxtractPlugin({
      filename: './assets/css/common.css',
    }),
    new StyleLintPlugin({
      fix: true, // 直せるやつは勝手に直してくれる Autofix モードの有効化
      failOnError: true, // エラーが出たらビルドを中断
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets/img", // コピー元
          to: "assets/img", // コピー先　 (output.path が基準)
          noErrorOnMissing: true, // コピー元ファイルがなくてもエラーにしない
        },
        {
          from: "src/.htaccess",
          noErrorOnMissing: true,
        },
      ],
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: { // PNG
        quality: "95-100",
      },
      gifsicle: { // GIF
        interlaced: false,
        optimizationLevel: 1,
        colors: 256,
      },
      svgo: {}, // SVG
      plugins: [
        ImageminMozjpeg({ // JPG
          quality: 85,
          progressive: true,
        }),
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)$/i,
          options: {
            quality: 75,
          },
        },
      ],
      overrideExtension: false, // 拡張子を上書きしない (元の拡張子の後ろに webp がつく)
      detailedLogs: true, // 変換後のバイト数や変換に失敗したファイル数などを表示
    }),
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      online: true,
      open: "external",
      server: { baseDir: ["public"] } // 対象のディレクトリ
    }),
    new CssMqpackerPlugin({
      sort: true,
    }),
    ...templates,
  ],
};
