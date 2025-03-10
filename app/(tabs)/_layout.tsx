import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#000', 
          borderTopColor: 'transparent' 
        },
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={24} />
          )
        }} 
      />
      <Tabs.Screen 
        name="profiles" 
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" color={color} size={24} />
          )
        }} 
      />
      <Tabs.Screen 
        name="about" 
        options={{
          title: 'Acerca de',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="info" color={color} size={24} />
          )
        }} 
      />
    </Tabs>
  );
}