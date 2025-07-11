import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// Importer les styles CSS pour le web
if (Platform.OS === 'web') {
  import('./web.css');
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
