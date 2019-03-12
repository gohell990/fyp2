import React from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableHighlight , Button } from 'react-native';

import firebase from 'react-native-firebase';

export default class Login extends React.Component {

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main' : 'Login')
    })
  }

  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
    const { email, password } = this.state
    if (this.state.email == '' || this.state.password == ''){
      Alert.alert("Cannot Be Null");
    }else {
      firebase
      .auth()
      .signInWithEmailAndPassword(email,password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({errorMessage:error.message}))
      console.log('handleLogin')}
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>

        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableHighlight onPress={()=> this.handleLogin()}
          style= {styles.button}>
          <Text> Login </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=> this.props.navigation.navigate('SignUp')}
          style={styles.button}>
          <Text> Don't have account yet? SignUp Now! </Text>
        </TouchableHighlight>

        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    paddingTop: 10,
    marginTop: 10,
    backgroundColor: 'cyan',
    justifyContent: 'center',
  }
});
