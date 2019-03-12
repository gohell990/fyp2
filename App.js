import {
  createStackNavigator,
} from 'react-navigation';

import SignUp from './SignUp';
import Login from './Login';
import Main from './Main';
import SettingsScreen from './app/src/SettingsScreen';
import MyAccountScreen from './app/src/MyAccountScreen';

export default createStackNavigator({
  Main:{ screen: Main },

  Login:{
    screen: Login
  },

  SignUp:{
    screen: SignUp
  },

  Settings: {
    screen: SettingsScreen
  },

  MyAccount: {
    screen: MyAccountScreen
  }
}, {
  initialRouteName: 'Login',
  navigationOptions:{
    headerStyle:{
      backgroundColor: '#a80000',
    },
    headerTintColor:'#fff',
    headerTitleStyle:{
      fontWeight: 'bold',
    },
  },
  headerMode: 'none',
});
