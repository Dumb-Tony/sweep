import * as T from './vendor/three.module.min.js';

// Purpose-built tools with thin working edges, separate fittings and grips.
export function createTools(art){
  const root=new T.Group(),models={};
  const material=(color,metalness=0,roughness=.65,kind=metalness?'metal':'paint')=>Object.assign(art.surfaceMat(color,kind).clone(),{metalness,roughness});
  const steel=material('#a9b8bb',.85,.27),rubber=material('#26383b',0,.92),wood=material('#b48a50',0,.7,'wood'),brass=material('#b6955a',.6,.4),cloth=material('#d8d3b9',0,1,'fabric'),teal=material('#4e8582');
  function group(name){const g=new T.Group();g.name=name;root.add(g);models[name]=g;return g;}
  function bar(g,a,b,r,m){const p=new T.Vector3(...a),q=new T.Vector3(...b),v=q.clone().sub(p);const mesh=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),12),m);mesh.position.copy(p).add(q).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());mesh.castShadow=true;g.add(mesh);return mesh;}
  function box(g,x,y,z,w,h,d,m,r=.008){return art.box(g,x,y,z,w,h,d,m,Math.min(r,w/3,h/3,d/3));}
  function handle(g,m=wood){bar(g,[0,.14,.02],[0,1.02,-.43],.022,m);bar(g,[0,.78,-.307],[0,1.02,-.43],.029,rubber);bar(g,[0,.12,.03],[0,.24,-.03],.033,steel);}
  const broom=group('broom');handle(broom);box(broom,0,.105,.04,.74,.075,.18,wood,.018);
  for(const x of [-.24,.24])box(broom,x,.148,.04,.045,.009,.13,brass,.002);
  const bristles=new T.InstancedMesh(new T.CylinderGeometry(.006,.009,.12,5),material('#bd9a60'),96),pose=new T.Object3D();
  for(let i=0;i<96;i++){pose.position.set((i%24-11.5)*.029,.015,.04+(Math.floor(i/24)-1.5)*.042);pose.rotation.z=(i%24-11.5)*.009;pose.updateMatrix();bristles.setMatrixAt(i,pose.matrix);}bristles.castShadow=true;broom.add(bristles);
  const mop=group('mop');handle(mop,steel);box(mop,0,.10,.04,.36,.06,.1,teal);
  for(let i=0;i<20;i++){const x=(i%10-4.5)*.033,z=.04+(i<10?-.03:.03);art.tube(mop,[[x,.09,z],[x*1.3,.015,z+.12],[x*1.7,-.015,z+.22],[x*1.9,.005,z+.28]],.012,cloth);}
  const pry=group('pry');art.tube(pry,[[0,.93,-.4],[0,.18,.01],[0,.045,.08],[0,.015,.23]],.023,steel);bar(pry,[0,.7,-.28],[0,.94,-.405],.031,rubber);
  for(const x of [-.032,.032])box(pry,x,.008,.245,.041,.018,.12,steel,.003);
  function blade(name,width,depth){const g=group(name);box(g,0,.035,.06,width,.012,depth,steel,.002);bar(g,[0,.04,-.02],[0,.15,-.04],.013,steel);bar(g,[0,.15,-.10],[0,.15,.14],.032,wood);return g;}
  const setter=blade('setter',.32,.36);for(let i=0;i<10;i++)box(setter,-.16,.029,-.10+i*.033,.028,.025,.015,steel,.001);
  const patch=blade('patch',.28,.33);
  const scraper=group('scraper');box(scraper,0,.03,.12,.23,.013,.16,steel,.001);bar(scraper,[0,.04,.04],[0,.37,-.08],.019,steel);bar(scraper,[0,.18,-.01],[0,.38,-.085],.035,rubber);
  const roller=group('roller');bar(roller,[0,.08,-.18],[0,.77,-.42],.024,wood);bar(roller,[0,.57,-.35],[0,.79,-.43],.03,rubber);
  art.tube(roller,[[0,.09,-.18],[0,.06,.04],[.27,.06,.04],[.27,.06,.20],[0,.06,.20]],.012,steel);
  bar(roller,[-.23,.06,.20],[.23,.06,.20],.07,cloth);for(const x of [-.235,.235])bar(roller,[x-.008,.06,.20],[x+.008,.06,.20],.045,teal);
  const grips={broom:.9,mop:.9,pry:.82,setter:.15,patch:.15,scraper:.28,roller:.68};
  function select(s){const name=s.stage===1?'broom':s.stage===2?'mop':s.stage===3?(s.floorPhase===0?'pry':s.floorPhase===2?'setter':null):s.stage===4?['scraper','patch','roller'][s.wallPhase]:null;for(const [key,g] of Object.entries(models))g.visible=key===name;root.userData.tool=name;}
  return {root,select,models,grip:()=>grips[root.userData.tool]||0};
}
