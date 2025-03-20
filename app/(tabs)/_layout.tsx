import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';

export default function TabLayout() {
  // Definimos una función para la configuración consistente del StatusBar
  const setConsistentStatusBar = () => {
    // Usamos esta función para garantizar que se aplique la misma configuración
    // independientemente de a qué pestaña naveguemos
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000');
      StatusBar.setTranslucent(false);
    }
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="black"
        translucent={false}
      />
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
          listeners={{
            tabPress: () => setConsistentStatusBar()
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
          listeners={{
            tabPress: () => setConsistentStatusBar()
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
          listeners={{
            tabPress: () => setConsistentStatusBar()
          }}
        />
      </Tabs>
    </>
  );
}