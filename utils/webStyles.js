import { Platform } from 'react-native';

// Styles communs pour le web
export const webStyles = {
  scrollView: {
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    minHeight: '100vh',
  },
  fullHeightContainer: {
    height: '100vh',
    overflow: 'hidden',
  },
  scrollableContent: {
    height: '100%',
    overflow: 'auto',
  }
};

// Fonction helper pour appliquer conditionnellement les styles web
export const applyWebStyles = (baseStyle, webStyle) => {
  return Platform.OS === 'web' ? [baseStyle, webStyle] : baseStyle;
};

// Fonction pour créer un ScrollView compatible web
export const createWebCompatibleScrollView = (contentContainerStyle, additionalProps = {}) => {
  const isWeb = Platform.OS === 'web';
  
  return {
    style: isWeb ? webStyles.scrollView : undefined,
    contentContainerStyle: isWeb 
      ? [contentContainerStyle, webStyles.container] 
      : contentContainerStyle,
    ...additionalProps
  };
};
