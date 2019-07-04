const log = require("./log");
const execa = require("execa");
const chalk = require("chalk");
const semver = require("semver");
const currentVersion = require("../../package.json").version;

/**
 * 脚手架版本检查
 * @param {string} cliName - cli名字
 */
async function cliVersionCheck(cliName) {
  console.log("  正在检查脚手架是否有更新...");
  let { stdout, error } = await new Promise((res, _) => {
    let she = execa.shell(`npm show ${cliName} version`);
    let timer = setTimeout(() => {
      // 超时杀掉子进程，避免当前进程持续等待
      she.kill();
      res({ stdout: chalk.yellow("  超时，越过版本检查"), error: true });
    }, 5000);
    she
      .then(result => {
        clearTimeout(timer);
        res({ stdout: result.stdout, error: false });
      })
      .catch(e => {
        res({ stdout: chalk.yellow("  超时，越过版本检查"), error: true });
      });
  });

  if (!error) {
    if (semver.neq(currentVersion, stdout)) {
      console.log(chalk.yellow("  正在进行更新..."));
      console.log("  最新版本: " + chalk.green(stdout));
      console.log("  当前版本: " + chalk.red(currentVersion));
      await execa.shell(`npm update ${cliName} -g`, {
        stdio: 'inherit'
      });
    } else {
      console.log("  已是最新版本: " + chalk.green(stdout));
    }
  } else {
    console.log(stdout);
  }
}

/**
 * 模板的依赖检查
 * @param {string[]} pkgName - 包名
 */
async function pkgVersion(pkgName) {
  let result;
  try {
    result = await Promise.all(
      pkgName.map(name => {
        return new Promise((result, reject) => {
          execa.shell(`npm show ${name} version`).then(res => {
            result(res)
          }).catch(e => {
            reject(`当前模板的${name}依赖检查出现了错误，即将停止自动安装依赖功能，建议：`)
          })
        })
      })
    );
  } catch(e) {
    log(chalk.red(e))
    console.log(`  1. npm config get registry 检查内网源是否有问题`)
    console.log(`  2. 联系模板开发者进行咨询`)
    console.log()
    console.log(chalk.green(`  如果已经解决问题，请进入项目进行手动安装依赖`))
    process.exit(1)
  }

    return result.map(item => item.stdout)
    
}

module.exports = {
  cliVersionCheck,
  pkgVersion
};
