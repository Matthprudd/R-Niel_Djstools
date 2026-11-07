"use strict";
(async function(){
  const gate = document.getElementById("rniel-gate");
  const workspace = document.querySelector(".app");
  const status = document.getElementById("rniel-gate-status");
  const form = document.getElementById("rniel-login-form");
  const emailField = document.getElementById("rniel-login-email");
  const syncIndicator = document.getElementById("rniel-sync-status");
  const url = "https://rxrsoamsjgnhryqpyhnx.supabase.co";
  const publishableKey = "sb_publishable_lwUz__1g64IOkwmPVKAn9w_syZ0QMO2";
  const emptyData = () => ({talents:[],campaigns:[],tasks:[],opportunities:[],activities:[],settings:{meydenEmail:"",rnielEmail:""}});
  let sb, userId, active=false, saving=Promise.resolve(), booting=false;
  const announce = (message, isError=false) => {status.textContent=message;status.style.color=isError?"#ffb9b9":"#d4c9c2";};
  const sync = (message, error=false) => {if(syncIndicator){syncIndicator.textContent=message;syncIndicator.style.color=error?"#ffb9b9":"#c3d2c0";}};
  const isValidData = d => d && Array.isArray(d.talents) && Array.isArray(d.campaigns) && Array.isArray(d.tasks) && Array.isArray(d.opportunities);
  function loginVisible(){workspace.hidden=true;gate.hidden=false;}
  function appVisible(){gate.hidden=true;workspace.hidden=false;}
  function saveData(next){
    if(!active || !userId){sync("Session fermée : enregistrement impossible",true);return;}
    const snapshot=structuredClone(next);
    sync("Synchronisation...");
    saving=saving.catch(()=>{}).then(async()=>{
      const result=await sb.from("rniel_workspaces").update({payload:snapshot,updated_at:new Date().toISOString()}).eq("owner_uid",userId);
      if(result.error)throw result.error;
      sync("Sauvegardé en privé");
    }).catch(err=>{sync("Échec de sauvegarde : exporter JSON",true);console.error("R-Niel sync",err.message);});
  }
  async function startWorkspace(){
    if(booting||active)return;
    booting=true;
    announce("Vérification de votre autorisation...");
    try{
      const result=await sb.auth.getUser();
      if(result.error || !result.data.user){loginVisible();announce("Connexion privée par courriel.");return;}
      const user=result.data.user;
      let r=await sb.from("rniel_workspaces").select("payload").eq("owner_uid",user.id).maybeSingle();
      if(r.error)throw r.error;
      let state=r.data?.payload;
      if(!state){
        const ins=await sb.from("rniel_workspaces").insert({owner_uid:user.id,payload:emptyData()});
        if(ins.error)throw ins.error;
        state=emptyData();
      }
      if(!isValidData(state))throw Error("Les données du dossier ne sont pas conformes.");
      const legacyString=localStorage.getItem("rniel-promohub-v1");
      if(legacyString){
        let legacy=null;
        try{legacy=JSON.parse(legacyString);}catch{}
        const nonempty=d=>["talents","campaigns","tasks","opportunities","activities"].some(k=>d?.[k]?.length);
        if(isValidData(legacy)&&nonempty(legacy) && confirm("Une ancienne sauvegarde locale R-Niel est présente sur cet appareil. Souhaitez-vous l'importer dans votre espace sécurisé ? L'import remplace les données en ligne. Exportez votre sauvegarde si nécessaire.")){
          const up=await sb.from("rniel_workspaces").update({payload:legacy,updated_at:new Date().toISOString()}).eq("owner_uid",user.id);
          if(up.error)throw up.error;
          state=legacy;localStorage.removeItem("rniel-promohub-v1");
        }
      }
      userId=user.id;active=true;window.RNIEL_SECURE={current:state,save:saveData};
      appVisible();sync("Espace privé connecté");
      if(!window.RNIEL_APP_LOADED){
        const script=document.createElement("script");script.src="./app.js";script.defer=true;
        script.onload=()=>{window.RNIEL_APP_LOADED=true;};
        script.onerror=()=>sync("Impossible de charger le bureau",true);
        document.body.appendChild(script);
      }
    }catch(err){
      active=false;loginVisible();announce("Accès refusé ou indisponible. Vérifiez que votre adresse est autorisée. "+String(err.message||"").slice(0,90),true);
    }finally{booting=false;}
  }
  loginVisible();
  if(!window.supabase?.createClient){announce("Module de sécurité indisponible. Réessayez avec une connexion Internet.",true);return;}
  sb=window.supabase.createClient(url,publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"implicit"}});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const email=emailField.value.trim().toLowerCase();
    if(!email)return;
    form.querySelector("button[type=submit]").disabled=true;
    announce("Envoi du lien de connexion...");
    try{
      const r=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+"/",shouldCreateUser:true}});
      if(r.error)throw r.error;
      announce("Consultez votre courriel et ouvrez le lien privé sur cet appareil. Un nouveau lien peut prendre quelques instants.");
    }catch(err){announce("Erreur de connexion : "+String(err.message).slice(0,140),true);}
    finally{form.querySelector("button[type=submit]").disabled=false;}
  });
  document.getElementById("rniel-logout").addEventListener("click",async()=>{
    await saving.catch(()=>{});
    await sb.auth.signOut();
    window.location.replace(window.location.origin+window.location.pathname);
  });
  await startWorkspace();
})();
