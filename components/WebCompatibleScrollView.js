import React from 'react';
import { ScrollView, Platform, StyleSheet } from 'react-native';

const WebCompatibleScrollView = ({ 
  children, 
  contentContainerStyle, 
  style, 
  ...otherProps 
}) => {
  const isWeb = Platform.OS === 'web';
  
  return (
    <ScrollView
      style={[
        isWeb && styles.webScrollView,
        style
      ]}
      contentContainerStyle={[
        contentContainerStyle,
        isWeb && styles.webContentContainer
      ]}
      {...otherProps}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  webScrollView: {
    height: '100vh',
    overflow: 'auto',
  },
  webContentContainer: {
    minHeight: '100vh',
    flexGrow: 1,
  },
});

export default WebCompatibleScrollView;
