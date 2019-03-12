import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default class EditItem extends React.Component{

  static navigationOptions = {
    title: 'Edit Board',
  };

  constructor() {
    super();
    this.state = {
      key: '',
      isLoading: true,
      name: '',
      description: '',
      category: '',
      price: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase.firestore().collection('Items').doc(JSON.parse(navigation.getParam('itemkey')));
    ref.get().then((doc) => {
      if (doc.exists) {
        const item = doc.data();
        this.setState({
          key: doc.id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
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
    this.setState({
      isLoading: true,
    });
    const { navigation } = this.props;
    const updateRef = firebase.firestore().collection('Items').doc(this.state.key);
    updateRef.set({
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        description: '',
        category: '',
        price: '',
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
          <TextInput
              placeholder={'Category'}
              value={this.state.category}
              onChangeText={(text) => this.updateTextInput(text, 'category')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Price'}
              value={this.state.price}
              onChangeText={(text) => this.updateTextInput(text, 'price')}
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'update'}}
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
  }
})
