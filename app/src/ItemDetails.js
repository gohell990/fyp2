import React, { Component } from 'react';
import { Image, StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { List, ListItem, Text, Card, Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default class ItemDetails extends React.Component{
  static navigationOptions = {
    title: 'Item Details',
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      item: {},
      key: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase.firestore().collection('Items').doc(JSON.parse(navigation.getParam('itemkey')));
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          item: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  deleteBoard(key) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    firebase.firestore().collection('Items').doc(key).delete().then(() => {
      console.log("Document successfully deleted!");
      this.setState({
        isLoading: false
      });
      navigation.navigate('ShowItem');
    }).catch((error) => {
      console.error("Error removing document: ", error);
      this.setState({
        isLoading: false
      });
    });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Image source={{uri:`${this.state.item.url}`}}
                style={styles.image}/>
              <Text style={styles.name}>
                <Text> Name: </Text>
                <Text style={styles.getItem}>{this.state.item.name}</Text>
              </Text>
              <Text style={styles.name}>
                <Text> Price: </Text>
                <Text style={styles.getItem}>{this.state.item.price}</Text>
              </Text>
              <Text style={styles.name}>
                <Text> Category: </Text>
                <Text style={styles.getItem}>{this.state.item.category}</Text>
              </Text>
              <Text style={styles.name}>
                <Text> Description: </Text>
                <Text style={styles.getItem}>{this.state.item.description}</Text>
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  name: {
    fontSize: 18,
  },
  getItem:{
    fontSize: 20,
    fontWeight: 'bold',

  },
  image: {
    width: '100%',
    height: 250,
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
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
  detailButton: {
    marginTop: 10
  }
})
