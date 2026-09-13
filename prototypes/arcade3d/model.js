/* Shared deterministic room rules. Coordinates are metres: X across, Z front/back. */
const RoomModel = (() => {
  const trails=new WeakMap();
  const COLS=17, ROWS=9, COUNT=COLS*ROWS, solution=[2,1,2,0,3,0];
  const bays=[{x:-5,z:-9.1},{x:0,z:-9.1},{x:5,z:-9.1}];
  const tile=i=>({x:-7.2+(i%COLS)*.9,z:-3.2+Math.floor(i/COLS)*1.15});
  function fresh(){return {version:2,stage:0,player:{x:0,z:6,yaw:Math.PI,vx:0,vz:0},cabinets:[{x:-4,z:0,yaw:0,stored:false},{x:0,z:-.5,yaw:0,stored:false},{x:4,z:1.8,yaw:0,stored:false}],held:-1,dust:Array(COUNT).fill(1),grime:Array(COUNT).fill(1),floor:Array(COUNT).fill(0),palette:0,wall:0,color:0,wires:[0,2,3,2,0,1],repaired:false,best:0};}
  function valid(s){return !!(s&&s.version===2&&(s.trail===undefined||(Array.isArray(s.trail)&&s.trail.length<500&&s.trail.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x)<9&&p.z> -11&&p.z<9)))&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=7&&s.player&&['x','z','yaw'].every(k=>Number.isFinite(s.player[k]))&&Math.abs(s.player.x)<9&&s.player.z>-11&&s.player.z<9&&Number.isInteger(s.held)&&s.held>=-1&&s.held<3&&Array.isArray(s.cabinets)&&s.cabinets.length===3&&s.cabinets.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.z)&&Number.isFinite(c.yaw)&&Math.abs(c.x)<9&&c.z>-11&&c.z<9&&typeof c.stored==='boolean')&&['dust','grime','floor'].every(k=>Array.isArray(s[k])&&s[k].length===COUNT&&s[k].every(v=>v===0||v===1))&&['palette','wall','color'].every(k=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<4)&&Array.isArray(s.wires)&&s.wires.length===6&&s.wires.every(v=>Number.isInteger(v)&&v>=0&&v<4)&&typeof s.repaired==='boolean'&&Number.isFinite(s.best)&&s.best>=0);}
  function blocked(s,x,z,r=.32,exclude=-1){
    if(x-r< -8.7||x+r>8.7||z-r< -10.5||z+r>8.5)return true;
    if(Math.abs(z+5)<.2+r&&Math.abs(x)>2.3-r)return true;
    // Workshop bench and shelves are solid fixtures.
    if(x>6.7-r&&z< -9.15+r)return true;
    return s.cabinets.some((c,i)=>i!==exclude&&Math.abs(x-c.x)<.65+r&&Math.abs(z-c.z)<.62+r);
  }
  function progress(s){if(s.stage===0)return s.cabinets.filter(c=>c.stored).length/3;if(s.stage>=1&&s.stage<=3){const key=['','dust','grime','floor'][s.stage];return s[key].reduce((a,v)=>a+(s.stage===3?v:1-v),0)/COUNT;}return s.stage===7?1:0;}
  function work(s){if(s.stage<1||s.stage>3)return 0;const p=s.player,key=['','dust','grime','floor'][s.stage];const x=p.x+Math.sin(p.yaw)*.8,z=p.z+Math.cos(p.yaw)*.8;let n=0;for(let i=0;i<COUNT;i++){const t=tile(i);if(Math.hypot(t.x-x,t.z-z)<1.4&&s[key][i]!== (s.stage===3?1:0)){s[key][i]=s.stage===3?1:0;n++;}}if(progress(s)===1)s.stage++;return n;}
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
    if(s.held>=0){const i=s.held,c=s.cabinets[i];if(s.stage===0&&s.player.z< -6.3){c.x=bays[i].x;c.z=bays[i].z;c.yaw=0;c.stored=true;s.held=-1;if(Math.abs(s.player.x-c.x)<1&&Math.abs(s.player.z-c.z)<1)s.player.z=c.z+1.5;if(s.cabinets.every(c=>c.stored))s.stage=1;return 'stored';}
      if(s.stage===6&&s.player.z> -3.5){c.x=s.player.x;c.z=s.player.z-1.5;c.yaw=0;c.stored=false;s.held=-1;s.stage=7;return 'restored';}
      s.held=-1;return 'dropped';}
    const i=nearest(s);if(i<0)return 'nearer';if((s.stage===0&&!s.cabinets[i].stored)||(s.stage===6&&i===0)){s.held=i;s.trail=[];trails.delete(s);return 'loaded';}if(s.stage===5&&i===0)return 'repair';if(s.stage===7&&i===0)return 'play';return 'unavailable';
  }
  // Grid search for point-and-click walking. Room geometry and cabinets remain solid.
  function path(s,x,z){const size=.4,minX=-8.4,minZ=-10.2,W=43,H=47;const node=(x,z)=>({x:Math.max(0,Math.min(W-1,Math.round((x-minX)/size))),z:Math.max(0,Math.min(H-1,Math.round((z-minZ)/size)))});const start=node(s.player.x,s.player.z),goal=node(x,z),id=n=>n.z*W+n.x,world=n=>({x:minX+n.x*size,z:minZ+n.z*size});const q=[start],seen=new Set([id(start)]),prev=new Map();let best=start,bestD=Infinity;
    for(let head=0;head<q.length;head++){const a=q[head],d=Math.hypot(a.x-goal.x,a.z-goal.z);if(d<bestD){bestD=d;best=a;}if(d===0)break;for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const b={x:a.x+dx,z:a.z+dz};if(b.x<0||b.x>=W||b.z<0||b.z>=H||seen.has(id(b)))continue;const w=world(b);if(blocked(s,w.x,w.z,s.held>=0?.8:.4,s.held))continue;if(s.held>=0&&s.cabinets.some((c,i)=>i!==s.held&&Math.abs(w.x-c.x)<2.1&&Math.abs(w.z-c.z)<2.1))continue;seen.add(id(b));prev.set(id(b),a);q.push(b);}}
    let result=[],at=best;while(id(at)!==id(start)){result.push(world(at));at=prev.get(id(at));if(!at)return [];}return result.reverse();
  }
  function repair(s){if(s.stage===5&&s.wires.every((v,i)=>v===solution[i])){s.repaired=true;s.stage=6;return true;}return false;}
  return {fresh,valid,blocked,progress,work,step,nearest,interact,path,repair,bays,tile,COUNT,solution};
})();
if(typeof module!=='undefined')module.exports=RoomModel;
if(typeof window!=='undefined')window.RoomModel=RoomModel;
