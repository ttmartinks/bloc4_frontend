import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native';

export default function Home({ navigation }) {
  const isWeb = Platform.OS === 'web';
  
  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container,
        isWeb && styles.webContainer
      ]} 
      keyboardShouldPersistTaps="handled"
      style={isWeb ? styles.webScrollView : undefined}
    >
      <View style={styles.content}>
        <Image source={require('../assets/img/logo_cesizen_big.png')} style={styles.logo_cesi} />

  <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.anonymousButton} onPress={() => navigation.navigate('MainPage')}>
          <Text style={styles.anonymousText}>Continuer en tant qu’anonyme</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/img/leaf_bottom_page.png')} style={styles.logo_bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  logo_cesi: {
    marginBottom: 20,
  },
  logo_bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    resizeMode: 'contain',
    zIndex:-99
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 25,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 50,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  anonymousButton: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    paddingVertical: 25,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginVertical: 10,
    marginTop: 50,
  },
  anonymousText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles spécifiques au web
  webScrollView: {
    height: '100vh',
    overflow: 'auto',
  },
  webContainer: {
    minHeight: '100vh',
  }
});