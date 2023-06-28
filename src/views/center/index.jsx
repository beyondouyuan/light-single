import { useState } from 'react';
import { Tabs } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import Design from './design';
import Preview from './preview';
import Code from './code'
import Less from './less' 
import styles from './index.module.less'

export default function Center(props) {
    const { activityColumn } = props
    const [designList, setDesignList] = useState([])

    const items = [
        {
            key: 1,
            label: "设计",
            children: <Design designList={designList} activityColumn={activityColumn} onChange={setDesignList} />
        },
        {
            key: 2,
            label: "预览",
            children: <ErrorBoundary title="数据解析失败">
                <Preview designList={designList} />
            </ErrorBoundary>
        },
        {
            key: 3,
            label: "代码页",
            children: <Code designList={designList} />
        },
        {
            key: 4,
            label: "样式页",
            children: <Less designList={designList} />
        }
    ]

    return <Tabs items={items} className={styles.tabs}/>
}