# DIVVYUP - Solo 

## Description

A mobile app that splits the bill for you. Just take a picture of your receipt, add number of people & method of splitting, and submit your charge requests.
This is a forked version where I worked on creating an improved receipt parser. The original receipt parsing function, only referenced the x-axis to parse the Google Vision API receipt data. This created limitations to our original app. The original receipt parser could only accept basic receipt formats and could not identify additional information such as the name of the businesss, total cost, and date/time. The receipt parsing function I coded uses both the x-axis and y-axis in order to collect more datapoints and accept more complex receipt formats.   

## Testing

npm install
expo start

## Building

npm install

## Features

- New users can sign up and current users can securely login to access their account
- Users have the ability to upload a receipt by taking a picture on their device camera or uploading from their photo gallery
- Users can either accept the parsed receipt data
- Users have the option to not accept the parsed receipt data and edit the price amounts for each item
- Once receipt data is accepted, users can provide number of people and can choose them method of splitting (evenly/itemzed)
- For itemized split bills, users can assign a chargee to individual items
- Users will be redirected to a final confirmation page, displaying the charge amounts by person

## Tech Stack

- React-Native framework for ios mobile application
- Firebase Firestore for receipt & user database
- Firebase Authentication for secured user signup/login
- Expo camera for accessing device photo gallery & camera
- Expo to quick start the app and test in real time
- Google Vision API for OCR text recognition

