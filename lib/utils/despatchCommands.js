// 该js将commands进行分发，传入如 {web:true, skipUpdate:true}
// 返回{projectType:'web', otherCommands: ['skipUpdate']}
const commands = require("../../config/command.conf.js");

function despatchCommands(options, command) {
  let commandInfo = {
    projectType: "",
    otherCommands: []
  };
  let projectType = [];
  commands[command].forEach(
    item => item["only"] && projectType.push(item.name)
  );
  for (let i in options) {
    if (projectType.includes(i)) {
      commandInfo.projectType = i;
    } else {
      commandInfo.otherCommands.push(i);
    }
  }
  return commandInfo;
}

module.exports = despatchCommands;
