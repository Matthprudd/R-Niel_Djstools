// La préparation des courriels est locale, sans prestataire d'expédition.
module.exports = function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  return res.status(200).json({mode:"manual",ready:true,automaticSending:false,message:"Brouillon prêt à envoyer manuellement dans Gmail ou la messagerie de R-niel."});
};
