import { renderCode } from 'components/codeText'
import { toHook } from 'views/utils/icode'

export default function Code({ designList }) {
    return renderCode({ value: toHook(designList) })
}