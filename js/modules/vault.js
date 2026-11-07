import {h,modal,toast,select,confirmDialog,ago,fmtSize} from '../components/ui.js';
import * as db from '../services/data.js';
const TYPES=['note','url','pdf','txt','docx'].map(v=>({value:v,label:v.toUpperCase()==='NOTE'?'Note':v.toUpperCase()}));
export async function resourceForm(r={}){
 const f=(k,tag='input')=>{const e=h(tag,{});e.value=r[k]||'';return e};
 const title=f('title'),desc=f('description','textarea'),subj=f('subject'),url=f('source_url'),concepts=f('key_concepts');concepts.value=(r.key_concepts||[]).join(', ');
 const type=select({options:TYPES,value:r.source_type||'note'});
 const body=h('div',{},h('label',{},'Title'),title,h('label',{},'Description'),desc,h('label',{},'Subject'),subj,h('label',{},'Type'),type,h('label',{},'URL (for links)'),url,h('label',{},'Key concepts (comma separated)'),concepts,
  h('p',{class:'muted',style:'margin-top:10px'},'Saves metadata only. File upload and PDF text extraction are Phase 2.'));
 return new Promise(res=>modal(r.id?'Edit resource':'Add resource',body,[{label:'Cancel',run:()=>{res(null)}},{label:'Save',cls:'p',run:async()=>{
  if(!title.value.trim())throw new Error('Title is required.');
  const row={title:title.value.trim(),description:desc.value.trim()||null,subject:subj.value.trim()||null,source_type:type.get(),source_url:url.value.trim()||null,key_concepts:concepts.value.split(',').map(s=>s.trim()).filter(Boolean)};
  const d=r.id?await db.update('resources',r.id,row):await db.insert('resources',row);toast(r.id?'Resource updated.':'Resource added.');res(d)}}]));
}
export async function render(el,{query=''}={}){
 const state={q:query,type:'all',sort:'created_at'};let all=[];
 const list=h('div',{class:'card'});
 const draw=()=>{let rows=all.filter(r=>(state.type==='all'||r.source_type===state.type)&&(!state.q||[r.title,r.description,r.subject,...(r.key_concepts||[])].join(' ').toLowerCase().includes(state.q.toLowerCase())));
  rows=[...rows].sort((a,b)=>state.sort==='title'?a.title.localeCompare(b.title):new Date(b[state.sort])-new Date(a[state.sort]));
  list.replaceChildren(...(rows.length?rows.map(r=>h('div',{class:'item'},h('div',{},h('b',{},r.title),h('br'),h('small',{},[r.subject,r.source_type.toUpperCase(),fmtSize(r.size_bytes),ago(r.created_at)].filter(Boolean).join(' · '))),
   h('div',{class:'row'},h('span',{class:'tag'},r.status),h('button',{class:'btn',onclick:async()=>{if(await resourceForm(r))load()}},'Edit'),h('button',{class:'btn d',onclick:async()=>{if(!await confirmDialog(`Delete “${r.title}”? This cannot be undone.`))return;try{await db.remove('resources',r.id,r.title);toast('Resource deleted.');load()}catch(e){toast(e.message,1)}}},'Delete')))):[h('div',{class:'empty'},all.length?'No resources match your filters.':'Your vault is empty. Add your first resource.')]))};
 const search=h('input',{placeholder:'Search title, subject, concepts…',value:query,oninput:e=>{state.q=e.target.value;draw()}});
 const filt=select({options:[{value:'all',label:'All types'},...TYPES],value:'all',onChange:v=>{state.type=v;draw()}});
 const sort=select({options:[{value:'created_at',label:'Newest'},{value:'updated_at',label:'Recently edited'},{value:'title',label:'Title A–Z'}],value:'created_at',onChange:v=>{state.sort=v;draw()}});
 async function load(){try{all=await db.list('resources');draw()}catch(e){list.replaceChildren(h('div',{class:'empty'},'Could not load resources: '+e.message))}}
 el.replaceChildren(h('div',{class:'row',style:'justify-content:space-between;margin-bottom:14px'},h('h2',{},'Knowledge Vault'),h('button',{class:'btn p',onclick:async()=>{if(await resourceForm())load()}},'Add resource')),h('div',{class:'row',style:'margin-bottom:14px'},h('div',{style:'flex:1;min-width:200px'},search),filt,sort),list);
 list.append(h('div',{class:'empty'},'Loading…'));load();
}
