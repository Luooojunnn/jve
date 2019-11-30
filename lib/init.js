// @ts-nocheck
const { isNeedShowInquirer } = require("./utils/optionsCheck");
const { initTplView } = require("../view/init-view");
const downloadRepo = require("./utils/downloadRepo");
const semver = require("semver");
const chalk = require("chalk");
const execa = require("execa");
const log = require("./utils/log");
const editModules = require("./utils/editModules");
const { readfile, isNpmInNet, rootPath, rmFiles } = require("./utils/helper");
const { url } = require("../config/internalOrigin");
const eventsBus = require("./utils/eventsBus");

// 全量模块列表
const allModules = {
  h5: ["vant", "vuex", "subpage", "sensorsData"],
  web: ['topNav']
};

async function init(name, options) {
  let [isShow, template] = isNeedShowInquirer(options, "init");

  let projectType = "";
  let modulesMeta = {};
  let selectedInfo = {};
  if (isShow) {
    selectedInfo = await initTplView(template).catch(e => console.log(e));
    projectType = selectedInfo.projectType
      ? selectedInfo.projectType
      : template[0];
    // 由于 jve 这边是增量选择需要哪些模块，而模板处是全量选择不需要哪些模块，所以脚手架这边需要做反向过滤
    (allModules[projectType] || []).forEach(i => {
      modulesMeta[i] = (selectedInfo.modules || []).includes(i);
    });
  } else {
    projectType = template[0];
  }

  await downloadRepo({ name, projectType, options });

  readfile(rootPath(name, ".cliConf.json")).then(
    res => {
      try {
        // 转成 js 对象，方便后续值处理
        res = JSON.parse(res);

        // 监听安装依赖
        eventsBus.on("install", () => {
          execa("sh", [`${__dirname}/../sh/init.sh ${name}`], {
            shell: true,
            stdio: "inherit"
          }).then(_ => {
            log();
            log(`🌞 ${name}项目初始化完毕，祝您开发愉快~`, false);
          });
        });

        if (projectType === "web") {
          editModules(
            rootPath(name),
            {
              name,
              ...modulesMeta,
              systemFrom: String(name).toUpperCase(),
              ...selectedInfo
            },
            res
          );
        } else {
          editModules(rootPath(name), { name, ...modulesMeta }, res);
        }
      } catch (e) {
        console.log(e);
        log();
        log.red(
          `${name} 项目下的脚手架配置文件编写有问题，请联系模板负责人进行检查更改`
        );
        rmFiles([`${name}/.cliConf.json`]);
        process.exit(1);
      }

      // 模板需要的 node 版本检查
      if (res.templateSelfNodeVersion) {
        let currentNodeVesion = process.version;
        let tplWantVersion = res.templateSelfNodeVersion;
        if (semver.lt(currentNodeVesion, tplWantVersion)) {
          log();
          log(`😭 当前node版本：${currentNodeVesion}`, false);
          log(
            `😁 ${name}项目希望node版本：${chalk.green(tplWantVersion)}`,
            false
          );
        }
      }
      // 模板需要的 vue-cli 版本检查
      if (res.templateSelfCliVersion) {
        execa("vue", [`--version`], {
          shell: true
        }).then(
          _ => {},
          e => {
            log();
            log(
              `😁 ${name}项目希望vue-cli版本：${chalk.green(
                res.templateSelfCliVersion
              )}`,
              false
            );
          }
        );
      }
    },
    _ => {
      log();
      log.red(
        `查找不到 ${name} 项目下的脚手架配置文件，请联系模板负责人进行检查更改`
      );
      rmFiles([`${name}/.cliConf.json`]);
    }
  );

  // 当前 npm 源检查
  let sameOrigin = await isNpmInNet(url);
  if (!sameOrigin[0]) {
    log();
    log(`😭 当前npm源处于：${sameOrigin[1]}`, false);
    log(`😁 需要npm源处于：${chalk.green(url)}`, false);
    log(`停止自动安装依赖`, false);
    return;
  }
}

module.exports = init;
