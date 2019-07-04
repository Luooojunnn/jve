const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const isFileInCurrent = name => {
  let targetDir = path.resolve(process.cwd(), name);
  if (fs.existsSync(targetDir)) {
    console.log();
    console.log("  " + chalk.yellow("当前目录下存在该同名文件"));
    return true;
  } else {
    return false;
  }
};

const mkdir = name => {
  fs.mkdirSync(name);
  return true;
};

/**
 *
 * @param {string} name - 项目根路径
 * @param {string} subPath - 子路径
 */
const staticPath = (name, subPath) => {
  return path.resolve(process.cwd(), name, subPath);
};

module.exports = {
  isFileInCurrent,
  mkdir,
  staticPath
};
