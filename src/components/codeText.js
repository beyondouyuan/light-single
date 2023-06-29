import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function renderCode({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="jsx"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}

export function renderJs({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="jsx"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}

export function renderLess({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="less"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}