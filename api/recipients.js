// Protected endpoint: returns the two intended e-mail recipients to an authorized user.
const {timingSafeEqual}=require("node:crypto");
function matches(a,b){const aa=Buffer.from(String(a||""),"utf8"),bb=Buffer.from(String(b||""),"utf8");return aa.length>0&&aa.length===bb.length&&timingSafeEqual(aa,bb)}
module.exports=function(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({ok:false,error:"Méthode non autorisée"});}
  if(!process.env.RNIEL_ACCESS_CODE||!matches(req.headers["x-rniel-access-code"],process.env.RNIEL_ACCESS_CODE))return res.status(401).json({ok:false,error:"Code d’accès invalide"});
  if(!process.env.MEYDEN_TO_EMAIL||!process.env.RNIEL_TO_EMAIL)return res.status(503).json({ok:false,error:"Adresses non configurées"});
  return res.status(200).json({ok:true,meydenEmail:process.env.MEYDEN_TO_EMAIL,rnielEmail:process.env.RNIEL_TO_EMAIL});
};