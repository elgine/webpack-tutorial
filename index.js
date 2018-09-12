const regExp = new RegExp(`src[\\/]style[\\/]home[\\/]?.*\.(css|less)$`);

console.log(regExp.test("src/style/home.less"));