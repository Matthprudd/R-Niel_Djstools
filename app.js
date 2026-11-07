"use strict";
(function(){
const STORAGE="rniel-promohub-v1";
const STATUS=["Découvert","Contacté","Intéressé","Orientation MEYDEN","En collaboration","Sans suite"];
const CAMPAIGN_STATUS=["Idée","Planifiée","En cours","Terminée"];
const TYPES=["DJ / Artiste","Salle de spectacle","Partenariat","Commandite","Événement","Émission / Live","Autre"];
const titles={home:["Bonjour, R-niel","Un seul endroit pour découvrir, connecter et propulser les artistes."],talents:["DJ et talents","Répertoire de découvertes, de contacts et de collaborations."],campaigns:["Atelier promotionnel","Organise tes campagnes et tes publications."],tasks:["Mes suivis","Note les prochaines étapes et ne perds aucun contact."],opportunities:["Opportunités MEYDEN","Prépare, soumets et suis tes propositions au mouvement."],incubation:["Incubation artistique DJ","Trois niveaux officiels pour structurer une carrière."],reports:["Bilans et valorisation","Documente ton travail et tes résultats observés."],settings:["Réglages et données","Sauvegarde ton travail et configure tes courriels de préparation."]};
let data=load(),page="home",filterTalents="",filterStatus="Tous",filterCampaigns="";
const $=id=>document.getElementById(id);
const safe=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const now=()=>new Date().toISOString();
const id=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"id-"+Date.now()+"-"+Math.random().toString(36).slice(2,9);
const day=()=>{const d=new Date();const pad=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const formatDate=d=>{if(!d)return"Sans date";try{return new Date(d+"T12:00:00").toLocaleDateString("fr-CA",{year:"numeric",month:"short",day:"numeric"})}catch{return d}};
function load(){const empty={talents:[],campaigns:[],tasks:[],opportunities:[],activities:[],settings:{meydenEmail:"",rnielEmail:""}};try{let r=JSON.parse(localStorage.getItem(STORAGE)||"null");if(!r||typeof r!=="object")return empty;for(const k of ["talents","campaigns","tasks","opportunities","activities"])empty[k]=Array.isArray(r[k])?r[k]:[];empty.settings={...empty.settings,...(r.settings||{})};return empty}catch{return empty}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(data));return true}catch{toast("Espace de stockage insuffisant. Exporte une sauvegarde.");return false}}
function toast(message){$("toast").textContent=message;$("toast").classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>$("toast").classList.remove("show"),4400)}
function btn(action,label,kind="",extra=""){return '<button type="button" class="btn '+kind+'" data-action="'+safe(action)+'" '+extra+'>'+label+'</button>'}
function pill(label,cls=""){return '<span class="pill '+cls+'">'+safe(label)+'</span>'}
function title(t,s){return '<div class="section-top"><h2>'+t+'</h2><span class="tiny">'+s+'</span></div>'}
function empty(symbol,heading,description,action,label){return '<div class="empty"><div class="big">'+symbol+'</div><b>'+heading+'</b><p>'+description+'</p>'+(action?btn(action,label,"primary"):"")+'</div>'}
function cleanUrl(x){try{const u=new URL(x);return ["https:","http:"].includes(u.protocol)?u.href:""}catch{return""}}
function setPage(p){if(!titles[p])p="home";page=p;render();window.scrollTo({top:0,behavior:"instant"})}
function render(){
$("page-title").textContent=titles[page][0];$("page-sub").textContent=titles[page][1];
document.querySelectorAll("[data-page]").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
const views={home:renderHome,talents:renderTalents,campaigns:renderCampaigns,tasks:renderTasks,opportunities:renderOpportunities,incubation:renderIncubation,reports:renderReports,settings:renderSettings};
$("view").innerHTML=views[page]();
}
function metric(num,label){return '<div class="stat"><div class="num">'+num+'</div><div class="label">'+label+'</div></div>'}
function renderHome(){
const active=data.tasks.filter(t=>!t.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999"));
const recent=[...data.opportunities].reverse().slice(0,3);
return '<section class="hero"><div><div class="eyebrow">TON BUREAU ARTISTIQUE PERSONNEL</div><h2>Découvrir des talents. Créer des liens. Faire avancer les projets.</h2><p>Enregistre tes découvertes, prépare les promotions, transmets des opportunités à MEYDEN et conserve une trace de chaque démarche.</p>'+btn("new-talent","＋ Ajouter un DJ","primary")+' '+btn("new-opportunity","✦ Nouvelle opportunité")+'</div><div class="glyph" aria-hidden="true">♫</div></section>'
+'<div class="stats">'+metric(data.talents.length,"Talents répertoriés")+metric(data.talents.filter(x=>["Intéressé","Orientation MEYDEN","En collaboration"].includes(x.status)).length,"Contacts intéressés")+metric(data.campaigns.filter(x=>x.status!=="Terminée").length,"Campagnes en préparation")+metric(data.opportunities.length,"Opportunités consignées")+'</div>'
+'<div class="grid2"><section class="panel">'+title("Actions rapides","Pour commencer")+'<div class="action-grid">'
+[['new-talent','♫','Ajouter un talent','Créer une fiche DJ'],['new-task','☑','Planifier un suivi','Ne rien oublier'],['new-campaign','◉','Créer une campagne','Organiser une promotion'],['new-opportunity','✦','Proposer à MEYDEN','Transmettre une idée'],['go-incubation','◆','Incubation DJ','Voir les 3 niveaux'],['go-reports','▥','Mon bilan','Mesurer mes efforts']].map(a=>'<button class="action" data-action="'+a[0]+'"><span class="icon">'+a[1]+'</span><b>'+a[2]+'</b><small>'+a[3]+'</small></button>').join("")+'</div></section>'
+'<section class="panel">'+title("Mes prochaines actions",active.length+" en attente")+(active.length?'<div class="items">'+active.slice(0,5).map(t=>taskItem(t,true)).join("")+'</div>':empty("☑","Aucun suivi en attente","Ajoute une tâche lorsque tu établis une nouvelle relation.","new-task","Ajouter une tâche"))+'</section></div>'
+'<section class="panel" style="margin-top:17px">'+title("Dernières propositions à MEYDEN",recent.length+" proposition(s)")+(recent.length?'<div class="items">'+recent.map(o=>opportunityItem(o,true)).join("")+'</div>':empty("✦","Ton carnet d’opportunités est vide","Les artistes, salles, projets et partenaires intéressants peuvent être soumis ici.","new-opportunity","Créer une proposition"))+'</section>';
}
function talentField(value){
 return '<div class="field wide"><label for="f-talentId">DJ lié au dossier (pour intégrer tout son parcours au courriel)</label><select id="f-talentId" name="talentId"><option value="">Aucun DJ lié</option>'+
 data.talents.map(t=>'<option value="'+safe(t.id)+'" '+(t.id===value?"selected":"")+'>'+safe(t.name)+'</option>').join("")+'</select></div>';
}
function activityItem(a){
 return '<article class="item"><div><h3>'+safe(a.type||"Suivi")+'</h3><p>'+formatDate(a.date||String(a.createdAt||"").slice(0,10))+'</p><p>'+safe(a.detail||"")+'</p></div><div class="item-actions">'+btn("delete-activity","Supprimer","sm warn",'data-id="'+safe(a.id)+'"')+'</div></article>';
}
function newActivity(talentId){
 const t=data.talents.find(x=>x.id===talentId);if(!t)return;
 modal("activity","Nouvelle information — "+t.name,[
 '<input type="hidden" name="talentId" value="'+safe(t.id)+'">',
 field("date","Date de l’échange / événement",day(),"date"),
 field("type","Nature de l'information","Conversation","select",{options:["Conversation","Appel","Live découvert","Courriel","Réponse de l’artiste","Promotion","Collaboration","Décision","Autre"]}),
 field("detail","Informations recueillies, promesses, résultats et notes","","textarea",{wide:true,required:true,max:2200})
 ],{});
}
function showHistory(t){
 const hist=(data.activities||[]).filter(a=>a.talentId===t.id).sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
 $("dialog-content").innerHTML='<div class="modal-head"><h2>Parcours — '+safe(t.name)+'</h2><button type="button" class="close" data-action="close">×</button></div><div class="modal-body"><p class="sub">Toutes les informations consignées ici enrichissent les prochains courriels d’opportunité associés à '+safe(t.name)+'.</p><div class="items">'+(hist.map(activityItem).join("")||'<p class="sub">Aucun échange encore enregistré.</p>')+'</div><div class="modal-foot">'+btn("close","Fermer")+btn("add-activity","＋ Ajouter une information","primary",'data-id="'+safe(t.id)+'"')+'</div></div>';$("dialog").showModal();
}
function talentItem(x){
const url=cleanUrl(x.link),status=x.status||"Découvert";
return '<article class="item talent" data-search="'+safe([x.name,x.style,x.city,status].join(" ").toLowerCase())+'" data-status="'+safe(status)+'"><div><h3>♫ '+safe(x.name)+'</h3><div class="inline-actions">'+pill(status,status==="En collaboration"?"green":status==="Intéressé"?"orange":"")+(x.style?pill(x.style):"")+'</div><p>'+safe([x.city,x.platform].filter(Boolean).join(" · "))+'</p>'+(x.notes?'<p>'+safe(x.notes)+'</p>':"")+(url?'<p><a href="'+safe(url)+'" rel="noopener noreferrer" target="_blank">Ouvrir le profil ↗</a></p>':"")+'</div><div class="item-actions">'+btn("message-talent","Message","sm",'data-id="'+safe(x.id)+'"')+btn("show-history","Parcours","sm",'data-id="'+safe(x.id)+'"')+btn("propose-talent","Proposer à MEYDEN","sm primary",'data-id="'+safe(x.id)+'"')+btn("edit-talent","Modifier","sm",'data-id="'+safe(x.id)+'"')+btn("delete-talent","Supprimer","sm warn",'data-id="'+safe(x.id)+'"')+'</div></article>';
}
function renderTalents(){return '<div class="section-top"><h2>Répertoire artistique</h2>'+btn("new-talent","＋ Ajouter un DJ","primary")+'</div><div class="toolbar"><input class="input" id="talent-search" placeholder="Rechercher un nom, une ville, un style..." value="'+safe(filterTalents)+'" aria-label="Rechercher un DJ"><select id="talent-status" aria-label="Filtrer les statuts"><option value="Tous">Tous les statuts</option>'+STATUS.map(s=>'<option '+(filterStatus===s?"selected":"")+'>'+safe(s)+'</option>').join("")+'</select></div><div class="items" id="talent-list">'+(data.talents.length?data.talents.map(talentItem).join(""):empty("♫","Aucun DJ enregistré","Commence par noter un artiste découvert en live, sur les réseaux ou lors d’un spectacle.","new-talent","Ajouter mon premier DJ"))+'</div>'}
function campaignItem(x){return '<article class="item campaign" data-search="'+safe([x.title,x.platform,x.status].join(" ").toLowerCase())+'"><div><h3>◉ '+safe(x.title)+'</h3><div class="inline-actions">'+pill(x.status||"Idée",x.status==="Terminée"?"green":"")+(x.platform?pill(x.platform):"")+'</div><p>Publication : '+formatDate(x.date)+'</p>'+(x.notes?'<p>'+safe(x.notes)+'</p>':"")+'</div><div class="item-actions">'+btn("edit-campaign","Modifier","sm",'data-id="'+safe(x.id)+'"')+btn("delete-campaign","Supprimer","sm warn",'data-id="'+safe(x.id)+'"')+'</div></article>'}
function renderCampaigns(){return '<div class="section-top"><h2>Campagnes promotionnelles</h2>'+btn("new-campaign","＋ Nouvelle campagne","primary")+'</div><div class="notice">Prépare les publications, les capsules et les annonces. Cette version organise les contenus, mais ne publie pas automatiquement sur TikTok, Instagram ou Messenger.</div><div class="toolbar" style="margin-top:15px"><input class="input" id="campaign-search" placeholder="Rechercher une campagne..." value="'+safe(filterCampaigns)+'" aria-label="Rechercher une campagne"></div><div class="items" id="campaign-list">'+(data.campaigns.length?data.campaigns.map(campaignItem).join(""):empty("◉","Aucune campagne","Prépare une annonce DJ, une capsule de 15 à 60 secondes ou la promotion d’un événement.","new-campaign","Créer une campagne"))+'</div>'}
function taskItem(t,short){return '<article class="item"><div><h3>'+(t.done?"✓ ":"☐ ")+safe(t.title)+'</h3><p>'+safe(t.related||"Tâche générale")+' · '+(t.due?formatDate(t.due):"Date libre")+'</p>'+(t.notes?'<p>'+safe(t.notes)+'</p>':"")+'</div><div class="item-actions">'+btn("toggle-task",t.done?"Rouvrir":"Terminer","sm "+(t.done?"":"primary"),'data-id="'+safe(t.id)+'"')+(short?"":btn("edit-task","Modifier","sm",'data-id="'+safe(t.id)+'"')+btn("delete-task","Supprimer","sm warn",'data-id="'+safe(t.id)+'"'))+'</div></article>'}
function renderTasks(){return '<div class="section-top"><h2>Suivis et rendez-vous</h2>'+btn("new-task","＋ Nouvelle tâche","primary")+'</div><div class="items">'+(data.tasks.length?[...data.tasks].sort((a,b)=>Number(a.done)-Number(b.done)||(a.due||"9999").localeCompare(b.due||"9999")).map(t=>taskItem(t,false)).join(""):empty("☑","Aucune tâche en mémoire","Crée un rappel pour une relance, un rendez-vous ou une publication.","new-task","Ajouter une tâche"))+'</div>'}
function normalizeKey(v){return String(v||"").trim().toLocaleLowerCase("fr-CA")}
function linkedTalent(o){
  const direct=data.talents.find(t=>t.id===o.talentId);
  return direct||data.talents.find(t=>normalizeKey(t.name)===normalizeKey(o.person))||null;
}
function associated(t,entry){
  if(!t)return false;
  if(entry.talentId)return entry.talentId===t.id;
  return normalizeKey(entry.related)===normalizeKey(t.name)||normalizeKey(entry.artistName)===normalizeKey(t.name);
}
function opportunitySubject(o){return "MEYDEN | Dossier "+(o.ref||"")+" — "+(o.title||"Nouvelle opportunité")}
function opportunityText(o){
 const talent=linkedTalent(o), campaigns=talent?data.campaigns.filter(c=>associated(talent,c)):[], tasks=talent?data.tasks.filter(t=>associated(talent,t)):[],
 activities=talent?(data.activities||[]).filter(a=>a.talentId===talent.id).sort((a,b)=>String(a.date||a.createdAt||"").localeCompare(String(b.date||b.createdAt||""))):[];
 const lines=[
 "Bonjour Mathieu,",
 "",
 "Voici une proposition de développement artistique préparée à partir des informations recueillies au cours de mon suivi.",
 "Elle rassemble la proposition et les éléments déjà documentés dans mon bureau R-NIEL YOURSELF.",
 "",
 "DOSSIER D’OPPORTUNITÉ — MEYDEN",
 "Référence : "+(o.ref||""),
 "Date de création : "+formatDate((o.createdAt||"").slice(0,10)),
 "Dernière mise à jour : "+formatDate((o.updatedAt||o.createdAt||"").slice(0,10)),
 "Préparé par : R-niel Yousoft",
 "",
 "1. OPPORTUNITÉ IDENTIFIÉE",
 "Catégorie : "+(o.type||"Non précisée"),
 "Projet : "+(o.title||"Non précisé"),
 "Artiste / organisation : "+(o.person||talent?.name||"Non précisé"),
 "Lien ou coordonnées : "+(o.contact||talent?.link||"Non précisé"),
 "Présentation : "+(o.description||"Non précisée"),
 "Prochaine étape proposée : "+(o.nextStep||"À déterminer avec MEYDEN")
 ];
 if(talent){
 lines.push("","2. FICHE ARTISTE ET POSITIONNEMENT",
 "Nom artistique : "+(talent.name||""),
 "Univers musical : "+(talent.style||"Non précisé"),
 "Région : "+(talent.city||"Non précisée"),
 "Plateforme de découverte : "+(talent.platform||"Non précisée"),
 "Profil : "+(talent.link||"Non précisé"),
 "Statut actuel : "+(talent.status||"Non précisé"),
 "Observations accumulées : "+(talent.notes||"Aucune note"));
 }
 if(activities.length){
 lines.push("","3. HISTORIQUE DES ÉCHANGES ET ACTIONS");
 for(const a of activities)lines.push("• "+formatDate(a.date||String(a.createdAt||"").slice(0,10))+" — "+(a.type||"Suivi")+" : "+(a.detail||""));
 }
 if(campaigns.length){
 lines.push("","4. PROMOTION ET CAMPAGNES LIÉES");
 for(const c of campaigns)lines.push("• "+(c.title||"Campagne")+" | "+(c.platform||"Plateforme à préciser")+" | "+(c.status||"Statut à préciser")+" | "+formatDate(c.date)+"\n  "+(c.notes||""));
 }
 if(tasks.length){
 lines.push("","5. SUIVIS ET ENGAGEMENTS");
 for(const t of tasks)lines.push("• "+(t.done?"Terminé":"À faire")+" — "+(t.title||"Action")+" | "+formatDate(t.due)+"\n  "+(t.notes||""));
 }
 lines.push("","6. SYNTHÈSE ET DÉCISION DEMANDÉE",
 "Je propose que MEYDEN évalue cette piste et détermine avec moi la suite des démarches.",
 "Les étapes, partenariats, budgets ou engagements éventuels demeurent sujets à validation.",
 "",
 "Merci,",
 "R-niel Yousoft",
 "Promotion et développement artistique",
 "MEYDEN — Mouvement artistique du Québec",
 "Structurer • Créer • Élever");
 return lines.join("\n");
}
function draftRecipients(){const c=data.settings||{};return [String(c.meydenEmail||"").trim(),String(c.rnielEmail||"").trim()].filter(Boolean)}
function draftHref(to,subject,body){
 return "mailto:"+to.map(encodeURIComponent).join(",")+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
}
function previewOpportunity(o){
 const to=draftRecipients(),subject=opportunitySubject(o),body=opportunityText(o);
 $("dialog-content").innerHTML='<div class="modal-head"><h2>Courriel construit à partir du parcours</h2><button class="close" type="button" data-action="close" aria-label="Fermer">×</button></div>'+
 '<div class="modal-body"><p class="sub">Le texte rassemble automatiquement la proposition et les informations associées au même artiste : profil, notes, historique des échanges, promotions et suivis. Tu peux le modifier avant l’envoi.</p>'+
 '<div class="field"><label>Destinataires (À)</label><div class="notice">'+(to.length===2?safe(to.join(" • ")):"Les deux adresses doivent être configurées dans Réglages.")+'</div></div>'+
 '<div class="field" style="margin-top:12px"><label for="draft-subject">Objet du courriel</label><input class="input" id="draft-subject" maxlength="220" value="'+safe(subject)+'"></div>'+
 '<div class="field" style="margin-top:12px"><label for="draft-body">Rapport complet — modifiable</label><textarea id="draft-body" rows="20" style="min-height:310px">'+safe(body)+'</textarea></div>'+
 '<div class="notice orange" style="margin-top:12px">Le bouton prépare seulement le brouillon. R-niel doit vérifier et appuyer sur Envoyer dans sa propre messagerie.</div>'+
 '<div class="modal-foot" style="flex-wrap:wrap;justify-content:flex-start">'+btn("close","Fermer","sm")+btn("copy-draft","Copier le courriel","sm")+(to.length===2?btn("open-draft","Ouvrir le courriel à deux","primary",'data-id="'+safe(o.id)+'"'):btn("draft-settings","Configurer les adresses","primary"))+'</div></div>';
 $("dialog").showModal();
}
function openDraft(o){
 const to=draftRecipients();
 if(to.length!==2){$("dialog").close();setPage("settings");toast("Il faut d’abord les deux adresses.");return}
 const subject=$("draft-subject")?.value||opportunitySubject(o),body=$("draft-body")?.value||opportunityText(o);
 o.preparedAt=now();o.status="Courriel préparé";save();
 window.location.href=draftHref(to,subject,body);
 toast("Brouillon ouvert pour les deux destinataires. À envoyer depuis ta messagerie.");
}
async function copyDraft(){
 const txt="À : "+draftRecipients().join(", ")+"\nObjet : "+($("draft-subject")?.value||"")+"\n\n"+($("draft-body")?.value||"");
 try{await navigator.clipboard.writeText(txt);toast("Courriel complet copié.");}
 catch{const el=$("draft-body");if(el){el.select();document.execCommand("copy");toast("Texte sélectionné.");}}
}
function opportunityItem(o,short){
 const state=o.confirmedSentAt?"Envoi confirmé":o.preparedAt?"Courriel préparé":"Brouillon";
 return '<article class="item"><div><h3>✦ '+safe(o.title)+'</h3><div class="inline-actions">'+pill(state,o.confirmedSentAt?"green":"orange")+pill(o.type||"Autre")+pill(o.ref||"")+'</div><p>'+safe(o.person||linkedTalent(o)?.name||"Contact à préciser")+' · '+formatDate((o.createdAt||"").slice(0,10))+'</p>'+(short?"":'<p>'+safe(o.description)+'</p>')+'</div><div class="item-actions">'+(short?btn("go-opportunities","Voir","sm"):btn("edit-opportunity","Modifier","sm",'data-id="'+safe(o.id)+'"')+btn("email-draft","Voir le courriel complet","sm primary",'data-id="'+safe(o.id)+'"')+(o.confirmedSentAt?"":btn("confirm-draft","Marquer comme envoyé","sm",'data-id="'+safe(o.id)+'"'))+btn("delete-opportunity","Supprimer","sm warn",'data-id="'+safe(o.id)+'"'))+'</div></article>';
}
function renderOpportunities(){
 return '<div class="section-top"><h2>Proposer une opportunité à MEYDEN</h2>'+btn("new-opportunity","✦ Nouvelle proposition","primary")+'</div>'+
 '<div class="notice">Un courriel évolutif : chaque information recueillie sur un artiste lié au dossier (fiches, historique, promotion, tâches) s’ajoute à la synthèse lorsqu’on l’ouvre. R-niel vérifie ensuite et l’envoie elle-même aux deux adresses.</div>'+
 '<div class="items" style="margin-top:16px">'+(data.opportunities.length?[...data.opportunities].reverse().map(o=>opportunityItem(o,false)).join(""):empty("✦","Aucune proposition enregistrée","Crée une piste de collaboration et associe-la à un talent pour intégrer le parcours complet.","new-opportunity","Créer une proposition"))+'</div>';
}
function renderIncubation(){
const levels=[
{title:"Niveau 1 — Structuration",price:"100 $ CA / mois",intro:"Construire une identité artistique claire et un dossier professionnel.",items:["Analyse musicale et positionnement","Direction artistique de base","Dossier DJ et liens de performance","Création ou optimisation Hedliner","Diagnostic des réseaux et lives","Plan d’action mensuel"]},
{title:"Niveau 2 — Déploiement",price:"250 $ CA / mois",intro:"Renforcer la visibilité et préparer des démarches de booking.",items:["Tout le niveau 1","Image publique et branding","Stratégie de contenus courts","Dossier de presse électronique (EPK)","Préparation booking et fiche technique","Recherche ciblée de salles et partenaires"]},
{title:"Niveau 3 — Expansion",price:"250 $ CA / mois + %",intro:"Développer un projet événementiel et des possibilités de revenus.",items:["Niveaux 1 et 2 inclus","Direction stratégique avancée","Conception de spectacles / événements","Études de budget et de faisabilité","Partenariats et commandites","Analyse des retombées et revenus"]}
];
return '<div class="notice">R-niel peut expliquer les niveaux et orienter les demandes. Les décisions contractuelles, la représentation et les mandats restent sous validation de MEYDEN. Les frais de production et la participation aux revenus du niveau 3 sont définis par entente écrite.</div><div class="cards" style="margin-top:16px">'+levels.map(x=>'<div class="mini"><div class="eyebrow">INCUBATEUR DJ</div><h3>'+x.title+'</h3><div class="money">'+x.price+'</div><p>'+x.intro+'</p><ul style="font-size:12px;color:#d3cce1;line-height:1.9;padding-left:18px">'+x.items.map(y=>'<li>'+safe(y)+'</li>').join("")+'</ul></div>').join("")+'</div><section class="panel" style="margin-top:17px"><h2>Orienter un DJ</h2><p>Lorsqu’un artiste manifeste un intérêt, ajoute-le au répertoire avec le statut « Orientation MEYDEN » puis crée une tâche pour transmettre son dossier.</p>'+btn("new-talent","Ajouter un DJ","primary")+' <a class="btn" href="https://meyden-incubation-artistique.vercel.app/" target="_blank" rel="noopener noreferrer">Découvrir l’incubation ↗</a></section>'}
function renderReports(){
const total=data.talents.length,interested=data.talents.filter(x=>["Intéressé","Orientation MEYDEN","En collaboration"].includes(x.status)).length,completed=data.tasks.filter(x=>x.done).length,finished=data.campaigns.filter(x=>x.status==="Terminée").length,sent=data.opportunities.filter(x=>x.confirmedSentAt).length;
return '<div class="stats">'+metric(total,"Talents enregistrés")+metric(interested,"Talents intéressés")+metric(completed,"Suivis terminés")+metric(finished,"Campagnes terminées")+'</div><div class="grid2"><section class="panel"><h2>Activités enregistrées</h2><p>Campagnes au total : <b>'+data.campaigns.length+'</b></p><p>Suivis en attente : <b>'+(data.tasks.length-completed)+'</b></p><p>Opportunités consignées : <b>'+data.opportunities.length+'</b></p><p>Échanges et découvertes consignés : <b>'+(data.activities||[]).length+'</b></p><p>Courriels marqués comme envoyés : <b>'+sent+'</b></p><div class="divider"></div><div class="inline-actions">'+btn("print","Imprimer / PDF","primary")+btn("export","Exporter les données")+'</div></section><section class="panel"><h2>Valorisation du travail</h2><p>Ces indicateurs mesurent les démarches consignées. Une proposition transmise ne correspond pas nécessairement à une collaboration acceptée et la visibilité n’équivaut pas automatiquement à un public en salle.</p><p>Ajoute une date, les échanges et le résultat observé dans chaque fiche pour produire des bilans crédibles.</p><div class="notice">Bilans fondés uniquement sur les données enregistrées dans ce navigateur. Ils ne représentent pas des statistiques vérifiées d’autres plateformes.</div></section></div>'}
function renderSettings(){
 const s=data.settings||{};
 return '<div class="notice" style="margin-bottom:16px">Le courriel est composé à partir de toutes les informations liées à l’artiste pendant son parcours. Les deux adresses sont préparées en même temps : R-niel vérifie et envoie depuis sa messagerie.</div>'+
 '<div class="grid2"><section class="panel"><h2>Destinataires des rapports</h2><p>À configurer une seule fois sur cet appareil. Ces adresses sont intégrées aux brouillons créés par le programme.</p>'+
 '<form data-form="settings" class="stack"><div class="field"><label for="meyden-email">Mathieu Prud’homme — MEYDEN</label><input id="meyden-email" name="meydenEmail" type="email" class="input" value="'+safe(s.meydenEmail||"")+'" placeholder="adresse@gmail.com" required></div>'+
 '<div class="field"><label for="rniel-email">R-niel Yousoft</label><input id="rniel-email" name="rnielEmail" type="email" class="input" value="'+safe(s.rnielEmail||"")+'" placeholder="adresse@gmail.com" required></div>'+
 '<button class="btn primary" type="submit">Enregistrer les adresses</button></form></section>'+
 '<section class="panel"><h2>Récupérer les adresses déjà configurées</h2><p>Si tu disposes du code MEYDEN, récupère les deux adresses depuis la configuration protégée du serveur Vercel. Ce code n’active aucun envoi automatique.</p>'+
 '<div class="field"><label for="send-code">Code privé MEYDEN</label><input type="password" id="send-code" class="input" autocomplete="off" placeholder="Code d’accès MEYDEN"></div><div style="margin-top:13px">'+btn("save-code","Récupérer les deux adresses","primary")+'</div></section>'+
 '<section class="panel"><h2>Sauvegarder le parcours</h2><p>Les talents, l’historique, les campagnes, les tâches et les opportunités restent dans ce navigateur. Enregistre des sauvegardes privées pour éviter toute perte.</p><div class="inline-actions">'+btn("export","Exporter JSON","primary")+btn("import-click","Importer JSON")+btn("reset","Effacer les données locales","warn")+'</div><input type="file" id="import-file" accept=".json,application/json" hidden></section>'+
 '<section class="panel"><h2>Liens utiles</h2><div class="quick-links"><a class="btn" href="https://meydenx-hedliner.vercel.app/" target="_blank" rel="noopener noreferrer">MEYDEN × Hedliner ↗</a><a class="btn" href="https://hedliner.com/" target="_blank" rel="noopener noreferrer">Hedliner ↗</a><a class="btn" href="https://github.com/Matthprudd/R-Niel_Djstools" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></section></div>';
}
function field(name,label,value="",type="text",opts={}){
return '<div class="field '+(opts.wide?"wide":"")+'"><label for="f-'+name+'">'+label+'</label>'+(type==="textarea"?'<textarea id="f-'+name+'" name="'+name+'" '+(opts.required?"required":"")+' maxlength="'+(opts.max||3000)+'" placeholder="'+safe(opts.placeholder||"")+'">'+safe(value)+'</textarea>':type==="select"?'<select id="f-'+name+'" name="'+name+'">'+(opts.options||[]).map(o=>'<option value="'+safe(o)+'" '+(o===value?"selected":"")+'>'+safe(o)+'</option>').join("")+'</select>':'<input class="input" type="'+type+'" id="f-'+name+'" name="'+name+'" value="'+safe(value)+'" '+(opts.required?"required":"")+' maxlength="'+(opts.max||200)+'" placeholder="'+safe(opts.placeholder||"")+'">')+'</div>'}
function modal(form,title,fields,obj){const val=obj||{},body='<div class="modal-head"><h2>'+title+'</h2><button class="close" type="button" data-action="close" aria-label="Fermer">×</button></div><form data-form="'+form+'" class="modal-body"><input type="hidden" name="id" value="'+safe(val.id||"")+'"><div class="form-grid">'+fields.join("")+'</div><div class="modal-foot">'+btn("close","Annuler")+'<button class="btn primary" type="submit">'+(form==="opportunity"?"Enregistrer et préparer le courriel":"Enregistrer")+'</button></div></form>';$("dialog-content").innerHTML=body;if($("dialog").open)$("dialog").close();$("dialog").showModal()}
function newTalent(x){modal("talent",x?"Modifier la fiche DJ":"Nouvelle fiche DJ",[
field("name","Nom artistique",x?.name,"text",{required:true,max:120}),
field("style","Style musical",x?.style,"text",{max:80,placeholder:"House, Techno, Métal..."}),
field("city","Ville / région",x?.city),field("platform","Plateforme / découverte",x?.platform,"select",{options:["TikTok","Instagram","Facebook","YouTube","SoundCloud","Spectacle","Autre"]}),
field("link","Lien de profil ou d’écoute",x?.link,"url",{wide:true,max:500,placeholder:"https://..."}),
field("status","Étape de la relation",x?.status||"Découvert","select",{options:STATUS}),
field("notes","Observations et prochaines pistes",x?.notes,"textarea",{wide:true,max:1500})
],x)}
function newCampaign(x){modal("campaign",x?"Modifier la campagne":"Nouvelle campagne",[
field("title","Nom de la campagne",x?.title,"text",{wide:true,required:true}),
field("platform","Canal principal",x?.platform||"TikTok","select",{options:["TikTok","Instagram","Facebook","YouTube","Messenger","Événement","Multiplateforme"]}),
talentField(x?.talentId||""),field("date","Date envisagée",x?.date||day(),"date"),field("status","Avancement",x?.status||"Idée","select",{options:CAMPAIGN_STATUS}),
field("notes","Objectif, médias, script, liens et étapes",x?.notes,"textarea",{wide:true,max:3000})
],x)}
function newTask(x){modal("task",x?"Modifier le suivi":"Nouveau suivi",[
field("title","Action à réaliser",x?.title,"text",{wide:true,required:true,max:180}),
field("related","Artiste / partenaire concerné",x?.related),talentField(x?.talentId||""),field("due","Date prévue",x?.due||day(),"date"),
field("notes","Notes",x?.notes,"textarea",{wide:true,max:1200})
],x)}
function newOpportunity(x){modal("opportunity",x?"Modifier une opportunité":"Proposer une opportunité à MEYDEN",[
field("title","Titre de l’opportunité",x?.title,"text",{wide:true,required:true,max:160}),
field("type","Type",x?.type||TYPES[0],"select",{options:TYPES}),
talentField(x?.talentId||""),
field("person","Personne / artiste / organisation",x?.person,"text",{max:150}),
field("contact","Lien ou coordonnées publiques",x?.contact,"text",{wide:true,max:300}),
field("description","Pourquoi cette opportunité est intéressante",x?.description,"textarea",{wide:true,required:true,max:2500}),
field("nextStep","Prochaine étape suggérée",x?.nextStep,"textarea",{wide:true,max:700})
],x)}
function getData(form){return Object.fromEntries(new FormData(form).entries())}
function saveForm(form){
const kind=form.dataset.form,r=getData(form);
if(kind==="settings"){data.settings={meydenEmail:String(r.meydenEmail||"").trim(),rnielEmail:String(r.rnielEmail||"").trim()};save();render();toast("Adresses enregistrées sur cet appareil.");return}
const key={talent:"talents",campaign:"campaigns",task:"tasks",opportunity:"opportunities",activity:"activities"}[kind];if(!key)return;
const arr=data[key],pos=arr.findIndex(x=>x.id===r.id),prev=pos>=0?arr[pos]:null;
const obj={...(prev||{}),...r,id:prev?prev.id:id(),createdAt:prev?.createdAt||now(),updatedAt:now()};
if(kind==="task")obj.done=Boolean(prev?.done);
if(kind==="opportunity"){obj.ref=prev?.ref||"MEY-OP-"+day().replaceAll("-","")+"-"+Math.random().toString(36).slice(2,6).toUpperCase();obj.status="Brouillon";obj.preparedAt=null;obj.confirmedSentAt=null;}
if(pos>=0)arr[pos]=obj;else arr.push(obj);
if(kind==="talent"&&(!prev||prev.status!==obj.status||prev.notes!==obj.notes)){
 const explanation=!prev?"Découverte : "+obj.name+" | "+(obj.style||"Style à préciser")+" | "+(obj.city||"Région à préciser"):"Profil actualisé : statut "+(obj.status||"")+(prev.status!==obj.status?" (précédemment : "+(prev.status||"")+")":"")+". "+(obj.notes||"");
 data.activities.push({id:id(),talentId:obj.id,type:prev?"Mise à jour du profil":"Découverte",date:day(),detail:explanation,createdAt:now()});
}
save();$("dialog").close();render();toast("Enregistré avec succès.");
if(kind==="opportunity")previewOpportunity(obj);
}
function remove(kind,key){const arr=data[kind],item=arr.find(x=>x.id===key);if(!item)return;if(!confirm("Supprimer cette fiche ? Cette action n’est pas réversible sans sauvegarde."))return;data[kind]=arr.filter(x=>x.id!==key);save();render();toast("Fiche supprimée.")}
function generateMessage(x){
const body="Bonjour "+x.name+",\n\nJe suis R-niel, collaboratrice en promotion artistique avec MEYDEN — Mouvement artistique du Québec.\n\nJ’ai découvert ton univers musical"+(x.style?" ("+x.style+")":"")+" et j’aimerais faire connaissance et en apprendre davantage sur tes projets.\n\nMEYDEN accompagne les artistes et les DJ dans la structuration, leur visibilité et leur développement professionnel. Si cela t’intéresse, nous pourrions échanger pour voir si une collaboration est pertinente.\n\nAu plaisir,\nR-niel\nMEYDEN — Mouvement artistique du Québec";
$("dialog-content").innerHTML='<div class="modal-head"><h2>Message de premier contact</h2><button class="close" data-action="close">×</button></div><div class="modal-body"><p class="sub">Modifie le message selon la relation réelle avec l’artiste. Aucun envoi automatique.</p><textarea id="message-content" rows="14" style="min-height:280px">'+safe(body)+'</textarea><div class="modal-foot">'+btn("close","Fermer")+btn("copy-message","Copier le message","primary")+'</div></div>';$("dialog").showModal()
}
async function copyMessage(){const box=$("message-content");if(!box)return;try{await navigator.clipboard.writeText(box.value);toast("Message copié.")}catch{box.select();document.execCommand("copy");toast("Texte sélectionné / copié.")}}
function download(name,text,type){const blob=new Blob([text],{type:type||"application/json;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function backup(){download("R-Niel_PromoHub_Sauvegarde_"+day()+".json",JSON.stringify({app:"rniel-promohub",version:1,exportedAt:now(),data},null,2));toast("Sauvegarde téléchargée.")}
async function importJSON(file){try{if(file.size>4*1024*1024)throw Error("Fichier trop volumineux.");const payload=JSON.parse(await file.text());const d=payload.data||payload;if(!d||!Array.isArray(d.talents)||!Array.isArray(d.tasks)||!Array.isArray(d.campaigns)||!Array.isArray(d.opportunities))throw Error("Format incompatible.");if(!confirm("Importer cette sauvegarde et remplacer toutes les données locales actuelles ?"))return;data={talents:d.talents,campaigns:d.campaigns,tasks:d.tasks,opportunities:d.opportunities,activities:Array.isArray(d.activities)?d.activities:[],settings:{meydenEmail:"",rnielEmail:"",...(d.settings||{})}};save();render();toast("Sauvegarde importée.")}catch(e){toast("Échec de l’import : "+e.message)}}
function clearData(){if(!confirm("Effacer toutes les données enregistrées dans ce navigateur ? Exporte une sauvegarde avant de continuer."))return;if(!confirm("Dernière confirmation : cette suppression est définitive."))return;data={talents:[],campaigns:[],tasks:[],opportunities:[],activities:[],settings:{meydenEmail:"",rnielEmail:""}};save();render();toast("Données locales effacées.")}
function filterItems(which){const query=(which==="talent"?filterTalents:filterCampaigns).toLowerCase().trim();const selector=which==="talent"?"#talent-list .talent":"#campaign-list .campaign";document.querySelectorAll(selector).forEach(n=>n.style.display=(n.dataset.search.includes(query)&&(which!=="talent"||filterStatus==="Tous"||n.dataset.status===filterStatus))?"":"none")}
document.addEventListener("click",async e=>{
const nav=e.target.closest("[data-page]");if(nav){setPage(nav.dataset.page);return}
const b=e.target.closest("[data-action]");if(!b)return;
const action=b.dataset.action,key=b.dataset.id;
const get=k=>data[k].find(x=>x.id===key);
if(action==="new-talent")newTalent();
else if(action==="edit-talent")newTalent(get("talents"));
else if(action==="show-history"){const x=get("talents");if(x)showHistory(x)}
else if(action==="add-activity"){const x=get("talents");if(x){if($("dialog").open)$("dialog").close();newActivity(x.id)}}
else if(action==="delete-activity"){const x=get("activities");if(x&&confirm("Supprimer cette information du parcours ?")){data.activities=data.activities.filter(a=>a.id!==key);save();const t=data.talents.find(t=>t.id===x.talentId);if(t)showHistory(t);else $("dialog").close();render()}}
else if(action==="propose-talent"){const x=get("talents");if(x)newOpportunity({talentId:x.id,person:x.name,contact:x.link||"",title:"Occasion de développement — "+x.name,description:x.notes||"Artiste découvert à présenter à MEYDEN."})}
else if(action==="delete-talent")remove("talents",key);
else if(action==="new-campaign")newCampaign();
else if(action==="edit-campaign")newCampaign(get("campaigns"));
else if(action==="delete-campaign")remove("campaigns",key);
else if(action==="new-task")newTask();
else if(action==="edit-task")newTask(get("tasks"));
else if(action==="delete-task")remove("tasks",key);
else if(action==="toggle-task"){const x=get("tasks");if(x){x.done=!x.done;save();render()}}
else if(action==="new-opportunity")newOpportunity();
else if(action==="edit-opportunity")newOpportunity(get("opportunities"));
else if(action==="delete-opportunity")remove("opportunities",key);
else if(action==="email-draft"){const x=get("opportunities");if(x)previewOpportunity(x)}
else if(action==="open-draft"){const x=get("opportunities");if(x)openDraft(x)}
else if(action==="copy-draft")await copyDraft();
else if(action==="draft-settings"){$("dialog").close();setPage("settings");}
else if(action==="confirm-draft"){const x=get("opportunities");if(x&&confirm("Confirmer avoir envoyé le courriel aux deux destinataires depuis ta messagerie ?")){x.confirmedSentAt=now();x.status="Envoi confirmé par R-niel";save();render();toast("Envoi personnel confirmé dans le suivi.");}}
else if(action==="message-talent"){const x=get("talents");if(x)generateMessage(x)}
else if(action==="copy-message")copyMessage();
else if(action==="go-incubation")setPage("incubation");
else if(action==="go-reports")setPage("reports");
else if(action==="go-opportunities")setPage("opportunities");
else if(action==="close")$("dialog").close();
else if(action==="export")backup();
else if(action==="import-click")$("import-file")?.click();
else if(action==="print")window.print();
else if(action==="reset")clearData();
else if(action==="save-code"){const v=$("send-code")?.value?.trim();if(!v||v.length<20){toast("Entre le code d’accès sécurisé fourni par MEYDEN.");return}try{const res=await fetch("/api/recipients",{method:"POST",headers:{"X-Rniel-Access-Code":v}});const d=await res.json();if(!res.ok||!d.ok)throw new Error(d.error||"Code refusé");data.settings={...data.settings,meydenEmail:d.meydenEmail,rnielEmail:d.rnielEmail};save();render();toast("Adresses récupérées. Les courriels peuvent maintenant être préparés.");}catch(err){toast("Code non accepté : "+String(err.message).slice(0,120))}}
});
document.addEventListener("submit",e=>{if(e.target.matches("form[data-form]")){e.preventDefault();saveForm(e.target)}});
document.addEventListener("input",e=>{if(e.target.id==="talent-search"){filterTalents=e.target.value;filterItems("talent")}else if(e.target.id==="campaign-search"){filterCampaigns=e.target.value;filterItems("campaign")}});
document.addEventListener("change",e=>{if(e.target.id==="talent-status"){filterStatus=e.target.value;filterItems("talent")}else if(e.target.id==="import-file"&&e.target.files?.[0]){importJSON(e.target.files[0]);e.target.value=""}});
$("dialog").addEventListener("click",e=>{if(e.target===$("dialog"))$("dialog").close()});
render();
})();