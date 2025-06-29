BLOC 4 - COMPTE RENDU

CESIZEN:
L'application de votre santé mentale












DUBOSQ Martin
2025













































1. INTRODUCTION

1.1 Présentation du client

Le Ministère de la Santé et de l'Accès aux Soins est une institution publique française au cœur des politiques de santé et de l'accès équitable aux services de soins pour tous les citoyens. Chargé de la gestion des politiques de santé publique, il vise à garantir des soins de qualité, accessibles et adaptés aux besoins de l'ensemble de la population. 
Ce ministère joue un rôle essentiel dans l'amélioration de la santé et la réduction des inégalités sociales et géographiques d'accès aux soins.

1.2 Contexte du projet

Le rythme de vie accéléré, les exigences croissantes et les crises récentes (COVID-19, incertitudes socio-économiques) génèrent un stress chronique et une surcharge mentale. En parallèle, les technologies de santé connectée rendent les outils de bien-être plus accessibles. CESIZen s'appuie sur cette convergence : répondre à un besoin massif d'accompagnement mental via une application mobile simple et disponible partout.

1.3 Objectifs du projet

• Promouvoir le bien-être mental : vulgariser des informations fiables et encourager la prévention.
• Offrir des solutions concrètes : exercices de relaxation, auto-diagnostics, suivi émotionnel.
• Renforcer l'autonomie : contenus et conseils personnalisés selon le profil de chaque utilisateur.
• Démocratiser la santé connectée : interface inclusive pour tous les âges et niveaux tech.
• Créer un impact sociétal durable : faire du bien-être mental une priorité collective.

1.4 Résumé du projet

CESIZen est une appli mobile qui aide chacun à évaluer, comprendre et réduire son stress grâce à des exercices de respiration sur mesure et des ressources pédagogiques. Simple, intuitive et pensée pour un large public, elle veut devenir la référence nationale pour la prévention et la gestion quotidienne du bien-être mental.

2. CONTRAINTES FONCTIONNELLES

2.1 TYPES D'UTILISATEURS

L'application CESIZen s'adresse à trois types d'utilisateurs, chacun disposant de fonctionnalités adaptées à ses besoins spécifiques.

**Visiteur anonyme** : Peut accéder aux ressources et apercevoir les fonctionnalités sans inscription ni création de compte.

**Utilisateur connecté** : Bénéficie de fonctionnalités avancées, comme le suivi personnalisé et l'accès aux outils de gestion du stress.

**Administrateur** : Dispose de droits élargis pour gérer les utilisateurs et les contenus de l'application.

2.2 ATTENTES FONCTIONNELLES GÉNÉRALES

Les besoins fonctionnels de CESIZen s'organisent autour de trois axes principaux :

**Gestion des comptes** : Création, modification et gestion des comptes utilisateurs avec authentification sécurisée.

**Accès à des informations** : Proposer des contenus clairs et accessibles sur la santé mentale, avec des ressources de prévention avec la possibilité d'ajouter en favoris.

**Exercices de respiration** : Intégrer des exercices de cohérence cardiaque configurables en termes de rythme et de durée.

2.3 FONCTIONNALITÉS GESTION DE COMPTES

| Fonctions | Acteurs |
|-----------|---------|
| Création d'un compte utilisateur | Visiteur anonyme |
| Gestion de son compte utilisateur | Utilisateur connecté |
| Réinitialisation de son mot de passe | Utilisateur connecté |
| Désactivation / Suppression d'un compte utilisateur | Administrateur |
| Création des comptes administrateur | Administrateur |

2.4 FONCTIONNALITÉS D'INFORMATIONS

| Fonctions | Acteurs |
|-----------|---------|
| Consultation des pages de contenus | Visiteur anonyme |
| Mettre la ressource en favoris | Utilisateur connecté |
| Création et gestion des ressources | Administrateur |

3. CHOIX TECHNOLOGIQUES

3.1 FRONTEND

React Native avec Expo pour développer une application cross-platform (iOS/Android/Web) :
• **Multiplateforme** : Une seule base de code pour toutes les plateformes
• **Composants natifs** : Performance et expérience utilisateur optimales
• **Écosystème riche** : Large communauté et nombreuses bibliothèques
• **Expo** : Simplification du développement et déploiement

3.2 BACKEND

Node.js avec Express pour une API REST performante :
• **Performance** : Modèle d'exécution non bloquant adapté aux requêtes simultanées
• **Langage unifié** : JavaScript côté frontend et backend
• **Modularité** : Structure claire et modulaire avec Express
• **API REST** : Communication standardisée avec endpoints RESTful

3.3 BASE DE DONNÉES

PostgreSQL avec ORM Sequelize :
• **Fiabilité** : Stabilité et gestion de volumes importants
• **Relations complexes** : Jointures et transactions avancées
• **ORM Sequelize** : Manipulation des données via modèles JavaScript
• **Hébergement cloud** : Base hébergée sur Azure pour sécurité et performance

3.4 HÉBERGEMENT ET DÉPLOIEMENT

• **Frontend** : GitHub Pages pour l'hébergement web
• **Backend** : Heroku pour l'API Node.js
• **Base de données** : PostgreSQL sur Microsoft Azure
• **Déploiement** : Automatisé via CI/CD GitHub Actions

3.5 SÉCURITÉ

• **Authentification JWT** : Tokens sécurisés avec expiration
• **Hachage SHA-256** : Protection des mots de passe
• **Validation serveur** : Protection contre injections SQL et XSS
• **HTTPS** : Chiffrement de toutes les communications

4. DÉPLOIEMENT

4.1 MISE EN PLACE DES ENVIRONNEMENTS DE DÉPLOIEMENT

CESIZen utilise une architecture distribuée avec des repositories séparés pour chaque composant :

**Environnement de développement** :
• Frontend : Expo CLI avec hot reloading et tests sur émulateurs
• Backend : Node.js avec rechargement automatique
• Tests locaux : `expo export` puis `npx serve .` pour validation web

**Environnement de production** :
• Frontend : GitHub Pages (hébergement statique avec CDN)
• Backend : Heroku (plateforme cloud managée)
• Base de données : PostgreSQL sur Microsoft Azure

4.2 PLAN DE DÉPLOIEMENT

**Pipeline CI/CD automatisé** :

1. **Développement** : Création d'une branche depuis main
2. **Pull Request** : Déclenche automatiquement :
   - Tests de nom de branche (respect des conventions)
   - Analyse SonarQube (qualité et sécurité)
   - Tests de connexion base de données
3. **Revue de code** : Approbation obligatoire d'un reviewer
4. **Merge** : Déploiement automatique vers production

**Spécificités par composant** :
• **Frontend** : Build React Native → Déploiement GitHub Pages
• **Backend** : Tests API avec Postman → Déploiement Heroku
• **Base de données** : Migrations automatiques via ORM

4.3 PROPOSITION ET CONFIGURATION D'UN OUTIL DE VERSIONING

**Git + GitHub** avec configuration sécurisée :
• **Multi-repository** : Repositories séparés frontend/backend
• **Protection des branches** : Interdiction de push direct sur main
• **Pull Requests obligatoires** : Avec approbation requise
• **Conventions de nommage** : Tests automatisés des noms de branches

5. MAINTENANCE

5.1 OUTIL DE GESTION DES ÉVOLUTIONS

**Écosystème GitHub intégré** :

**GitHub Issues** :
• Rapports de bugs et demandes de fonctionnalités
• Système de labels pour classification
• Assignation et suivi des tâches

**Pull Requests** :
• Revue de code systématique
• Tests automatisés avant intégration
• Documentation des modifications

**GitHub Actions** :
• Automatisation des tests
• Analyses de qualité (SonarQube)
• Déploiements automatiques

**Historique Git** : Traçabilité complète avec possibilité de rollback

5.2 GARANTIES D'ÉVOLUTIVITÉ DE LA SOLUTION – VEILLE ET MÉTHODOLOGIE

**Architecture évolutive** :
• **Modularité** : Repositories séparés permettant évolutions indépendantes
• **ORM automatisé** : Migrations de base de données sans interruption
• **Technologies maintenues** : React Native et Node.js avec communautés actives

**Veille technologique** :
• Surveillance des mises à jour frameworks
• Détection automatique des vulnérabilités (SonarQube)
• Mise à jour régulière des dépendances

6. SÉCURISATION

6.1 PLAN DE SÉCURISATION

**Sécurité des déploiements** :

**GitHub Secrets** :
• Chiffrement des clés de connexion Azure
• Protection des tokens Heroku
• Variables d'environnement sécurisées

**Protection des repositories** :
• Interdiction des modifications directes sur main
• Tests de conventions obligatoires
• Revue de code avant merge
• Séparation stricte dev/production

**Sécurité applicative** :
• **Authentification JWT** : Tokens avec expiration automatique
• **Validation des données** : Contrôles côté client et serveur
• **HTTPS obligatoire** : Chiffrement de toutes les communications
• **Hachage SHA-256** : Protection des mots de passe

**Sécurité infrastructure** :
• **Azure Database** : Chiffrement au repos et en transit
• **Heroku** : Plateforme sécurisée avec monitoring
• **GitHub Pages** : HTTPS natif avec CDN sécurisé

6.2 DONNÉES PERSONNELLES, SENSIBLES ET RGPD

**Conformité RGPD** :

**Minimisation des données** : Collecte limitée au strict nécessaire

**Droits des utilisateurs** :
• Droit d'accès : Consultation des données personnelles
• Droit de rectification : Modification via interface
• Droit à l'effacement : Suppression complète sur demande

**Sécurisation** :
• Base PostgreSQL sur Azure (certifications ISO 27001, SOC 2)
• Hébergement en France (souveraineté des données)
• Logs d'audit pour traçabilité des accès
• Chiffrement bout en bout des communications
