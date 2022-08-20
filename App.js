import 'react-native-gesture-handler';

import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {setCustomTextInput, setCustomText} from 'react-native-global-props';
import Toast from 'react-native-toast-message';

import {store, persistor} from './src/config/store';

import Router from './src/config/Router';

const fontFamilyProps = {style: {fontSize: 20, fontFamily: 'FiraSans'}};
setCustomTextInput(fontFamilyProps);
setCustomText(fontFamilyProps);

class App extends React.Component {
  render() {
    console.disableYellowBox = true;
    // return <BasePage />
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            <StatusBar barStyle="dark-content" />
            <Router />
          <Toast />
          </>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
