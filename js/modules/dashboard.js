import {h,ago,fmtSize} from '../components/ui.js';
import * as db from '../services/data.js';
import {clubForm,ICONS} from './clubs.js';
import {resourceForm} from './vault.js';
export async function render(el,{name,go}){
 const stats=h('div',{class:'grid g5',style:'margin-bottom:16px'}),vault=h('div'),clubs=h('div',{class:'row'}),act=h('div');
 const card=(t,link,to,...k)=>h('div',{class:'card'},h('h3',{},t,link&&h('button',{class:'link',onclick:()=>go(to)},link)),...k);
 el.replaceChildren(
  h('div',{class:'card hero'},h('div',{},h('h1',{},`Welcome back, ${name}`),h('p',{},'Your personal knowledge journey continues.'),h('div',{class:'row'},h('button',{class:'btn p',onclick:()=>go('ask')},'Ask a question'),h('button',{class:'btn',onclick:async()=>{await resourceForm();render(el,{name,go})}},'Add resource'),h('button',{class:'btn',onclick:()=>go('paths')},'Continue learning'))),h('div',{class:'globe','aria-hidden':'true'})),
  stats,
  h('div',{class:'grid g3',style:'margin-bottom:16px'},card('Continue Learning','View all','paths',h('div',{class:'empty'},'No lessons started yet. Learning Paths arrive in Phase 5.')),card('Knowledge Vault','View all','vault',vault),card('Knowledge Graph','Explore','graph',h('div',{class:'empty'},'Graph builds from your concepts. Coming in Phase 5.'))),
  h('div',{class:'grid g3'},card('Knowledge Clubs','View all','clubs',clubs),card('Recent Activity',null,null,act),card('Quick Tools',null,null,h('div',{class:'row'},[['paths','Learning Paths'],['practice','Practice Lab'],['research','Research Lab'],['mastery','Mastery Tracker']].map(([k,l])=>h('button',{class:'btn',onclick:()=>go(k)},l))))));
 try{
  const[rc,cc,lc,vc,rs,cs,al]=await Promise.all([db.count('resources'),db.count('knowledge_clubs'),db.countWhere('learning_progress','completed_at'),db.count('conversations'),db.list('resources',{limit:4}),db.list('knowledge_clubs',{limit:4}),db.list('activity_logs',{limit:5})]);
  stats.replaceChildren(...[['Resources',rc],['Knowledge Clubs',cc],['Lessons completed',lc],['Conversations',vc]].map(([l,v])=>h('div',{class:'card stat'},h('b',{},String(v)),h('span',{},l))));
  vault.replaceChildren(...(rs.length?rs.map(r=>h('div',{class:'item'},h('div',{},h('b',{},r.title),h('br'),h('small',{},`${r.source_type.toUpperCase()} · ${fmtSize(r.size_bytes)} · ${ago(r.created_at)}`)))):[h('div',{class:'empty'},'No resources yet.')]));
  clubs.replaceChildren(...cs.map(c=>h('button',{class:'btn',onclick:()=>go('clubs')},(ICONS[c.icon]||'')+' '+c.name)),h('button',{class:'btn p',onclick:async()=>{if(await clubForm())render(el,{name,go})}},'Create club'));
  act.replaceChildren(...(al.length?al.map(a=>h('div',{class:'item'},h('span',{},`${a.action[0].toUpperCase()+a.action.slice(1)}: ${a.label||a.entity}`),h('small',{},ago(a.created_at)))):[h('div',{class:'empty'},'No activity yet.')]));
 }catch(e){stats.replaceChildren(h('div',{class:'card empty',style:'grid-column:1/-1'},'Could not load data: '+e.message+'. Check that supabase/schema.sql has been run.'))}
}
