# CESIZen Frontend - Documentation Technique

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Application mobile de bien-être mental développée en React Native avec Expo, déployée sur GitHub Pages.

## 📋 Table des matières

- [Architecture](#architecture)
- [Installation](#installation)
- [Développement Local](#développement-local)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Sécurisation](#sécurisation)
- [Monitoring](#monitoring)
- [API](#api)
- [Structure du Projet](#structure-du-projet)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture

### Stack Technique
- **Framework**: React Native + Expo SDK
- **Navigation**: React Navigation 6
- **State Management**: React Hooks + AsyncStorage
- **HTTP Client**: Fetch API
- **Monitoring**: Sentry
- **Déploiement**: GitHub Pages (version web)

### Compatibilité
- **Mobile**: iOS / Android (via Expo Go)
- **Web**: Tous navigateurs modernes
- **Responsive**: Adaptation automatique mobile/web

## 🚀 Installation

### Prérequis
```bash
node >= 16.0.0
npm >= 8.0.0
expo-cli
```

### Setup Initial
```bash
# Cloner le repository
git clone <repository-url>
cd bloc_4_frontend

# Installer les dépendances
npm install

# Installer Expo CLI globalement
npm install -g expo-cli
```

### Variables d'Environnement
Créer un fichier `.env` :
```env
REACT_APP_API_URL=https://your-api-url.herokuapp.com
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## 💻 Développement Local

### Démarrage
```bash
# Mode développement Expo
expo start

# Mode web spécifique
expo start --web

# Build web pour test local
expo export --platform web
npx serve dist
```

### Accès
- **Metro Bundler**: http://localhost:19002
- **Web**: http://localhost:19006
- **Mobile**: Scanner QR code avec Expo Go

### Hot Reload
- Modifications automatiquement reflétées
- Shake device ou Ctrl+M pour debug menu
- Console logs dans Metro Bundler

## 🧪 Tests

### Tests Locaux
```bash
# Test de build web
expo export --platform web

# Servir localement
npx serve dist --port 3000
```

### Validation Cross-Platform
```bash
# Test iOS Simulator
expo start --ios

# Test Android Emulator  
expo start --android

# Test Web
expo start --web
```

## 🚀 Déploiement

### Pipeline CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Test branch naming
        run: echo ${{ github.ref }} | grep -E '^refs/heads/(feature|bugfix|hotfix)/'
      - name: Run SonarQube analysis
        uses: sonarqube-quality-gate-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build for web
        run: expo export --platform web
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Processus de Déploiement
1. **Pull Request** → Tests automatiques (nommage + SonarQube)
2. **Merge sur main** → Build automatique
3. **Export Expo web** → Génération des fichiers statiques
4. **GitHub Pages** → Déploiement automatique

### Environments
- **Development**: Feature branches
- **Staging**: Pull Requests
- **Production**: Main branch → GitHub Pages

## 🔒 Sécurisation

### Variables Sensibles
```javascript
// Stockage sécurisé avec GitHub Secrets
process.env.REACT_APP_API_URL
process.env.REACT_APP_SENTRY_DSN
```

### Authentification
```javascript
// JWT Token Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stockage sécurisé du token
await AsyncStorage.setItem('token', jwtToken);

// Récupération pour les appels API
const token = await AsyncStorage.getItem('token');
```

### Communications
- **HTTPS Obligatoire**: Toutes les communications chiffrées
- **CORS**: Configuration sécurisée côté API
- **Headers Security**: Content-Type validation

### Protection du Code
- **Branches protégées**: Pas de push direct sur main
- **Pull Request obligatoire**: Revue systématique
- **Tests automatiques**: Validation avant merge

## 📊 Monitoring

### Sentry Configuration
```javascript
// utils/config_sentry.js
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
  autoSessionTracking: true,
});
```

### Métriques Surveillées
- **Erreurs JavaScript**: Capture automatique
- **Performance**: Temps de chargement
- **Crashes**: React Error Boundaries
- **User Actions**: Breadcrumbs
- **Network Errors**: Échecs API

### Alertes Configurées
- Taux d'erreur > 5%
- Temps de chargement > 3s
- Crashes fréquents
- Erreurs réseau répétées

## 🔌 API

### Configuration
```javascript
// API Base URL
const API_URL = process.env.REACT_APP_API_URL;

// Headers par défaut
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Endpoints Principaux
```javascript
// Auth
POST /auth/login
POST /auth/register
POST /auth/logout

// Users
GET /users/profile
PUT /users/profile
DELETE /users/account

// Resources
GET /resources
GET /resources/:id
POST /resources/:id/favorite

// Admin
GET /admin/users
DELETE /admin/users/:id
```

### Gestion d'Erreurs
```javascript
try {
  const response = await fetch(`${API_URL}/endpoint`, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## 📁 Structure du Projet

```
bloc_4_frontend/
├── components/              # Composants React Native
│   ├── Home.js             # Page d'accueil
│   ├── Login.js            # Authentification
│   ├── MainPage.js         # Dashboard principal
│   ├── BreathExercise.js   # Exercices de respiration
│   ├── Ressources.js       # Liste des ressources
│   └── UserSettings.js     # Paramètres utilisateur
├── fetch/                  # Appels API
│   ├── fetchAuth.js        # Authentification
│   ├── fetchUsers.js       # Gestion utilisateurs
│   └── fetchRessources.js  # Ressources
├── utils/                  # Utilitaires
│   ├── config_sentry.js    # Configuration Sentry
│   └── constants.js        # Constantes
├── assets/                 # Images et médias
├── .env                    # Variables d'environnement
├── app.json               # Configuration Expo
├── package.json           # Dépendances
└── App.js                 # Point d'entrée
```

## 🐛 Troubleshooting

### Problèmes Fréquents

#### Build Failed
```bash
# Nettoyer le cache
expo start --clear

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

#### Platform Specific Issues
```javascript
// Détection de plateforme
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: { overflow: 'auto' },
      default: { flex: 1 }
    })
  }
});
```

#### Network Errors
```javascript
// Vérification de connectivité
import NetInfo from '@react-native-async-storage/async-storage';

const checkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
```

### Debug Mode
```bash
# Activer les logs détaillés
expo start --verbose

# Debug React Native
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

### Performance Issues
```javascript
// Optimisation des listes
import { FlatList, VirtualizedList } from 'react-native';

// Lazy loading des composants
const LazyComponent = React.lazy(() => import('./Component'));
```

## 📚 Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Guide](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Projet développé dans le cadre de la formation CESI - Bloc 4
