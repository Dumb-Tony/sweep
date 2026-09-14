import * as T from './vendor/three.module.min.js';

// Jointed, hand-authored geometry: each elbow, knee and wrist is independent.
// No generated skin weights or externally retargeted skeleton are involved.
export function createCharacter(art) {
  const root=new T.Group(), hips=new T.Group(), chest=new T.Group();
  root.add(hips); hips.position.y=.88; hips.add(chest); chest.position.y=.27;
  const material=(color,roughness=.85)=>Object.assign(art.surfaceMat(color).clone(),{roughness,bumpScale:.003});
  const jacket=material('#487c7d'),darkJacket=material('#345f63'),seam=material('#8ca9a0');
  const denim=material('#304453'),skin=material('#d6a281'),hair=material('#47352b');
  const boot=material('#956f48'),sole=material('#313936'),glove=material('#d0bc90');
  const metal=material('#ad9b70',.4);
  function oval(parent,m,x,y,z,sx,sy,sz){const mesh=new T.Mesh(new T.SphereGeometry(1,20,16),m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function rounded(parent,m,x,y,z,w,h,d,r=.025){return art.box(parent,x,y,z,w,h,d,m,Math.min(r,w*.45,h*.45,d*.45));}
  function joint(parent,x,y,z){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
  // Shaped shoulders, waist and jacket hem keep a human silhouette from behind.
  const profile=[[.21,-.27],[.245,-.22],[.235,-.08],[.285,.16],[.25,.26],[.15,.31]];
  const torso=new T.Mesh(new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),28),jacket);
  torso.scale.z=.73;torso.castShadow=torso.receiveShadow=true;chest.add(torso);
  rounded(chest,darkJacket,0,-.235,0,.46,.08,.32);
  rounded(chest,seam,0,.03,.182,.014,.48,.013,.003);
  rounded(chest,darkJacket,-.13,.12,.177,.15,.14,.027,.015);
  rounded(chest,seam,-.13,.172,.195,.145,.012,.012,.003);
  rounded(chest,metal,-.07,.15,.204,.018,.018,.009,.003);
  // A stitched back yoke, small repair-shop patch, and natural jacket folds.
  art.tube(chest,Array.from({length:13},(_,i)=>{const x=-.2+i/12*.4;return [x,.19,-Math.sqrt(.27*.27-x*x)*.73-.006];}),.005,seam);
  rounded(chest,darkJacket,0,.025,-.18,.27,.15,.025,.018);
  const patch=document.createElement('canvas');patch.width=256;patch.height=128;
  const ink=patch.getContext('2d');ink.fillStyle='#d5c8a4';ink.fillRect(0,0,256,128);
  ink.strokeStyle='#4b716b';ink.lineWidth=8;ink.strokeRect(10,10,236,108);
  ink.fillStyle='#31574f';ink.textAlign='center';ink.font='bold 34px monospace';ink.fillText('AFTER',128,54);ink.fillText('HOURS',128,94);
  const tex=new T.CanvasTexture(patch);tex.colorSpace=T.SRGBColorSpace;
  const badge=new T.Mesh(new T.PlaneGeometry(.24,.12),new T.MeshStandardMaterial({map:tex,roughness:1}));
  badge.position.set(0,.025,-.195);badge.rotation.y=Math.PI;chest.add(badge);
  for(const side of [-1,1]){const fold=rounded(chest,darkJacket,side*.19,-.1,-.145,.012,.16,.018,.005);fold.rotation.z=side*.18;}
  oval(hips,denim,0,-.05,0,.24,.18,.17);
  for(const side of [-1,1]){rounded(hips,denim,side*.125,-.075,-.164,.14,.14,.022,.016);rounded(hips,seam,side*.125,-.02,-.178,.11,.009,.009,.003);}
  rounded(hips,boot,0,.015,0,.45,.045,.34,.015);
  rounded(hips,metal,0,.018,.179,.075,.055,.018,.008);
  const neck=joint(chest,0,.31,0);oval(neck,skin,0,.025,0,.09,.09,.085);
  const head=joint(neck,0,.18,0);
  oval(head,skin,0,0,.014,.166,.205,.16);
  oval(head,skin,0,-.105,.058,.13,.107,.12);
  for(const side of [-1,1]){
    oval(head,skin,side*.168,-.006,0,.035,.062,.03);
    oval(head,hair,side*.085,.006,.152,.032,.009,.008);
    oval(head,material('#282d2c'),side*.068,-.022,.163,.011,.014,.008);
  }
  oval(head,skin,0,-.058,.177,.027,.041,.036);
  rounded(head,hair,0,-.118,.164,.065,.008,.008,.003);
  oval(head,hair,0,.08,-.015,.175,.152,.158);
  // Knit work cap, ribbed band, short hair at the nape. No oversized box hat.
  oval(head,darkJacket,0,.125,-.016,.188,.14,.174);
  const band=new T.Mesh(new T.TorusGeometry(.167,.026,8,32),jacket);band.rotation.x=Math.PI/2;band.scale.y=.91;band.position.set(0,.066,-.002);band.castShadow=true;head.add(band);
  for(let i=0;i<17;i++){const a=i/17*Math.PI*2;oval(head,seam,Math.sin(a)*.176,.069,Math.cos(a)*.151,.005,.025,.005);}
  rounded(head,metal,.126,.073,.137,.038,.032,.008,.004);
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const hip=joint(hips,side*.13,-.09,0),knee=joint(hip,0,-.34,0);
    oval(hip,denim,0,-.17,0,.111,.22,.115);
    oval(knee,denim,0,-.14,0,.095,.19,.094);
    rounded(knee,darkJacket,0,-.27,0,.185,.045,.184,.014);
    const foot=joint(knee,0,-.30,.035);
    rounded(foot,boot,0,-.02,.045,.205,.18,.33,.055);
    rounded(foot,sole,0,-.108,.052,.218,.045,.35,.013);
    rounded(foot,darkJacket,0,.025,-.075,.12,.14,.095,.023);
    for(let n=0;n<3;n++)rounded(foot,glove,0,.071,.012+n*.043,.13,.011,.011,.003);
    legs.push({hip,knee,foot,side});
    const shoulder=joint(chest,side*.275,.17,0),elbow=joint(shoulder,0,-.31,0),wrist=joint(elbow,0,-.29,0);
    oval(shoulder,jacket,0,-.13,0,.105,.19,.105);
    oval(elbow,jacket,0,-.105,0,.083,.15,.083);
    rounded(elbow,darkJacket,0,-.23,0,.16,.085,.15,.024);
    oval(wrist,glove,0,-.05,.012,.072,.09,.052);
    oval(wrist,glove,-side*.055,-.025,.027,.024,.05,.03);
    arms.push({shoulder,elbow,wrist,side});
  }
  art.contact(root,0,0,.95,.75,.42,.008);
  let gait=0;
  const down=new T.Vector3(0,-1,0);
  function reach(arm,point){
    const start=arm.shoulder.position.clone(),end=new T.Vector3(...point).sub(start);
    const length=T.MathUtils.clamp(end.length(),.05,.595);end.normalize();
    const bend=new T.Vector3(arm.side*.65,-.05,-1);bend.addScaledVector(end,-bend.dot(end)).normalize();
    const along=(.31*.31-.29*.29+length*length)/(2*length);
    const mid=end.clone().multiplyScalar(along).addScaledVector(bend,Math.sqrt(Math.max(0,.31*.31-along*along)));
    arm.shoulder.quaternion.setFromUnitVectors(down,mid.clone().normalize());
    const lower=end.multiplyScalar(length).sub(mid).normalize().applyQuaternion(arm.shoulder.quaternion.clone().invert());
    arm.elbow.quaternion.setFromUnitVectors(down,lower);
  }
  function animate({dt,speed,phase,time,working,hauling,tool,wall,side}){
    gait=T.MathUtils.lerp(gait,Math.min(1,speed/3.2),1-Math.exp(-12*dt));
    hips.position.y=.88+Math.sin(phase*2)*.015*gait;
    chest.rotation.z=Math.sin(phase)*.018*gait;chest.rotation.x=hauling?.075:working?.035:0;
    head.rotation.y=Math.sin(time*.00065)*.018*(1-gait);
    for(const leg of legs){const swing=Math.sin(phase+(leg.side<0?0:Math.PI));leg.hip.rotation.x=swing*.42*gait;leg.knee.rotation.x=Math.max(0,-swing)*.65*gait;leg.foot.rotation.x=-leg.knee.rotation.x*.45;}
    for(const arm of arms){arm.shoulder.rotation.set(Math.sin(phase+(arm.side<0?Math.PI:0))*.3*gait,0,arm.side*.08);arm.elbow.rotation.set(-.12,0,0);}
    if(tool&&!wall){reach(arms[1],[.32,-.22,.28]);reach(arms[0],[.3,-.10,.23]);}
    if(wall){const a=side<0?arms[0]:arms[1];reach(a,[side*.57,.13+(working?Math.sin(time*.012)*.08:0),.05]);}
    if(hauling)for(const arm of arms)reach(arm,[arm.side*.28,-.21,.26]);
  }
  return {root,animate};
}
