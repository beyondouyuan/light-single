import { useState, useEffect } from 'react'
import { Modal, Tabs } from 'antd';
import { Form, Dialog } from 'freedomen'
import uniqueId from 'lodash/uniqueId'
import CodeEdit from 'components/CodeEditor'
import { useDispatch } from 'react-redux';
import { setChainValueByString } from 'views/utils/util';
import styles from './index.module.less'
import { setRightFormChange } from 'slices/eventSlice';

var currentProp = null
var currentValue = null
var preValue = null

const config = {
    layout: 'vertical',
    labelCol: undefined,
}
const tabKeys = {
    base: '0',
    more: '1',
    style: '2'
}

export default function Right({ activityColumn }) {
    
    const [baseColumns, setBaseColumns] = useState([])
    const [moreColumns, setMoreColumns] = useState([])
    const [styleColumns, setStyleColumns] = useState([])
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

    const dispatchRightFormChange = (column) => {
        const { uuid } = column
        dispatch(setRightFormChange({ uuid }))
    }

    useEffect(() => {
        const { base = [], more = [], style = [] } = activityColumn.props || {}
        setBaseColumns(base)
        setMoreColumns(more)
        setStyleColumns(style)
        setFormData(activityColumn.data)

    }, [activityColumn])

    const formEvent = ({ type, value, prop }) => {
        if (type === 'dbclick') {
            currentProp = prop
            currentValue = value.value
            preValue = value.value

            Dialog.open('code', { title: `代码编辑` }).then(s => s(
                <div style={{ marginTop: -12 }}>
                    <div className="des">
                        提示：输入$ 会有可使用的变量或函数等提示，输入tip: 会有属性等提示
                    </div>
                    <CodeEdit
                        focus
                        {...value}
                        style={{ width: 850, marginTop: 5 }}
                        onChange={value => { currentValue = value }}
                    />
                </div>
            ))
        } else if (type === 'change') {
            prop && setChainValueByString(activityColumn.data, prop, value)

            dispatchRightFormChange(activityColumn)
        }
    }

    const applyChange = () => {
        setChainValueByString(activityColumn.data, currentProp, currentValue)
        setFormData({ ...activityColumn.data })

        dispatchRightFormChange(activityColumn)
    }

    const items = []

    if (baseColumns.length) {
        items.push({
            key: tabKeys.base,
            label: "常用",
            children: <div>
                <Form
                    key={uniqueId()}
                    data={formData}
                    config={config}
                    onEvent={formEvent}
                    columns={baseColumns}
                />
            </div>
        })
    }
    if (moreColumns.length) {
        items.push({
            key: tabKeys.more,
            label: "更多",
            children: <div>
                <Form
                    key={uniqueId()}
                    data={formData}
                    onEvent={formEvent}
                    config={config}
                    columns={moreColumns}
                />
            </div>
        })
    }
    if (styleColumns.length) {
        items.push({
            key: tabKeys.style,
            label: "样式",
            children: <div>
                <Form
                    key={uniqueId()}
                    data={formData}
                    onEvent={formEvent}
                    config={config}
                    columns={styleColumns}
                />
            </div>
        })
    }

    return <div className="right-body">
        <Dialog
            name="code"
            title="代码编辑"
            width={900}
            config={{ maskClosable: false, okText: '应用' }}
            onOk={applyChange}
            onCancel={_ => {
                if (preValue !== currentValue) {
                    Modal.confirm({
                        content: "检测到数据变化并且未应用，是否应用修改？",
                        onOk() {
                            applyChange()
                        }
                    })
                }
            }}
        />
        <Tabs items={items} className={styles.tabs} />
    </div>
}