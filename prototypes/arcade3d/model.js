/* Shared deterministic room rules. Coordinates are metres: X across, Z front/back. */
const RoomModel = (() => {
  const trails=new WeakMap();
  const COLS=17, ROWS=9, COUNT=COLS*ROWS, solution=[2,1,2,0,3,0];
  const bays=[{x:-5,z:-9.1},{x:0,z:-9.1},{x:5,z:-9.1}];
  const tile=i=>({x:-7.2+(i%COLS)*.9,z:-3.2+Math.floor(i/COLS)*1.15});
  function fresh(){return {version:3,removed:Array(COUNT).fill(0),loose:Array(COUNT).fill(0),load:0,floorPhase:0,wallPhase:0,wallStrip:Array(16).fill(0),wallPatch:Array(16).fill(0),wallPaint:Array(16).fill(0),machineDirt:Array.from({length:3},()=>Array(24).fill(1)),stage:0,player:{x:0,z:6,yaw:Math.PI,vx:0,vz:0},cabinets:[{x:-4,z:0,yaw:0,stored:false},{x:0,z:-.5,yaw:0,stored:false},{x:4,z:1.8,yaw:0,stored:false}],held:-1,dust:Array(COUNT).fill(1),grime:Array(COUNT).fill(1),floor:Array(COUNT).fill(0),palette:0,wall:0,color:0,wires:[0,2,3,2,0,1],repaired:false,best:0};}
  function valid(s){return !!(s&&s.version===3&&[s.removed,s.loose].every(a=>Array.isArray(a)&&a.length===COUNT&&a.every(v=>Number.isFinite(v)&&v>=0&&v<=1))&&[s.wallStrip,s.wallPatch,s.wallPaint].every(a=>Array.isArray(a)&&a.length===16&&a.every(v=>Number.isFinite(v)&&v>=0&&v<=1))&&Array.isArray(s.machineDirt)&&s.machineDirt.length===3&&s.machineDirt.every(a=>Array.isArray(a)&&a.length===24&&a.every(v=>Number.isFinite(v)&&v>=0&&v<=1))&&Number.isInteger(s.load)&&s.load>=0&&s.load<=12&&Number.isInteger(s.floorPhase)&&s.floorPhase>=0&&s.floorPhase<=2&&Number.isInteger(s.wallPhase)&&s.wallPhase>=0&&s.wallPhase<=2&&(s.trail===undefined||(Array.isArray(s.trail)&&s.trail.length<500&&s.trail.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x)<9&&p.z> -11&&p.z<9)))&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=7&&s.player&&['x','z','yaw'].every(k=>Number.isFinite(s.player[k]))&&Math.abs(s.player.x)<9&&s.player.z>-11&&s.player.z<9&&Number.isInteger(s.held)&&s.held>=-1&&s.held<3&&Array.isArray(s.cabinets)&&s.cabinets.length===3&&s.cabinets.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.z)&&Number.isFinite(c.yaw)&&Math.abs(c.x)<9&&c.z>-11&&c.z<9&&typeof c.stored==='boolean')&&['dust','grime','floor'].every(k=>Array.isArray(s[k])&&s[k].length===COUNT&&s[k].every(v=>Number.isFinite(v)&&v>=0&&v<=1))&&['palette','wall','color'].every(k=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<4)&&Array.isArray(s.wires)&&s.wires.length===6&&s.wires.every(v=>Number.isInteger(v)&&v>=0&&v<4)&&typeof s.repaired==='boolean'&&Number.isFinite(s.best)&&s.best>=0);}
  function blocked(s,x,z,r=.32,exclude=-1){
    if(x-r< -8.7||x+r>8.7||z-r< -10.5||z+r>8.5)return true;
    if(Math.abs(z+5)<.2+r&&Math.abs(x)>2.3-r)return true;
    // Workshop bench and shelves are solid fixtures.
    if(x>6.7-r&&z< -9.15+r)return true;
    return s.cabinets.some((c,i)=>i!==exclude&&Math.abs(x-c.x)<.65+r&&Math.abs(z-c.z)<.62+r);
  }
  const wallTile=i=>({x:i<8?-8.52:8.52,z:-3.35+(i%8)*1.55});
  const mean=a=>a.reduce((n,v)=>n+v,0)/a.length;
  function migrate(old){if(!old)return null;if(old.version===3){if(!valid(old))return null;while(workKey(old)&&!remaining(old).length)work(old);return old;}if(old.version!==2)return null;const n=Object.assign(fresh(),old,{version:3});if(n.stage>=3){n.floorPhase=2;n.removed.fill(1);}if(n.stage>=5){n.wallPhase=2;n.wallStrip.fill(1);n.wallPatch.fill(1);n.wallPaint.fill(1);n.machineDirt.forEach(a=>a.fill(0));}return valid(n)?n:null;}
  function workKey(s){return s.stage===1?'dust':s.stage===2?'grime':s.stage===3?(s.floorPhase===0?'removed':s.floorPhase===2?'floor':null):s.stage===4?['wallStrip','wallPatch','wallPaint'][s.wallPhase]:null;}
  function progress(s){if(s.stage===0)return s.cabinets.filter(c=>c.stored).length/3;if(s.stage===3&&s.floorPhase===1)return 1-(s.loose.reduce((a,v)=>a+v,0)+s.load)/COUNT;if(s.stage===5)return 1-mean(s.machineDirt.flat());const key=workKey(s);if(key)return s.stage<3?1-mean(s[key]):mean(s[key]);return s.stage===7?1:0;}
  function remaining(s){const key=workKey(s);if(key)return s[key].flatMap((v,i)=>(s.stage<3?v>0:v<1)?[i]:[]);if(s.stage===3&&s.floorPhase===1)return s.loose.flatMap((v,i)=>v?[i]:[]);return [];}
  function percent(s){const p=progress(s),unfinished=workKey(s)?remaining(s).length:s.stage===5?s.machineDirt.flat().some(v=>v>0):p<1;return unfinished?Math.min(99,Math.floor(p*100)):100;}
  function work(s){const key=workKey(s);if(!key)return 0;const p=s.player;let n=0;
    if(s.stage===4){let best=-1,dist=1.9;for(let i=0;i<16;i++){const w=wallTile(i),d=Math.hypot(w.x-p.x,w.z-p.z);if(d<dist&&s[key][i]<1){best=i;dist=d;}}if(best>=0){s[key][best]=Math.min(1,s[key][best]+.09);n++;}}
    else{const x=p.x+Math.sin(p.yaw)*.55,z=p.z+Math.cos(p.yaw)*.55;for(let i=0;i<COUNT;i++){const q=tile(i);if(Math.hypot(q.x-x,q.z-z)>.92&&Math.hypot(q.x-p.x,q.z-p.z)>.65)continue;const goal=s.stage<3?0:1;if(s[key][i]===goal)continue;s[key][i]=goal===0?Math.max(0,s[key][i]-.24):Math.min(1,s[key][i]+.2);if(key==='removed'&&s[key][i]===1)s.loose[i]=1;n++;}}
    if(!remaining(s).length){if(s.stage===3&&s.floorPhase===0)s.floorPhase=1;else if(s.stage===4&&s.wallPhase<2)s.wallPhase++;else s.stage++;}return n;
  }
  function debris(s){if(s.stage!==3||s.floorPhase!==1)return 'unavailable';if(Math.hypot(s.player.x+7,s.player.z-7.2)<2&&s.load){s.load=0;if(!s.loose.some(Boolean)){s.floorPhase=2;return 'disposed';}return 'unloaded';}if(s.load>=12)return 'full';let n=0;for(let i=0;i<COUNT&&s.load<12;i++){const q=tile(i);if(s.loose[i]&&Math.hypot(q.x-s.player.x,q.z-s.player.z)<1.65){s.loose[i]=0;s.load++;n++;}}return n?'collected':'nearer';}
  function wipe(s,c,patch,mode){if(s.stage!==5||!Number.isInteger(c)||c<0||c>2||!Number.isInteger(patch)||patch<0||patch>=24)return false;const v=s.machineDirt[c][patch],needed=v>.67?'dust':v>.33?'wash':'polish';if(mode&&mode!==needed)return false;s.machineDirt[c][patch]=Math.max(0,v-.34);return true;}
  function cameraBlocked(s,x,z,y){if(y<3.5&&(Math.abs(x)>8.54||z< -10.34))return true;if(y<3&&Math.abs(z+5)<.36&&Math.abs(x)>2.14)return true;if(y<1.4&&x>6.54&&z< -8.99)return true;return y<2.65&&s.cabinets.some(c=>Math.abs(x-c.x)<.81&&Math.abs(z-c.z)<.78);}
  function cameraPosition(s,yaw,distance=4.2,pitch=.24){const p=s.player,dx=Math.sin(yaw)*distance,dz=Math.cos(yaw)*distance;let f=1;for(let i=1;i<=80;i++){const q=i/80;if(cameraBlocked(s,p.x+dx*q,p.z+dz*q,1.65+Math.sin(pitch)*distance*q)){f=Math.max(0,(i-2)/80);break;}}return {x:p.x+dx*f,z:p.z+dz*f,y:1.65+Math.sin(pitch)*distance*f};}
  function step(s,dx,dz,dt){dt=Math.max(0,Math.min(dt,.04));const p=s.player,mag=Math.hypot(dx,dz),speed=s.held<0?4.2:2.8,k=1-Math.exp(-18*dt);p.vx=(p.vx||0)+((mag?dx/mag*speed:0)-(p.vx||0))*k;p.vz=(p.vz||0)+((mag?dz/mag*speed:0)-(p.vz||0))*k;
    const ox=p.x,oz=p.z;
    if(!blocked(s,p.x+p.vx*dt,p.z,.32,s.held))p.x+=p.vx*dt;else p.vx=0;
    if(!blocked(s,p.x,p.z+p.vz*dt,.32,s.held))p.z+=p.vz*dt;else p.vz=0;
    if(Math.hypot(p.vx,p.vz)>.1){const goal=Math.atan2(p.vx,p.vz),diff=Math.atan2(Math.sin(goal-p.yaw),Math.cos(goal-p.yaw));p.yaw+=diff*(1-Math.exp(-15*dt));}
    if(s.held>=0){
      const c=s.cabinets[s.held];let trail=trails.get(s);if(!trail){trail=Array.isArray(s.trail)?s.trail:[{x:ox,z:oz}];trails.set(s,trail);s.trail=trail;}
      if(!trail.length||Math.hypot(p.x-trail.at(-1).x,p.z-trail.at(-1).z)>.025)trail.push({x:p.x,z:p.z});
      let length=0,previous=c;for(const q of trail){length+=Math.hypot(q.x-previous.x,q.z-previous.z);previous=q;}
      let travel=Math.max(0,length-1.5);
      while(travel>.0001&&trail.length){const q=trail[0],d=Math.hypot(q.x-c.x,q.z-c.z);if(d<.0001){trail.shift();continue;}const amount=Math.min(travel,d),x=c.x+(q.x-c.x)*amount/d,z=c.z+(q.z-c.z)*amount/d;
        if(blocked(s,x,z,.68,s.held)){p.x=ox;p.z=oz;p.vx=p.vz=0;trail.pop();break;}
        c.yaw=Math.atan2(q.x-c.x,q.z-c.z);c.x=x;c.z=z;travel-=amount;if(amount>=d-.0001)trail.shift();
      }
    }else {trails.delete(s);s.trail=[];}
  }
  function nearest(s){let index=-1,dist=2.35;for(let i=0;i<3;i++){const c=s.cabinets[i],d=Math.hypot(c.x-s.player.x,c.z-s.player.z);if(d<dist){dist=d;index=i;}}return index;}
  function interact(s){
    if(s.stage===3&&s.floorPhase===1)return debris(s);
    if(s.held>=0){const i=s.held,c=s.cabinets[i];if(s.stage===0&&s.player.z< -6.3){c.x=bays[i].x;c.z=bays[i].z;c.yaw=0;c.stored=true;s.held=-1;if(Math.abs(s.player.x-c.x)<1&&Math.abs(s.player.z-c.z)<1)s.player.z=c.z+1.5;if(s.cabinets.every(c=>c.stored))s.stage=1;return 'stored';}
      if(s.stage===6&&s.player.z> -3.5){c.x=s.player.x;c.z=s.player.z-1.5;c.yaw=0;c.stored=false;s.held=-1;s.stage=7;return 'restored';}
      s.held=-1;return 'dropped';}
    const i=nearest(s);if(i<0)return 'nearer';if((s.stage===0&&!s.cabinets[i].stored)||(s.stage===6&&i===0)){s.held=i;s.trail=[];trails.delete(s);return 'loaded';}if(s.stage===5&&s.machineDirt[i].some(v=>v>0))return 'clean';if(s.stage===5&&i===0&&s.machineDirt.every(a=>a.every(v=>v===0)))return 'repair';if(s.stage===7&&i===0)return 'play';return 'unavailable';
  }
  // Grid search for point-and-click walking. Room geometry and cabinets remain solid.
  function path(s,x,z){const size=.4,minX=-8.4,minZ=-10.2,W=43,H=47;const node=(x,z)=>({x:Math.max(0,Math.min(W-1,Math.round((x-minX)/size))),z:Math.max(0,Math.min(H-1,Math.round((z-minZ)/size)))});const start=node(s.player.x,s.player.z),goal=node(x,z),id=n=>n.z*W+n.x,world=n=>({x:minX+n.x*size,z:minZ+n.z*size});const q=[start],seen=new Set([id(start)]),prev=new Map();let best=start,bestD=Infinity;
    for(let head=0;head<q.length;head++){const a=q[head],d=Math.hypot(a.x-goal.x,a.z-goal.z);if(d<bestD){bestD=d;best=a;}if(d===0)break;for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const b={x:a.x+dx,z:a.z+dz};if(b.x<0||b.x>=W||b.z<0||b.z>=H||seen.has(id(b)))continue;const w=world(b);if(blocked(s,w.x,w.z,s.held>=0?.8:.4,s.held))continue;if(s.held>=0&&s.cabinets.some((c,i)=>i!==s.held&&Math.abs(w.x-c.x)<2.1&&Math.abs(w.z-c.z)<2.1))continue;seen.add(id(b));prev.set(id(b),a);q.push(b);}}
    let result=[],at=best;while(id(at)!==id(start)){result.push(world(at));at=prev.get(id(at));if(!at)return [];}return result.reverse();
  }
  function repair(s){if(s.stage===5&&s.machineDirt.every(a=>a.every(v=>v===0))&&s.wires.every((v,i)=>v===solution[i])){s.repaired=true;s.stage=6;return true;}return false;}
  return {fresh,valid,migrate,workKey,wallTile,wipe,cameraPosition,cameraBlocked,blocked,progress,percent,remaining,work,step,nearest,interact,path,repair,bays,tile,COUNT,solution};
})();
if(typeof module!=='undefined')module.exports=RoomModel;
if(typeof window!=='undefined')window.RoomModel=RoomModel;
