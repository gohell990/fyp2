import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Container, Header, Content, Left} from 'native-base';

export default class SettingsScreen extends React.Component{

  render(){
    return(
      <View style={styles.container}>
        <Text> Settings Screen </Text>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Logout"
            icon = {
              <Icon name="sign-out" size={20} style={styles.icon}/>
            }/>
          </View>
          <View style={styles.button}>
            <Button
              title="Home"
              onPress={()=>this.props.navigation.navigate('Main')}
              icon = {
                <Icon name="shopping-cart" size={20} style={styles.icon}/>
              }
            />
          </View>
          <View style={styles.button}>
            <Button title="My Account" onPress={()=>this.props.navigation.navigate('MyAccount')}
              icon = {
                <Icon name="user-circle" size={20} style={styles.icon}/>
              }/>
          </View>
        </View>
      </View>
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
