import React, {Component} from 'react';
import { TouchableHighlight, FlatList, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Left, Right} from 'native-base';
import firebase from 'react-native-firebase';

export default class MyAccountScreen extends React.Component{

  static navigationOptions = { title: 'My Item List'};

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Items');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items: [],

    };
  }

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

  handleLogout = () => {
    const { email, password } = this.state
    firebase
    .auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Login'))
    .catch(error => this.setState({errorMessage:error.message}))
    console.log('handleLogout')
  }

  render(){
    const {currentUser} = this.state
    if (this.state.items == ''){
      return(
        <View style={styles.container}>
          <View style={styles.notice}>
            <Text style={{fontWeight: 'bold', fontSize: 25}}> Seem like you don't have any item</Text>
            <Text style={{fontWeight: 'bold', fontSize: 25}}> uploaded yet! </Text>
          </View>
          <View style={styles.upload}>
            <Button title="Upload Item Now" onPress={()=>this.props.navigation.navigate('UploadItem')}
              icon = {
                <Icon name="upload" size={20} style={styles.icon}/>
              }
            />
          </View>
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
                  <Icon name="cog" size={20} style={styles.icon}/>
                }
                title="Settings"
                onPress={()=>this.props.navigation.navigate('Settings')}
              />
            </View>

          </View>
        </View>
      );
    }else{
      return(
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={{justifyContent:'center', alignItems:'center'}}>
            Hi {currentUser && currentUser.email}!
          </Text>
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
