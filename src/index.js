import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import prettier from 'prettier/esm/standalone.mjs'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import Freedomen from 'freedomen'
import './index.css';

Freedomen.setDefaultConfigs(() => {
  return {
    '-g@small': {
      size: 'small'
    },
    Form: {
      labelCol: { span: 4 }
    },
    'select*': {
      allowClear: true
    },
    'input,input@*,input-*': {
      allowClear: true,
      changeEventType: 'blur'
    },
    'autocomplete*': {
      changeEventType: 'blur'
    }
  }
})

window.codeFormart = function (value) {
  return prettier.format(value, {
    parser: "babel",
    tabWidth: 4,
    semi: false,
    printWidth: 160,
    plugins: [parserBabel],
  })
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
