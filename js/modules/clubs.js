import {h,modal,toast,confirmDialog,select} from '../components/ui.js';
import * as db from '../services/data.js';
export const ICONS={book:'📖',science:'⚛',tech:'💻',philosophy:'Ψ',math:'∑',islam:'🕌',business:'📈'};
const IC=Object.entries(ICONS).map(([value,label])=>({value,label:label+' '+value}));
export async function clubForm(c={}){
 const name=h('input',{value:c.name||''}),desc=h('textarea',{},c.description||''),obj=h('textarea',{placeholder:'One per line'},(c.objectives||[]).join('\n'));const icon=select({options:IC,value:c.icon||'book'});
 return new Promise(res=>modal(c.id?'Edit club':'Create club',h('div',{},h('label',{},'Name'),name,h('label',{},'Icon'),icon,h('label',{},'Description'),desc,h('label',{},'Learning objectives'),obj),[{label:'Cancel',run:()=>res(null)},{label:'Save',cls:'p',run:async()=>{
  if(!name.value.trim())throw new Error('Club name is required.');
  const row={name:name.value.trim(),description:desc.value.trim()||null,icon:icon.get(),objectives:obj.value.split('\n').map(s=>s.trim()).filter(Boolean)};
  const d=c.id?await db.update('knowledge_clubs',c.id,row):await db.insert('knowledge_clubs',row);toast(c.id?'Club updated.':'Club created.');res(d)}}]));
}
export function clubCard(c,n,reload){
 return h('div',{class:'card'},h('div',{style:'font-size:1.8rem'},ICONS[c.icon]||'📖'),h('h3',{style:'margin:8px 0 4px'},c.name),h('p',{class:'muted'},c.description||'No description yet.'),h('p',{class:'muted',style:'margin:8px 0'},`${n||0} resources`),
 h('div',{class:'row'},h('button',{class:'btn',onclick:()=>openClub(c,n,reload)},'Open'),h('button',{class:'btn',onclick:async()=>{if(await clubForm(c))reload()}},'Edit'),h('button',{class:'btn d',onclick:async()=>{if(!await confirmDialog(`Delete the club “${c.name}”? Its resources stay in your vault.`))return;try{await db.remove('knowledge_clubs',c.id,c.name);toast('Club deleted.');reload()}catch(e){toast(e.message,1)}}},'Delete')));
}
function openClub(c,n){modal(c.name,h('div',{},h('p',{},c.description||'No description yet.'),h('label',{},'Learning objectives'),c.objectives?.length?h('ul',{style:'padding-left:20px'},c.objectives.map(o=>h('li',{},o))):h('p',{class:'muted'},'None set.'),h('p',{class:'muted',style:'margin-top:12px'},`${n||0} resources linked. Club notes, research topics and questions arrive in a later phase.`)),[{label:'Close',run:()=>{}}])}
export async function render(el){
 const grid=h('div',{class:'grid g3'});
 async function load(){try{const[cs,counts]=await Promise.all([db.list('knowledge_clubs'),db.clubResourceCounts()]);grid.replaceChildren(...(cs.length?cs.map(c=>clubCard(c,counts[c.id],load)):[h('div',{class:'empty'},'No clubs yet. Create your first one.')]))}catch(e){grid.replaceChildren(h('div',{class:'empty'},'Could not load clubs: '+e.message))}}
 el.replaceChildren(h('div',{class:'row',style:'justify-content:space-between;margin-bottom:14px'},h('h2',{},'Knowledge Clubs'),h('button',{class:'btn p',onclick:async()=>{if(await clubForm())load()}},'Create club')),grid);load();
}
