import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            defaultSource={require('@/assets/images/logo.png')}
          />
          <Text style={styles.title}>ProTG Mujer</Text>
          <Text style={styles.version}>Versión 1.0.0</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de esta aplicación</Text>
          <Text style={styles.paragraph}>
            ProTG Mujer es una aplicación diseñada para brindar seguridad y protección a las mujeres 
            en situaciones de emergencia. Con un simple toque, puedes enviar una alerta con tu ubicación 
            actual a los servicios de emergencia.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo funciona</Text>
          <View style={styles.featureItem}>
            <IconSymbol name="location.fill" size={24} color="#ec4899" />
            <Text style={styles.featureText}>
              Envía tu ubicación en tiempo real a los servicios de emergencia
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol name="timer" size={24} color="#ec4899" />
            <Text style={styles.featureText}>
              Seguimiento de ubicación por 5 minutos para mayor seguridad
            </Text>
          </View>
        </View>
        
        {/* Nueva sección para los datos del desarrollador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desarrollador</Text>
          <View style={styles.featureItem}>
            <IconSymbol name="person.fill" size={24} color="#ec4899" />
            <Text style={styles.featureText}>
              Edson Keri Barrera Mendoza
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol name="briefcase.fill" size={24} color="#ec4899" />
            <Text style={styles.featureText}>
              K-Solutions
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:ekbarreram@gmail.com')}
          >
            <IconSymbol name="envelope.fill" size={20} color="#ec4899" />
            <Text style={styles.contactText}>ekbarreram@gmail.com</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('https://www.k-solutions.com.mx/')}
          >
            <IconSymbol name="globe" size={20} color="#ec4899" />
            <Text style={styles.contactText}>www.k-solutions.com.mx</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:3535316545')}
          >
            <IconSymbol name="phone.fill" size={20} color="#ec4899" />
            <Text style={styles.contactText}>C4 - Emergencias</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2024-2027 Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 15,
    color: '#ccc',
    marginLeft: 10,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 15,
    color: '#ccc',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  copyright: {
    fontSize: 14,
    color: '#666',
  },
});