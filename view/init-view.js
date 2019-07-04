// init操作的视图层

const inquirer = require("inquirer");
const initModules = require("./modules/init-modules");

/**
 *
 * @param {string[]} inquirerCommandList - 需要注册的对话列表([] 或者是含有i的指令)
 */
async function initTplView(inquirerCommandList) {
  console.clear();

  let basePromptList = [
    {
      type: "list",
      name: "projectType",
      prefix: "✨",
      message: "模板类型:",
      choices: [
        {
          name: "web",
          value: "web"
        },
        {
          name: "H5",
          value: "H5"
        },
        {
          name: "node",
          value: "node"
        }
      ]
    }
  ];

  let promptList = basePromptList.concat(initModules(inquirerCommandList));

  inquirerCommandList.length && promptList.shift();

  return inquirer.prompt(promptList);
}

module.exports = {
  initTplView
};
