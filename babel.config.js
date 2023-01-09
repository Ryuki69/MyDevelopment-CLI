module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage", // 必要な Polyfill のみ import してくれる
          corejs: 3, // バージョンを指定
        },
      ]
    ],
  };
};
