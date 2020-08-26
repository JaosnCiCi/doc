```
// 将设置放入此文件中以覆盖默认设置
{
  // vscode默认启用了根据文件类型自动设置tabsize的选项
  "editor.detectIndentation": false,
  // 重新设定tabsize
  "editor.tabSize": 2,
  // #每次保存的时候自动格式化 
  "editor.formatOnSave": true,
  // 开启 vscode 文件路径导航
  "breadcrumbs.enabled": true,
  //  #去掉代码结尾的分号 
  "prettier.semi": false,
  //  #使用带引号替代双引号 
  "prettier.singleQuote": true,
  //  #让函数(名)和后面的括号之间加个空格
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  // 显示 markdown 中英文切换时产生的特殊字符
  "editor.renderControlCharacters": true,
  // #这个按用户自身习惯选择 
  "vetur.format.defaultFormatter.html": "prettyhtml",
  // #让vue中的js按编辑器自带的ts格式进行格式化 
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  // 设置 eslint 保存时自动修复
  // "eslint.autoFixOnSave": true,
  // eslint 检测文件类型
  "eslint.format.enable": true,
  "eslint.validate": [
    "vue",
    "html",
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ],
  // vetur 的自定义设置
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "singleQuote": true,
      "semi": false
    },
    "js-beautify-html": {
      "wrap_attributes": "force-aligned"
      // #vue组件中html代码格式化样式
    }
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "git.autofetch": true,
  "cSpell.userWords": [
    "Instrucitons",
    "LIMSBOX",
    "LIMSPAT",
    "LIMSSAM",
    "Pipline",
    "Ultrafrac",
    "camelcase",
    "cellpadding",
    "cellspacing",
    "eqeqeq",
    "examing",
    "geneseeq",
    "goback",
    "iife",
    "isnan",
    "libconstruction",
    "libquant",
    "lims",
    "linebreak",
    "mixins",
    "nonwords",
    "sussess",
    "vuex"
  ],
  "editor.quickSuggestions": {
    "strings": true
  },
  "git.enableSmartCommit": true,
  "[javascript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  } // 两个选择器中是否换行
}
```