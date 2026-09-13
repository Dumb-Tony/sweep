// Serves only the reviewed standalone game, never project notes or parent folders.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const game=path.join(__dirname,'../prototypes/m1/index.html');
http.createServer((req,res)=>{if(req.url.split('?')[0]!=='/'){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(game));}).listen(4175,'127.0.0.1',()=>console.log('Sweep preview: http://127.0.0.1:4175'));
