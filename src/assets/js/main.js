// import文

import defo, { hello, name } from "./lib/sub";
import "../sass/common.scss";

defo(); // デフォルト export の関数
hello(); // export された関数を実行
console.log(name); // 名前付きの export の変数

console.log("Hello webpack!");
console.log("Good webpack!");
console.log("Success ESLint!");

const init = (settings) => {
  console.log("babel Test");

  const defaultOptions = {
    option1: false,
    option2: false,
    option3: false,
  };

  const options = Object.assign(defaultOptions, settings);
  console.log(options);
};

init();
init({ option2: true });

// Drawer
