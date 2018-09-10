# 模块化介绍
## CommonJs、AMD 与 UMD
### AMD

    // 定义一个AMD 模块
    // @param 模块名称
    // @param 依赖模块数组
    // @param 模块生成工厂 默认参数 [require, exports, module]
    define(id?, dependencies?, factory)

    // 加载一个模块
    // @param 加载的模块数组
    // @param callback 加载完成后的回调
    require(dependencies?, callback)

### CommonJs

    // 导入模块1
    const module1 = require("module1");
    // 导出模块
    module.exports = {};

### UMD
UMD 是对 AMD 与 CommonJs 的规范统一，兼容 AMD 与 CommonJs，同时还支持“全局”变量规范

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // Node, CommonJS之类的
            module.exports = factory(require('jquery'));
        } else {
            // 浏览器全局变量(root 即 window)
            root.returnExports = factory(root.jQuery);
        }
    }(this, function ($) {
        // 方法
        function myFunc(){};
        // 暴露公共方法
        return myFunc;
    }));