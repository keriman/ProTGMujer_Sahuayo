import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [db, setDb] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Usuario de ProTG Mujer',
    phone: '',
    email: '',
    address: '',
    imageUri: null,
  });
  const [originalProfile, setOriginalProfile] = useState({...profile});

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Abrir la base de datos
        const database = await SQLite.openDatabaseAsync('protgmujer.db');
        setDb(database);

        // Crear tabla si no existe
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY NOT NULL, 
            name TEXT, 
            phone TEXT, 
            email TEXT, 
            address TEXT
          );
        `);

        // Cargar datos existentes
        await loadProfileData(database);
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
      }
    };

    initializeDatabase();
  }, []);

  const loadProfileData = async (database) => {
    try {
      // Intentar cargar imagen desde AsyncStorage
      const imageUri = await AsyncStorage.getItem('profile_image');
      if (imageUri) {
        setProfile(prev => ({...prev, imageUri}));
        setOriginalProfile(prev => ({...prev, imageUri}));
      }

      // Cargar datos del perfil desde SQLite
      const results = await database.getAllAsync(
        'SELECT * FROM profile WHERE id = 1'
      );

      if (results.length > 0) {
        const data = results[0];
        const updatedProfile = {
          name: data.name || 'Usuario de ProTG Mujer',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          imageUri: profile.imageUri,
        };
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const saveProfileData = async () => {
    if (!db) {
      Alert.alert('Error', 'Base de datos no inicializada');
      return;
    }

    try {
      // Guardar datos en SQLite
      await db.runAsync(
        'INSERT OR REPLACE INTO profile (id, name, phone, email, address) VALUES (1, ?, ?, ?, ?)',
        [profile.name, profile.phone, profile.email, profile.address]
      );

      // Guardar imagen en AsyncStorage si es nueva
      if (profile.imageUri !== originalProfile.imageUri) {
        await AsyncStorage.setItem('profile_image', profile.imageUri);
      }
      
      Alert.alert('Éxito', 'Perfil guardado correctamente');
      setOriginalProfile({...profile});
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando perfil:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil');
    }
  };

  const cancelEditing = () => {
    setProfile({...originalProfile});
    setIsEditing(false);
  };

  const pickImage = async () => {
    if (!isEditing) return;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfile(prev => ({...prev, imageUri: result.assets[0].uri}));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={pickImage}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            <Image 
              source={profile.imageUri 
                ? {uri: profile.imageUri} 
                : require('@/assets/images/default-avatar.png')
              } 
              style={styles.avatar}
              defaultSource={require('@/assets/images/default-avatar.png')}
            />
            {isEditing && (
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>Editar</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={profile.name}
              onChangeText={(text) => setProfile(prev => ({...prev, name: text}))}
              placeholder="Nombre"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.name}>{profile.name}</Text>
          )}
          
          <Text style={styles.description}>Información personal</Text>
        </View>
        
        <View style={styles.infoSection}>
          <EditableInfoItem 
            title="Teléfono" 
            value={profile.phone} 
            isEditing={isEditing}
            onChangeText={(text) => setProfile(prev => ({...prev, phone: text}))}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
          />
          
          <EditableInfoItem 
            title="Correo" 
            value={profile.email} 
            isEditing={isEditing}
            onChangeText={(text) => setProfile(prev => ({...prev, email: text}))}
            placeholder="Ingresa tu correo electrónico"
            keyboardType="email-address"
          />
          
          <EditableInfoItem 
            title="Dirección" 
            value={profile.address} 
            isEditing={isEditing}
            onChangeText={(text) => setProfile(prev => ({...prev, address: text}))}
            placeholder="Ingresa tu dirección"
            multiline={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={cancelEditing}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveProfileData}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar perfil</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function EditableInfoItem({ 
  title, 
  value, 
  isEditing, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default', 
  multiline = false 
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoTitle}>{title}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.infoInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#777"
          keyboardType={keyboardType}
          multiline={multiline}
        />
      ) : (
        <Text style={styles.infoValue}>{value || '---'}</Text>
      )}
    </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#ec4899",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(236, 72, 153, 0.7)',
    paddingVertical: 5,
    alignItems: 'center',
  },
  editBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ec4899',
    paddingBottom: 5,
    width: '80%',
  },
  description: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  infoTitle: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  infoInput: {
    fontSize: 16,
    color: 'white',
    flex: 2,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#ec4899',
    paddingBottom: 5,
  },
  multilineInput: {
    minHeight: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#ec4899',
  },
  saveButton: {
    backgroundColor: '#10b981', // verde
  },
  cancelButton: {
    backgroundColor: '#6b7280', // gris
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;