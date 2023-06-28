import { message } from 'antd'

export const useType = {
    none: 1,
    use: 2,
    copy: 3
}

export const getFormItemLabel = (label, docName = "data", use, plugId, title) => {
    return label
    // message.info("暂无相关文档")
}

//--------------------------第二个参数的下划线有特别用义
export const typeLabel = getFormItemLabel('类型', 'type', useType.none)

export const layoutLabel = getFormItemLabel('布局', 'layout', useType.none)

export const componentLabel = getFormItemLabel('组件', 'component', useType.none)

export const dialogLabel = getFormItemLabel('模态框', 'modal', useType.copy)

export const elementLabel = getFormItemLabel('元素', 'element', useType.none)

export const containerLabel = getFormItemLabel('容器', 'container', useType.none)

export const dataNameLabel = getFormItemLabel('数据变量名', 'dataName')

export const eventNameLabel = getFormItemLabel('事件变量名', 'eventName')

export const propLabel = getFormItemLabel('字段名', 'prop')

export const dataLabel = getFormItemLabel('数据', 'data')

export const arrDataLabel = getFormItemLabel('数据', 'arrayData')

export const loadLabel = getFormItemLabel('load是否加载(联动)', 'load')

export const filterLabel = getFormItemLabel('filter', 'filter')

export const uploadFilterLabel = getFormItemLabel('filter', 'config.filter')

export const uploadActionLabel = getFormItemLabel('action(上传地址)', 'config.action')

export const uploadOnSuccessLabel = getFormItemLabel('返回数据处理', 'config.onSuccess')

export const filterCopyLabel = getFormItemLabel('filter', 'filter', useType.copy)

export const refLabel = getFormItemLabel('ref', 'ref')

export const searchLabel = getFormItemLabel('@search(查询事件)', 'search')

export const changeLabel = getFormItemLabel('@change(值改变事件)', 'change')

export const componentChangeLabel = getFormItemLabel('change(数据改变事件)', 'componentChange')

export const clickLabel = getFormItemLabel('@click(单击事件)', 'click')

export const optionsLabel = getFormItemLabel('options', 'options')
//下划线 _ 有特别用义， _前面表示字段名
export const stepOptionsLabel = getFormItemLabel('子步骤', 'options_step')
//下划线 _ 有特别用义， _前面表示字段名
export const treeOptionsLabel = getFormItemLabel('options', 'options_tree')

export const submitLabel = getFormItemLabel('@表单提交', 'submit')

export const ruleLabel = getFormItemLabel('rule(校验)', 'rule')

export const ruleCopyLabel = getFormItemLabel('rule(校验)', 'rule', useType.copy)

export const styleLabel = getFormItemLabel('style', 'style')

export const lessLabel = getFormItemLabel('less', 'less', useType.copy)

export const paginationDocLabel = getFormItemLabel('分页配置', 'pagination')

export const pageLabel = getFormItemLabel('@分页', 'page')

export const tableSortLabel = getFormItemLabel('排序', 'config.sorter')

export const tableSortEventLabel = getFormItemLabel('@(sorter)排序事件', 'sorterEvent')

export const selectionLabel = getFormItemLabel('@选择/取消行选中', 'selection')

export const selectionDisabledLabel = getFormItemLabel('disabled(可选项失效判定)', 'tableDisabled')

export const cancelLabel = getFormItemLabel('@cancel(点击取消事件)', 'cancel')

export const confirmLabel = getFormItemLabel('@confirm(点击确定事件)', 'confirm')

export const disabledLabel = getFormItemLabel('disabled(禁用)', 'disabled')

export const disabledCopyLabel = getFormItemLabel('disabled(禁用)', 'disabled', useType.copy)

export const dialogNameLabel = getFormItemLabel('name', 'dialogName')

export const freedomenGlobalDataLabel = getFormItemLabel('全局数据(项目中多处用到的相同数据或配置)', 'freedomenGlobalData', useType.copy)

export const freedomenConfigLabel = getFormItemLabel('freedomen配置', 'freedomenConfig', useType.copy)

export const globalLessLabel = getFormItemLabel('全局样式.less(相当于在入口引入的less，可以应用与项目全局)', 'globalLess', useType.copy)

export const customModelLabel = getFormItemLabel('自定义模块', 'customModel', useType.none)

export const preCodeLabel = getFormItemLabel('预定义(变量/函数/ref)', 'preCode', useType.none)

export const effectLabel = getFormItemLabel('副作用(useEffect)', 'effect', useType.none)

export const preApiLabel = getFormItemLabel('预定义(接口)', 'preApi', useType.none)

export const hotkeyLabel = getFormItemLabel('快捷键', 'hotkey', useType.none)

//plug create
export const basePropLabel = getFormItemLabel('基本属性', 'baseProp', useType.none)

export const customPropLabel = getFormItemLabel('自定义属性', 'customProp', useType.none)

export const shouldUpdateLabel = getFormItemLabel('sholudUpdate(依赖更新)', 'shouldUpdate')
//center
export const designTipLabel = getFormItemLabel(null, 'designTip', useType.none, null, "设计页面")

export const previewTipLabel = getFormItemLabel(null, 'previewTip', useType.none, null, "预览页面")

export const codeTipLabel = getFormItemLabel(null, 'codeTip', useType.none, null, "代码页面")

export const apiTipLabel = getFormItemLabel(null, 'apiTip', useType.none, null, "接口页面")

export const lessTipLabel = getFormItemLabel(null, 'lessTip', useType.none, null, "样式页面")

//useTip
export const regionUseTipLabel = getFormItemLabel(null, 'regionUseTip', useType.none, null, "域使用提示")

export const searchUseTipLabel = getFormItemLabel(null, 'searchUseTip', useType.none, null, "搜索使用提示")

export const formUseTipLabel = getFormItemLabel(null, 'formUseTip', useType.none, null, "表单使用提示")

export const formListTipLabel = getFormItemLabel(null, 'formListUseTip', useType.none, null, "表单列表使用提示")

export const tableUseTipLabel = getFormItemLabel(null, 'tableUseTip', useType.none, null, "表格使用提示")

export const listUseTipLabel = getFormItemLabel(null, 'listUseTip', useType.none, null, "列表使用提示")

export const dialogUseTipLabel = getFormItemLabel(null, 'dialogUseTip', useType.none, null, "弹窗使用提示")

export const fdialogUseTipLabel = getFormItemLabel(null, 'fdialogUseTip', useType.none, null, "弹窗表单使用提示")

export const drawerUseTipLabel = getFormItemLabel(null, 'drawerUseTip', useType.none, null, "侧滑弹窗使用提示")

export const fdrawerUseTipLabel = getFormItemLabel(null, 'fdrawerUseTip', useType.none, null, "侧滑弹窗表单使用提示")

export const divUseTipLabel = getFormItemLabel(null, 'divUseTip', useType.none, null, "div使用提示")

export const tabsUseTipLabel = getFormItemLabel(null, 'tabsUseTip', useType.none, null, "标签页使用提示")






