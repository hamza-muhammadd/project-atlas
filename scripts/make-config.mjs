import fs from 'node:fs';
const url=process.env.SUPABASE_URL||'',anonKey=process.env.SUPABASE_ANON_KEY||'';
if(!url||!anonKey)console.warn('SUPABASE_URL / SUPABASE_ANON_KEY missing: app will show the setup screen.');
fs.writeFileSync('config.js',`window.ATLAS_CONFIG=${JSON.stringify({url,anonKey})}`);
console.log('config.js written');
