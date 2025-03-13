import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import EmergencyButton from '@/components/EmergencyButton';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Disclaimer Banner - Added for Google Play compliance */}
      <View style={styles.disclaimerBanner}>
        <Text style={styles.disclaimerText}>
          Esta aplicación no es una entidad gubernamental oficial
        </Text>
      </View>
      
      <View style={styles.container}>
        <EmergencyButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Estilo para el banner de disclaimer
  disclaimerBanner: {
    backgroundColor: '#f43f5e',
    padding: 8,
    alignItems: 'center',
  },
  disclaimerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});