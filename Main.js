import React from 'react';
import { FlatList, TouchableHighlight, ActivityIndicator, ScrollView, StyleSheet, Image, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import { Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import MyAccountScreen from './app/src/MyAccountScreen';
import Profile from './app/src/Profile';

export default class Main extends React.Component {

  static navigationOptions = { title: 'Home Page'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Items');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: [],
      search: '',
      messages: [],
    };
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  updateSearch = search => {
    this.setState({ search });
  };

  onCollectionUpdate = (querySnapshot) => {
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
  }

  componentDidMount() {
    const {currentUser} = firebase.auth()
    this.setState({currentUser})
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  state = { currentUser: null }

  render() {

      const { search } = this.state;
      if(this.state.isLoading){
        return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
        )
      }
      else {
        return (

            <ScrollView contentContainerStyle={styles.container}>

              <View style={{flexDirection:'row',top:2, width: '100%'}}>
                <View style={{flex:5}}>
                  <SearchBar
                    platform='android'
                    containerStyle={styles.searchBar}
                    onChangeText={this.updateSearch}
                    value={search}
                    placeholder='Type Here...' />
                </View>
                <View style={{flex:1}}>
                  <Button
                    icon = {
                      <Icon name="search" size={20}/>
                    }
                    onPress={ () => {
                      this.props.navigation.navigate('Search', {
                        search: `${JSON.stringify(this.state.search)}`,
                      });
                      this.setState({search:''})
                    }}
                    buttonStyle={{height: 65}}
                  />
                </View>
              </View>
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
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button title="Filter"
                    icon = {
                      <Icon name="filter" size={20} style={styles.icon}/>
                    }
                    onPress={()=>this.props.navigation.navigate('FilterPage')}
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
                  <Button title="My Account"
                    onPress={()=>this.props.navigation.navigate('MyAccount')}
                    icon = {
                      <Icon name="user-circle" size={20} style={styles.icon}/>
                    }
                  />
                </View>
              </View>
            </ScrollView>

        );
    }
  }
}


const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  icon:{
    marginRight: 10,
  },
  button: {

    justifyContent: 'flex-end',
    flex: 1,
  },
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
