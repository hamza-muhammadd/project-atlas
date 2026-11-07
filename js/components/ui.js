export const h=(tag,a={},...kids)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(a||{})){if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='class')e.className=v;else if(v!==false&&v!=null)e.setAttribute(k,v)}
 kids.flat().forEach(c=>c!=null&&e.append(c.nodeType?c:document.createTextNode(c)));return e};
export function toast(msg,err){const t=h('div',{class:'toast'+(err?' err':''),role:'status'},msg);document.getElementById('toasts').append(t);setTimeout(()=>t.remove(),err?6000:3000)}
export function modal(title,body,actions=[]){const close=()=>ov.remove();
 const ov=h('div',{class:'ov',onclick:e=>e.target===ov&&close()},h('div',{class:'card modal',role:'dialog','aria-label':title},h('h3',{},title,h('button',{class:'link',onclick:close,'aria-label':'Close'},'✕')),body,h('div',{class:'row',style:'margin-top:16px;justify-content:flex-end'},actions.map(a=>h('button',{class:'btn '+(a.cls||''),onclick:async e=>{e.target.disabled=true;try{if(await a.run(close)!==false)close()}catch(x){toast(x.message,1)}finally{e.target.disabled=false}}},a.label)))));
 document.body.append(ov);return close}
export const confirmDialog=(msg,label='Delete')=>new Promise(res=>{let done=false;const fin=v=>{if(!done){done=true;res(v)}};
 const c=modal('Are you sure?',h('p',{},msg),[{label:'Cancel',run:()=>fin(false)},{label,cls:'d',run:()=>fin(true)}]);});
export function select({options,value,onChange,placeholder='Select'}){let cur=value;const lbl=()=>(options.find(o=>o.value===cur)||{}).label||placeholder;
 const b=h('button',{type:'button','aria-haspopup':'listbox'},h('span',{},lbl()),'▾');
 const ul=h('ul',{role:'listbox'},options.map(o=>h('li',{role:'option',class:o.value===cur?'sel':'',onclick:ev=>{cur=o.value;b.firstChild.textContent=o.label;ul.querySelectorAll('li').forEach(l=>l.classList.toggle('sel',l===ev.currentTarget));root.classList.remove('open');onChange&&onChange(cur)}},o.label)));
 const root=h('div',{class:'dd'},b,ul);b.onclick=()=>root.classList.toggle('open');document.addEventListener('click',e=>!root.contains(e.target)&&root.classList.remove('open'));root.get=()=>cur;return root}
export const ago=d=>{const s=(Date.now()-new Date(d))/1e3;return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':Math.floor(s/86400)+'d ago'};
export const fmtSize=b=>b==null?'—':b<1048576?Math.round(b/1024)+' KB':(b/1048576).toFixed(1)+' MB';
