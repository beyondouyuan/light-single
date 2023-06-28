import { useCallback, useEffect, createElement, useState, useRef, isValidElement } from 'react'
import { Form, FormList, Search, Table, Dialog, Drawer, Region, List } from 'freedomen'
import { getFnContainer, isComponent, isContainer, isPlainObject, getEventItemString, getPreviewData, getPreviewValue, toFirstUpperCase } from 'views/utils/util'
import { Divider, message, Modal, Tabs } from 'antd'
import { toPageLess } from 'views/utils/icode'
import { createPreviewStyleFromLessString } from './lessUtil'
import Name from 'views/utils/models/name'
import update from 'immutability-helper'
/** 第一层的  ~less 不能去， 去掉的是config中的 ~ */
function resetData(data, isNext) {
    let obj = {}
    for (let key in data) {
        if (isPlainObject(data[key])) {
            obj[key] = resetData(data[key], true)
        } else if (isNext && key.indexOf('~') === 0) {
            continue
        } else {
            obj[key] = data[key]
        }
    }
    return obj
}

function showError(text, e) {
    if (e?.message) {
        message.error(text + e.message, 6)
    } else {
        console.log("失败信息：", e)
        message.error(text + "请打开控制台查看")
    }
}
//freedomen风格组件  
const freedomenMaps = { Form, Search, Table, Region, List, FormList }
//其他组件
const originMaps = { "DIV": 'div' }

const allMaps = { ...freedomenMaps, ...originMaps }
//"{backgroundColor: 'white'}" => { backgroundColor: 'white' }
const getStyleFromString = (type, styleString) => {
    let style
    try {
        style = eval('(' + styleString + ')')
    } catch (error) {
        message.error(type + '样式格式解析出错！')
    }
    return style;
}

const getElementType = (type) => {
    let elType = allMaps[type]
    if (!elType) {
        message.error('不存在的类型：' + type)
    }
    return elType
}

const amendRecord = (column) => {
    for (let key in column) {
        if (isValidElement(column[key]) || /^[A-Za-z]+$/.test(column[key])) continue

        if (isPlainObject(column[key])) {
            amendRecord(column[key])
        } else {
            try {
                if (key === 'prop') {
                    column[key] = String(column[key])
                } else if (typeof column[key] === 'string') {
                    column[key] = getPreviewValue(column[key])
                }
            } catch (e) { }
        }
    }
}
//对column其进行处理一下
const amendColumns = (columns) => {
    for (let column of columns) {
        if (column.config?.split) {
            column.config.split = <Divider type="vertical" />
        }

        if (Array.isArray(column)) {
            amendColumns(column)
        } else {
            amendRecord(column)
        }

        column.className = column.className || column[`~className`]
    }
}
//保存一下FDialog 的Form
var keyPrefix = 0
var dialogForms = {}
var dialogNames = []
var drawerForms = {}
var drawerNames = []

function getEventString(base, data) {
    let events = ""

    const addEvent = (strFn, prop, type) => {
        const content = getFnContainer(strFn)
        if (content) {
            events += getEventItemString({
                ifOrElse: events ? 'else if' : 'if', prop, type, content
            })
        }
    }
    //table 的排序，特殊处理
    if (data['@sorter'] && data.prop) {
        addEvent(data['@sorter'], data.prop, 'sorter')
    }
    //普通事件
    for (let propItem of base) {
        if (propItem.prop?.indexOf('@') === 0) {
            addEvent(data[propItem.prop], data.prop, propItem.prop)
        }
    }
    return events
}

const defaultClearKeys = ['~className', '~less', '~isVertical']
function getClearKeys(obj, ...keys) {
    const newObject = { ...obj }

    keys.forEach(key => {
        delete newObject[key]
    })
    return newObject
}
//将变量挂载到window 的 $var 上
const setWindowState = (virData) => {
    if (!window.$var) {
        window.$var = {}
    }
    for (let key in virData) {
        window.$var[key] = virData[key]
    }
}
const classPrefix = "preiview_"

export default function Preview(props) {
    const { designList } = props
    const [virData, setVirData] = useState({})

    const domRefs = useRef({})
    const $ref = domRefs.current


    useEffect(() => {
        const rjction = (event) => {
            showError("预览提示：捕获到异步函数异常：", event.reason)
            event.preventDefault();
        }
        window.addEventListener('unhandledrejection', rjction);
        return () => {
            window.removeEventListener('unhandledrejection', rjction)
        }
    }, [])
    //設置數據
    const $set = useCallback((name, data) => {
        setVirData((pre) => {
            if (name && !(name in pre)) {
                message.error("set" + toFirstUpperCase(name) + "方法不存在，建议检查代码")
            }

            const newVirData = update(pre, {
                [name]: { $set: data }
            })
            setWindowState(newVirData)
            return newVirData
        })
    }, [])

    const $dialog = {
        open(name, props, data) {
            if (!dialogNames.includes(name)) {
                Modal.confirm({
                    type: 'error',
                    title: '系统提示',
                    content: '未找到对话框' + name + '，请检查是否拼写错误！'
                })
                return
            }
            if (dialogForms[name]) {
                Dialog.open(name, props).then(s => {
                    s(dialogForms[name](data))
                })
            } else {
                Dialog.open(name, props)
            }
        },
        close(name) {
            Dialog.close(name)
        },
        loading(name, l) {
            Dialog.loading(name, l)
        }
    }
    const $drawer = {
        open(name, props, data) {
            if (!drawerNames.includes(name)) {
                Modal.confirm({
                    type: 'error',
                    title: '系统提示',
                    content: '未找到对话框' + name + '，请检查是否拼写错误！'
                })
                return
            }
            if (drawerForms[name]) {
                Drawer.open(name, props).then(s => {
                    s(drawerForms[name](data))
                })
            } else {
                Drawer.open(name, props)
            }
        },
        close(name) {
            Drawer.close(name)
        },
        loading(name, l) {
            Drawer.loading(name, l)
        }
    }
    //modal function
    const $modal = {
        message: {
            success(msg) { message.success(msg) },
            error(msg) { message.error(msg) },
            warning(msg) { message.warning(msg) },
            info(msg) { message.info(msg) },
            loading(msg) { message.loading(msg) }
        },
        confirm(params) { Modal.confirm(params) },
        warning(params) { Modal.warning(params) },
        error(params) { Modal.error(params) },
        success(params) { Modal.success(params) },
        info(params) { Modal.info(params) }
    }
    //更新设计器
    useEffect(() => {
        //将less转成css, 来加载显示 , designList 每项中的 data 司时会加 ~className，不合理，如有机会重构 
        createPreviewStyleFromLessString(toPageLess({ designList }, classPrefix), classPrefix)
    }, [designList])

    const resolveChildren = useCallback(({ children = [], type }) => {
        let columns = [], event = ''
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            const data = resetData(getPreviewData(child.data))

            if (isComponent(child)) {
                columns.push({
                    ...data,
                    render({ value }) {
                        let _value = value
                        if (_value === void 0 && data.data) {
                            _value = data.data
                        }

                        return createElement(
                            getElementType(child.type),
                            getProps({ ...child, type: child.type, data: data }, _value)
                        )
                    }
                })
            } else if (isContainer(child)) {
                const childrenInfo = resolveChildren({ children: child.children })
                childrenInfo.columns.push({ type: data.type || child.type, ...data })
                event += getEventString(child.props.base, data)

                if (type === 'Table') {
                    amendColumns(childrenInfo.columns)

                    columns.push({
                        ...data,
                        render: () => childrenInfo.columns
                    })
                    event += childrenInfo.event
                } else {
                    columns.push(childrenInfo.columns)
                    event += childrenInfo.event
                }
            } else {
                const column = {
                    ...data,
                    type: data.type || child.type
                }
                event += getEventString(child.props.base, data)
                columns.push(column)
            }
        }
        //"function () {}..." => () => {} 
        amendColumns(columns)
        return { columns, event }
    }, [virData])
    /**
     * item.type: 组件类型DIV, Form, ... 
     */
    const getProps = useCallback((item, sourceData, key) => {
        const { type, data } = item
        const props = {}
        //都有的属性
        if (key !== void 0) {
            props.key = keyPrefix + "_" + key
        }
        if (data.ref) {
            props.ref = (ref) => {
                domRefs.current[data.ref] = ref
            }
        }
        //Tabs
        if (data.activeKey) {
            props.activeKey = item.data.activeKey
        }
        props.className = item.data.className || item.data['~className']
        props.style = getStyleFromString(type, data.style)
        //DIV 只有上面的属性 
        if (type !== "DIV" && type !== 'Tabs') {
            let { columns, event } = resolveChildren(item)

            //data里的 event 目前主要是搞table里的
            for (let key of Object.keys(data)) {
                if (key.indexOf('@') === 0) {
                    event += getEventItemString({
                        prop: key,
                        content: getFnContainer(data[key]),
                        ifOrElse: event ? 'else if' : 'if'
                    })
                }
            }
            //共有的
            props.columns = columns
            props.data = sourceData
            props.onEvent = (params) => {
                try {
                    const result = eval(`() => {${event}}`)()
                    return result
                } catch (e) {
                    showError('事件 执行失败：', e)
                }
            }
            if (data.onChange) {
                //不要用data.onChange, 有局部变量data
                const { onChange } = data
                props.onChange = (data) => {
                    try {
                        eval(getFnContainer(onChange, "(data)=>{"))
                    } catch (e) {
                        showError('change事件 执行失败：', e)
                    }
                }
            }
            if (data.config) {
                props.config = data.config
            }
            //table 分页
            if ('isPagination' in data) {
                props.pagination = data.isPagination ? data.pagination : false
            }
            //表单提交
            if ('submit' in data) {
                //不要用data.onChange, 有局部变量data
                const { submit } = data
                props.onSubmit = (data, column) => {
                    let fns = getFnContainer(submit, '(data)=>{')
                    if (!fns) {
                        fns = getFnContainer(submit, '(data,column)=>{')
                    }

                    try {
                        const result = eval(`() => {${fns}}`)()
                        return result
                    } catch (e) {
                        showError('提交事件 执行失败：', e)
                    }
                }
            }
        }
        return props;
    }, [keyPrefix, resolveChildren])
    //解析设计器为页面元素
    const createElements = useCallback((children, getName, virData) => {
        return children?.map((item, index) => {
            const data = getPreviewData(item.data)

            delete data['~isVertical']
            const type = item.type

            if (['FDialog', 'Dialog', 'FDrawer', 'Drawer'].includes(type)) {
                const { name } = data
                let currentNames, currentForms, Dom

                if (['FDialog', 'Dialog'].includes(type)) {
                    currentNames = dialogNames
                    currentForms = dialogForms
                    Dom = Dialog
                } else {
                    currentNames = drawerNames
                    currentForms = drawerForms
                    Dom = Drawer
                }

                currentNames.push(name)

                if (data.footer === 'null') {
                    data.footer = null
                } else if (data.footer === '') {
                    delete data.footer
                }
                const events = {}
                //ok事件
                if (data.onOk) {
                    events.onOk = () => {
                        try {
                            const result = eval(`() => {${getFnContainer(data.onOk, '()=>{')}}`)()
                            return result
                        } catch (e) {
                            showError('提交事件 执行失败：', e)
                        }
                    }
                }
                //取消事件
                if (data.onCancel) {
                    events.onCancel = () => {
                        try {
                            const result = eval(`() => {${getFnContainer(data.onCancel, '()=>{')}}`)()
                            return result
                        } catch (e) {
                            showError('取消事件 执行失败：', e)
                        }
                    }
                }

                if (['FDialog', 'FDrawer'].includes(type)) {
                    //把dialog 中的 from 保存起来
                    currentForms[name] = (_data) => {
                        const innerType = 'Form'

                        const form = createElement(
                            getElementType(innerType),
                            getProps({ ...item, data, type: innerType }, _data)
                        )
                        return form
                    }
                }

                return <Dom key={index} name={name} {...getClearKeys(data, 'ref', ...defaultClearKeys)} {...events}>
                    {['FDialog', 'FDrawer'].includes(type) ? void 0 : createElements(item.children, getName, virData)}
                </Dom>
            } else if (type === 'Tabs') {
                const { children = [] } = item
                const events = {}

                if (data.onChange) {
                    events.onChange = (next) => {
                        try {
                            eval(getFnContainer(data.onChange, '(next)=>{'))
                        } catch (e) {
                            showError('提交事件 执行失败：', e)
                        }
                    }
                }

                const items = children.map((el, index) => {
                    const { label, tab, key, forceRender } = el.data

                    return {
                        key: key || index,
                        label: label || tab,
                        forceRender,
                        children: createElements([el], getName, virData)
                    }
                })
                return <Tabs {...getProps({ ...item, data, type: type }, data, index)} items={items} {...getClearKeys(data, ...defaultClearKeys)}  {...events} />

            } else {
                let innerData
                if (data.data || data.dataName) {
                    innerData = virData[getName(data.dataName || type.toLowerCase() + 'Data')]
                }
                const props = getProps({ ...item, data, type: type }, innerData, index)
                return createElement(
                    getElementType(item.type),
                    props,
                    Object.keys(freedomenMaps).includes(item.type)
                        ? void 0
                        : createElements(item.children, getName, virData)
                )
            }
        })
    }, [])

    return createElements(designList, (new Name()).get, virData)
}