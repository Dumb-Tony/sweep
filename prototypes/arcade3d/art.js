import * as T from './vendor/three.module.min.js';

// All artwork and surface maps are generated locally with a fixed seed.
// No fetched artwork, fonts, textures, or runtime asset services.
export function createArt(scene, renderer) {
  let seed=82731;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const textures=[], disposables=[];
  function canvas(w=512,h=w){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
  function texture(c,color=true){const t=new T.CanvasTexture(c);if(color)t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(t);return t;}
  function noise(g,w,h,count,alpha=.08){for(let i=0;i<count;i++){g.fillStyle=`rgba(${random()>.5?'255,244,222':'12,18,24'},${random()*alpha})`;const n=1+random()*2;g.fillRect(random()*w,random()*h,n,n);}}
  const [surface,sg]=canvas();sg.fillStyle='#a8a39b';sg.fillRect(0,0,512,512);noise(sg,512,512,45000,.2);
  for(let i=0;i<70;i++){sg.strokeStyle=`rgba(45,42,37,${random()*.15})`;sg.lineWidth=random()*2;sg.beginPath();const y=random()*512;sg.moveTo(0,y);sg.bezierCurveTo(150,y+15,400,y-10,512,y+5);sg.stroke();}
  const grain=texture(surface,false);grain.wrapS=grain.wrapT=T.RepeatWrapping;
  const [fabricC,fg]=canvas(256);fg.fillStyle='#888';fg.fillRect(0,0,256,256);for(let i=0;i<256;i+=4){fg.fillStyle=i%8?'#aaa':'#666';fg.fillRect(i,0,1,256);fg.fillRect(0,i,256,1);}noise(fg,256,256,9000,.09);const fabricMap=texture(fabricC,false);fabricMap.wrapS=fabricMap.wrapT=T.RepeatWrapping;fabricMap.repeat.set(5,5);
  const [plasterC,pg0]=canvas(256);pg0.fillStyle='#aaa';pg0.fillRect(0,0,256,256);for(let i=0;i<2400;i++){const a=40+random()*30;pg0.fillStyle=`rgb(${a},${a},${a})`;pg0.beginPath();pg0.arc(random()*256,random()*256,.4+random()*2,0,7);pg0.fill();}const plasterMap=texture(plasterC,false);plasterMap.wrapS=plasterMap.wrapT=T.RepeatWrapping;plasterMap.repeat.set(3,3);
  const [scratchC,scg]=canvas(256);scg.fillStyle='#777';scg.fillRect(0,0,256,256);for(let i=0;i<180;i++){scg.strokeStyle=`rgba(230,230,230,${.05+random()*.18})`;scg.lineWidth=.4;scg.beginPath();scg.moveTo(random()*256,random()*256);scg.lineTo(random()*256,random()*256);scg.stroke();}const scratchMap=texture(scratchC,false);scratchMap.wrapS=scratchMap.wrapT=T.RepeatWrapping;
  const materialCache=new Map();
  function surfaceMat(color,kind='paint'){
    const key=color+kind;if(materialCache.has(key))return materialCache.get(key);
    const detail=kind==='fabric'?fabricMap:kind==='plaster'?plasterMap:kind==='metal'?scratchMap:grain;
    const m=new T.MeshStandardMaterial({color,roughness:kind==='metal'?.34:kind==='skin'?.72:kind==='tile'?.43:kind==='wood'?.68:.84,metalness:kind==='metal'?.68:0,bumpMap:detail,bumpScale:kind==='fabric'?.012:kind==='plaster'?.022:kind==='skin'?.006:kind==='tile'?.015:.028,roughnessMap:detail});materialCache.set(key,m);return m;
  }
  function rounded(w,h,d,r=.035){const sh=new T.Shape(),x=-w/2,y=-h/2;sh.moveTo(x+r,y);sh.lineTo(x+w-r,y);sh.quadraticCurveTo(x+w,y,x+w,y+r);sh.lineTo(x+w,y+h-r);sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);sh.lineTo(x+r,y+h);sh.quadraticCurveTo(x,y+h,x,y+h-r);sh.lineTo(x,y+r);sh.quadraticCurveTo(x,y,x+r,y);const geo=new T.ExtrudeGeometry(sh,{depth:d-2*r,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r*.45,bevelThickness:r,curveSegments:3});geo.translate(0,0,-d/2+r);return geo;}
  const unitBox=new T.BoxGeometry(1,1,1);
  function box(parent,x,y,z,w,h,d,material,bevel=0){const o=new T.Mesh(bevel?rounded(w,h,d,bevel):unitBox,typeof material==='string'?surfaceMat(material):material);if(!bevel)o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function tube(parent,points,r,color){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const mesh=new T.Mesh(new T.TubeGeometry(curve,Math.max(12,points.length*4),r,6,false),typeof color==='string'?surfaceMat(color,'metal'):color);mesh.castShadow=true;parent.add(mesh);return mesh;}
  function disk(parent,x,y,z,r,h,color){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,20),typeof color==='string'?surfaceMat(color,'metal'):color);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function plane(parent,map,x,y,z,w,h,emissive=0){const m=new T.MeshStandardMaterial({map,roughness:.65,emissive:emissive?'#ffffff':'#000000',emissiveMap:map,emissiveIntensity:emissive});const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(x,y,z);parent.add(o);return o;}
  // A soft, local contact shadow anchors feet, wheels, cabinets, and props.
  const [shadowC,shadowG]=canvas(128);const shadowGrad=shadowG.createRadialGradient(64,64,8,64,64,64);shadowGrad.addColorStop(0,'rgba(9,13,18,.65)');shadowGrad.addColorStop(1,'rgba(9,13,18,0)');shadowG.fillStyle=shadowGrad;shadowG.fillRect(0,0,128,128);const shadowTex=texture(shadowC);
  function contact(parent,x,z,w,d,opacity=.6,y=.012){const o=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:shadowTex,transparent:true,opacity,depthWrite:false}));o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.raycast=()=>{};parent.add(o);return o;}
  // Irregular layered dirt replaces the old identical polygon per tile.
  const [dirtC,dg]=canvas(256);for(let i=0;i<90;i++){const x=128+(random()-.5)*160,y=128+(random()-.5)*160,r=15+random()*55;const grad=dg.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,`rgba(45,35,27,${.05+random()*.13})`);grad.addColorStop(1,'rgba(45,35,27,0)');dg.fillStyle=grad;dg.fillRect(x-r,y-r,r*2,r*2);}for(let i=0;i<1500;i++){dg.fillStyle=`rgba(55,41,31,${random()*.2})`;dg.fillRect(25+random()*206,25+random()*206,1+random()*3,1+random()*3);}const dirtMap=texture(dirtC);
  const floorCache=new Map();
  function floorMaterial(color,kind='tile'){
    const key=color+kind;if(floorCache.has(key))return floorCache.get(key);const [c,g]=canvas(256);g.fillStyle=color;g.fillRect(0,0,256,256);
    if(kind==='parquet'){for(let i=0;i<150;i++){g.strokeStyle=`rgba(${i%2?'39,25,18':'245,211,148'},${.025+random()*.1})`;g.lineWidth=.5+random()*2;const y=random()*256;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(70,y+random()*8,180,y-random()*8,256,y+random()*4);g.stroke();}for(const y of [64,128,192]){g.fillStyle='#30241a66';g.fillRect(0,y,256,2);}}
    else if(kind==='terrazzo'){for(let i=0;i<100;i++){const x=random()*256,y=random()*256;g.fillStyle=['#d2b49b','#9aaba3','#e2d5b5','#4a5a64','#c88a8a'][i%5];g.beginPath();g.moveTo(x,y);g.lineTo(x+2+random()*6,y+random()*3);g.lineTo(x+random()*6,y+3+random()*5);g.closePath();g.fill();}}
    noise(g,256,256,9000,kind==='old'?.2:.065);g.strokeStyle=kind==='old'?'#dac7a238':'#ffffff18';g.lineWidth=3;g.strokeRect(3,3,250,250);g.strokeStyle='#15232a40';g.lineWidth=2;g.strokeRect(0,0,256,256);
    if(kind==='old'){for(let j=0;j<10;j++){g.strokeStyle='#332b2450';g.lineWidth=.6;let x=random()*256,y=random()*256;g.beginPath();g.moveTo(x,y);g.lineTo(x+random()*60-30,y+random()*30);g.stroke();}}
    const map=texture(c),m=new T.MeshStandardMaterial({map,roughness:kind==='old'?.91:kind==='parquet'?.57:.36,bumpMap:grain,bumpScale:.012,roughnessMap:grain});floorCache.set(key,m);return m;
  }
  // Original printed artwork for three fictional machines.
  const names=['STAR SIGNAL','MOON RALLY','PIXEL GARDEN'];
  function artwork(i,marquee=false){const [c,g]=canvas(512,marquee?144:768);const h=c.height;const grad=g.createLinearGradient(0,0,512,h);grad.addColorStop(0,['#163f55','#302340','#25483f'][i]);grad.addColorStop(1,['#111827','#805947','#19383a'][i]);g.fillStyle=grad;g.fillRect(0,0,512,h);
    const accent=['#f1b5c8','#f3c384','#a6d7a7'][i];g.strokeStyle=accent;g.lineWidth=5;g.strokeRect(12,12,488,h-24);
    for(let j=0;j<80;j++){g.fillStyle=j%4? '#f7e2b78c':accent;g.fillRect(random()*512,random()*h,1+random()*3,1+random()*3);}
    if(!marquee){g.save();g.translate(256,320);if(i===0){for(let j=0;j<6;j++){g.strokeStyle=[accent,'#8cbcbc','#d7b27d'][j%3];g.lineWidth=8;g.beginPath();g.ellipse(0,0,60+j*18,160+j*16,-.6,0,Math.PI*2);g.stroke();}g.fillStyle=accent;g.beginPath();g.arc(0,0,60,0,7);g.fill();g.fillStyle='#173440';g.beginPath();g.arc(-15,-12,47,0,7);g.fill();}
      else if(i===1){g.fillStyle='#e8c68b';g.beginPath();g.arc(87,-105,70,0,7);g.fill();g.fillStyle='#1b2437';g.beginPath();g.moveTo(-205,205);g.bezierCurveTo(140,30,-150,-65,35,-190);g.lineTo(85,-190);g.bezierCurveTo(-50,-65,240,30,205,205);g.closePath();g.fill();g.strokeStyle='#d5a36f';g.lineWidth=9;g.beginPath();g.moveTo(-105,205);g.bezierCurveTo(200,20,-100,-40,61,-185);g.stroke();g.setLineDash([20,18]);g.strokeStyle='#f0ddaf';g.lineWidth=3;g.stroke();g.setLineDash([]);}
      else{g.strokeStyle='#a2c2a0';g.lineWidth=12;g.beginPath();g.moveTo(0,190);g.quadraticCurveTo(28,20,-7,-160);g.stroke();for(let j=0;j<7;j++){g.save();g.translate(j%2?45:-45,145-j*45);g.rotate(j%2?-.55:.55);g.fillStyle=j%2?'#b6d3aa':'#739f96';g.beginPath();g.ellipse(0,0,60,23,0,0,7);g.fill();g.restore();}g.fillStyle='#e3b0ad';for(let j=0;j<6;j++){g.beginPath();g.ellipse(Math.sin(j)*27,-155+Math.cos(j)*27,22,12,j,0,7);g.fill();}g.fillStyle='#edce92';g.beginPath();g.arc(0,-155,18,0,7);g.fill();}
      g.restore();g.fillStyle=accent;g.font='bold 53px system-ui';g.textAlign='center';const words=names[i].split(' ');words.forEach((w,j)=>g.fillText(w,256,570+j*58));g.font='18px monospace';g.fillText(['A SIGNAL FROM ANOTHER WORLD','TAKE THE LONG WAY HOME','GROW SOMETHING WONDERFUL'][i],256,708);}
    else{g.shadowColor=accent;g.shadowBlur=8;g.fillStyle='#f8e5bf';g.textAlign='center';g.font='italic 900 53px system-ui';g.fillText(names[i],256,90);g.shadowBlur=0;}
    noise(g,512,h,3500,.075);return texture(c);
  }
  const cabDetails=[];
  function cabinet(i,color){const group=new T.Group(),body=surfaceMat(color).clone();body.roughness=.52;const black=surfaceMat('#16262d'),metal=surfaceMat('#59666b','metal');
    // Extruded side panels give each cabinet a real arcade-machine profile.
    const profile=[[-.53,.08],[.6,.08],[.6,.93],[.78,1.02],[.72,1.2],[.37,1.3],[.22,1.94],[.51,2.02],[.5,2.45],[-.53,2.45]];
    const sh=new T.Shape();profile.forEach(([z,y],j)=>j?sh.lineTo(-z,y):sh.moveTo(-z,y));sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:.075,bevelEnabled:true,bevelSize:.022,bevelThickness:.017,bevelSegments:2,steps:1});geo.rotateY(Math.PI/2);
    for(const x of [-.67,.59]){const side=new T.Mesh(geo,body);side.position.x=x;side.castShadow=side.receiveShadow=true;group.add(side);tube(group,profile.map(([z,y])=>[x<0?-.697:.697,y,z]),.022,'#111d25');const decal=plane(group,artwork(i),x<0?-.715:.715,1.23,-.01,.91,1.97);decal.rotation.y=x<0?-Math.PI/2:Math.PI/2;}
    box(group,0,1,-.4,1.19,1.83,.25,black);box(group,0,.48,.57,1.18,.85,.11,body,.022);box(group,0,.13,.59,1.23,.14,.1,metal,.02);
    const bezel=box(group,0,1.63,.39,1.14,.8,.14,black,.065);bezel.rotation.x=-.24;
    const crtGeo=new T.PlaneGeometry(.91,.6,18,12),positions=crtGeo.attributes.position;for(let v=0;v<positions.count;v++){const x=positions.getX(v)/.455,y=positions.getY(v)/.3;positions.setZ(v,.055*(1-x*x)*(1-y*y));}crtGeo.computeVertexNormals();
    const [screenC,screenG]=canvas(256,192);screenG.fillStyle='#091720';screenG.fillRect(0,0,256,192);const reflection=screenG.createLinearGradient(0,0,256,192);reflection.addColorStop(0,'#78959b');reflection.addColorStop(.35,'#142c36');reflection.addColorStop(1,'#09131c');screenG.fillStyle=reflection;screenG.fillRect(8,8,240,176);screenG.fillStyle='#bac2ae30';screenG.font='10px monospace';screenG.textAlign='center';screenG.fillText('NO SIGNAL',128,150);const screenMap=texture(screenC);
    const screenMat=new T.MeshPhysicalMaterial({map:screenMap,roughness:.19,metalness:.16,clearcoat:1,clearcoatRoughness:.11,envMapIntensity:1.25});const screen=new T.Mesh(crtGeo,screenMat);screen.position.set(0,1.65,.478);screen.rotation.x=-.24;group.add(screen);
    box(group,0,2.22,.02,1.21,.43,.91,body,.03);const marquee=plane(group,artwork(i,true),0,2.23,.486,1.16,.32,.12);box(group,0,2.02,.51,1.25,.035,.055,metal);box(group,0,2.44,.51,1.25,.035,.055,black);
    const deck=box(group,0,1.09,.64,1.22,.14,.41,black,.028);deck.rotation.x=.09;
    // Printed control overlay, labels, chrome shafts and concave buttons.
    const [overlay,og]=canvas(512,160);og.fillStyle='#213746';og.fillRect(0,0,512,160);og.strokeStyle=['#d7a4b1','#d5b27b','#98b9a0'][i];og.lineWidth=7;for(let n=0;n<3;n++)og.strokeRect(8+n*11,8+n*11,496-n*22,144-n*22);og.fillStyle='#ecd7b1';og.font='18px monospace';og.fillText('MOVE',60,130);og.fillText('ACTION',320,130);const controls=plane(group,texture(overlay),0,1.168,.63,1.17,.35);controls.rotation.x=-Math.PI/2+.09;
    disk(group,-.3,1.19,.59,.11,.018,metal);disk(group,-.3,1.29,.59,.025,.22,metal);const knob=new T.Mesh(new T.SphereGeometry(.09,20,16),new T.MeshPhysicalMaterial({color:'#d5b091',roughness:.24,clearcoat:1}));knob.position.set(-.3,1.42,.59);group.add(knob);
    for(let b=0;b<3;b++){disk(group,.07+b*.16,1.197,.65,.066,.045,metal);disk(group,.07+b*.16,1.22,.65,.051,.025,['#d89198','#d9b77e','#94b9a4'][b]);}
    box(group,0,.59,.64,.36,.39,.065,metal,.015);box(group,-.07,.66,.681,.055,.1,.011,'#0c1820');box(group,.065,.66,.683,.07,.08,.016,'#dc9879');box(group,0,.44,.681,.21,.045,.02,black);for(const x of [-.145,.145])for(const y of [.44,.74]){const screw=disk(group,x,y,.682,.012,.014,metal);screw.rotation.x=Math.PI/2;}
    for(let j=0;j<6;j++)box(group,0,1.92-j*.022,.433,.56,.008,.014,'#0b141c');
    for(const x of [-.48,.48])disk(group,x,.045,-.31,.085,.09,black);
    contact(group,0,0,2.15,2.05,.78,.006);
    cabDetails.push({group,body,screen,screenMat,screenMap,screenC,screenG,offImage:screenG.getImageData(0,0,256,192),marquee,powered:false});
    return {group,body,screen};
  }
  // Background environment used by polished metal and curved CRT glass.
  const envScene=new T.Scene();envScene.background=new T.Color('#5c7077');
  for(const [x,y,z,w,h,d,col]of [[0,7,0,12,.1,12,'#c4c4a8'],[-6,2,0,.1,5,10,'#405365'],[6,2,0,.1,5,10,'#966e55'],[0,3,-6,10,5,.1,'#536971']])box(envScene,x,y,z,w,h,d,new T.MeshBasicMaterial({color:col}));
  const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene,.03);scene.environment=environment.texture;scene.environmentIntensity=.42;pmrem.dispose();
  function sign(words,w=768,h=240){const [c,g]=canvas(w,h);g.fillStyle='#17272f';g.fillRect(0,0,w,h);g.strokeStyle='#bc9b72';g.lineWidth=6;g.strokeRect(12,12,w-24,h-24);g.fillStyle='#efcf9d';g.textAlign='center';g.font=`italic 900 ${words.length>18?40:75}px system-ui`;g.shadowColor='#ed8aa7';g.shadowBlur=10;g.fillText(words,w/2,h*.61);g.shadowBlur=0;noise(g,w,h,4000,.08);return texture(c);}
  const practicals=[];
  const [haloC,hg]=canvas(128);const haloGradient=hg.createRadialGradient(64,64,0,64,64,64);haloGradient.addColorStop(0,'rgba(255,185,140,.28)');haloGradient.addColorStop(.25,'rgba(250,134,140,.1)');haloGradient.addColorStop(1,'rgba(240,120,140,0)');hg.fillStyle=haloGradient;hg.fillRect(0,0,128,128);const haloMap=texture(haloC);
  function halo(x,y,z,w,h){const o=new T.Sprite(new T.SpriteMaterial({map:haloMap,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.5}));o.position.set(x,y,z);o.scale.set(w,h,1);scene.add(o);return o;}
  function decorate(){
    const ground=box(scene,0,-.72,-1,120,.1,120,new T.MeshStandardMaterial({color:'#14222b',roughness:1}));ground.castShadow=false;
    // Architectural details stay against existing boundaries, keeping routes clear.
    for(const z of [-10.57,-5.18]){for(const x of z===-5.18?[-5.65,5.65]:[0]){const w=z===-5.18?6.65:17.5;box(scene,x,.68,z,w,1.22,.07,'#253d43');box(scene,x,1.31,z+.07,w,.075,.07,'#b59b76');for(let k=0;k<w;k+=.8)box(scene,x-w/2+k,.7,z+.05,.025,1.1,.035,'#4b6060');}}
    for(const x of [-8.74,8.74]){box(scene,x,.66,-1,.08,1.2,19.2,'#253d43');box(scene,x,1.3,-1,.1,.065,19.2,'#b59b76');box(scene,x,3.39,-1,.17,.17,19.3,'#23343c');}
    box(scene,0,3.43,-10.7,18,.18,.27,'#23343c');
    // Wall conduit, wiring loops and numbered workshop fixtures.
    tube(scene,[[-8.6,2.9,-10.48],[-3,2.9,-10.48],[4,2.9,-10.48],[8.4,2.9,-10.48]],.035,'#8e8c78');
    for(const x of [-5,0,5]){box(scene,x,2.9,-10.43,.16,.2,.09,'#afa68e');tube(scene,[[x,2.9,-10.4],[x,2.4,-10.4],[x+.1,1.1,-10.4]],.019,'#504e41');}
    // An illuminated exit sign and the first iconic marquee.
    box(scene,0,3.12,-4.96,1.1,.38,.17,'#293c37',.03);plane(scene,sign('EXIT',384,150),0,3.12,-4.858,.99,.29,1.2);
    const neon=plane(scene,sign('AFTER HOURS'),-5.6,2.18,-4.70,4.25,1.17,.85);practicals.push(neon.material);halo(-5.6,2.18,-4.6,5.1,2.3);const neonLight=new T.PointLight('#df8f9e',5,4,2);neonLight.position.set(-5.6,2,-4.3);scene.add(neonLight);
    const [pc,pg]=canvas(384,512);pg.fillStyle='#d7c397';pg.fillRect(0,0,384,512);pg.fillStyle='#9f645f';pg.fillRect(20,20,344,472);pg.fillStyle='#dfc79d';pg.textAlign='center';pg.font='bold 40px Georgia';pg.fillText('ONE MORE',192,75);pg.fillText('GOOD NIGHT',192,123);pg.strokeStyle='#e2c597';pg.lineWidth=10;for(let j=0;j<5;j++){pg.beginPath();pg.arc(192,280,30+j*22,0,7);pg.stroke();}pg.font='21px monospace';pg.fillText('SATURDAY / 8 PM',192,457);noise(pg,384,512,7000,.16);plane(scene,texture(pc),5.5,2.04,-4.7,1.42,1.8);
    // Hanging fixtures make the lighting's source visible.
    for(const z of [-1.8,4.8])tube(scene,[[-8.8,3.45,z],[-8.8,4.15,z],[8.8,4.15,z],[8.8,3.45,z]],.027,'#394b50');
    for(const [x,z]of [[-5,-1.8],[5,-1.8],[0,4.8]]){tube(scene,[[x,4.15,z],[x,3.5,z]],.016,'#343d3d');const shade=new T.Mesh(new T.ConeGeometry(.48,.24,32,1,true),surfaceMat('#63746b','metal'));shade.position.set(x,3.47,z);scene.add(shade);disk(scene,x,3.4,z,.35,.035,new T.MeshBasicMaterial({color:'#ffdeb0'}));const lamp=new T.PointLight('#ffc17b',21,9,2);lamp.position.set(x,3.15,z);scene.add(lamp);halo(x,3.33,z,1.2,.8);}
    // Small luminous wall fixtures and workshop task lighting.
    for(const x of [-7.8,7.8]){box(scene,x,2.6,-10.35,.56,.12,.28,'#44514e');box(scene,x,2.56,-10.19,.42,.05,.05,new T.MeshBasicMaterial({color:'#b9e3d0'}));const light=new T.PointLight('#b0ddcf',9,5,2);light.position.set(x,2.4,-9.8);scene.add(light);}
    // Toolboard with actual peg holes and hanging tools above the existing workbench.
    box(scene,7.5,1.88,-10.43,1.75,1.1,.07,'#a68b66');const holes=new T.InstancedMesh(new T.SphereGeometry(.012,4,4),surfaceMat('#463d32'),96);const transform=new T.Object3D();for(let i=0;i<96;i++){transform.position.set(6.76+i%12*.13,1.45+Math.floor(i/12)*.12,-10.38);transform.updateMatrix();holes.setMatrixAt(i,transform.matrix);}scene.add(holes);
    for(let j=0;j<4;j++){box(scene,7+j*.22,1.9,-10.31,.055,.42,.035,'#36414a');box(scene,7+j*.22,1.64,-10.3,.09,.19,.06,['#a97761','#8fada2','#c4a36d','#bd8b82'][j]);}
    // Detailed boxes: tape, folded flaps and shipping marks on existing shelves.
    for(let i=0;i<3;i++){box(scene,-7.7,.72+i*.8,-9.705,.68,.025,.009,'#d7b97a');box(scene,-7.7,.72+i*.8,-9.715,.08,.38,.016,'#d7b97a');const l=plane(scene,sign('FRAGILE',256,100),-7.7,.78+i*.8,-9.69,.38,.14);}
    // Bench drawers, vise, hardware tray, paint can lids and printed labels.
    for(let j=0;j<3;j++){box(scene,7.57,.68-j*.18,-9.22,1.17,.15,.075,'#607271');box(scene,7.57,.68-j*.18,-9.16,.3,.027,.04,'#b4b19a');}
    box(scene,8.1,1.1,-9.6,.33,.23,.3,'#4d6570');box(scene,8.1,1.25,-9.6,.45,.045,.26,'#929997');
    for(let i=0;i<4;i++){const x=7+i%2*.43,z=-9.8+Math.floor(i/2)*.35;disk(scene,x,1.389,z,.148,.027,'#aab5ab');const l=plane(scene,sign(['TEAL','ROSE','GOLD','INK'][i],256,100),x,1.2,z+.143,.21,.09);}
    // Refinish the existing supply trolley without changing its footprint.
    for(const x of [-7.49,-6.51])box(scene,x,.32,7.56,.06,.55,.03,'#a5a68e');
    for(const y of [.2,.42]){box(scene,-7,y,7.565,.91,.18,.03,'#3c575a');box(scene,-7,y,7.59,.27,.028,.025,'#b7b49b');}
    const coil=[];for(let j=0;j<95;j++){const a=j*.2,r=.12+j*.0018;coil.push([-7+Math.cos(a)*r,.715,7.2+Math.sin(a)*r]);}tube(scene,coil,.012,'#ba855d');
    plane(scene,sign('SERVICE',256,100),-7,.53,7.595,.48,.12);
    // Perimeter decals and dust in light: no obstacles added to playable floor.
    contact(scene,0,-10.4,18,1.4,.7,.014);contact(scene,-8.5,-1,1.1,19,.6,.014);contact(scene,8.5,-1,1.1,19,.6,.014);
  }
  const floatPositions=new Float32Array(150*3);for(let i=0;i<150;i++){floatPositions[i*3]=(random()-.5)*16;floatPositions[i*3+1]=.3+random()*3.7;floatPositions[i*3+2]=-9+random()*16;}
  const floatGeo=new T.BufferGeometry();floatGeo.setAttribute('position',new T.BufferAttribute(floatPositions,3));const motes=new T.Points(floatGeo,new T.PointsMaterial({color:'#f4d3a6',size:.021,transparent:true,opacity:.27,depthWrite:false}));scene.add(motes);
  function refresh(state){cabDetails.forEach((c,i)=>{const on=i===0&&state.repaired;if(c.powered!==on){c.screenMat.needsUpdate=true;if(!on){c.screenG.putImageData(c.offImage,0,0);c.screenMap.needsUpdate=true;}}c.powered=on;c.marquee.material.emissiveIntensity=on?1.6:.12;c.screenMat.emissive.set(on?'#76cdbb':'#000000');c.screenMat.emissiveMap=on?c.screenMap:null;c.screenMat.emissiveIntensity=on?.65:0;});}
  let lastScreen=0;
  function animate(time){motes.rotation.y=Math.sin(time*.00002)*.025;if(time-lastScreen<120)return;lastScreen=time;for(const c of cabDetails){if(!c.powered)continue;const g=c.screenG;g.fillStyle='#071d2a';g.fillRect(0,0,256,192);g.fillStyle='#8ebaaa';for(let i=0;i<28;i++)g.fillRect((i*73)%256,(i*41+time*.008)%192,2,2);g.strokeStyle='#edc99a';g.lineWidth=2;g.beginPath();for(let j=0;j<256;j++){const y=100+Math.sin(j*.055+time*.002)*18;j?g.lineTo(j,y):g.moveTo(j,y);}g.stroke();g.fillStyle='#bce8ce';g.font='bold 20px monospace';g.textAlign='center';g.fillText('STAR SIGNAL',128,48);g.font='11px monospace';g.fillText('INSERT COIN',128,159);g.fillStyle='#00000030';for(let y=0;y<192;y+=3)g.fillRect(0,y,256,1);c.screenMap.needsUpdate=true;}}
  return {surfaceMat,floorMaterial,dirtMap,cabinet,decorate,refresh,animate,contact,box,tube,disk};
}
