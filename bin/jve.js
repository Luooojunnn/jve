#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const semver = require("semver");
const log = require("../lib/utils/log");
const { isFileInCurrent } = require("../lib/utils/helper");
const { cliVersionCheck } = require("../lib/utils/versionCheck");
const requiredVersion = require("../package.json").engines.node;
const { init } = require("../config/command.conf.js");

// 初始化版本检查
function nodeVersionCheck(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    log(
      chalk.red(
        `目前您的Node版本是: ${
          process.version
        }，${id}最低要求是: ${requiredVersion}
      `
      )
    );
    process.exit(1);
  }
}
nodeVersionCheck(requiredVersion, "jve");

// 指令集
program
  .version(require("../package").version, "-v, --version")
  .usage("<command> [options]");

program
  .command("init <project-name>")
  .alias("i")
  .description(chalk.green("单次拉取一种标准模板"))
  .option(init[0]["c"], init[0]["d"])
  .option(init[1]["c"], init[1]["d"])
  .option(init[2]["c"], init[2]["d"])
  .option(init[3]["c"], init[3]["d"])
  .action(async (name, cmd) => {
    let options = cleanArgs(cmd);

    if (!options.skipUpdate) {
      await cliVersionCheck("jve");
    }

    // 包名合规校验
    if (!pkgNameCheck(name) || isFileInCurrent(name)) {
      process.exit(1);
    }
    require("../lib/init")(name, options);
  });

program
  .command("start [project-name]")
  .description(chalk.green("启动项目[指定项目]"))
  .action((name) => {
    require("../lib/start")(name);
  });

program.arguments("<command>").action(cmd => {
  program.outputHelp();
  log(chalk.red(`错误命令 ${cmd}`));
});

program.on("--help", () => {
  log(`执行 ${chalk.cyan("jve <command> -h")} 以查看指令的详细使用`);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

/**
 * @description - 包名/项目名校验
 * 1. 驼峰形式
 * 2. 包名不能以.或_开头
 * 3. 不含 ~)('!*
 * 4. 不超过214个字符
 */
function pkgNameCheck(name) {
  if (
    String(name).length < 214 &&
    !/^[\._A-Z]\w*/g.test(name) &&
    !/[\(\)\~\'\!\*]/g.test(name) &&
    !/[A-Z]{2,}/g.test(name)
  ) {
    return true;
  } else {
    console.log();
    console.log("  1. " + chalk.yellow("驼峰形式"));
    console.log("  2. " + chalk.yellow("包名不能以.或_开头"));
    console.log("  3. " + chalk.yellow("不含 ~)('!*"));
    console.log("  4. " + chalk.yellow("不超过214个字符"));
    return false;
  }
}

// 参数过滤函数
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach(o => {
    const key = o.long.replace(/^-+/g, "");
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}

