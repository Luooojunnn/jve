// 该文件为 cammand 配置
// 为了防止将来命令经常变化，所以归在此文件统一进行管理
// 需要新命令，按格式添加即可
// c: commnad(分短名、长名，可只写一个)
// d: describle(命令描述)
// i: inquirer(是否需要对话接入,可选)
// 是否需要对话接入取决于当前模板是够存在子模块，如模板存在登录模块
// only: 具有only属性的值与其他具有only属性的值互斥(默认只有模板类型之间互斥)
// name: 给optionsCheck使用，针对only产生唯一性数组（和only一同存在）

module.exports = {
    init: [
      {
        c: '-W, --web',
        d: 'web项目标准模板',
        i: true,
        only: true,
        name: 'web'
      },
      {
        c: '-H, --H5',
        d: 'H5项目标准模板',
        only: true,
        name: 'H5'
      },
      {
        c: '-N, --node',
        d: 'node项目标准模板',
        only: true,
        name: 'node'
      },
      {
        c: '--skipUpdate',
        d: '越过cli版本检查环节',
      },
    ]
}