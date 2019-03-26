import React, {Component} from 'react';
import { TouchableHighlight, FlatList, Image, ScrollView, View, Text, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { Container, Header, Content, Left} from 'native-base';

export default class Profile extends React.Component{

  static navigationOptions = { title: 'My Profile'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('User');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: [],
      userData: [],
      user: '',
    };
  }

  handleLogout = () => {
    const { email, password } = this.state
    firebase
    .auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Login'))
    .catch(error => this.setState({errorMessage:error.message}))
    console.log('handleLogout')
  }

  onCollectionUpdate = () => {

    this.ref.where("user", "==", firebase.auth().currentUser.email).get()
    .then((querySnapshot) => {
    const userData = [];

    querySnapshot.forEach((doc) => {
      const { name, gender, email, url} = doc.data();
      userData.push({
        key: doc.id,
        doc,
        name,
        gender,
        url,
        email,
        });
      });
      this.setState({
        userData,
        isLoading: false,

      });
    })
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    const currentUser = firebase.auth().currentUser.user
    this.setState({currentUser})
    const { navigation } = this.props;

  }

  render(){
    if (this.state.userData.name == '' || this.state.userData.address == '' ||
    this.state.userData.picture == '' || this.state.userData.gender == ''
    || this.state.userData.birthday == ''){
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.buttonContainer}>
            <View style={styles.signout}>
              <Button title="Logout" onPress={this.handleLogout}
                icon = {
                  <Icon name="sign-out" size={20} style={styles.icon}/>
                }
              />
            </View>
            <Text> No data record found! </Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Edit"
                  icon = {
                    <Icon name="edit" size={20} style={styles.icon}/>
                  }
                  onPress={()=>{this.props.navigation.navigate('EditAccount', {
                    editAccount: `${JSON.stringify(this.state.userData.key)}`});
                  }}
                />
              </View>
              <View style={styles.button}>
                <Button
                  icon = {
                    <Icon name="home" size={20} style={styles.icon}/>
                  }
                  title="Home"
                  onPress={()=>this.props.navigation.navigate('Main')}
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
        </ScrollView>
      );
    }else {
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <Text> got data! </Text>
          <View style={styles.container}>
            <View style={styles.signout}>
              <Button title="Sign Out"
                icon = {
                  <Icon name="sign-out" size={20} style={styles.icon}/>
                }
                onPress={this.handleLogout}
              />
            </View>
            <Text> Profile Screen </Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Edit"
                  icon = {
                    <Icon name="edit" size={20} style={styles.icon}/>
                  }
                  onPress={()=>{this.props.navigation.navigate('EditAccount', {
                    editAccount: `${JSON.stringify(this.state.userData.key)}`});
                  }}
                />
              </View>
              <View style={styles.button}>
                <Button
                  icon = {
                    <Icon name="home" size={20} style={styles.icon}/>
                  }
                  title="Home"
                  onPress={()=>this.props.navigation.navigate('Main')}
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
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  signout: {
    top: 0,
    right: 0,
    position: 'absolute',
  },
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
