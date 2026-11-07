# R-NIEL YOURSELF — PROMO HUB × MEYDEN

Bureau numérique de promotion et de développement artistique de R-niel Yousoft. Application HTML/JavaScript, mobile-first, déployable sur Vercel.

## Principe directeur : chaque information recueillie construit le courriel

Le courriel final n'est pas limité au formulaire « Proposer une opportunité ». Il est composé dynamiquement à partir **du parcours complet du DJ lié à cette proposition** :

1. Informations de la fiche DJ (nom, style, ville, plateformes, liens, statut et observations).
2. Historique daté des découvertes, conversations, réponses, décisions et autres événements.
3. Campagnes promotionnelles associées au même DJ (objectifs, plateformes, états, dates et notes).
4. Tâches et suivis associés (à faire/terminés, échéances, notes).
5. Description de l'opportunité et action recommandée à MEYDEN.

Ce contenu est régénéré à chaque ouverture du brouillon, afin de refléter les mises à jour enregistrées. **Il rassemble seulement les données associées au même dossier artistique**, pas celles des autres DJ.

### Parcours de R-niel

1. Dans **DJ / Talents**, créer la fiche du DJ. L'application conserve la découverte et les changements majeurs de statut/notes dans l'historique.
2. Cliquer sur **Parcours** dans la fiche pour ajouter une conversation, un appel, une réponse, une décision ou une information reçue. Chaque entrée conserve sa date et son contexte.
3. Dans **Promotion** et **Suivis**, relier la campagne ou la tâche au DJ grâce au champ « DJ lié au dossier ». Les anciens suivis qui portent exactement le nom du DJ peuvent également être associés au dossier.
4. Cliquer sur **Proposer à MEYDEN** depuis la fiche DJ, ou utiliser **Opportunités → Nouvelle proposition** et sélectionner le DJ concerné.
5. Après **Enregistrer et préparer le courriel**, le système affiche le rapport complet, son objet, et les deux destinataires. R-niel peut relire et modifier le contenu.
6. Cliquer **Ouvrir le courriel à deux** : la messagerie de l'appareil s'ouvre avec les deux adresses dans le champ À, le sujet et le corps préremplis.
7. **L'envoi réel appartient à R-niel : elle doit appuyer sur Envoyer dans Gmail ou son client courriel.** Elle peut ensuite marquer le dossier comme envoyé dans le tableau de bord.

Le bouton « Copier le courriel » offre une solution de rechange si le téléphone ne prend pas en charge un brouillon mailto volumineux.

### Les destinataires

- Mathieu Prud'homme — MEYDEN.
- R-niel Yousoft — copie du même rapport.

Leurs adresses ne sont pas écrites dans les sources publiques du dépôt. Elles sont configurables dans **Réglages**, enregistrées localement sur l'appareil de R-niel, ou récupérées via un code d'accès à usage privé et un point de terminaison protégé par Vercel (\`/api/recipients\`).

Un code d'accès est utile pour récupérer les deux adresses, **pas pour envoyer des messages**.

## Modules disponibles

- Accueil et tableau de bord.
- DJ / Talents et historique des interactions.
- Campagnes promotionnelles.
- Suivis et relances.
- Opportunités, synthèse cumulative et brouillon courriel.
- Présentation du programme officiel d'incubation DJ MEYDEN (3 niveaux).
- Bilans des démarches, impression en PDF depuis le navigateur.
- Import/export des données au format JSON.

## Confidentialité, limites et sécurité

- Les données sont enregistrées uniquement dans le \`localStorage\` de ce navigateur, sauf les adresses de destination qui existent aussi dans la configuration privée Vercel. Il n'y a pas encore de base centrale synchronisée.
- La personne qui utilise le même appareil/profil de navigateur peut accéder aux données locales de l'application. Ne pas y conserver des renseignements sensibles, mots de passe ni documents confidentiels. Prévoir une authentification et une base sécurisée si l'outil devient multi-utilisateur.
- Le dépôt GitHub étant public, ne jamais y mettre de clés, codes privés ou données personnelles de talents.
- Une action enregistrée n'est pas une entente conclue; une proposition ne confirme pas de booking, de contrat ou de commande.
- Les vidéos et publications sont planifiées ici; elles ne sont pas envoyées automatiquement à TikTok, Instagram ou Messenger.
- Le point de terminaison \`/api/opportunity\` ne peut plus envoyer de courriel : il retourne HTTP 410 (fonctionnalité retirée volontairement).
- Il n'est **pas nécessaire** de configurer Resend, une clé API de courrier ou un domaine d'expédition.
- Si le brouillon contient de très longues notes, certains clients de messagerie peuvent limiter la longueur du lien \`mailto:\`. Utiliser alors « Copier le courriel » et coller dans un nouveau message.

## Déploiement

1. Importer le dépôt \`Matthprudd/R-Niel_Djstools\` dans Vercel.
2. Utiliser le répertoire racine, sans framework spécifique; le fichier d'entrée est \`index.html\`.
3. La production utilise le domaine \`https://r-nieldjstools.vercel.app/\`.
4. Le code étant relié à GitHub, chaque commit sur \`main\` peut déclencher un nouveau déploiement.

MEYDEN — Mouvement artistique du Québec. Structurer • Créer • Élever.
