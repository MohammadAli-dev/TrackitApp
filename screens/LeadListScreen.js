import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function LeadListScreen({ navigation }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
    //   const response = await axios.get('YOUR_BACKEND_API_URL/get-leads');
      const response = await axios.get('http://localhost:5000/get-leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.phone}
        renderItem={({ item }) => (
          <View style={styles.leadItem}>
            <Text style={styles.leadText}>{item.businessName} - {item.contactPerson}</Text>
            <Text>{item.phone}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('LeadForm')}>
        <Text style={styles.addButtonText}>+ Add Lead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  leadItem: { padding: 10, borderBottomWidth: 1 },
  leadText: { fontWeight: 'bold' },
  addButton: { backgroundColor: 'blue', padding: 10, marginTop: 10, alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 16 },
});
