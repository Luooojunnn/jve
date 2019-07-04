const Handlebars = require("handlebars");
const fs = require("fs");
/**
 * 根据传入的绝对路径，进行文件的修改操作
 * @param {string} path - 绝对路径
 * @param {any} meta - 元信息
 */
function editFile(path, meta) {
  // 读取路径下的文件
  fs.readFile(path, (err, data) => {
    if (err) {
      return;
    }
    // handlebars接管数据
    let tpl = Handlebars.compile(data.toString());
    // 元信息
    let result = tpl(meta);
    fs.writeFile(path, result, e => {
      if (e) {
        console.log("写入失败");
        return;
      }
    });
  });
}

module.exports = editFile;
