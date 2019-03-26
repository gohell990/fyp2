import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Image, Text, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import { Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ChatScreen extends React.Component{

  static navigationOptions = {title: "chat"};

  constructor(){
    super();
    this.ref = firebase.firestore().collection('Items');
    this.userRef = firebase.firestore().collection('Users');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: [],
      users: [],
      messages: '',

    };
  }

  componentDidMount() {


    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = () => {
    const { navigation } = this.props;
    this.ref.where("id", "==", JSON.parse(navigation.getParam('chatItem'))).get()
    .then((querySnapshot) => {
      const items = [];

      querySnapshot.forEach((doc) => {
        const { name, description, category, price, url, user } = doc.data();
        items.push({
          key: doc.id,
          doc,
          name,
          description,
          category,
          price,
          url,
          user,
        });
      });
      this.setState({
        items,
        isLoading: false,
     });
   })

   .then((querySnapshot) => {
   const users = [];

     querySnapshot.forEach((doc) => {
       const { name, id, email } = doc.data();
       items.push({
         key: doc.id,
         doc,
         name,
         email,
         id,
       });
     });
       this.setState({
         users,
         isLoading: false,
      });
    })
  }

  render(){
    return(
      <ScrollView>
        <View>
          <Text> welcome to chat screen </Text>
          <Text> {this.state.items.key} </Text>
        </View>
        <View style={styles.input}>
          <TextInput placeholder="Send Message here..."
            value={this.state.messages}
          >
          </TextInput>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  input:{
    flex: 1,
    justifyContent: 'center',
    bottom: 0,
    alignItems: 'center',

  }
})
