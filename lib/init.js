const { isNeedShowInquirer } = require("./utils/optionsCheck");
const { initTplView } = require("../view/init-view");
const despatchCommands = require("./utils/despatchCommands");
const downloadRepo = require("./utils/downloadRepo");
const editFile = require("./utils/editFile");
const { pkgVersion } = require("./utils/versionCheck");
const fs = require("fs");
const execa = require("execa");
const child_process = require("child_process");
const log = require("./utils/log");
const { staticPath } = require("./utils/helper");
const chalk = require("chalk");

const defaultEditFiles = ["package.json", "dep2test.sh", "public/index.html"];

async function init(name, options) {
  let { show, error, inquirerCommandList } = isNeedShowInquirer(
    options,
    "init"
  );
  // 选择的模块的列表
  let moduleListResult = [];
  if (show) {
    moduleListResult = await initTplView(inquirerCommandList);
  } else {
    if (error) {
      log(chalk.red(error));
      process.exit(1);
    }
  }
  // commandInfo的格式如：
  //  {
  //    projectType: 'web',
  //    otherCommands: [],
  //    webModules: ['topNav', 'sideNav']
  //  }
  let commandInfo = despatchCommands(options, "init");
  commandInfo = Object.assign({}, commandInfo, moduleListResult);

  let isDownLoadRepoError = await downloadRepo(name, commandInfo);
  if (!isDownLoadRepoError) {
    fs.readFile(staticPath(name, ".cliConf.json"), (e, res) => {
      if (e) {
        // console.log(
        //   "  " + chalk.yellow("当前目录没有cli配置文件，进行默认的修改操作")
        // );
        defaultEditFiles.forEach(subPath => {
          editFile(staticPath(name, subPath), {
            name: name
          });
        });
      }

      let cliConfContent = {};
      try {
        cliConfContent = JSON.parse(res.toString());
      } catch (e) {
        log(
          chalk.yellow(`  模板的cli配置文件出错，请联系模板负责人进行检查更改`)
        );
        process.exit(1);
      }

      (cliConfContent.needEditFile || []).forEach(subPath => {
        editFile(staticPath(name, subPath), {
          name: name
        });
      });
      pkgVersion(cliConfContent.needCheckedPkg || [])
        .then(res => {
          // 这里获取到版本号即表示网络正常，可进行install
          execa.shell(require("../sh/init-install")(name), {
            stdio: "inherit"
          });
        })
        .catch(e => {
          console.log(e);
          process.exit(1);
        });
    });
  }
}

module.exports = init;
