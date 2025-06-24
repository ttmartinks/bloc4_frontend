# Adaptation Web - React Native

## Modifications apportées pour améliorer la compatibilité web

### Problème résolu
L'application React Native ne permettait pas le scroll avec la souris sur le web. Les composants `ScrollView` ne fonctionnaient pas correctement dans un environnement web.

### Solutions implémentées

#### 1. Ajout de Platform Detection
- Ajout de `Platform` import dans tous les composants avec ScrollView
- Détection conditionnelle de l'environnement web avec `Platform.OS === 'web'`

#### 2. Styles Web pour ScrollView
Ajout de styles spécifiques pour le web dans tous les composants :

```javascript
// Styles spécifiques au web
webScrollView: {
  height: '100vh',
  overflow: 'auto',
},
webContainer: {
  minHeight: '100vh',
},
```

#### 3. Composants modifiés
- ✅ `App.js` - Configuration navigation pour web
- ✅ `Home.js` - ScrollView compatible web
- ✅ `MainPage.js` - ScrollView compatible web
- ✅ `Login.js` - ScrollView compatible web
- ✅ `SignUp.js` - ScrollView compatible web
- ✅ `BreathExercise.js` - ScrollView compatible web
- ✅ `AdminUser.js` - ScrollView compatible web
- ✅ `Ressources.js` - ScrollView compatible web
- ✅ `Ressource.js` - ScrollView compatible web
- ✅ `UserSettings.js` - ScrollView compatible web

#### 4. Fichiers utilitaires créés
- `utils/webStyles.js` - Styles réutilisables pour le web
- `components/WebCompatibleScrollView.js` - Composant wrapper
- `web.css` - Styles CSS globaux pour améliorer l'expérience web
- `index.web.js` - Point d'entrée spécifique au web

### Utilisation
Les modifications sont automatiques et se basent sur la détection de la plateforme. Aucune configuration supplémentaire n'est nécessaire.

### Résultat
- ✅ Scroll fonctionnel avec la souris sur le web
- ✅ Hauteurs correctes pour les conteneurs
- ✅ Barre de défilement personnalisée
- ✅ Compatibilité maintenue avec React Native mobile
