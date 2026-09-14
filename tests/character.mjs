import assert from 'node:assert/strict';
import * as T from '../prototypes/arcade3d/vendor/three.module.min.js';
import {createCharacter} from '../prototypes/arcade3d/character.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
const art={surfaceMat:color=>new T.MeshStandardMaterial({color}),box(parent,x,y,z,w,h,d,material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;},tube(){},contact(){}};
const model=createCharacter(art);
assert(model.root.getObjectByName('continuous-jacket-shell'),'character has one tapered jacket silhouette');
assert(model.root.getObjectByName('continuous-head'),'character has one continuous head volume');
const positions=[];
for(const state of [{speed:0},{speed:4.2},{speed:2.8,hauling:true},{speed:0,tool:true,working:true},{speed:0,tool:true,working:true,shortTool:true},{speed:0,tool:true,wall:true,working:true,side:-1},{speed:0,tool:true,wall:true,working:true,side:1}]){
  for(let i=0;i<180;i++){
    model.animate({dt:1/60,speed:0,phase:i*.09,time:i*16.67,working:false,hauling:false,tool:false,wall:false,side:1,...state});
    model.root.updateMatrixWorld(true);
    model.root.traverse(o=>{assert(o.matrixWorld.elements.every(Number.isFinite),'finite joint transforms');assert(o.scale.x>0&&o.scale.y>0&&o.scale.z>0,'no inverted joints');});
  }
  const pose=[];model.root.traverse(o=>pose.push(...o.quaternion.toArray()));positions.push(pose);
}
assert.notDeepEqual(positions[0],positions[1],'walking changes the pose');
assert.notDeepEqual(positions[1],positions[2],'hauling has its own arm pose');
assert.notDeepEqual(positions[3],positions[4],'wall reach differs from floor tools');
assert.notDeepEqual(positions[5],positions[6],'both wall-side reaches animate');
console.log('PASS articulated character: idle, walking, hauling, floor work and both wall reaches');
