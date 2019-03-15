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
import FilterPage from './app/src/FilterPage';
import CategoryPage from './app/src/CategoryPage';

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

  FilterPage: { screen: FilterPage },

  CategoryPage: { screen: CategoryPage },
}, {
  initialRouteName: 'Login',
  navigationOptions:{
    headerStyle:{
      backgroundColor: '#191970',
    },
    headerTintColor:'#fff',
    headerTitleStyle:{
      fontWeight: 'bold',
    },
  },

});
