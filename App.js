import {
  createStackNavigator,
} from 'react-navigation';

import SignUp from './SignUp';
import Login from './Login';
import Main from './Main';
import SettingsScreen from './app/src/SettingsScreen';
import MyAccountScreen from './app/src/MyAccountScreen';
import EditItem from './app/src/EditItem';
import ShowItem from './app/src/ShowItem';
import ItemDetails from './app/src/ItemDetails';
import UploadItem from './app/src/UploadItem';

export default createStackNavigator({
  Main:{ screen: Main },

  Login:{ screen: Login },

  SignUp:{ screen: SignUp },

  Settings: { screen: SettingsScreen },

  MyAccount: { screen: MyAccountScreen },

  EditItem: { screen: EditItem },

  ShowItem: { screen: ShowItem },

  ItemDetails: { screen: ItemDetails },

  UploadItem: { screen: UploadItem },
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
