import React, {Component} from 'react';
import { KeyboardAvoidingView, TouchableHighlight, FlatList, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import {Button, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Left, Right} from 'native-base';
import firebase from 'react-native-firebase';

export default class FilterPage extends React.Component{

  static navigationOptions = { title: 'Category'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Items');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: [],
      search: '',
    };
  }

  updateSearch = search => {
    this.setState({ search });
  };

  display = () => {
    return (this.categoryData.map(function(key, val, array){
      return key;
  })); }

  onCollectionUpdate = () => {

      this.ref.where("user", "==", firebase.auth().currentUser.uid).get()
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
 }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    const currentUser = firebase.auth().currentUser.uid
    this.setState({currentUser})
  }

  state = { currentUser: null }

  render(){
    const {currentUser} = this.state
    const { search } = this.state;
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{justifyContent:'center', alignItems:'center'}}>
          Hi {currentUser && currentUser.email}!
        </Text>
        <SearchBar
          platform='android'
          containerStyle={styles.searchBar}
          onChangeText={this.updateSearch}
          value={search}
          placeholder='Type Here...' />

        <FlatList
          showsVerticalScrollIndicator= {true}
          data={[{key: 'Text Book/Notes'},
                {key: 'Groceries'},
                {key: 'Fashion'},
                {key: 'Transportation'},
                {key: 'Furniture'},
                {key: 'Health & Beauty'},
                {key: 'Others'}]}
          renderItem={({item}) => <TouchableHighlight
            onPress={() => {
              this.props.navigation.navigate('CategoryPage', {
                itemkey: `${JSON.stringify(item.key)}`,
              });
            }}
          >
            <View style={styles.item}>
              <View style={styles.itemDetails}>
                <Text style={styles.title}> {item.key} </Text>
              </View>
            </View>
          </TouchableHighlight>}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Logout" onPress={this.handleLogout}
              icon = {
                <Icon name="sign-out" size={20} style={styles.icon}/>
              }
            />
          </View>
          <View style={styles.button}>
            <Button
              icon = {
                <Icon name="home" size={20} style={styles.icon}/>
              }
              title="Home"
              onPress={()=>this.props.navigation.navigate('Main')}
            />
          </View>
          <View style={styles.button}>
            <Button title="Upload Item" onPress={()=>this.props.navigation.navigate('UploadItem')}
              icon = {
                <Icon name="upload" size={20} style={styles.icon}/>
              }
            />
          </View>

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  searchBar: {
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
    top: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  icon:{
    marginRight: 10
  },
  image:{
    flex: 1,
    width: '100%',
    height: 150,
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
    height: 50,
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
