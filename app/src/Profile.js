import React, {Component} from 'react';
import { ActivityIndicator, TouchableHighlight, FlatList, Image, ScrollView, View, Text, StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { Container, Header, Content, Left} from 'native-base';

export default class Profile extends React.Component{

  static navigationOptions = { title: 'My Profile'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Users');
    this.state = {

      user: '',
      name: '',
      email: '',
      gender: '',
      viewName: '',
      viewEmail: '',
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


  componentDidMount() {

    const { navigation } = this.props;
    console.log(firebase.auth().currentUser.email)

    const ref = firebase.firestore().collection('Users');
    ref.where("email", "==", firebase.auth().currentUser.email).get()

    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const user = doc.data()
        this.setState({
          email: user.email,
          name: user.name,
        })
      })
    });

    ref.where("email", "==", JSON.parse(navigation.getParam('viewUser'))).get()
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const viewUser = doc.data()
        this.setState({
          viewEmail: viewUser.email,
          viewName: viewUser.name,
        })

        console.log("ViewUser item: " + this.state.viewEmail + "  " + this.state.viewName)
      })
    });
  }

  render(){
    const {navigation} = this.props;

    if (this.ref.where("email", "==", this.state.viewEmail) &&
    this.ref.where("email", "!=", firebase.auth().currentUser.email)){
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <Text> View User Profile Here! </Text>
          <View style={styles.container}>
            <Text> Profile Screen </Text>
            <View style={styles.title}>
              <Text> User Name: {this.state.viewName}</Text>
            </View>
            <View style={styles.title}>
              <Text> Email: {this.state.viewEmail}</Text>
            </View>
            <View style={styles.title}>
              <Text> Gender: </Text>
            </View>
            <View style={styles.buttonContainer}>
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
                <Button title="Sign Out"
                  icon = {
                    <Icon name="sign-out" size={20} style={styles.icon}/>
                  }
                  onPress={this.handleLogout}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
    else if (this.ref.where("email", "==", firebase.auth().currentUser.email) &&
        this.ref.where("email", "!=", JSON.parse(navigation.getParam('viewUser')))) {
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <Text> got data! </Text>
          <View style={styles.container}>
            <Text> Profile Screen </Text>
            <View style={styles.title}>
              <Text> User Name: {this.state.name}</Text>
            </View>
            <View style={styles.title}>
              <Text> Email: {this.state.email}</Text>
            </View>
            <View style={styles.title}>
              <Text> Gender: {this.state.gender}</Text>
            </View>
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
                <Button title="Sign Out"
                  icon = {
                    <Icon name="sign-out" size={20} style={styles.icon}/>
                  }
                  onPress={this.handleLogout}
                />
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
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
})
