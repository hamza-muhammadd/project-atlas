import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
if(fs.existsSync('.env'))for(const l of fs.readFileSync('.env','utf8').split('\n')){const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2]}
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((q,r)=>{
 let p=decodeURIComponent(q.url.split('?')[0]);
 if(p==='/config.js'){r.setHeader('Content-Type','text/javascript');
  return r.end(`window.ATLAS_CONFIG=${JSON.stringify({url:process.env.SUPABASE_URL||'',anonKey:process.env.SUPABASE_ANON_KEY||''})}`)}
 if(p.endsWith('/'))p+='index.html';
 const f=path.join(process.cwd(),path.normalize(p));
 if(!f.startsWith(process.cwd())||['.env','server.mjs'].includes(path.basename(f))||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.statusCode=404;return r.end('Not found')}
 r.setHeader('Content-Type',T[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)
}).listen(process.env.PORT||5173,()=>console.log('Atlas on http://localhost:'+(process.env.PORT||5173)));
