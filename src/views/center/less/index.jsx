import { renderLess } from 'components/codeText'
import { toPageLess } from 'views/utils/icode'

export default function Less({ designList }) {
    return renderLess({
        value: toPageLess({
            designList 
        })
    })
}