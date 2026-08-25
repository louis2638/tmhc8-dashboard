color:rgba(56,189,248,.3)" title="Click to remove">'+dr+' &#10005;</span>';});h+='</div>';}else{h+='<span style="font-size:11px;color:var(--tx3)">No doctors assigned</span>';}h+='<div style="display:flex;gap:4px;margin-top:6px;border-top:1px solid var(--bd2);padding-top:4px">';h+='<input id="customDoc_'+wn+'" placeholder="Add doctor..." style="font-size:11px;flex:1;padding:2px 6px" onkeydown="if(event.key===\'Enter\')addCustomDocToWard(\''+wn+'\')">';h+='<button class="btn btn-p" style="font-size:10px;padding:1px 8px" onclick="addCustomDocToWard(\''+wn+'\')">+</button>';h+='</div>';h+='</div>';});h+='</div>';el.innerHTML=h;}
// Toggle ward doctor editing panel
var _editingWardDoc=null;
function editWardDocs(wn){const el=document.getElementById('wardDocEl');if(!el)return;if(_editingWardDoc===wn){renderWardDocList();_editingWardDoc=null;return;}const wdocs=getWardDocs(wn);let h='<div style="margin:4px 0;padding:6px;background:var(--bg3);border-radius:3px;border:1px solid var(--bd)">';h+='<div style="font:700 12px system-ui;color:var(--acc);margin-bottom:4px">'+wn+' — Select doctors ('+wdocs.length+')</div>';h+='<div style="display:flex;flex-wrap:wrap;gap:3px">';DOCS.forEach(dr=>{const inWard=wdocs.includes(dr);h+='<button class="btn '+(inWard?'btn-p':'btn-s')+'" style="font-size:12px;padding:2px 6px" onclick="toggleDocInWard(\''+dr+'\',\''+wn+'\')">'+(inWard?'&#10003; ':'')+dr+'</button>';});h+='</div>';h+='<div style="margin-top:6px;display:flex;gap:4px;border-top:1px solid var(--bd);padding-top:6px">';h+='<input id="customDoc_'+wn+'" placeholder="Add custom doctor..." style="font-size:12px;flex:1;padding:3px 6px" onkeydown="if(event.key===\'Enter\')addCustomDocToWard(\''+wn+'\')">';h+='<button class="btn btn-p" style="font-size:11px;padding:2px 8px" onclick="addCustomDocToWard(\''+wn+'\')">+ Add</button>';h+='</div>';h+='<div style="margin-top:4px"><button class="btn btn-s" style="font-size:12px;padding:2px 6px" onclick="renderWardDocList();_editingWardDoc=null;">Done</button></div>';h+='</div>';el.innerHTML=h;_editingWardDoc=wn;}
function addCustomDocToWard(wn){const input=document.getElementById('customDoc_'+wn);if(!input)return;const raw=input.value.trim();if(!raw)return;const norm=normDocName(raw);if(!DOCS.includes(norm)){DOCS.push(norm);DOCS.sort((a,b)=>docFamily(a).localeCompare(docFamily(b)));}if(!S.wardDocs)S.wardDocs={};if(!S.wardDocs[wn])S.wardDocs[wn]=[];if(!S.wardDocs[wn].includes(norm)){S.wardDocs[wn].push(norm);S.wardDocs[wn].sort();save();}input.value='';editWardDocs(wn);}
function toggleDocInWard(dr,wn){if(!S.wardDocs)S.wardDocs={};if(!S.wardDocs[wn])S.wardDocs[wn]=[];const idx=S.wardDocs[wn].indexOf(dr);if(idx>=0)S.wardDocs[wn].splice(idx,1);else{S.wardDocs[wn].push(dr);S.wardDocs[wn].sort();}save();editWardDocs(wn);}
function toggleWardDoc(wn){if(_editingWardDoc===wn){renderWardDocList();_editingWardDoc=null;return;}editWardDocs(wn);}
function addWard(){const input=document.getElementById('newWardName');const name=input.value.trim().toUpperCase();if(!name){toast('Enter ward name','wa');return;}if(WARD_ORDER.includes(name)){toast('Ward already exists','wa');return;}WARD_ORDER.push(name);WARDS[name]=[];input.value='';save();renderWardDocList();toast('Ward '+name+' added','ok');}
// Smart doctor add with ward matching + normalization
function addDoctor(){const input=document.getElementById('newDocName');const wSel=document.getElementById('newDocWard');const raw=input.value.trim();if(!raw){toast('Enter doctor name','wa');return;}const norm=normDocName(raw);if(DOCS.includes(norm)){toast(norm+' already exists','wa');return;}const family=docFamily(norm);const suggestedWard=WARD_ORDER.find(w=>w.toLowerCase().includes(family.toLowerCase())||family.toLowerCase().includes(w.replace(/\d/g,'').toLowerCase()));const promptEl=document.getElementById('docPromptEl');if(suggestedWard&&!wSel.value){promptEl.innerHTML='<div style="display:flex;gap:6px;align-items:center"><span>Did you mean <b>'+suggestedWard+'</b> Dr. '+family+'?</span><button class="btn btn-p" style="font-size:12px;padding:2px 6px" onclick="confirmSmartDoc(\''+norm+'\',\''+suggestedWard+'\')">Yes</button><button class="btn btn-s" style="font-size:12px;padding:2px 6px" onclick="forceAddDoc(\''+norm+'\')">No</button><button class="btn btn-s" style="font-size:12px;padding:2px 6px" onclick="cancelAddDoc()">Cancel</button></div>';return;}forceAddDoc(norm,wSel?wSel.value:'');}
function confirmSmartDoc(dr,wn){document.getElementById('docPromptEl').innerHTML='';forceAddDoc(dr,wn);}
function forceAddDoc(dr,wn){const input=document.getElementById('newDocName');document.getElementById('docPromptEl').innerHTML='';DOCS.push(dr);DOCS.sort((a,b)=>docFamily(a).localeCompare(docFamily(b)));if(wn){if(!S.wardDocs)S.wardDocs={};if(!S.wardDocs[wn])S.wardDocs[wn]=[];if(!S.wardDocs[wn].includes(dr)){S.wardDocs[wn].push(dr);S.wardDocs[wn].sort();}}input.value='';save();renderWardDocList();const sel=document.getElementById('newDocWard');if(sel)sel.innerHTML=WARD_ORDER.map(w=>'<option value="'+w+'">'+w+'</option>').join('');toast(dr+(wn?' added to '+wn:' added'),'ok');}
function cancelAddDoc(){document.getElementById('docPromptEl').innerHTML='';}
function removeDoctor(idx){if(idx<0||idx>=DOCS.length)return;const dr=DOCS[idx];if(!confirm('Remove '+dr+'?'))return;DOCS.splice(idx,1);Object.keys(S.wardDocs||{}).forEach(wn=>{const i=(S.wardDocs[wn]||[]).indexOf(dr);if(i>=0)S.wardDocs[wn].splice(i,1);});save();renderWardDocList();toast(dr+' removed','ok');}
function renderSumItemsInline(){var items=['clinical','app','screen','dc','wr','onleave','mdro','plan','doneApp'];if(!S.sumConfig)S.sumConfig={clinical:true,app:true,screen:true,dc:true,wr:true,onleave:true,mdro:true,plan:true,doneApp:true};var el=document.getElementById('sumItems');if(!el)return;var chips=el.querySelectorAll('.tchip');for(var i=0;i<chips.length&&i<items.length;i++){if(S.sumConfig[items[i]])chips[i].classList.add('on');else chips[i].classList.remove('on');}}
function renderSetLogInline(){var el=document.getElementById('setLogList');if(!el)return;var logs=S.logs||[];if(!logs.length){el.innerHTML='<span style="color:var(--tx3)">No records</span>';return;}var h='';var rev=logs.slice().reverse();for(var i=0;i<rev.length;i++){var l=rev[i];var clr=l.action==='Admit'?'var(--acc)':l.action==='Discharge'?'var(--er)':l.action==='Transfer'?'#c084fc':l.action==='Daily Reset'?'var(--wa)':'var(--tx3)';h+='<div style="display:flex;gap:6px;padding:2px 0;border-bottom:1px solid rgba(148,163,184,0.05)"><span style="color:var(--tx3);font-weight:700;min-width:30px;font-size:12px">'+l.time+'</span><span style="background:'+clr+';color:#fff;font:700 7px system-ui;padding:1px 3px;border-radius:3px;text-transform:uppercase;flex-shrink:0;height:14px;display:inline-flex;align-items:center">'+l.action+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+l.detail+'</span></div>';}el.innerHTML=h;}

function addBedToCub(cn){
  if(!CUBS[cn]){toast('Cubicle '+cn+' not found','er');return;}
  const num=parseInt(prompt('Add bed number to '+cn+':'));
  if(!num||isNaN(num)){return;}
  if(S.beds[num]){toast('Bed '+num+' already exists','er');return;}
  if(CUBS[cn].includes(num)){toast('Bed '+num+' already in '+cn,'er');return;}
  CUBS[cn].push(num);
  CUBS[cn].sort((a,b)=>a-b);
  S.beds[num]={occupied:false,patient:{name:'',diagnosis:'',admissionDate:'',gender:'',age:0,mrn:''},doctor:'',parentWard:'C8',alerts:{fallRisk:false,dn:false,sp:false,bipap:false,hfnc:false,vt:false,isolation:false,escort:false,dysphagia:false,allergyBand:false,woundCare:false,restraint:false,npo:false,npoem:false,transfusion:false,pendingXray:false,adli:false},wardRound:{done:false,doctor:'',note:'',time:''},keyMsg:'',phoneContact:'',onLeave:false,reliefMO:'',plan:{type:'',targetDate:'',dischargeTo:'',pending:false},cmoMsg:'',mdro:{vre:false,cpe:false,mra:false,cAuris:false},transferHistory:[],screening:{records:[],contactVRE:false,contactCPE:false,contactMRA:false,contactCAuris:false},bathing:[],apps:[],handover:{}};
  S.hiddenBeds=S.hiddenBeds.filter(n=>n!==num);
  recalcFloorLayout();
  save();
  renderHidBedList();
  render();
  toast('Bed '+num+' added to '+cn,'ok');
}
function delBedFromCub(cn){
  if(!CUBS[cn]||!CUBS[cn].length){toast('No beds in '+cn,'wa');return;}
  const num=parseInt(prompt('Delete bed number from '+cn+' (current: '+CUBS[cn].join(',')+'):'));
  if(!num||isNaN(num)){return;}
  if(!CUBS[cn].includes(num)){toast('Bed '+num+' not in '+cn,'er');return;}
  if(S.beds[num]&&S.beds[num].occupied){if(!confirm('Bed '+num+' is occupied! Delete anyway?'))return;}
  delete S.beds[num];
  CUBS[cn]=CUBS[cn].filter(n=>n!==num);
  S.hiddenBeds=S.hiddenBeds.filter(n=>n!==num);
  recalcFloorLayout();
  save();
  renderHidBedList();
  render();
  toast('Bed '+num+' removed from '+cn,'ok');
}
function toggleHidBed(n){
  const idx=S.hiddenBeds.indexOf(n);
  if(idx>=0)S.hiddenBeds.splice(idx,1);else S.hiddenBeds.push(n);
  save();renderHidBedList();render();
  toast('Bed '+n+(idx>=0?' shown':' hidden'),'ok');
}

// ===== SEARCH =====
function searchBed(){const q=document.getElementById('bedSearch')?.value.trim().toLowerCase();if(!q)return;const all=Object.values(S.beds).filter(b=>b.occupied&&!isHid(b.num));const found=all.find(b=>String(b.num).includes(q)||(b.patient&&(b.patient.name.toLowerCase().includes(q)||b.patient.diagnosis.toLowerCase().includes(q)||b.patient.mrn.toLowerCase().includes(q))));if(found){S.ui.selectedBed=found.num;save();goPp();}else toast('No match','wa');}
function hdrSearchBed(){const q=document.getElementById('hdrSearch')?.value.trim().toLowerCase();if(!q)return;const all=Object.values(S.beds).filter(b=>b.occupied&&!isHid(b.num));const found=all.find(b=>String(b.num).includes(q)||(b.patient&&(b.patient.name.toLowerCase().includes(q)||b.patient.diagnosis.toLowerCase().includes(q)||b.patient.mrn.toLowerCase().includes(q))));if(found){S.ui.selectedBed=found.num;save();goPp();}else toast('No match','wa');}

// ===== NOTICE =====
let nRot=0;
function renderNoticeBar(){const d=new Date();const h=d.getHours();const occ=Object.values(S.beds).filter(b=>b.occupied&&!isHid(b.num));const wrPending=occ.filter(b=>!b.wardRound.done);const nbar=document.getElementById('nbar');const isAfter15=h>=15&&wrPending.length>0;if(isAfter15){if(nbar)nbar.classList.add('nbar-wr-urgent');document.getElementById('ntxt').innerHTML='<span style="color:var(--wa);font-weight:800;text-shadow:0 0 8px rgba(245,158,11,.4)">&#9888; WR URGENT: '+wrPending.length+' beds pending</span> <span style="color:var(--tx3)">'+wrPending.map(b=>b.num).join(',')+'</span>';}else{if(nbar)nbar.classList.remove('nbar-wr-urgent');const active=(S.notices||[]).filter(n=>!n.deleted&&n.effectFrom<=_ts()&&n.endWith>=_ts());if(!active.length){document.getElementById('ntxt').textContent='Welcome to TMHC8 Ward Dashboard';}else{nRot=nRot%active.length;document.getElementById('ntxt').textContent=active[nRot]?active[nRot].text:'';}}const ds=String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();const hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');const de=document.getElementById('nbarDt');if(de)de.innerHTML='<div style="display:flex;align-items:center;gap:8px;padding:3px 8px;background:var(--bg4);border-radius:4px;border:1px solid var(--acc);font:700 var(--fs-xs) system-ui;color:var(--acc);white-space:nowrap"><span style="font:800 14px system-ui">'+hm+'</span><span style="width:1px;height:16px;background:var(--bd)"></span><span>Ward C8</span><span style="width:1px;height:16px;background:var(--bd)"></span><span style="color:var(--tx2);font:700 9px">'+ds+'</span></div>';}
function openNotice(){const el=document.getElementById('nMb');let h='';for(let i=0;i<3;i++){const n=S.notices[i]||{text:'',effectFrom:_ts(),endWith:_ts(),deleted:false};h+='<div style="display:flex;gap:4px;align-items:center;padding:3px 0;border-bottom:1px solid var(--bd)"><input value="'+(n.text||'')+'" id="nt'+i+'" placeholder="Notice text" style="flex:1"><input type="date" value="'+(n.effectFrom||_ts())+'" id="nf'+i+'" style="width:120px"><input type="date" value="'+(n.endWith||_ts())+'" id="ne'+i+'" style="width:120px"><button class="btn btn-d" onclick="delNotice('+i+')">Del</button></div>';}el.innerHTML=h;document.getElementById('nModal').style.display='flex';}
function closeNotice(){document.getElementById('nModal').style.display='none';renderNoticeBar();}
function saveNotices(){for(let i=0;i<3;i++){if(!S.notices[i])S.notices[i]={id:'N'+i,text:'',effectFrom:_ts(),endWith:_ts(),deleted:false};S.notices[i].text=document.getElementById('nt'+i).value;S.notices[i].effectFrom=document.getElementById('nf'+i).value;S.notices[i].endWith=document.getElementById('ne'+i).value;S.notices[i].deleted=!S.notices[i].text;}commit('Saved');closeNotice();}
function delNotice(i){if(S.notices[i])S.notices[i].deleted=true;commit('Deleted');}

// ===== PRINT HANDOVER =====
function printHandover(fmt){
  const all=Object.values(S.beds).filter(b=>b.occupied&&!isHid(b.num)).sort((a,b)=>a.num-b.num);
  const tdy=_ts(),tmr=_doff(tdy,1);
  // Apply format
  const oldStyle=document.getElementById('printFmt');if(oldStyle)oldStyle.remove();
  const style=document.createElement('style');style.id='printFmt';
  if(fmt==='4:3')style.textContent='@page{size:297mm 210mm;margin:10mm}';
  else if(fmt==='16:9')style.textContent='@page{size:320mm 180mm;margin:8mm}';
  else style.textContent='@page{size:auto;margin:10mm}';
  document.head.appendChild(style);
  let h='<div style="background:#fff;color:#000;padding:20px;font-family:Arial,sans-serif;font-size:11pt">';
  h+='<div style="text-align:center;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:12px">';
  h+='<h1 style="font-size:16pt;margin:0 0 4px">TMHC8 Ward Handover</h1>';
  h+='<div style="font-size:10pt;color:#555">Generated: '+_dmy()+' | Ward: C8 | Patients: '+all.length+'</div>';
  h+='</div>';
  h+='<table style="width:100%;border-collapse:collapse;font-size:9pt">';
  h+='<tr style="background:#e8e8e8;font-weight:700;border-bottom:2px solid #333"><td style="padding:4px;border:1px solid #ccc">Bed</td><td style="padding:4px;border:1px solid #ccc">Ward</td><td style="padding:4px;border:1px solid #ccc">Patient</td><td style="padding:4px;border:1px solid #ccc">Doctor</td><td style="padding:4px;border:1px solid #ccc">Flags</td><td style="padding:4px;border:1px solid #ccc">WR</td><td style="padding:4px;border:1px solid #ccc">Screen</td><td style="padding:4px;border:1px solid #ccc">Tdy</td><td style="padding:4px;border:1px solid #ccc">Tmr</td><td style="padding:4px;border:1px solid #ccc">Plan</td><td style="padding:4px;border:1px solid #ccc">Note</td></tr>';
  all.forEach(b=>{
    const p=b.patient;
    const flags=[];if(b.alerts.fallRisk)flags.push('FALL');if(b.alerts.dn)flags.push('DNR');if(b.phoneContact)flags.push('Contact');
    if(b.mdro.vre)flags.push('VRE');if(b.mdro.cpe)flags.push('CPE');if(b.mdro.mra)flags.push('MRA');if(b.mdro.cAuris)flags.push('C.Auris');
    const wr=b.wardRound.done?'Done':'Pending';
    const scr=getScr(b).filter(s=>s.resultStatus==='pending').map(s=>s.organism+(s.setLabel||'')).join(', ')||'-';
    const tdyA=b.apps.filter(a=>a.date===tdy&&a.status!=='cancelled').map(a=>a.time+' '+a.item).join('; ')||'-';
    const tmrA=b.apps.filter(a=>a.date===tmr&&a.status!=='cancelled').map(a=>a.time+' '+a.item).join('; ')||'-';
    const plan=b.plan.type==='discharge'?'DC':b.plan.type==='transfer'?'Tx':'-';
    const los=Math.floor((new Date(tdy)-new Date(p.admissionDate))/(864e5))+1;
    h+='<tr style="border-bottom:1px solid #ccc"><td style="padding:3px;border:1px solid #ccc;font-weight:700">'+b.num+'</td><td style="padding:3px;border:1px solid #ccc">'+b.parentWard+'</td><td style="padding:3px;border:1px solid #ccc">'+p.name+'</td><td style="padding:3px;border:1px solid #ccc">'+(b.doctor||'-')+'</td><td style="padding:3px;border:1px solid #ccc">'+flags.join(', ')+'</td><td style="padding:3px;border:1px solid #ccc">'+wr+'</td><td style="padding:3px;border:1px solid #ccc">'+scr+'</td><td style="padding:3px;border:1px solid #ccc">'+tdyA+'</td><td style="padding:3px;border:1px solid #ccc">'+tmrA+'</td><td style="padding:3px;border:1px solid #ccc">'+plan+'</td><td style="padding:3px;border:1px solid #ccc;max-width:200px;word-break:break-word">'+(b.handover.note||'')+' (LOS:'+los+'d)</td></tr>';
  });
  h+='</table>';
  h+='<div style="margin-top:12px;border-top:1px solid #999;padding-top:6px;font-size:9pt;color:#555;display:flex;justify-content:space-between"><span>Ward: C8 | Total: '+all.length+'</span><span>Printed: '+_dmy()+'</span></div>';
  h+='</div>';
  document.getElementById('hoPrint').innerHTML=h;
  setTimeout(()=>window.print(),100);
}

// ===== EXPORT / IMPORT =====
function doExport(){const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='tmhc8-'+_ts()+'.json';a.click();URL.revokeObjectURL(url);toast('Exported','ok');}
function doImport(inp){const f=inp.files[0];if(!f)return;doBackup();if(!confirm('This will OVERWRITE current data. Proceed?'))return;const r=new FileReader();r.onload=e=>{try{const d=JSON.parse(e.target.result);if(d&&d.beds){S=d;norm();save();render();toast('Imported','ok');}else toast('Invalid file','er');}catch(x){toast('Error','er');}};r.readAsText(f);inp.value='';}


// ===== PATIENT JOURNEY =====
function renderPatientJourney(){
  const all=Object.values(S.beds).filter(b=>!isHid(b.num));
  const tmr=_ts();
  const totalBeds=all.length;
  const occ=all.filter(b=>b.occupied).length;
  const isMdroVacancy=(bed)=>!bed.occupied&&bed.allocation&&bed.allocation.market==='MDRO_COMPATIBLE';
  const isGeneralVacancy=(bed)=>!bed.occupied&&!isMdroVacancy(bed);
  const generalVacancies=all.filter(isGeneralVacancy);
  const mdroVacancies=all.filter(isMdroVacancy);
  const plannedDischarges=all.filter(b=>b.occupied&&b.plan&&b.plan.type==='discharge'&&(!b.plan.targetDate||b.plan.targetDate>tmr));
  const pendingTransfers=all.filter(b=>b.occupied&&b.plan&&b.plan.type==='transfer');
  const vacM=generalVacancies.filter(b=>b.allocation&&b.allocation.genderSuitability==='M').length;
  const vacF=generalVacancies.filter(b=>b.allocation&&b.allocation.genderSuitability==='F').length;
  const fallCnt=all.filter(b=>b.occupied&&b.alerts.fallRisk).length;
  const dnrCnt=all.filter(b=>b.occupied&&b.alerts.dn).length;
  const isoCnt=all.filter(b=>b.occupied&&b.alerts.isolation).length;
  const cpeCnt=all.filter(b=>b.occupied&&b.mdro.cpe).length;
  const vreCnt=all.filter(b=>b.occupied&&b.mdro.vre).length;
  const mraCnt=all.filter(b=>b.occupied&&b.mdro.mra).length;
  const cauCnt=all.filter(b=>b.occupied&&b.mdro.cAuris).length;
  const wrDone=all.filter(b=>b.occupied&&b.wrDone).length;
  const wrTotal=all.filter(b=>b.occupied).length;
  // Cubicle occupancy
  const cubOcc={};
  Object.keys(CUBS).forEach(c=>{cubOcc[c]=CUBS[c].filter(n=>{const b=S.beds[n];return b&&!isHid(n)&&b.occupied;}).length+'/'+CUBS[c].filter(n=>!isHid(n)).length;});
  let h='<div class="kpi-row">';
  h+='<div class="kc" data-type="bed" onclick="S.ui.selectedBed=null;save();renderFloor();"><div class="kv">'+occ+'/'+totalBeds+'</div><div class="kl">Occ</div></div>';
  h+='<div class="kc" data-type="adm"><div class="kv">'+vacM+'M/'+vacF+'F</div><div class="kl">Vacant</div></div>';
  h+='<div class="kc" data-type="dc" onclick="S.ui.selectedBed=null;save();setDbTab(\'dc\');renderRpDb();"><div class="kv">'+plannedDischarges.length+'</div><div class="kl">DC</div></div>';
  h+='<div class="kc" data-type="tx" onclick="S.ui.selectedBed=null;save();setDbTab(\'transfer\');renderRpDb();"><div class="kv">'+pendingTransfers.length+'</div><div class="kl">Tx</div></div>';
  h+='<div class="kc" data-type="fall"><div class="kv">'+fallCnt+'</div><div class="kl">Fall</div></div>';
  h+='<div class="kc" data-type="dc"><div class="kv">'+dnrCnt+'</div><div class="kl">DNR</div></div>';
  h+='<div class="kc" data-type="vre"><div class="kv">'+(cpeCnt+vreCnt+mraCnt+cauCnt)+'</div><div class="kl">MDRO</div></div>';
  h+='<div class="kc" data-type="wr"><div class="kv">'+wrDone+'/'+wrTotal+'</div><div class="kl">WR</div></div>';
  h+='<div class="kc" data-type="adm"><div class="kv">'+(S.pendingAdmissions||[]).length+'</div><div class="kl">Adm Q</div></div>';
  h+='<div class="kc" data-type="txin"><div class="kv">'+(S.pendingTransferIn||[]).length+'</div><div class="kl">Tx In</div></div>';
  // Cubicle mini-bar
  h+='<div style="display:flex;gap:2px;align-items:center;margin-left:4px;padding-left:6px;border-left:1px solid var(--bd2)">';
  Object.keys(CUBS).forEach(c=>{
    const occN=parseInt(cubOcc[c].split('/')[0]);
    const totN=parseInt(cubOcc[c].split('/')[1]);
    const pct=Math.round(occN/totN*100);
    const color=pct>=90?'var(--er)':pct>=70?'var(--wa)':'var(--ok)';
    h+='<div style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:22px;cursor:pointer" onclick="S.ui.selectedCubicle=\''+c+'\';save();renderFloor();" title="'+c+'">';
    h+='<div style="font:700 9px system-ui;color:var(--tx3)">'+c.replace('C','')+'</div>';
    h+='<div style="width:20px;height:3px;background:var(--bg4);border-radius:2px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:'+color+'"></div></div>';
    h+='</div>';
  });
  h+='</div>';
  h+='</div>';
  document.getElementById('hdrKpi').innerHTML=h;
}

// ===== INTER-WARD TRANSFER =====
function pickTxTargetType(bedNum,type){
  const b=gb(bedNum);
  if(!b)return;
  const wardTypes={MEDICAL:['R8C','R8D','R9A','R9B','R10A','R10B','ICU','CCU','NICU'],SURGICAL:['OT','SICU','DSU'],PSYCH:['Psych'],REHAB:['Rehab'],GERI:['Geri'],OTHERS:['Other']};
  const wards=wardTypes[type]||[];
  const currentWard=b.transferPlan&&b.transferPlan.destinationWard?b.transferPlan.destinationWard:'';
  const wardOpts=wards.map(w=>`<div class="btn" style="margin:2px 0;text-align:left;padding:8px 12px" onclick="pickTxSourceWard(${bedNum},'${w}')">${w}${w===currentWard?' <span style="color:#22c55e">(current)</span>':''}</div>`).join('');
  showPrompt('Choose Receiving Ward — '+type,'<div style="max-height:55vh;overflow:auto">'+wardOpts+'</div><div style="display:flex;gap:8px;margin-top:8px"><button class=btn onclick="startTransferWard('+bedNum+')">Back</button><button class=btn onclick=closePrompt()>Cancel</button></div>');
}

function pickTxSourceWard(bedNum,ward){
  const b=gb(bedNum);
  if(!b)return;
  commit('transfer out '+bedNum,()=>{
    b.transferPlan={status:'PENDING',destinationWard:ward};
    b.transferHistory.push({bedNum:bedNum,date:_ts(),from:'C8',to:ward});
    b.plan={type:'transfer',targetDate:_doff(_ts(),1)};
  });
  closePrompt();
  goHome();
}

function startTransferWard(bedNum){
  const b=gb(bedNum);
  if(!b||!b.occupied)return;
  const wardTypes={MEDICAL:['R8C','R8D','R9A','R9B','R10A','R10B','ICU','CCU','NICU'],SURGICAL:['OT','SICU','DSU'],PSYCH:['Psych'],REHAB:['Rehab'],GERI:['Geri'],OTHERS:['Other']};
  const typeOpts=Object.keys(wardTypes).map(t=>`<div class="btn" style="margin:2px 0;text-align:left;padding:8px 12px" onclick="pickTxTargetType(${bedNum},'${t}')">${t}</div>`).join('');
  showPrompt('Choose Receiving Ward Type','<div style="max-height:55vh;overflow:auto">'+typeOpts+'</div><div style="display:flex;gap:8px;margin-top:8px"><button class=btn onclick=closePrompt()>Cancel</button></div>');
}

function pickTxTargetWard(ward){
  const b=gb(S.ui.selectedBed);
  if(!b)return;
  commit('transfer in to '+ward,()=>{
    const c=CUB_SEX[b.parentWard];
    const cubGender=c==='F'?'F':c==='M'?'M':/^(C1|C4|C6|C9)$/.test(b.parentWard)?'F':'M';
    b.occupied=true;b.doctor='';
    b.patient={name:'Transferred Patient',age:50+_ri(45),gender:cubGender,mrn:'HN'+(100000+_ri(900000)),hospNo:'H'+String(1+_ri(9))+_ri(10)+_ri(10)+_ri(10),admissionDate:_ts(),diagnosis:'Post-transfer',los:1};
    b.plan={type:null,targetDate:null};
    b.transferPlan={status:'PENDING',destinationWard:''};
    b.dischargePlan={status:'NOT_PLANNED',destination:'',targetTime:''};
    b.socialProfile={dischargeDestination:'',homeName:''};
    b.allocation={market:'GENERAL',genderSuitability:cubGender,cleaningStatus:'NOT_REQUIRED'};
  });
  showToast('Transfer confirmed to '+ward);
  goHome();
}

// ===== KEYBOARD =====
document.addEventListener('keydown',e=>{
if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undoLast();return;}
if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey){
if(e.key==='1'){e.preventDefault();setDbTab('summary');}
else if(e.key==='2'){e.preventDefault();setDbTab('wardRound');}
else if(e.key==='3'){e.preventDefault();setDbTab('apps');}
else if(e.key==='4'){e.preventDefault();setDbTab('screening');}
else if(e.key==='5'){e.preventDefault();setDbTab('flags');}
else if(e.key==='6'){e.preventDefault();setDbTab('bathing');}
else if(e.key==='a'||e.key==='A'){e.preventDefault();openActionCard();}
}
if(e.key==='Escape'){closeActionCard();closeSettings();closeDailyReset();closePending();}
});

// Daily reset toggle handlers
document.addEventListener('click',function(e){if(e.target.closest('.rst-overlay')){const t=e.target;if(t.classList.contains('tsw')&&t.closest('.rst-box'))t.classList.toggle('on');}});

// ===== INIT =====
try{init();}catch(e){console.error('INIT ERROR:',e);document.body.innerHTML='<div style="padding:20px;color:#ef4444;font-family:system-ui"><h3>TMHC8 Error</h3><pre>'+e.message+'</pre><p>Try clearing browser cache and reload (Ctrl+Shift+R)</p></div>';}
