// 模板下载核心文件

const download = require("download-git-repo");
const repoConf = require("../../config/repo.conf.js");
const { mkdir, rootPath } = require("./helper");
const log = require("./log");

function repoAddress(projectType) {
  let info = repoConf[projectType];
  return `${info["repoOrigin"]}:${info["hostname"]}:${info["templateAddress"]}${
    info["branch"] ? `#${info["branch"]}` : ""
  }`;
}

async function downloadRepo({ name, projectType, options }) {
  mkdir(name);
  // FEATURE: 断网时
  if (options.offline) {
    // ...
  } else {
    return new Promise((res, _) => {
      download(
        repoAddress(projectType),
        rootPath(name),
        { clone: true },
        err => {
          if (err) {
            log.red(String(err));
            process.exit(1);
          }
          res();
        }
      );
    });
  }
}

module.exports = downloadRepo;
