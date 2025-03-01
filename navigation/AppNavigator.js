import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LeadFormScreen from '../screens/LeadFormScreen';
import LeadListScreen from '../screens/LeadListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LeadList">
        <Stack.Screen name="LeadList" component={LeadListScreen} options={{ title: 'Leads' }} />
        <Stack.Screen name="LeadForm" component={LeadFormScreen} options={{ title: 'Add Lead' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
