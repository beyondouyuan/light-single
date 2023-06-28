import { Modal } from "antd" 
import { useMemo } from "react"

export default function useIKnow(key, content = '我已知晓，当前浏览器中不再提示？') {
    const iKnow = localStorage.getItem(key)

    return useMemo(() => {
        return {
            iKnow,
            confirm() {
                Modal.confirm({
                    title: '提示',
                    content: content,
                    onOk() {
                        localStorage.setItem(key, "iknow")
                    }
                })
            }
        }
    }, [iKnow, content])
}