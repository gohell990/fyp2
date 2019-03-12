import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, ScrollView, ActivityIndicator, View, Text, FlatList } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

export default class ShowItem extends React.Component{
  static navigationOptions = { title: 'My Item List'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Items');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const items = [];

    querySnapshot.forEach((doc) => {
      const { name, description, category, price } = doc.data();
      items.push({
        key: doc.id,
        doc,
        name,
        description,
        category,
        price,
      });
    });
    this.setState({
      items,
      isLoading: false,
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    else {
    return (
      <ScrollView contentContainerStylestyle={styles.container}>
        <FlatList
          data={this.state.items}
          showsVerticalScrollIndicator= {true}
          renderItem={({item}) =>
              <TouchableHighlight
                onPress={() => {
                  this.props.navigation.navigate('ItemDetails', {
                    itemkey: `${JSON.stringify(item.key)}`,
                  });
                }}
              >
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.key}</Text>
              </View>
              </TouchableHighlight>

          }
          keyExtractor={(item) => {item.key.toString()}}
        />


      </ScrollView>
    );}
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    justifyContent: 'center',
    borderRadius: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom:10,
    padding: 35,
    fontSize: 18,
    height: 44,
  },

  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
    marginTop: 30,
  },
  itemSubtitle: {
    fontSize: 18,
    marginBottom:20
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
