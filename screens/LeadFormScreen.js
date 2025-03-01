import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function LeadFormScreen({ navigation }) {
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location access to fetch coordinates.');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
  };

  const saveLead = async () => {
    if (!businessName || !contactPerson || !phone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const leadData = { businessName, contactPerson, phone, address, location, comments };

    try {
    //   await axios.post('YOUR_BACKEND_API_URL/add-lead', leadData);
      await axios.post('http://localhost:5000/add-lead', leadData);
      Alert.alert('Success', 'Lead saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save lead.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Business Name" value={businessName} onChangeText={setBusinessName} />
      <TextInput style={styles.input} placeholder="Contact Person" value={contactPerson} onChangeText={setContactPerson} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Comments" value={comments} onChangeText={setComments} />
      <Button title="Get Location" onPress={getLocation} />
      <Button title="Save Lead" onPress={saveLead} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
