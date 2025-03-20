import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisclaimerModal = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    checkFirstTime();
  }, []);
  
  const checkFirstTime = async () => {
    try {
      const hasSeenDisclaimer = await AsyncStorage.getItem('hasSeenDisclaimer');
      if (hasSeenDisclaimer !== 'true') {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking first time status:', error);
      // Si hay algún error, mostramos el disclaimer por seguridad
      setVisible(true);
    }
  };
  
  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem('hasSeenDisclaimer', 'true');
      setVisible(false);
    } catch (error) {
      console.error('Error saving disclaimer status:', error);
      setVisible(false);
    }
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.warningTitle}>AVISO IMPORTANTE</Text>
          </View>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.modalText}>
            Esta aplicación <Text style={styles.highlight}>NO es una entidad gubernamental oficial</Text>. 
          </Text>
          
          <Text style={styles.modalText}>
            ProTG Mujer es desarrollada y mantenida por K-Solutions, una empresa privada, 
            en colaboración con el Gobierno Municipal de Sahuayo.
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.modalSubText}>
            Aunque trabajamos en coordinación con las autoridades de Sahuayo para mejorar la seguridad
            ciudadana, esta aplicación no representa oficialmente a ninguna entidad gubernamental.
          </Text>
          
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>Entiendo y Acepto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#222',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    backgroundColor: '#f43f5e',
    padding: 15,
    alignItems: 'center',
  },
  warningTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 22,
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#aaa',
    paddingHorizontal: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  highlight: {
    color: '#f43f5e',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  acceptButton: {
    backgroundColor: '#ec4899',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    elevation: 2,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DisclaimerModal;