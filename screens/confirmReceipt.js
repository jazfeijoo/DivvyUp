import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Button,
} from 'react-native';

import {
  useFonts,
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from '@expo-google-fonts/lato';

//0. Import firebase for receipt collection: 
 import firebase from '../config/firebase'
 const firestore = firebase.firestore();
//1: Import authenticated user 
import { auth } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';


//COMPONENT:
export default ConfirmReceipt = ({ route, navigation }) => {


 
  const {img, text, button, container} = styles;
  //2.Set user object. Set state (however, receipt in local state here will be the PARSED receipt) 
  const { user } = useContext(AuthenticatedUserContext) ? useContext(AuthenticatedUserContext) : 'NO USER!'
  const [receipt, setReceipt] = useState({businessName: 'PIZZERIA', items:[{price: 15, description: 'pizza', quantity: 1},{price: 20, description: 'pasta',quantity: 1},{price: 12, description: 'wine',quantity: 2}]})


  let [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_100Thin_Italic,
    Lato_300Light,
    Lato_300Light_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    Lato_900Black_Italic,
  });

  function submitReceipt(){
   return (
       firestore.collection('receipts')
       .add({receipt: {...receipt, charger: `${user.uid}`}})
   )        
  }




  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  } else {
    console.log('USER: ', user.uid)
    return (
      <View style={container}>
        <ImageBackground
          style={img}
          source={require('../assets/divvyup-background.jpg')}
          resizeMode="cover">
          <View>
            <Text style={text}>Items: {JSON.stringify(receipt.items)} </Text>
            <Button onPress={submitReceipt} title="Submit"/>
            <Button title="Edit"/>
 
          </View>
        </ImageBackground>
      </View>
    );
  }
};

// export default confirmReceipt;

const styles = StyleSheet.create({
  img: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  button: {
    width: '100%',
    height: '40%',
    color: 'white',
    fontFamily: 'Lato_400Regular',
    backgroundColor: 'black',
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    padding: 30,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lato_400Regular',
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lato_400Regular',
  },
});