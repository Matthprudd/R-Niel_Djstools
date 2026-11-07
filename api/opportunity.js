// R-NIEL YOURSELF — le mode automatique est intentionnellement désactivé.
// Le parcours prépare désormais un courriel complet dans la messagerie de R-niel.
// Aucun serveur ne peut envoyer de courriel depuis ce point d'accès.
module.exports = function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("Allow","GET, POST");
  return res.status(410).json({ok:false,error:"Envoi automatique désactivé. Utiliser le brouillon complet préparé dans l’application."});
};
