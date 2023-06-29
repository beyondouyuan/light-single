import { Alert, Collapse, message } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';
import { ReactSortable } from 'react-sortablejs';
import { datas } from './config'
import Bus, { BUS_KEYS } from '../bus'
import { useIKnow, useLongKeyDown } from 'hooks';
import classNames from 'classnames'
import { useDispatch } from 'react-redux';
import { setComponentDrag } from 'slices/eventSlice';
import styles from './index.module.less'

const { Panel } = Collapse;

const iknowKey = "iknowcomp"

export default function Left() {
    const dispatch = useDispatch()

    const { ctrlKey } = useLongKeyDown()
    const { iKnow, confirm } = useIKnow(iknowKey)

    return <div className={styles["left-body"]}>
        {!iKnow && <Alert
            type='info'
            closable
            message="点击或拖拽到设计容器，按住ctrl单击查看相关文档"
            className={styles["alert"]}
            onClose={confirm}
        />}
        <Collapse
            ghost
            bordered={false}
            defaultActiveKey={[0, 1, 2, 3, 4]}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        >
            {
                datas.map((el, key) => {
                    return <Panel header={el.title} key={key} >
                        <ReactSortable
                            group={{
                                put: false,
                                pull: 'clone',
                                name: el.group
                            }}
                            sort={false}
                            list={el.children}
                            setList={_ => { /**donothing*/ }}
                            onStart={(e) => {
                                dispatch(setComponentDrag({ group: el.group, type: el.children[e.oldIndex].type }))
                            }}
                            onEnd={(e) => {
                                if (!e.pullMode && e.from !== e.to) {
                                    message.warning({
                                        title: '提示',
                                        content: <>无法放入，点击对应标题查看详情！</>
                                    })
                                }

                                Bus.emit(BUS_KEYS.putEnd)
                                dispatch(setComponentDrag(null))
                            }}
                            style={{marginTop: -10}}
                        >
                            {
                                el.children.map((child, key) => {
                                    return <div
                                        key={key}
                                        className={classNames(styles["item"], {
                                            [styles["custom-item"]]: child.isCustom
                                        })}
                                        title={child.tooltip}
                                        onClick={_ => {
                                            _.stopPropagation()

                                            Bus.emit(BUS_KEYS.putEnd, child)
                                        }}
                                    >
                                        {child.title}
                                        {ctrlKey && <a
                                            className={classNames(styles["cmpDoc"], styles["cmpDocShow"])}
                                            href={child.docLink}
                                            target="_blank"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {child.title}文档
                                        </a>}
                                    </div>
                                })
                            }
                        </ReactSortable>
                    </Panel>
                })
            }
        </Collapse>
    </div>
}