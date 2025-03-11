import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Animated } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';

// URL del servidor
const SERVER_URL = 'https://sahuayo-c4.ngrok.app/PROTG/post_alert.php';
const TRACKING_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

const EmergencyButton = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [helpMessage, setHelpMessage] = useState(false); // Estado para el mensaje de "ayuda en camino"
  const [profileData, setProfileData] = useState({
    name: 'Usuario de ProTG Mujer',
    phone: 'Emergencia Móvil'
  });
  
  // Referencias para los temporizadores y suscripciones
  const intervalRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const trackingTimerRef = useRef(null);
  const helpMessageTimerRef = useRef(null); // Referencia para el timer del mensaje
  
  // Animación para el punto parpadeante
  const blinkAnim = useRef(new Animated.Value(0.4)).current;

  // Cargar los datos del perfil desde SQLite
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('protgmujer.db');
        
        const results = await db.getAllAsync(
          'SELECT * FROM profile WHERE id = 1'
        );

        if (results.length > 0) {
          const data = results[0];
          setProfileData({
            name: data.name || 'Usuario de ProTG Mujer',
            phone: data.phone || 'Emergencia Móvil'
          });
        }
      } catch (error) {
        console.error('Error cargando datos del perfil:', error);
      }
    };

    loadProfile();
  }, []);

  // Configurar la animación de parpadeo
  useEffect(() => {
    let animationLoop;
    
    if (isTracking) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(blinkAnim, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true
          })
        ])
      );
      animationLoop.start();
    } else {
      blinkAnim.setValue(0.4);
    }
    
    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [isTracking, blinkAnim]);

  // Solicitar permisos de ubicación al cargar el componente
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          "Permiso denegado",
          "La aplicación necesita acceso a la ubicación para enviar alertas de emergencia.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  // Efecto para manejar el inicio y fin del seguimiento
  useEffect(() => {
    // Cuando isTracking cambia a true, iniciamos el temporizador
    if (isTracking) {
      startPeriodicUpdates();
      
      // Configurar el temporizador para finalizar después de 5 minutos
      trackingTimerRef.current = setTimeout(() => {
        stopTracking();
        Alert.alert("Fin de seguimiento", "El período de 5 minutos de envío de ubicación ha terminado.");
      }, TRACKING_DURATION);
      
      // Nuevo temporizador para mostrar el mensaje de ayuda a los 6 segundos
      helpMessageTimerRef.current = setTimeout(() => {
        setHelpMessage(true);
        // Ocultamos el mensaje después de 5 segundos
        setTimeout(() => {
          setHelpMessage(false);
        }, 5000);
      }, 6000);
    } else {
      // Si isTracking cambia a false, detener todo el seguimiento
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
      
      if (trackingTimerRef.current) {
        clearTimeout(trackingTimerRef.current);
        trackingTimerRef.current = null;
      }
      
      if (helpMessageTimerRef.current) {
        clearTimeout(helpMessageTimerRef.current);
        helpMessageTimerRef.current = null;
      }
      
      // Asegurarse de que el mensaje de ayuda se oculte si se detiene el seguimiento
      setHelpMessage(false);
    }
    
    // Función de limpieza
    return () => {
      if (trackingTimerRef.current) {
        clearTimeout(trackingTimerRef.current);
        trackingTimerRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
      
      if (helpMessageTimerRef.current) {
        clearTimeout(helpMessageTimerRef.current);
        helpMessageTimerRef.current = null;
      }
    };
  }, [isTracking]);

  // Función para detener todo el seguimiento
  const stopTracking = () => {
    console.log("Deteniendo el seguimiento de ubicación");
    
    // Mostrar mensaje de detención
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
    }, 3000);
    
    // Limpiar el intervalo de forma segura
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Limpiar la suscripción de ubicación
    if (locationSubscriptionRef.current) {
      try {
        locationSubscriptionRef.current.remove();
      } catch (error) {
        console.error("Error al eliminar suscripción de ubicación:", error);
      } finally {
        locationSubscriptionRef.current = null;
      }
    }
    
    // Limpiar el temporizador
    if (trackingTimerRef.current) {
      clearTimeout(trackingTimerRef.current);
      trackingTimerRef.current = null;
    }
    
    // Limpiar el temporizador del mensaje de ayuda
    if (helpMessageTimerRef.current) {
      clearTimeout(helpMessageTimerRef.current);
      helpMessageTimerRef.current = null;
    }
    
    // Ocultar el mensaje de ayuda si está visible
    setHelpMessage(false);
    
    // Por último, actualizar el estado
    setIsTracking(false);
  };

  // Función para iniciar las actualizaciones periódicas
  const startPeriodicUpdates = async () => {
    try {
      // Obtener la ubicación inicial
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      console.log("Ubicación inicial obtenida:", location);
      await sendLocationToServer(location);
      
      // Configurar intervalo para actualizaciones periódicas
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(async () => {
        if (!isTracking) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }
        
        try {
          console.log("Obteniendo nueva ubicación desde el intervalo...");
          const newLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });
          
          await sendLocationToServer(newLocation);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log("Actualización periódica de ubicación enviada");
        } catch (error) {
          console.error("Error al obtener ubicación periódica:", error);
        }
      }, 10000); // Cada 10 segundos
      
      // Configurar watchPosition para actualizaciones basadas en movimiento
      if (locationSubscriptionRef.current) {
        try {
          locationSubscriptionRef.current.remove();
        } catch (error) {
          console.error("Error al eliminar suscripción anterior:", error);
        }
        locationSubscriptionRef.current = null;
      }
      
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,  // 10 segundos
          distanceInterval: 10  // 10 metros
        },
        async (newLocation) => {
          if (!isTracking) return;
          
          console.log("Nueva ubicación detectada por watchPosition");
          await sendLocationToServer(newLocation);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log("Actualización por movimiento enviada");
        }
      );
      
      locationSubscriptionRef.current = subscription;
      
    } catch (error) {
      console.error("Error al iniciar actualizaciones periódicas:", error);
      Alert.alert("Error", "No se pudo configurar el seguimiento de ubicación.");
    }
  };

  // Función para enviar la ubicación al servidor
  const sendLocationToServer = async (location) => {
    // Verificar si el seguimiento aún está activo
    if (!isTracking) {
      console.log("Intento de envío cancelado: el seguimiento ya no está activo");
      return;
    }
    
    try {
      const data = {
        Nombre: profileData.name,
        Telefono: profileData.phone,
        Geo: `${location.coords.latitude},${location.coords.longitude}`,
        timestamp: Math.floor(Date.now() / 1000)
      };
      
      console.log("Enviando datos:", JSON.stringify(data));
      
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseText = await response.text();
      console.log("Respuesta del servidor:", responseText);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status} ${responseText}`);
      }
      
      console.log("Ubicación enviada exitosamente");
    } catch (error) {
      console.error("Error enviando ubicación:", error.message);
      // No detenemos el seguimiento por errores de red, seguiremos intentando
    }
  };

  // Manejar el clic en el botón (iniciar o detener)
  const handleEmergencyPress = () => {
    // Proporcionar feedback háptico
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (isTracking) {
      // Si ya estamos rastreando, detener
      stopTracking();
    } else {
      // Iniciar nuevo rastreo
      // Mostrar alerta de éxito
      setAlertSent(true);
      setTimeout(() => {
        setAlertSent(false);
      }, 3000);
      
      // Iniciar el seguimiento
      setIsTracking(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.card}>
        <Text style={styles.title}>¿Estás en peligro?</Text>
        
        <TouchableOpacity
          style={[
            styles.button,
            isTracking ? styles.stopButton : null
          ]}
          onPress={handleEmergencyPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "DETENER" : "AYUDA"}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.instructionText}>
          {isTracking 
            ? "Presiona el botón para detener la alerta" 
            : "Presiona el botón para emitir una alerta al C4"}
        </Text>
      </View>
      
      {/* Indicador de seguimiento */}
      {isTracking && (
        <View style={styles.trackingIndicator}>
          <Animated.View 
            style={[
              styles.trackingDot, 
              { opacity: blinkAnim }
            ]} 
          />
          <Text style={styles.trackingText}>Enviando ubicación</Text>
        </View>
      )}
      
      {/* Mensaje de alerta */}
      {alertSent && (
        <View style={styles.alertMessage}>
          <Text style={styles.alertText}>
            {isTracking ? "Alarma enviada exitosamente" : "Alarma detenida"}
          </Text>
        </View>
      )}
      
      {/* Nuevo mensaje de ayuda en camino */}
      {helpMessage && (
        <View style={styles.helpMessage}>
          <Text style={styles.helpMessageText}>
            Acabamos de recibir tu solicitud, la ayuda está en camino
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  stopButton: {
    backgroundColor: '#f43f5e', // Un rojo más intenso para indicar detención
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  instructionText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 16,
  },
  trackingIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    backgroundColor: '#ec4899',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  trackingText: {
    color: 'white',
    fontSize: 12,
  },
  alertMessage: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  alertText: {
    color: 'white',
  },
  // Estilos para el nuevo mensaje de ayuda
  helpMessage: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: '#ec4899',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  helpMessageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default EmergencyButton;