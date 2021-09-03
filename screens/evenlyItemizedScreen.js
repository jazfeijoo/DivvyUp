import React, {useState, useRef, useContext} from 'react';
import Header from './header';
import { db } from '../config/firebase';
import {AuthenticatedUserContext} from '../navigation/AuthenticatedUserProvider';
import { StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback, Keyboard, Modal, FlatList } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {TextInput, Button, Chip, Checkbox, List } from 'react-native-paper'; 


function evenlyItemizedScreen({route, navigation}) {
    const {img, container, text, button, textInput} = styles;
    const { id } = route.params;
    const [modalOpen, setModalOpen] = useState(false);
    const [receiptItems, setItems] = useState([]);
    const [chargees, setChargees] = useState([]);

    // const {user} = useContext(AuthenticatedUserContext);
    // const chargerId = user.uid;
    const getMostRecent = async () => {
      // Make the initial query
      const query = await db
        .collection('receipts') 
        .doc(id)
        .get();

      const data = query.data();

      totalPrice = data.items.find(
        ({description}) => description.toLowerCase() === 'total');
      let perPersonCharge =  splitFunctionality()
      
      const chargees = new Array(Number(numPeople.current)).fill({name: 'chargee', amountOwed: perPersonCharge});
      // console.log(chargees);
      navigation.navigate('AmountOwed', {chargeesProp: chargees, id: id});
    }
    
    //this needs to happen when itemized button is pressed
    const getReceiptAndChargees = async () => {
      const query = await db
        .collection('receipts')
        .doc(id)
        .get();
        
      const data = query.data();
      // console.log('what is itemized receipt', data);
      setItems(data.items);

      numPeople.current = tempPeople;
      let chargeesObj = new Array(Number(numPeople.current)).fill({name: 'chargee', amountOwed: 0});
      // console.log('what is itemized chargees', chargeesObj)
      setChargees(chargeesObj);

      //modalOpen needs to be called here so we can use the data above
      showModal();
    }

    const assignItemized = () => {

      //then hideModal needs to be called here so we can complete the assignment and review charges in next screen
      hideModal();
      navigation.navigate('AmountOwed', {chargeesProp: chargees, id: id})
    }


    let totalPrice
    const splitFunctionality = () => {
      numPeople.current = tempPeople;
      let split = totalPrice.price / numPeople.current;
      return split;
    }

    //setting the initial state 
    const numPeople = useRef(0)
    const [tempPeople, setTempPeople] = useState(0);
    
    //function to set the temp number to the number of people
    const tempNumber = people => {
      setTempPeople(people); 
    }

    //the evenly button takes numPeople set in state and calls the splitFunctionaly function
    const evenlyButton = () =>{
      return (
        <Button color='#000029' onPress={getMostRecent} mode='contained'>
          <Text>Evenly</Text>
        </Button>
      )
    }

    const showModal = () => setModalOpen(true);
    const hideModal = () => setModalOpen(false);
    const itemizedButton = () =>{
      // console.log('inside itemized button')
      return(
        <Button color='#000029' onPress={getReceiptAndChargees}  mode='contained'>
          <Text>Itemized</Text>
        </Button>
      )
    }

    const ItemizedModal = () => {
      // onClick=(index)=>{
      //   const temp = this.state.data.slice()
      //   temp[index].value = !temp[index].value
      //   this.setState({data: temp})
      // } 

      const [checked, setChecked] = useState(false);

      const AccordionList = () => (
        <List.Section title="Assign Receipt Items">
          {receiptItems.map((item, index) => (
            <List.Accordion title={item.description} key={index}>
              {chargees.map((chargee, index) => (
                <Checkbox.Item 
                  key={index}
                  label={chargee.name} 
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => setChecked(!checked)} 
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      )

      return (
        <Modal 
          animationType="slide"
          visible={modalOpen}
          transparent={true}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.content}>
                <AccordionList />
              </View>
              <Button color='#000029' mode='contained' onPress={hideModal}>
                Go Back
              </Button>
              <Button color='#000029' mode='contained' onPress={assignItemized}>
                Complete Assignments
              </Button>
            </View>
          </View>
        </Modal>
      )
    }

    return (
      <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
        <View style={container}>
          <ImageBackground
            style={img}
            source={require('../assets/divvyup-background.jpg')}
            resizeMode="cover"
          >
            <ItemizedModal/>
            <Header />
            <View style={text}>
              <Text style={text}>Number of People:</Text>
            </View>
            <TextInput 
              style={textInput} 
              placeholder="enter number" 
              onChangeText={tempNumber} 
              keyboardType="number-pad"
            ></TextInput>
            <View style={button} > 
                {evenlyButton()}
                {itemizedButton()}
            </View>
          </ImageBackground>
        </View> 
      </TouchableWithoutFeedback>  
    );
}

export default evenlyItemizedScreen;


const styles = StyleSheet.create({
    button: {
      marginBottom: 12,
      paddingVertical: 16,
      paddingHorizontal: 40,
      justifyContent: 'space-between',
      flexDirection: 'row',
      color: '#000029',
      marginBottom: 150
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Lato_400Regular',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      flex:1, 
    },
    img: {
      flex: 1,
      justifyContent: 'center'
    }, 
    text: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Lato_400Regular',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    textInput:{
        marginBottom: 10,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: "80%",
      height: "75%",
      alignItems: "center",  
      justifyContent: "center",
      backgroundColor: 'pink',
      // backgroundColor: '#2d3142',
    },
    modalText: {
      fontSize: 20
    },
    content: {
      padding: 40,
      paddingTop: 10,
      paddingBottom: 40,
      flex: 1 ,
      backgroundColor: 'yellow',
    },
  })