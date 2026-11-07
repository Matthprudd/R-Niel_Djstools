# R-NIEL YOURSELF — PROMO HUB × MEYDEN

Application HTML mobile-first pour R-niel Yousoft et la promotion artistique MEYDEN — Mouvement artistique du Québec.

**Statut :** V1 de travail. Le tableau de bord fonctionne dans un navigateur sans serveur. Le service d'envoi automatique à deux destinataires exige une configuration Vercel + Resend avant de pouvoir transmettre quoi que ce soit.

## Modules opérationnels

1. **Accueil** : compteurs fondés sur les données réelles saisies et actions rapides.
2. **DJ / Talents** : créer, modifier, supprimer et rechercher des fiches (nom artistique, style, région, profil, notes, statut). Générateur de premier message personnalisé, à relire et copier.
3. **Promotion** : campagnes avec support, date, notes et statut (idée, planifiée, en cours, terminée).
4. **Suivis** : tâches et relances datées, marqueur terminé/à faire.
5. **Opportunités** : proposer un artiste, une salle, une commandite, un événement ou une collaboration; suivre un dossier avec numéro de référence. Préparation de courriel manuel ou envoi serveur sécurisé.
6. **Incubation DJ** : présentation des 3 niveaux officiels, 100 $ / 250 $ / 250 $ + % selon entente.
7. **Bilans** : statistiques locales observées, impression et enregistrement au format PDF via le navigateur.
8. **Réglages** : adresses pour les brouillons de courriel, clé d'envoi de session, sauvegarde JSON, restauration et effacement local.

Aucun logo officiel MEYDEN inventé n'est utilisé : l'interface présente une marque typographique neutre.

## Démarrage

Ouvrir index.html sur un navigateur récent. Aucune dépendance de construction n'est requise.

Pour déployer :
1. Dans Vercel, importer le dépôt GitHub \`Matthprudd/R-Niel_Djstools\`.
2. Framework : \`Other\`; répertoire racine : \`./\`.
3. Déployer. Vercel sert index.html, app.js et la fonction serveur \`/api/opportunity\`.
4. Ajouter le site à l'écran d'accueil Android ou iPhone si souhaité (un raccourci web, pas encore une vraie PWA hors ligne).

## Envoi automatique de deux courriels

La fonction \`api/opportunity.js\` appelle Resend uniquement après validation du code de session. L'envoi de courriel passe par des variables d'environnement **sur Vercel uniquement**. Ne jamais insérer de clé Resend ou de code secret dans le HTML, JavaScript client ou GitHub.

Variables à créer dans **Vercel → Project → Settings → Environment Variables** :

- \`RESEND_API_KEY\` : clé privée Resend.
- \`RESEND_FROM_EMAIL\` : adresse expéditrice d'un domaine vérifié chez Resend.
- \`MEYDEN_TO_EMAIL\` : adresse de Mathieu Prud'homme.
- \`RNIEL_TO_EMAIL\` : adresse de R-niel.
- \`RNIEL_ACCESS_CODE\` : phrase secrète aléatoire et longue (idéalement 32+ caractères), partagée séparément à R-niel.

Ensuite redéployer pour que la fonction dispose des variables. Dans l'application, ouvrir **Réglages** et saisir le code d'accès d'envoi fourni séparément par l'administrateur MEYDEN. Le code est vérifié auprès du serveur via **/api/recipients**; une fois validé, les deux adresses de destination sont automatiquement renseignées dans les réglages locaux. Le code est gardé dans **sessionStorage** (un seul onglet, il disparaît à la fermeture de session). Il n'est jamais enregistré dans GitHub ni dans une sauvegarde JSON.

Le module interroge **/api/status** pour afficher si le service d'envoi est prêt. Si les variables d'expédition ne sont pas complètes, le bouton d'envoi automatique reste désactivé.

Sur une proposition enregistrée : cliquer **Envoyer automatiquement**. Le serveur effectue deux envois distincts : proposition à MEYDEN et confirmation à R-niel. Le statut passe à *Envoyée par courriel* uniquement si les deux envois réussissent.

**Important :** si un seul message part et l'autre échoue, l'interface signale un *envoi partiel*. Vérifier les boîtes avant un nouvel essai pour éviter les doublons. Cette V1 protège l'envoi avec un code partagé, mais ne dispose pas encore d'un compte nominatif sécurisé, de limitation de débit durable ni d'un journal d'envoi centralisé. Pour une diffusion publique à grande échelle, ajouter l'authentification Supabase, des permissions par utilisateur et un contrôle anti-abus.

### Solution sans Resend

Dans Réglages, enregistrer les deux adresses pour le mode manuel, ou saisir le code d'accès de l'administrateur pour les récupérer automatiquement. Sur une proposition, cliquer **Courriel manuel** : l'application de messagerie s'ouvre avec Mathieu comme destinataire et R-niel en copie. L'utilisateur vérifie et appuie lui-même sur Envoyer. **Aucun message n'est envoyé automatiquement par ce mode.**

## Données et confidentialité

- Données conservées dans \`localStorage\` du navigateur courant seulement.
- Ne pas y conserver des renseignements financiers, mots de passe ou informations sensibles.
- Exporter régulièrement une sauvegarde JSON dans un dossier privé.
- Un autre appareil ne partage pas les fiches automatiquement. Pour une utilisation multi-appareils/équipe, brancher un stockage central sécurisé avec contrôle d'accès.
- Le dépôt GitHub est public : ne jamais y écrire des identifiants, clés, courriels personnels réels ou fichiers confidentiels.
- Les statistiques sont fondées sur les données saisies et ne démontrent pas directement des résultats commerciaux.

## Périmètre

L'application **ne publie pas** directement sur TikTok, Instagram ou Facebook. Elle n'envoie pas de messages sur ces réseaux. Aucun booking ni représentation n'est créé automatiquement via Hedliner. R-niel peut préparer les campagnes, contacter personnellement les artistes et transmettre des dossiers à MEYDEN.

**Responsabilités :** MEYDEN valide les engagements professionnels, budgets, contrats et représentations; les rôles d'Antbro et de GRP International dépendent des ententes.

**Auteur / coordination :** MEYDEN — Mouvement artistique du Québec — Structurer • Créer • Élever.
