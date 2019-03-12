import React from 'react';
import { ScrollView, StyleSheet, Image, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import MyAccountScreen from './app/src/MyAccountScreen';

import SettingsScreen from './app/src/SettingsScreen';

export default class Main extends React.Component {
  handleLogout = () => {
    const { email, password } = this.state
    firebase
    .auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Login'))
    .catch(error => this.setState({errorMessage:error.message}))
    console.log('handleLogout')
  }

  componentDidMount() {
    const {currentUser} = firebase.auth()
    this.setState({currentUser})
  }

  state = { currentUser: null }

  render() {
      const { currentUser } = this.state
      return (

          <ScrollView contentContainerStyle={styles.container}>
            <Text>
              Hi {currentUser && currentUser.email}!
            </Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Logout" onPress={this.handleLogout}
                icon = {
                  <Icon name="shopping-cart" size={20} style={styles.icon}/>
                }/>
              </View>
              <View style={styles.button}>
                <Button
                  title="Settings"
                  onPress={()=>this.props.navigation.navigate('Settings')}
                  icon = {
                    <Icon name="shopping-cart" size={20} style={styles.icon}/>
                  }
                />
              </View>
              <View style={styles.button}>
                <Button title="My Account" onPress={()=>this.props.navigation.navigate('MyAccount')}
                  icon = {
                    <Icon name="shopping-cart" size={20} style={styles.icon}/>
                  }/>
              </View>
            </View>
          </ScrollView>

      );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  button: {

    justifyContent: 'flex-end',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  }
})
