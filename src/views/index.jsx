import Left from "./left";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import Bus, { BUS_KEYS } from "./bus";
import Center from "./center";
import Right from "./right";

export default function LightSimple() {
    const [activityColumn, setActivityColumn] = useState({})

    useEffect(() => {
        const focusKey = Bus.on(BUS_KEYS.focus, function (column) {
            Bus.set(BUS_KEYS.activeUUID, column.uuid)
            //防止属性配置表单的onChange不触发
            setTimeout(() => {
                setActivityColumn(column)
            });
        })
        return () => {
            Bus.remove(focusKey)
        }
    }, [])

    return <div className={styles.main}>
        <div className={styles.left}>
            <div className={styles.header}>
                Light Simple
                <div className={styles.doc}>
                <a href="https://light2f.com" target={"_blank"}>文档地址</a> 
                </div>
            </div>
            <Left />
        </div>
        <div className={styles.center}>
            <Center activityColumn={activityColumn} />
        </div>
        <div className={styles.right}>
            <Right activityColumn={activityColumn} />
        </div>
    </div>
}