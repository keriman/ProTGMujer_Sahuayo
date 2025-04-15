import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        {/* Disclaimer Banner - Added for Google Play compliance */}
        <View style={styles.disclaimerBanner}>
          <Text style={styles.disclaimerText}>
            AVISO: Esta aplicación no representa una entidad gubernamental oficial. 
            Es desarrollada por un tercero bajo autorización del Gobierno Municipal de Sahuayo.
          </Text>
        </View>
        
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            defaultSource={require('@/assets/images/logo.png')}
          />
          <Text style={styles.title}>ProTG Mujer</Text>
          <Text style={styles.version}>Versión 1.0.0</Text>
        </View>
        
        {/* Sección para el logo del Gobierno de Sahuayo */}
        <View style={styles.governmentSection}>
          <Text style={styles.governmentTitle}>Una iniciativa en colaboración con:</Text>
          <Image 
            source={require('@/assets/images/LogoSahuayo.png')} 
            style={styles.governmentLogo}
            resizeMode="contain"
          />
          <Text style={styles.governmentSubtitle}>Gobierno de Sahuayo</Text>
          <Text style={styles.governmentYears}>2024-2027</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de esta aplicación</Text>
          <Text style={styles.paragraph}>
            ProTG Mujer es una aplicación desarrollada en colaboración con el{' '}
            <Text style={styles.highlightText}>Gobierno de Sahuayo (2024-2027) </Text>
            diseñada para brindar seguridad y protección a las mujeres 
            en situaciones de emergencia. Con un simple toque, puedes enviar una alerta con tu ubicación 
            actual a los servicios de emergencia.
          </Text>
          
          {/* Información adicional de la fuente gubernamental */}
          <Text style={styles.paragraph}>
            La información y servicios de emergencia son provistos por el Centro de Control,
            Comando, Comunicación y Cómputo (C4) de Sahuayo. Para más información oficial,
            visite el sitio web del gobierno municipal o contacte directamente a las oficinas
            de seguridad pública.
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
        
        {/* Sección del desarrollador */}
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
          
          {/* Enlace al sitio web oficial del gobierno */}
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('https://gob.sahuayomich.gob.mx')}
          >
            <IconSymbol name="globe" size={20} color="#ec4899" />
            <Text style={styles.contactText}>Sitio web oficial del Gobierno de Sahuayo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Política de privacidad y aviso legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Política de Privacidad y Aviso Legal</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('https://gob.sahuayomich.gob.mx/aviso-de-privacidad-protg-mujer/')}
          >
            <IconSymbol name="doc.text" size={20} color="#ec4899" />
            <Text style={styles.contactText}>Consultar Política de Privacidad</Text>
          </TouchableOpacity>
          <Text style={styles.legalText}>
            K-Solutions es responsable del tratamiento de los datos personales recopilados por esta aplicación.
            La información de ubicación solo se utiliza para fines de emergencia y se eliminará después de
            cumplido su propósito de asistencia. Para más información, consulte nuestra política de privacidad.
          </Text>
        </View>
        
        {/* Segundo disclaimer al final para mayor claridad */}
        <View style={styles.disclaimerFooter}>
          <Text style={styles.disclaimerFooterText}>
            AVISO IMPORTANTE: Esta aplicación es desarrollada y mantenida por K-Solutions, una empresa privada,
            y no es un producto oficial del Gobierno de Sahuayo. Si bien colaboramos con las autoridades para
            mejorar la seguridad ciudadana, esta aplicación no representa oficialmente a ninguna entidad gubernamental.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2024 K-Solutions. Todos los derechos reservados
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
  // Estilo para el banner de disclaimer
  disclaimerBanner: {
    backgroundColor: '#f43f5e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  disclaimerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  // Estilos para la sección del gobierno
  governmentSection: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  governmentTitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  governmentLogo: {
    width: 150,
    height: 100,
    marginBottom: 10,
  },
  governmentSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  governmentYears: {
    fontSize: 14,
    color: '#ccc',
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
    marginBottom: 15,
  },
  highlightText: {
    color: '#3b82f6', // Color azul
    fontWeight: 'bold',
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
  legalText: {
    fontSize: 13,
    color: '#999',
    marginTop: 10,
    lineHeight: 18,
  },
  // Estilo para el segundo disclaimer al final
  disclaimerFooter: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  disclaimerFooterText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
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