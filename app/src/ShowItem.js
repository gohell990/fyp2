import React, { Component } from 'react';
import { Image, TouchableHighlight, StyleSheet, ScrollView, ActivityIndicator, View, Text, FlatList } from 'react-native';
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
      const { name, description, category, price, url } = doc.data();
      items.push({
        key: doc.id,
        doc,
        name,
        description,
        category,
        price,
        url,
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
                  <Image source={{uri:`${item.url}`}}
                      style={styles.image}/>
                  <View style={styles.itemDetails}>
                    <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemTitle}>RM {item.price}</Text>
                    <Text style={styles.itemSubtitle}>{item.category}</Text>
                  </View>
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
  image:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  itemDetails:{
    paddingTop: 15,
    flex: 2,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingBottom: 22
  },
  item: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    borderRadius: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom:10,
    fontSize: 18,

  },

  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 18,
    marginBottom:20
  },
})
