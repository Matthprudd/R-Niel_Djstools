// R-NIEL YOURSELF — Vercel serverless endpoint
// Only sends when the required environment variables and a private access code are configured.
const {timingSafeEqual} = require("node:crypto");
function response(res,status,data){res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");return res.status(status).json(data)}
function equal(a,b){const aa=Buffer.from(String(a||""),"utf8");const bb=Buffer.from(String(b||""),"utf8");return aa.length===bb.length&&aa.length>0&&timingSafeEqual(aa,bb)}
const cut=(v,n)=>String(v==null?"":v).trim().slice(0,n);
module.exports=async function handler(req,res){
if(req.method!=="POST"){res.setHeader("Allow","POST");return response(res,405,{ok:false,error:"Méthode non autorisée"})}
const env=["RESEND_API_KEY","RESEND_FROM_EMAIL","MEYDEN_TO_EMAIL","RNIEL_TO_EMAIL","RNIEL_ACCESS_CODE"];
if(env.some(name=>!process.env[name])||process.env.RNIEL_ACCESS_CODE.length<20)return response(res,503,{ok:false,error:"Envoi automatique non configuré sur le serveur. Utiliser le courriel manuel."});
const access=req.headers["x-rniel-access-code"];
if(!equal(access,process.env.RNIEL_ACCESS_CODE))return response(res,401,{ok:false,error:"Code d'accès invalide."});
let raw=req.body;
try{
if(typeof raw==="string"){if(raw.length>8500)return response(res,413,{ok:false,error:"Proposition trop volumineuse"});raw=JSON.parse(raw)}
if(!raw||typeof raw!=="object"||Array.isArray(raw))throw Error("Données invalides");
const o={
ref:cut(raw.ref,50),title:cut(raw.title,160),type:cut(raw.type,80),
person:cut(raw.person,150),contact:cut(raw.contact,300),
description:cut(raw.description,2500),nextStep:cut(raw.nextStep,700),
createdAt:cut(raw.createdAt,40)
};
if(!o.title||o.title.length<3||!o.description||o.description.length<8)return response(res,400,{ok:false,error:"Le titre et la description sont requis."});
const text=["PROPOSITION D'OPPORTUNITÉ — MEYDEN","Référence : "+(o.ref||"Sans référence"),"Soumise par : R-niel Yousoft","Date du dossier : "+o.createdAt,"","Type : "+o.type,"Projet : "+o.title,"Artiste / Contact : "+o.person,"Coordonnées : "+o.contact,"","Description :\n"+o.description,"","Prochaine étape proposée :\n"+o.nextStep,"","MEYDEN — Mouvement artistique du Québec","Structurer • Créer • Élever"].join("\n");
const subject="MEYDEN | Nouvelle opportunité "+o.ref+" | "+o.title.replace(/[\r\n]/g," ");
const headers={"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"};
async function send(to,subjectLine,body){
const r=await fetch("https://api.resend.com/emails",{method:"POST",headers,body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to:[to],subject:subjectLine,text:body})});
const payload=await r.json().catch(()=>({}));
if(!r.ok||!payload.id)throw Error("Le fournisseur de courriel a refusé l'envoi.");
return payload.id;
}
const outcome=await Promise.allSettled([
send(process.env.MEYDEN_TO_EMAIL,subject,text),
send(process.env.RNIEL_TO_EMAIL,"Confirmation | "+subject,"Copie de votre proposition soumise à MEYDEN.\n\n"+text)
]);
const sent=outcome.filter(x=>x.status==="fulfilled").length;
if(sent!==2)return response(res,502,{ok:false,error:sent===1?"Envoi partiel : un des deux courriels est parti. Vérifier les boîtes avant de réessayer.":"Les deux envois ont échoué. Vérifier la configuration Resend.",sent});
return response(res,200,{ok:true,sent:2,reference:o.ref});
}catch(e){return response(res,400,{ok:false,error:"Proposition invalide ou erreur d'envoi. Vérifier la configuration."})}
};