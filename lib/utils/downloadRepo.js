// 模板下载核心文件

const download = require("download-git-repo");
const repoConf = require("../../config/repo.conf.js");
const { mkdir } = require("./helper");
const path = require("path");

function repoAddress(repoConf, commandInfo) {
  let projectType = commandInfo.projectType;
  let info = repoConf[projectType];
  return `${info["repoOrigin"]}:${info["hostname"]}:${info["templateAddress"]}${
    info["branch"] ? `#${info["branch"]}` : ""
  }`;
}

async function downloadRepo(name, commandInfo) {
  let cwdPath = path.resolve(process.cwd(), name);
  if (mkdir(name)) {
    // TODO: 留一个口子，作为断网时处理
    if ((commandInfo.otherCommands || {}).offline) {
      // 断网操作
    } else {
      let res = await new Promise((res, _) => {
        download(
          repoAddress(repoConf, commandInfo),
          cwdPath,
          { clone: true },
          err => {
            res(err);
          }
        );
      });
      return res;
    }
  }
}

module.exports = downloadRepo;
