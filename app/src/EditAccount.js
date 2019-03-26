import React, { Component } from 'react';
import { Picker, Image, StyleSheet, ScrollView, ActivityIndicator, View, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select a photo'
};

export default class EditAccount extends React.Component{

  static navigationOptions = {
    title: 'Edit Account',
  };

  constructor() {
    super();
    this.categoryData = ["Select Category", "Text Book/Notes", "Electronic", "Groceries", "Fashion", "Transportation", "Furniture", "Health & Beauty", "Others"]
    this.genderData = ["Select Gender", "male", "female"],
    this.state = {
      key: '',
      isLoading: true,
      name: '',
      gender: '',
      url: '',
      email: '',
    };
  }

  categoryList = () => {
    return (this.categoryData.map( (x, i) => {
      return( <Picker.Item label={x} key={i} value={x} />)
    }));
  }

  genderList = () => {
    return (this.categoryData.map( (x, i) => {
      return( <Picker.Item label={x} key={i} value={x} />)
    }));
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

  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase.firestore().collection('Users').doc(JSON.parse(navigation.getParam('editAccount')));
    ref.get().then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        this.setState({
          key: doc.id,
          name: user.name,
          gender: user.gender,
          url: user.url,
          email: user.email,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
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
      const updateRef = firebase.firestore().collection('Users').doc(this.state.key);
      updateRef.set({
        name: this.state.name,
        gender: this.state.gender,
        url: this.state.url,
        email: firebase.auth().currentUser.email,
        timestamp: this.state.timestamp,
      }).then((docRef) => {
        this.setState({
          key: '',
          name: '',
          gender: '',
          url: '',
          email: '',
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

  showItem() {
    var ref = firebase.database().ref("Items/id");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.key; // "ada"

    });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View>
          <Image source={{uri:this.state.url}} style={{width:'100%',height: 200, margin: 10}}/>
          <Button title="Select Image" onPress={this.choosePhoto}/>
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Description'}
              value={this.state.description}
              onChangeText={(text) => this.updateTextInput(text, 'description')}
          />
        </View>
        <View style={styles.subContainer}>
          <Picker
            selectedValue={this.state.selectedCategory}
            onValueChange={ (value) => ( this.setState({selectedCategory : value}) )}>
            { this.categoryList() }
          </Picker>
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Price'}
              value={this.state.price}
              onChangeText={(text) => this.updateTextInput(text, 'price')}
          />
        </View>
        <View style={styles.subcontainer}>
          <Button
            large
            title='Update'
            onPress={() => this.updateBoard()} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginTop: 20,
    borderRadius: 2
  },
})
