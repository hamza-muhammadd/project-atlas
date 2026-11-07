import {h,toast} from './components/ui.js';
import {sb,configured} from './services/supabase.js';
import * as dashboard from './modules/dashboard.js';import * as vault from './modules/vault.js';import * as clubs from './modules/clubs.js';
const NAV=[['dashboard','Dashboard','⌂'],['vault','Knowledge Vault','▤'],['clubs','Knowledge Clubs','◫'],['ask','Ask Anything','?'],['professor','Personal Professor','☺'],['research','Research Lab','⚗'],['graph','Knowledge Graph','✳'],['paths','Learning Paths','⇢'],['practice','Practice Lab','✎'],['mastery','Mastery Tracker','▮']];
const SEC=[['settings','Settings','⚙'],['export','Export Data','⇩'],['about','About Project Atlas','ℹ']];
const PHASE={ask:'Phase 3',professor:'Phase 4',research:'Phase 4',graph:'Phase 5',paths:'Phase 5',practice:'Phase 5',mastery:'Phase 5',settings:'a later phase',export:'a later phase'};
const root=document.getElementById('app');let user,name='Hamza',query='';
const go=r=>{location.hash=r};
function authScreen(){const em=h('input',{type:'email',autocomplete:'username'}),pw=h('input',{type:'password',autocomplete:'current-password'});
 const submit=async()=>{const{error}=await sb.auth.signInWithPassword({email:em.value,password:pw.value});if(error)toast('Sign-in failed: '+error.message,1);else boot()};
 root.replaceChildren(h('div',{class:'card auth'},h('h2',{},'Project Atlas'),h('p',{class:'muted'},'Private. Sign in as the owner.'),h('label',{},'Email'),em,h('label',{},'Password'),pw,h('button',{class:'btn p',style:'margin-top:16px;width:100%',onclick:submit},'Sign in')))}
function setup(){root.replaceChildren(h('div',{class:'card auth'},h('h2',{},'Connect Supabase'),h('p',{class:'muted'},'Copy .env.example to .env, add SUPABASE_URL and SUPABASE_ANON_KEY, run supabase/schema.sql, then restart npm start.')))}
async function route(){const r=location.hash.slice(1)||'dashboard',main=document.getElementById('main');if(!main)return;
 document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('on',n.dataset.r===r));
 if(r==='dashboard')return dashboard.render(main,{name,go});if(r==='vault')return vault.render(main,{query});if(r==='clubs')return clubs.render(main);
 const all=[...NAV,...SEC],t=(all.find(x=>x[0]===r)||[0,'Not found'])[1];
 main.replaceChildren(h('div',{class:'card soon'},h('h2',{},t),h('p',{class:'muted',style:'margin-top:8px'},r==='about'?'Project Atlas, The Universal Mind. Phase 1: foundation, dashboard, vault metadata, clubs.':`Coming soon: planned for ${PHASE[r]||'a later phase'}. Nothing here is functional yet.`)))}
function shell(){const navBtn=([k,l,i])=>h('button',{class:'nav','data-r':k,onclick:()=>go(k),title:l},h('span',{},i),h('span',{},l));
 const search=h('input',{class:'search',placeholder:'Search your vault… (Ctrl K)',onkeydown:e=>{if(e.key==='Enter'){query=e.target.value;if(location.hash==='#vault')route();else go('vault')}}});
 addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();search.focus()}});
 const sh=h('div',{class:'shell'},h('aside',{class:'side'},h('div',{class:'brand'},h('b',{},'PROJECT ATLAS'),h('small',{},'The Universal Mind')),NAV.map(navBtn),h('div',{class:'sep'}),SEC.map(navBtn),h('div',{style:'flex:1'}),h('button',{class:'nav',onclick:()=>sh.classList.toggle('collapsed')},h('span',{},'⇔'),h('span',{},'Collapse'))),
  h('div',{class:'main'},h('div',{class:'top'},search,h('span',{class:'tag'},'Connected'),h('button',{class:'btn',onclick:async()=>{await sb.auth.signOut();boot()}},user.email.split('@')[0]+' · Sign out')),h('div',{id:'main'})));
 root.replaceChildren(sh);route()}
async function boot(){if(!configured)return setup();const{data}=await sb.auth.getSession();if(!data.session)return authScreen();user=data.session.user;
 const{data:p}=await sb.from('profiles').select('display_name').eq('id',user.id).maybeSingle();name=p?.display_name||user.email.split('@')[0];shell()}
addEventListener('hashchange',route);boot();
