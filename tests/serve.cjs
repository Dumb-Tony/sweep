// Serves only the reviewed standalone game, never project notes or parent folders.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../prototypes/arcade3d');
const files=['index.html','model.js','scene.js','art.js','style.css','vendor/three.module.min.js','vendor/three.core.min.js','vendor/LICENSE'];
http.createServer((req,res)=>{const name=req.url.split('?')[0].slice(1)||'index.html';if(!files.includes(name)){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(root,name)));}).listen(4175,'127.0.0.1',()=>console.log('After Hours 3D preview: http://127.0.0.1:4175'));
