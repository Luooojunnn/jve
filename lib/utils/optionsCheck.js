// 参数校验包
// 引入配置文件，可以针对更多命令做修改而不用修改本文件
const commands = require("../../config/command.conf.js");

// inquirer 校验
function inqCheck(options, command) {
  // 需要inquire的命令
  let cmdsObj = [];
  // 输出数组，其中包含需要 inquirer 的参数
  let resArr = [];
  commands[command].forEach(item => item["i"] && cmdsObj.push(item.name));
  let ops = Object.keys(options);
  // 输入的选项是否存在于含inquirer需要的数组里
  ops.forEach(item => {
    if (cmdsObj.includes(item)) {
      resArr.push(item);
    }
  });
  if (!resArr.length) {
    return {
      show: false,
      error: ""
    };
  } else {
    return {
      show: true,
      error: "需要选择模块",
      inquirerCommandList: resArr
    };
  }
}

// 互斥校验
function optionsCheck(options, command) {
  const oLength = Object.keys(options);
  let flag = false;
  const tplOption = commands[command].map(item => {
    return item.only ? item.name : "";
  });
  for (let i = 0; i < oLength.length; i++) {
    if (tplOption.includes(oLength[i])) {
      if (flag) {
        return 2;
      } else {
        flag = true;
      }
    }
  }
  return flag ? 0 : 1;
}

// 是否需要弹出对话列表
function isNeedShowInquirer(options, command) {
  switch (optionsCheck(options, command)) {
    case 0:
      return inqCheck(options, command);
    // break;
    case 1:
      return {
        show: true,
        error: "需要给定一种模板类型",
        inquirerCommandList: []
      };
    case 2:
      return {
        show: false,
        error: "单次仅支持创建一种类型模板"
      };
  }
}

module.exports = {
  isNeedShowInquirer
};
