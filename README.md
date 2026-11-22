# CINÉ-GENESIS AI

Studio local image-vers-vidéo connecté à fal.ai.

## Prérequis
- Ordinateur Windows, macOS ou Linux (un téléphone seul ne peut pas lancer le serveur Node de ce paquet).
- Node.js 18 ou plus récent.
- Compte fal.ai et clé API. La génération peut consommer des crédits.

## Installation
1. Décompressez le ZIP.
2. Copiez `.env.example` vers `.env`.
3. Dans `.env`, remplacez `collez_votre_cle_api_ici` par votre clé fal.ai.
4. Ouvrez un terminal dans le dossier et exécutez `npm install`.
5. Exécutez `npm start`.
6. Ouvrez `http://localhost:3000`.

## Utilisation
- Sélectionnez une image JPG, PNG ou WebP (moins de 7 Mo) ou entrez une URL HTTPS publique.
- Décrivez la scène et cliquez sur « Générer la vidéo ».
- Le logiciel envoie la demande au modèle `fal-ai/minimax/video-01-live/image-to-video`.
- Quand le clip est prêt, utilisez le lien pour l'ouvrir ou l'enregistrer.

## Sécurité
- Ne partagez jamais votre fichier `.env`.
- Ne publiez pas le serveur avec une clé sans authentification et limites d'utilisation.
- Vérifiez le coût et les crédits fal.ai avant de lancer la génération.

## Limites
Le logiciel anime une image de départ. La durée exacte dépend du modèle/API. Pour un épisode TikTok de 10 secondes, assemblez deux clips dans un éditeur vidéo.
