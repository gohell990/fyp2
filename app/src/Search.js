import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TouchableOpacity,ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import firebase from 'react-native-firebase';
import { Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Search extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Search Result(s): ' + navigation.getParam('search')
    };
  };

  handleLogout = () => {
    const { email, password } = this.state
    firebase
    .auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Login'))
    .catch(error => this.setState({errorMessage:error.message}))
    console.log('handleLogout')
  }
  constructor(){
    super();
    this.ref = firebase.firestore().collection('items');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      items:[],
    };
  }

  onCollectionUpdate = ()=>{
    const { navigation } = this.props;
    const search = JSON.parse(navigation.getParam('search'))
    this.ref.orderBy("name").startAt(search).endAt(search + "\uf8ff").get()
    .then((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        const{name,category, description,imageFileName,point,service,user,url} = doc.data();
        items.push({
          key:doc.id,
          doc,
          name,
          category,
          description,
          imageFileName,
          url,
          point,
          service,
        });
      });
      this.setState({
        items,
        isLoading:false,
      })
    })
  }

  componentDidMount() {
    const {currentUser} = firebase.auth()
    this.setState({currentUser})
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  state = { currentUser: null }
  render() {
    const { currentUser } = this.state
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{position: 'absolute', top: 5, right: 5}}>
          {currentUser && currentUser.email}
        </Text>
        <FlatList
          data={ this.state.items }
          showsVerticalScrollIndicator={ false }
          renderItem={({item}) =>
            <TouchableHighlight
              underlayColor={'#cccccc'}
              style={{width:400}}
              onPress={ () => {
                this.props.navigation.navigate('ShowDetails', {
                  itemkey: `${JSON.stringify(item.key)}`,
                });
             }}
            >
              <View style={styles.item}>
                <Image source={{uri:`${item.url}`}}
                  style={styles.image}/>
                <View style={styles.itemDetails}>
                <Text numberOfLines={1} style={styles.itemTitle}>{ item.name }</Text>
                <Text style={styles.itemSubtitle}>{ item.category }</Text>
                <Text numberOfLines={1}>{item.description}</Text>
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
