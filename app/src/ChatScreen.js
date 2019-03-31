import React, {Component} from 'react';
import {ToastAndroid, TouchableOpacity, StyleSheet, ScrollView, View, Image, Text, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import { Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class ChatScreen extends React.Component{

  static navigationOptions = {title: "Chat Room"};

  constructor(){
    super();
    this.ref = firebase.firestore().collection('Items');
    this.userRef = firebase.firestore().collection('Users');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      item: [],
      user: [],
      message: '',
      chatroom: '',
    };
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  updateBoard() {
    if (this.state.imageUrl == ''){
      Alert.alert("Invalid image format");
    }
    else if (this.state.name == '') {
      Alert.alert("Invalid name");
    }
    else if (this.state.selectedCategory == null){
      Alert.alert("Please select a category");
    }
    else if (parseFloat(this.state.price) <= 0 ){
      Alert.alert("Invalid price input");

    }
    else {
      this.setState({
        isLoading: true,
      });
      const { navigation } = this.props;
      const updateRef = firebase.firestore().collection('Items').doc(this.state.key);
      updateRef.set({
        name: this.state.name,
        description: this.state.description,
        category: this.state.category,
        price: this.state.price,
        url: this.state.url,
        user: firebase.auth().currentUser.email,
        timestamp: this.state.timestamp,
      }).then((docRef) => {
        this.setState({
          key: '',
          name: '',
          description: '',
          category: '',
          price: '',
          url: '',
          isLoading: false,
        });
        this.props.navigation.navigate('MyAccount');

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  componentDidMount() {

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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
      console.log("got item!")
    });

   this.userRef.where("email", "==", JSON.parse(navigation.getParam('sellerEmail'))).get()
   .then((snapshot) => {
     snapshot.docs.forEach(doc => {

       this.setState({
         user: doc.data(),
       })
     })
     console.log(this.state.user.name)
   });
  }

  render(){
    return(
      <ScrollView>
        <View>
          <Text> welcome to chat screen </Text>
        </View>
        <Text> Hi {this.state.item.name} {this.state.user.name}</Text>
        <TextInput
          style={ styles.input }
          placeholder="Enter message"
          value={ this.state.message }
          selectTextOnFocus ={ true }
          onChangeText={(message) => {this.setState({message})}}
        />
        <TouchableOpacity onPress={() =>{}}>
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
