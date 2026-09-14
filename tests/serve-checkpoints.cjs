const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'../prototypes/arcade3d'),M=require('../prototypes/arcade3d/model.js');
const steps=['store','sweep','mop','lift','dispose','lay','strip','patch','paint','clean','repair','return','play'];
function fixture(name){const n=steps.indexOf(name),s=M.fresh();s.cabinets.forEach((c,i)=>Object.assign(c,{...M.bays[i],stored:true}));s.dust.fill(n>1?0:1);s.grime.fill(n>2?0:1);s.removed.fill(n>3?1:0);s.floor.fill(n>5?1:0);s.wallStrip.fill(n>6?1:0);s.wallPatch.fill(n>7?1:0);s.wallPaint.fill(n>8?1:0);s.floorPhase=n>=5?2:n===4?1:0;s.wallPhase=n>=8?2:n===7?1:0;s.stage=n<3?n:n<6?3:n<9?4:n<11?5:n===11?6:7;
 s.player={x:0,z:1.95,yaw:Math.PI,vx:0,vz:0};
 if(n===0){s.cabinets[2].stored=false;s.held=2;s.player.x=5;s.player.z=-7.8;}
 const key=M.workKey(s);if(key){s[key].fill(n<3?0:1);const i=n>=6?0:76;s[key][i]=n<3?.1:.8;if(n>=6){s.player.x=-7.6;s.player.z=-3.35;}else{s.player.x=M.tile(i).x;s.player.z=M.tile(i).z+.55;}}
 if(n===4){s.load=1;s.player.x=-6;s.player.z=6.5;}
 if(n>=9){s.machineDirt.forEach(a=>a.fill(0));s.player.x=-5;s.player.z=-7.4;if(n===9)s.machineDirt[0][0]=.34;}
 if(n>=11){s.repaired=true;s.wires=[...M.solution];s.held=n===11?0:-1;s.cabinets[0].stored=false;s.cabinets[0].x=0;s.cabinets[0].z=0;s.player.x=0;s.player.z=1.7;}
 return s;}
http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),file=u.pathname==='/'?'index.html':u.pathname.slice(1);if(!['index.html','scene.js','model.js','tools.js','character.js','mouse-look.js','art.js','style.css','vendor/three.module.min.js','vendor/three.core.min.js'].includes(file)){res.writeHead(404);return res.end();}let body=fs.readFileSync(path.join(root,file));if(file==='index.html'&&steps.includes(u.searchParams.get('step'))){const seed=JSON.stringify(JSON.stringify(fixture(u.searchParams.get('step'))));body=body.toString().replace('<head>','<head><script>localStorage.setItem("afterhours.3d.v2",'+seed+');</script>');}res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html','Cache-Control':'no-store'});res.end(body);}).listen(4176,'127.0.0.1',()=>console.log('Local restoration checkpoint testing on 4176'));
