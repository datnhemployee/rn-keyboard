import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import RnKeyboard from 'rn-keyboard';

RnKeyboard.registerComponent();
AppRegistry.registerComponent(appName, () => App);
