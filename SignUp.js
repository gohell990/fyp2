import React,{Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image} from 'react-native';
import firebase from 'react-native-firebase';
export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }

handleSignUp = () => {
  firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
    .then(()=>this.props.navigation.navigate('Main'))
    .catch(error => this.setState({errorMessage: error.message}))
  console.log('handleSignUp')
}

constructor(props) {
  super(props);
  state = {
    fullName: '',
  }
}

onClickListener = (viewId) => {
  Alert.alert("Alert", "Button pressed "+viewId);
}

render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput style={styles.textInput}
            autoCapitalize="none"
            placeholder="Full name"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(fullName) => this.setState({fullName})}
            value={this.state.fullName}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button style={styles.button} title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
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
  button:{
    marginTop:8,
    marginBottom:8
  }
})
