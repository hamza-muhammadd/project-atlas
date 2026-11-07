import {sb} from './supabase.js';
const ok=({data,error})=>{if(error)throw new Error(error.message);return data};
export const list=(t,{order='created_at',asc=false,limit}={})=>{let q=sb.from(t).select('*').order(order,{ascending:asc});if(limit)q=q.limit(limit);return q.then(ok)};
export const count=t=>sb.from(t).select('*',{count:'exact',head:true}).then(r=>{if(r.error)throw new Error(r.error.message);return r.count});
export const log=(action,entity,label,id)=>sb.from('activity_logs').insert({action,entity,label,entity_id:id}).then(()=>{});
export async function insert(t,row,label){const d=ok(await sb.from(t).insert(row).select().single());log('created',t,label||d.title||d.name,d.id);return d}
export async function update(t,id,row,label){const d=ok(await sb.from(t).update(row).eq('id',id).select().single());log('updated',t,label||d.title||d.name,id);return d}
export async function remove(t,id,label){ok(await sb.from(t).delete().eq('id',id));log('deleted',t,label,null)}
export const countWhere=(t,col)=>sb.from(t).select('*',{count:'exact',head:true}).not(col,'is',null).then(r=>{if(r.error)throw new Error(r.error.message);return r.count});
export const clubResourceCounts=async()=>{const r=ok(await sb.from('club_resources').select('club_id'));return r.reduce((m,x)=>(m[x.club_id]=(m[x.club_id]||0)+1,m),{})};
