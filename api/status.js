// Public readiness check. No email addresses, keys, or access codes are disclosed.
module.exports = function handler(req,res) {
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({ready:false,error:"Method not allowed"});}
  const required=["RESEND_API_KEY","RESEND_FROM_EMAIL","MEYDEN_TO_EMAIL","RNIEL_TO_EMAIL","RNIEL_ACCESS_CODE"];
  const ready=required.every(k=>typeof process.env[k]==="string"&&process.env[k].trim().length>0)&&(process.env.RNIEL_ACCESS_CODE||"").length>=20;
  return res.status(200).json({ready,mode:ready?"automatic":"manual",message:ready?"Envoi automatique disponible":"Configuration de l’envoi automatique incomplète"});
};