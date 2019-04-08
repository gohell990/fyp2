import React, {Component} from 'react';
import {Alert, ToastAndroid, TouchableOpacity, StyleSheet, ScrollView, View, Image, Text, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import { Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class ChatScreen extends React.Component{

  static navigationOptions = {title: "Chat Room"};

  constructor(){
    super();
    this.ref = firebase.firestore().collection('Items');
    this.userRef = firebase.firestore().collection('Users');
    this.chatRef = firebase.firestore().collection('Chats');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      item: [],
      buyer: firebase.auth().currentUser.email,
      seller: '',
      message: [],
      chatroom: '',
      chat: [],
      typing: '',
      chatData: [],
      record: [],
    };
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  updateBoard() {

      const { navigation } = this.props;
      const updateRef = firebase.firestore().collection('Chats').doc(this.state.key);
      updateRef.set({
        buyer: this.state.buyer,
        seller: this.state.seller.name,
        message: this.state.message,

      })

      .then((docRef) => {
        this.setState({
          key: '',
          buyer: '',
          seller: '',
          message: [],
        });

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false,
        });
      });
      console.log("Done update")
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.chatRef
    .where("buyer", "==", this.state.buyer)
    .where("seller", "==", JSON.parse(navigation.getParam('sellerEmail')))
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
          this.setState({
            chatData: doc.data(),
          })
      })
      console.log("this is buyer in chat: Hi" + this.state.chatData.buyer)
      console.log("buyer has chat record")
      console.log(this.state.chatData)
    })


    if (this.state.chatData == []){
      this.chatRef.add({
        buyer: this.state.buyer,
        message: [],
        seller: JSON.parse(navigation.getParam('sellerEmail')),
      }).then((docRef) => {
        this.setState({
          buyer: '',
          message: [],
          seller: '',
        });
        Alert.alert("Chat created!");
      })
    }
    else if (this.state.chatData != []){
      Alert.alert("Chat exist" + this.state.chatData.seller)
    }
    /*if (this.state.chatData.seller != JSON.parse(navigation.getParam('sellerEmail')) && this.state.chatData.buyer != this.state.buyer){
      this.chatRef.add({
        buyer: this.state.buyer,
        seller: JSON.parse(navigation.getParam('sellerEmail')),
        message: [],
      }).then((docRef) => {
        this.setState({
          buyer: '',
          seller: '',
          message: [],
        });
      });
      console.log("Im didMount() seller: " + this.state.seller)
      console.log("chat room created222 12345")
    }else if (this.state.chatData.seller != JSON.parse(navigation.getParam('sellerEmail')) &&
      this.state.chatData.buyer != this.state.buyer) {
      console.log("Got Chat Before")
    }*/
  }

  choosePhoto= () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const fileName = response.fileName + firebase.auth().currentUser.user;
        const imageRef = firebase.storage().ref('/images/').child(fileName);
        imageRef.put(response.uri,{contentType:'image/jpeg'})

        .then(()=>{
          return imageRef.getDownloadURL()
        })
        .then((url)=>{
          this.setPath(url)
        });

        this.setState({
          imageSource: source,
          imageFileName: fileName,
        });

      }
    });
  }

  setPath= (url) => {
    this.setState({
      url:url
    })
    console.log("url uploaded", this.state.url);
  }

  onCollectionUpdate = () => {
    const { navigation } = this.props;
    this.ref.where("name", "==", JSON.parse(navigation.getParam('chatItem'))).get()
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {

        this.setState({
          item: doc.data(),
        })
      })
      console.log("this is item: " + this.state.item.name)
    });


   this.userRef.where("email", "==", JSON.parse(navigation.getParam('sellerEmail'))).get()
   .then((snapshot) => {
     snapshot.docs.forEach(doc => {

       this.setState({
         seller: doc.data(),
       })
     })

     console.log("this is seller email: " + this.state.seller.email)

   });
 }


  render(){
    return(
      <ScrollView>
        <View>
          <Text> welcome to chat screen </Text>
        </View>
        <Text> {this.state.item.name} {this.state.seller.name} {this.state.buyer}</Text>
        <TextInput
          style={ styles.input }
          placeholder="Enter message"
          value={ this.state.message }
          selectTextOnFocus ={ true }
          onChangeText={(typing) => this.updateTextInput(typing, 'typing')}
        />
        <TouchableOpacity onPress={this.updateBoard}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  output: {
    height: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: 'blue',
  },
  button: {
    padding: 20,
    backgroundColor: 'blue',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
})
