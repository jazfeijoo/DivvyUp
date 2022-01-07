export const receiptParserXY = function (gcp){
    //INITIALIZE:
    //let receipt = {name: [], items: [], total: [] }
    const unsortedReceiptArray = gcp[0] //[0]['textAnnotations'].splice(1)
    console.log('GCP OBJ: ', unsortedReceiptArray, 'TYPE', typeof unsortedReceiptArray)
    return {'type': typeof gcp[0],'obj': unsortedReceiptArray}
const receiptArray = sortReceipt(unsortedReceiptArray) 
const textHeightFreqArray = Object.entries(mapFreq(receiptArray)['textHeight'])
const startXfreqArray = Object.entries(mapFreq(receiptArray)['textStartX'])
const groupStartXfreq = groupSequences(startXfreqArray)
//CONSTANTS CALCULATED:
const baseMaxTextSize = Number(textHeightFreqArray[textHeightFreqArray.length - 1][0])
const baseQuantStartX = Number(findMostFreq3XVals(groupStartXfreq)[0][1][0][0])
const basePriceStartX = Number(findMostFreq3XVals(groupStartXfreq)[groupStartXfreq.length-1][1][0][0])
//DEVIATION ALLOWED:
let margin = 30
let Ymargin = 10

for (let i=0; i< receiptArray.length; i++){
    let textObj = receiptArray[i]
    let textVert = textObj['boundingPoly']['vertices']
    let currHeight = textVert[3]['y']-textVert[1]['y']
    let currStartX = textVert[1]['x']
    if (!receipt.name.length){
        if ( baseMaxTextSize - Ymargin <= currHeight && currHeight <= baseMaxTextSize + Ymargin ){
            receipt.name.push(textObj)  
        }

    } else {

        if (receipt.name[receipt.name.length-1] === receiptArray[i-1]){
            if ( baseMaxTextSize - Ymargin <= currHeight && currHeight <= baseMaxTextSize + Ymargin ){
                receipt.name.push(textObj)  
            }
        } 
        //NAME COMPLETED. PENDING: TIME, ITEMS, TAX, TOTAL
        else {
            // START TO FIND TIME BEFORE SEARCHING FOR OBJECTS!
            if(!receipt.time){
                if (validateTime(textObj.description.trim())){
                    if (textObj.description.trim().length <= 8){
                        receipt.time = [receiptArray[i-1].description, textObj.description]
                        if (textObj.description.trim().length === 5){
                            receipt.time.push(receiptArray[i+1].description)
                        }
                    } else {
                        receipt.time = [].push(textObj.description)
                    }
                }                   
            } else {
                //TIME FOUND. SEARCH FOR ITEMS!
                const items = receipt.items
                 if (!items.length || items[items.length-1].price){
                    if(baseQuantStartX - margin <= currStartX && currStartX <= baseQuantStartX + margin ){   
                    //CREATE ITEM OBJECT W/ QUANT: 
                        if (validateQuant(textObj.description.trim())) {
                        items.push({quantity: textObj.description, description: []})
                        }
                    }
                } 
                //COMPLETE ITEM: ADD DESC & PRICE
                else {
                    if (basePriceStartX - margin <= currStartX && currStartX <= basePriceStartX + margin){
                        if(validatePrice(textObj.description.trim())){
                        items[items.length-1].price = textObj.description
                        }
                    } else {
                        items[items.length-1].description.push(textObj.description)
                    }
                }
            } //TIME 
        } //NAME
    } 
    if (receipt.items.length){
        if (!receipt.tax){
            if (receiptArray[i-1].description.toLowerCase() === 'tax' && validatePrice(textObj.description.trim())){
                    receipt.tax = textObj
            }
        } else {
            if (receiptArray[i-1].description.toLowerCase() === 'total' && validatePrice(textObj.description.trim())){ 
                    receipt.total = textObj
            }
        }
    }
}
return receipt
}

//ALL HELPER FUNCTIONS ARE INCLUDED BELOW: 

//HELPER FUNCTION: STEP 1- sort all receipts (in case it's not already sorted)
function sortReceipt(array) {
    // const receiptArray = gcpOutput2[0]['textAnnotations'].splice(1)
     array.sort((a,b) => {
     let aYStart = a['boundingPoly']['vertices'][1]['y']
     let bYStart = b['boundingPoly']['vertices'][1]['y']
     return aYStart - bYStart
     })
     array.sort((a,b) =>{
         let aXStart = a['boundingPoly']['vertices'][1]['x']
         let bXStart = b['boundingPoly']['vertices'][1]['x']
         let aYStart = a['boundingPoly']['vertices'][1]['y']
         let bYStart = b['boundingPoly']['vertices'][1]['y']
         if (aYStart - bYStart <= 20){
             return aXStart - bXStart   
         }
     })
     return array
 }
 
 //HELPER FUNCTION: VALIDATE PRICE (DATA TYPEOF/FORMAT)
 function validatePrice(str){
     var regExp = new RegExp("^\-?[0-9]+([\,|\.]{0,1}[0-9]{2}){0,1}$");
     var isValid = regExp.test(str)
     return isValid;
 }
 
 //HELPER FUNCTION: VALIDATE DESC IS A NUMBER FLOAT TYPE (FOR QUANT)
 function validateQuant(str) {
     var regExp = new RegExp("^\\d+$");
     var isValid = regExp.test(str); // or just: /^\d+$/.test(strNumber);
     return isValid;
 }
 
 function validateTime(str) {
     var regExp = new RegExp("^.*\-?([0-9]{2}[\:][0-9]{2}).*\($| *s*([AaPp][Mm]))$")
     var isValid = regExp.test(str); 
     return isValid;
 }
 
 //HELPER FUNCTION: MAP OF FREQUENCY
 function mapFreq(receiptArray){
     let textHeight = {}
     let textStartX = {}
     for(let i=0; i< 55; i++){
         let currText = receiptArray[i] 
         let currVert = currText['boundingPoly']['vertices']
         let height = currVert[3]['y']-currVert[1]['y']
         let currStartX = currVert[1]['x']
         textHeight[height] ?  textHeight[height] ++ :  textHeight[height] = 1   
         if(validateQuant(currText.description) || validatePrice(currText.description)){
             textStartX[currStartX] ? textStartX[currStartX] ++ :  textStartX[currStartX] = 1  
         }
     }
     return {textHeight, textStartX}
 }
 
 //HELPER FUNCTION: GROUP STARTXFREQ w/ deviation MARGIN 
 function groupSequences (array, margin = 6) {
     return array.reduce((arr, val, i, a=[]) => {
         if (!i || Number(val[0]) - a[i - 1][0] >= margin) {arr.push([])}
         arr[arr.length - 1].push(val);
         return arr;
       }, []).reduce((acc, currVal) => {
         if(currVal.length > 1) acc.push(currVal);
         return acc
     }, [])
 }
 
 //HELPER FUNC: FIND 3 MOST FREQ (quant=0, item=1, price=2)
 function findMostFreq3XVals(groupStartXfreq) {
     return groupStartXfreq.map((entry) => {
        const sumFreq = entry.reduce((accum, val) => {
             accum += val[1]
             return accum
         },0)
         return [sumFreq, entry]
     })
     .sort().reverse().slice(0,3).sort((a,b) => {
         let aX = Number(a[1][0][0]) 
         let bX = Number(b[1][0][0]) 
         if (aX < bX){
             return -1
         } 
         if (aX > bX){
             return 1
         }
         return 0
     })
 }