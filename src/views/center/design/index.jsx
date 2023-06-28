import { useCallback, useMemo } from 'react'
import { ReactSortable } from 'react-sortablejs';
import { Dropdown, message } from 'antd'
import { clone, isSort } from 'views/utils/util'
import { useCanPutIn, useClickPutTo } from 'hooks';
import DragItem from './item'
import update from 'immutability-helper'
import Bus, { BUS_KEYS } from 'views/bus'
import { cloneDeep, uniqueId } from 'lodash';
import { PAGE_ACTIVE_COLUMN_UUID } from 'views/types';
import { getPageConfigItem } from 'views/left/config'
import className from 'classnames'
import styles from './index.module.less'

const canPutGroup = ['layout', 'component', 'dialog']
//历史记录
const rollbacks = []
//复制對象
var copyColumn = null

const getPageActiveColumn = (column = {}) => {
    //如果没有活跃，假设页面就是活跃的
    if (!column.uuid) {
        return { uuid: PAGE_ACTIVE_COLUMN_UUID, isContainer: true }
    }
    return column
}
//複製出來的重新設置UUID
const resetUuid = (column) => {
    column.uuid = uniqueId()
    if (column.children && column.children.length) {
        for (let item of column.children) {
            resetUuid(item)
        }
    }
}

export default function Design(props) {
    const { designList = [], activityColumn, onChange } = props
    const canPutbackgroundColor = useCanPutIn(canPutGroup)
    //没有活跃column
    const noActivityColumn = useMemo(() => {
        return !activityColumn.uuid || activityColumn.uuid === PAGE_ACTIVE_COLUMN_UUID
    }, [activityColumn])
    //获取删除后的List
    const getDeletedList = useCallback((list) => {
        let newList = []
        for (let item of list) {
            if (item.uuid !== activityColumn.uuid) {
                if (item.children && item.children.length) {
                    item.children = getDeletedList(item.children)
                }
                newList.push(item)
            }
        }
        return newList
    }, [activityColumn])
    //删除选中元素
    const deleteActivityItem = () => {
        if (noActivityColumn) return

        copyColumn = activityColumn
        Bus.emit(BUS_KEYS.focus, {})
        //保存还未删除时的记录
        rollbacks.push(cloneDeep(designList))
        onChange(getDeletedList(designList))
        message.success('已删除/剪切: ' + activityColumn.type)
    }
    //拷贝
    const copyActivityItem = useCallback(() => {
        //没有选中元素，或者鼠标选中一些文案
        if (noActivityColumn || window.getSelection().toString()) {
            return
        }

        copyColumn = activityColumn
        message.success('已复制:' + activityColumn.type)
    }, [noActivityColumn, activityColumn])
    //粘贴
    const pasteToActivityItem = () => {
        if (copyColumn == null) {
            return
        }
        copyColumn = cloneDeep(copyColumn)
        resetUuid(copyColumn)
        Bus.emit(BUS_KEYS.putEnd, copyColumn)
    }
    //回滚
    const rollbackItem = () => {
        if (rollbacks.length) {
            let pop = rollbacks.pop()
            onChange(pop)
        } else {
            message.info('没有可回滚项！')
        }
    }
    //拖拽, 点击，等更新 List
    const onUpdate = useCallback(() => {
        rollbacks.push(cloneDeep(designList))
    }, [designList])
    //子元素更新
    const updateList = useCallback((newChildren, index) => {
        if (index === void 0) {
            if (isSort(designList, newChildren)) {
                onChange(newChildren)
            }
        } else if (newChildren) {
            let newList = update(designList, {
                [index]: {
                    children: {
                        $set: newChildren
                    }
                }
            })
            onChange(newList)
        }
    }, [designList])
    //拦截单击放入
    const interceptClickPutTo = (newChildren, index) => {
        onUpdate()
        updateList(newChildren, index)
    }
    //鼠标事件
    const onMouseDown = useCallback((evt) => {
        const { button } = evt
        if (button === 0) {
            //点击页面
            Bus.emit(BUS_KEYS.focus, getPageConfigItem({
                ...getPageActiveColumn()
            }))
        }
    }, [])
    //点击添加 
    useClickPutTo(getPageActiveColumn(activityColumn), { list: designList }, interceptClickPutTo, true)
    //右擊菜單
    const menu = useMemo(() => {
        const items = [
            { key: '1', disabled: noActivityColumn, label: '复制选中' },
            { key: '2', disabled: copyColumn == null, label: '粘贴' },
            { key: '3', disabled: noActivityColumn, label: '删除/剪切选中' },
            { key: '4', disabled: !rollbacks.length, label: '撤销删除/剪切' }
        ]
        return {
            items,
            onClick({ key }) {
                if (key === '1') {
                    copyActivityItem()
                } else if (key === '2') {
                    pasteToActivityItem()
                } else if (key === '3') {
                    deleteActivityItem()
                } else if (key === '4') {
                    rollbackItem()
                }
            }
        }
    }, [activityColumn])

    return <div className={className(styles.page, {
        [styles['active-page']]: activityColumn.uuid === PAGE_ACTIVE_COLUMN_UUID
    })}>
        <Dropdown menu={menu} trigger={['contextMenu']}>
            <div className={styles["design-body"]} onMouseDown={onMouseDown} >
                <ReactSortable
                    sort
                    list={designList}
                    animation={180}
                    onUpdate={onUpdate}
                    className={styles["drag-center"]}
                    style={{ backgroundColor: canPutbackgroundColor }}
                    group={{
                        name: 'component',
                        push: true,
                        pull: false,
                        put: canPutGroup
                    }}
                    setList={newList => {
                        updateList(newList)
                    }}
                    clone={(currentItem) => {
                        onUpdate()
                        return clone(currentItem)
                    }}
                >
                    {
                        designList.map((el, index) => (<DragItem
                            key={el.uuid}
                            column={el}
                            onUpdate={onUpdate}
                            activityColumn={activityColumn}
                            updateList={(newChildren) => {
                                updateList(newChildren, index)
                            }}
                        />))
                    }
                </ReactSortable>
            </div>
        </Dropdown>
    </div>
}
