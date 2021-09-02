import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, Modal, TextInput} from 'react-native';
import {auth} from '../config/firebase';
import {AuthenticatedUserContext} from '../navigation/AuthenticatedUserProvider';
import firebase from '../config/firebase';
const firestore = firebase.firestore();
import Header from './header';
import {Button} from 'react-native-paper';
import Receipt from './receipt';

export default addChargees = ({navigation}) => {
  const {
    img,
    text,
    button,
    container,
    textHeader,
    list,
    listItem,
    separator,
    textInput,
  } = styles;
    
//   const [receipt, setReceiptChargees] = useState({items: [], numChargees: 0})
//   const [showModal, setShowModal] = useState(false);



  if (!receipt) {
    return (
      <View>
        <Text style={text}>Loading</Text>
      </View>
    );
  } else {
    return (
      <View style={container}>
        <ImageBackground
          style={img}
          source={require('../assets/divvyup-background.jpg')}
          resizeMode="cover">
          <Header />
          <View style={container}>
           <Tex>HELLOOOOO</Tex>
           </View>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  img: {
    flex: 1,
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    marginTop: 60,
    flexDirection: 'row',
    padding: 25,
  },
  listItem: {
    padding: 10,
    height: 50,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Lato_400Regular',
    color: 'white',
    padding: 5,
  },
  textHeader: {
    fontSize: 27,
    fontWeight: '600',
    fontFamily: 'Lato_400Regular',
    color: 'white',
    padding: 5,
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 2,
    textAlign: 'center',
    marginHorizontal: 10,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  button: {
    color: 'white',
    backgroundColor: 'black',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CEDCCE',
  },
  constainerForListAndSubmit: {
    height: '85%',
  },
});
