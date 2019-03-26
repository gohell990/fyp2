import React, { Component } from 'react';
import { Alert, ScrollView, Picker, Image, StyleSheet, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select a photo'
};

export default class UploadItem extends React.Component{

  static navigationOptions = {
    title: 'Upload Item',
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Items');
    this.categoryData = ["Select Category", "Text Book/Notes", "Electronic", "Groceries", "Fashion", "Transportation", "Furniture", "Health & Beauty", "Others"]
    this.state = {
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      timestamp: '',
      user: '',
      selectedCategory: null,
      isLoading: false,
      loadingImage: false,
    };
  }

  categoryList = () => {
    return (this.categoryData.map( (x, i) => {
      return( <Picker.Item label={x} key={i} value={x} />)
    }));
  }

  choosePhoto= () => {
    this.setState({ loadingImage: true})

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
      imageUrl:url
    })
    console.log("url uploaded", this.state.imageUrl);
  }

  componentDidMount(){

  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveBoard() {

    if (this.state.imageUrl == ''){
      Alert.alert("Invalid image format");
    }
    else if (this.state.name == '') {
      Alert.alert("Invalid name");
    }
    else if (this.state.selectedCategory == null){
      Alert.alert("Please select a category");
    }
    else if (parseFloat(this.state.price) <= 0 || this.state.price == ''){
      Alert.alert("Invalid price input");

    }else {
      this.setState({
        isLoading: true,
      });
      this.ref.add({
        name: this.state.name,
        description: this.state.description,
        category: this.state.selectedCategory,
        price: parseFloat(this.state.price),
        url: this.state.imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: firebase.auth().currentUser.email,
      }).then((docRef) => {
        this.setState({
          name: '',
          description: '',
          category: '',
          price: '',
          imageUrl: '',
          isLoading: false,
        });
        Alert.alert("Item has successfully uploaded");
        this.props.navigation.goBack();
      })

      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false,
        });
      });
    }
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
          <Image source={this.state.loadingImage ? this.state.imageSource :require('../image/imageNotFound.png')} style={{width:'100%', height:300}}/>
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
              keyboardType= 'numeric'
              placeholder={'Price'}
              value={this.state.price}
              onChangeText={(text) => this.updateTextInput(text, 'price')}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            large
            title='Save'
            onPress={() => this.saveBoard()} />
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
  image:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
