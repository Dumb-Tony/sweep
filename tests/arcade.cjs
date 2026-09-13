const assert=require('node:assert/strict');
const A=require('../prototypes/arcade/game.js');
let s=A.fresh();assert(A.valid(s));
assert.equal(A.brush(s,300,300),0);assert.equal(A.move(s,0,400,350),false);
for(let i=0;i<3;i++)assert(A.move(s,i,650,155));assert.equal(s.stage,1);
for(let stage=1;stage<=3;stage++){
 assert.equal(s.stage,stage);
 for(let y=260;y<=620;y+=30)for(let x=90;x<=770;x+=30){if(s.stage===stage)A.brush(s,x,y);}
 assert.equal(s.stage,stage+1,`complete coverage advances stage ${stage}`);
}
assert(s.dust.every(v=>v===0));assert(s.grime.every(v=>v===0));assert(s.floor.every(v=>v===1));
assert.equal(A.repair(s),false);s.stage=5;assert.equal(A.repair(s),false);
s.wires=[...A.solution];assert.equal(A.repair(s),true);assert.equal(s.stage,6);
assert.equal(A.move(s,1,350,400),false);assert.equal(A.move(s,0,800,200),false);
assert.equal(A.move(s,0,440,390),true);assert.equal(s.stage,7);assert.equal(s.returned,true);
assert(A.valid(JSON.parse(JSON.stringify(s))));
for(let i=0;i<6;i++){const broken={...s,wires:[...A.solution]};broken.wires[i]=(broken.wires[i]+1)%4;assert.equal(A.connected(broken),false);}
for(const bad of [null,{}, {...s,stage:99},{...s,dust:[]},{...s,palette:99},{...s,wires:[0]},{...s,cabinets:[{x:NaN}]}])assert.equal(!!A.valid(bad),false);
console.log('PASS: complete restoration route, stage gates, six circuit faults, save roundtrip, malformed saves');
