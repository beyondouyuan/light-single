import { Provider } from 'react-redux'
import LightSimple from './views';
import store from './store'

function App() {
  return (
    <Provider store={store}>
      <LightSimple />
    </Provider>
  );
}

export default App;
