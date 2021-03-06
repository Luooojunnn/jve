#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const semver = require("semver");
const log = require("../lib/utils/log");
const { isFileInCurrent } = require("../lib/utils/helper");
const { cliVersionCheck } = require("../lib/utils/versionCheck");
const requiredVersion = require("../package.json").engines.node;

// 初始化版本检查
function nodeVersionCheck(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    log("");
    log.red(
      `您当前正在使用的 Node 版本是: ${
        process.version
      }, 但 ${id} 要求最低版本是: ${requiredVersion}`
    );
    process.exit(1);
  }
}
nodeVersionCheck(requiredVersion, "jve");

program
  .version(require("../package").version, "-v, --version")
  .usage("<command> [options]");

program
  .command("init <project-name>")
  .alias("i")
  .description(chalk.green("单次拉取一种标准模板"))
  .option("-H, --h5", "H5项目标准模板")
  .option("-W, --web", "Web项目标准模板")
  // .option("-N, --node", "Node项目标准模板")
  .option("--skipUpdate", "跳过jve版本检查")
  .action(async (name, cmd) => {
    let options = cleanArgs(cmd);
    if (!options.skipUpdate) {
      await cliVersionCheck("jve");
    }
    if (!pkgNameCheck(name)) {
      log();
      log("1. " + chalk.yellow("驼峰形式"));
      log("2. " + chalk.yellow("包名不能以.或_开头"));
      log("3. " + chalk.yellow("不含 ~)('!*"));
      log("4. " + chalk.yellow("不超过214个字符"));
      return;
    }
    if (isFileInCurrent(name)) {
      log.red("当前目录下存在该同名文件");
      return;
    }
    require("../lib/init")(name, options);
  });

program
  .command("start")
  .description(chalk.green("启动项目  [指定路径下的项目]"))
  .action(name => {
    name = typeof name !== "string" ? "." : name;
    require("../lib/start")(name);
  });

program.arguments("<command>").action(cmd => {
  program.outputHelp();
  log();
  log(chalk.red(`错误命令 ${cmd}`));
});

program.on("--help", () => {
  log();
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
    /^[a-z\d]+([A-Z][a-z\d]{1,})*$/g.test(name)
  ) {
    return true;
  } else {
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

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
