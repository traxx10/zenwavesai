import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const QRCodeScannerScreen = () => {
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Request camera permission
  // useEffect(() => {
  //   const getCameraPermissions = async () => {
  //     const { status } = await ExpoCamera.requestCameraPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   };

  //   getCameraPermissions();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      requestPermission();
    }, [])
  );

  // Handle scan result
  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    Alert.alert('Scan Successful', `QR Code Data: ${data}`);
    // You can handle the scanned data here, e.g. send to server
  };

  // Show loading while requesting permission
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  // Show message if permission denied
  if (permission.status !== 'granted') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.scanner}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      </View>

      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          style={styles.scanAgainButton}
        >
          <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QRCodeScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  scanner: {
    flex: 1,
  },
  scanAgainButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  scanAgainButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
