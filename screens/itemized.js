// AN Note: Import React from React.
import React, {useContext, useState, useRef} from 'react';
// Importing items from react native to be used in my screen.
import {StyleSheet, Text, View, ScrollView} from 'react-native';
// Importing my receipt parser function to use when someone navigates to this page.
import {receiptParser} from '../utilities/receiptParser';
import {receiptParserXY} from '../utilities/receiptParserXY'
// Importing react native paper elements to be used for styling.
import {DataTable, Button} from 'react-native-paper';
// Importing firebase per Jazmin's code on sending back the finalized receipt.
import firebase from '../config/firebase';

import {AuthenticatedUserContext} from '../navigation/AuthenticatedUserProvider';

import { db } from '../config/firebase';

const Itemized = ({route, navigation}) => {
  const {container, bottom, button} = styles;
  const {receiptData} = route.params;
  // This is my parsed receipt.
  let parsedData = receiptParser(receiptData.responses);
  let parsedDataXY = receiptParserXY(receiptData.responses)
  // Setting user object.
  const {user} = useContext(AuthenticatedUserContext)
    ? useContext(AuthenticatedUserContext)
    : 'NO USER!';
  // Here I'm using useState, changing the names of my items to the same naming convention as Jazz.
  const [receipt, setReceipt] = useState(parsedDataXY);
  const acceptedReceipt = useRef(null);
  const displayItemized = () => {
    // console.log('OLD RECEIPT:',parsedData)
     console.log('NEW RECEIPT:',parsedDataXY)
     console.log('TOTAL IS:', parsedDataXY['total'], 'OR:',parsedDataXY.total)
    if (receiptData === null) {
      return null;
    } else {

      return (
        <View>
          {parsedDataXY.items.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{paddingRight: 30, alignContent: 'flex-start'}} numeric>{item.quantity}</DataTable.Cell>
              <DataTable.Cell>{item.description.join(' ').trim()}</DataTable.Cell>
              <DataTable.Cell numeric>{item.price}</DataTable.Cell>
            </DataTable.Row>
          ))}
            <DataTable.Row>
              <DataTable.Cell style={{paddingRight: 30, alignContent: 'flex-start'}} numeric></DataTable.Cell>
              <DataTable.Cell style={{fontWeight: 'bold'}} > Total Cost</DataTable.Cell>
              <DataTable.Cell numeric>{parsedDataXY['total'][0].description}</DataTable.Cell>
            </DataTable.Row>
        </View>
      );
    }
  };
  
  // AN's Accept Button
  const acceptButton = () => {
    return (
      <Button
        style={button}
        onPress={() => acceptButtonFunctionality()}
        mode="contained">
        <Text>Accept</Text>
      </Button>
    );
  };
  // AN's Edit Button
  const editButton = () => {
    return (
      <Button
        style={button}
        onPress={() => editButtonFunctionality()}
        mode="contained">
        <Text>Edit</Text>
      </Button>
    );
  };

  // AN Integrating Jo's function to send the receipt back to the firestore.
  const submitReceipt = async () => {
    const submittedReceipt = await db
      .collection('receipts')
      .add({
        ...acceptedReceipt.current,
        charger: `${user.uid}`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    navigation.navigate('SplitReceipt', {id: submittedReceipt.id})
  }

  //   AN's function to massage parsed receipt data in a form that Jazz is expecting.  However, I have no business name.
  //   After parsedReceipt is massaged into a form Jazz is expecting, send it to db.
  const convertDataToCleanObjectAndSubmitToFirestore = () => {
    let cleanReceipt = {};
    let items = [];
    parsedData.forEach(itemObject => {
      let obj = {};
      let description = itemObject.words.join(' ');
      obj.description = description;
      obj.price = itemObject.price;
      items.push(obj);
    });
    cleanReceipt.items = items;
    // AN set receipt state to clean receipt.
    setReceipt(cleanReceipt);
    // Submit clean receipt to firestore with Jo's function.
    // We need to use useRef here since this isn't getting rendered to the screen.
    // If we don't, the uncleaned receipt will be sent back to the db instead of the clean one.
    acceptedReceipt.current = cleanReceipt;
    submitReceipt();
  };

  const acceptButtonFunctionality = () => {
    convertDataToCleanObjectAndSubmitToFirestore();
  };

  const convertDataToCleanObject = () => {
    let cleanReceipt = {};
    let items = [];
    parsedData.forEach(itemObject => {
      let obj = {};
      let description = itemObject.words.join(' ');
      obj.description = description;
      obj.price = itemObject.price;
      items.push(obj);
    });
    cleanReceipt.items = items;
    // AN set receipt state to clean receipt.
    setReceipt(cleanReceipt);
    return cleanReceipt;
  };

  const editButtonFunctionality = () => {
    const receipt = convertDataToCleanObject();
    navigation.navigate('EditReceipt', {receipt});
  };

  const name = parsedDataXY.name.map((obj) => {
    return obj.description
  }).join(' ')

  return (
    <View style={container}>
      <ScrollView>
        <View>
          <Text style={{fontSize: 35, textAlign: 'center'}}>{name}</Text> 
        </View>
        <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{paddingRight: 30, alignContent: 'flex-start'}} numeric>Quantity</DataTable.Title>
              <DataTable.Title>Item/Meal</DataTable.Title>
              <DataTable.Title numeric>Cost</DataTable.Title>
            </DataTable.Header>
            {displayItemized()}
        </DataTable>
        <View style={bottom}>
          {acceptButton()}
          {editButton()}
        </View>
      </ScrollView>
    </View>
  );
};

export default Itemized;

// AN Basic Styling - will be updated eventually.
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottom: {
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'rgb(227, 100, 20)',
  }
});
