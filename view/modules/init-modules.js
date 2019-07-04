// init 时，选择 web 类型，弹出的模块选项配置列表
// 这里低版本的node会导致message一直出现，但是我不想做这种兼容的hack处理...

/**
 * 
 * @param {string[]} inquirerCommandList - 是否传入了模板参数
 */
function initModules(inquirerCommandList){
  return [
    {
      type: "checkbox",
      message: "选择需要的模块",
      prefix: "🥕",
      name: "webModules",
      choices: [
        {
          name: "权限模块",
          value: "permission"
        },
        {
          name: "顶部导航模块",
          value: "topNav"
        },
        {
          name: "侧边导航模块",
          value: "sideNav"
        }
      ],
      when(preAnswer) {
        // 1. 无参数，由init列表部分手动选择的web，则会传进来 []，然后判断前一步是否选择了web，是则出现checkbox列表
        // 2. 有参数，用户手动传入如：['H5']或者['web']这种，判断包含web则出现checkbox列表
        return inquirerCommandList.length ? inquirerCommandList.includes('web') : preAnswer.projectType === 'web';
      }
    }
  ]

}

module.exports = initModules;


