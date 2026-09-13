const assert=require('node:assert/strict');
const M=require('../prototypes/arcade3d/model.js');
let s=M.fresh(),seconds=0;
function walkTo(x,z,work=false){let route=M.path(s,x,z);assert(route.length||Math.hypot(s.player.x-x,s.player.z-z)<.5,'reachable target');let frames=0;while(route.length&&frames++<6000){while(route.length&&Math.hypot(route[0].x-s.player.x,route[0].z-s.player.z)<.19)route.shift();if(!route.length)break;M.step(s,route[0].x-s.player.x,route[0].z-s.player.z,1/60);if(work)M.work(s);seconds+=1/60;if(frames%97===0){s=JSON.parse(JSON.stringify(s));assert(M.valid(s));}}s.player.vx=s.player.vz=0;assert(frames<6000,`route stalled to ${x},${z} at ${s.player.x},${s.player.z}`);}
assert(M.valid(s));assert(M.blocked(s,5,-5));assert(!M.blocked(s,0,-5));
for(let i=0;i<3;i++){walkTo(s.cabinets[i].x,s.cabinets[i].z+1.75);assert.equal(M.nearest(s),i);assert.equal(M.interact(s),'loaded');walkTo(M.bays[i].x,-7.8);assert.equal(M.interact(s),'stored');assert(!M.blocked(s,s.player.x,s.player.z),'parking leaves player free');}
assert.equal(s.stage,1);console.log('PASS three complete cabinet routes through storage doorway');
for(let stage=1;stage<=3;stage++){assert.equal(s.stage,stage);for(let row=0;row<9&&s.stage===stage;row++){const z=M.tile(row*17).z;walkTo(row%2?7.2:-7.2,z,true);walkTo(row%2?-7.2:7.2,z,true);}assert.equal(s.stage,stage+1,`all floor cells reachable at stage ${stage}`);}
assert.equal(s.stage,4);s.stage=5;walkTo(s.cabinets[0].x,s.cabinets[0].z+1.75);assert.equal(M.interact(s),'repair');assert.equal(M.repair(s),false);s.wires=[...M.solution];assert(M.repair(s));assert.equal(M.interact(s),'loaded');walkTo(0,1);assert.equal(M.interact(s),'restored');assert.equal(s.stage,7);assert.equal(M.interact(s),'play');assert(M.valid(JSON.parse(JSON.stringify(s))));console.log(`PASS complete walkable restoration route and return trip (${seconds.toFixed(1)} simulated seconds)`);
const obstacle=M.fresh();obstacle.player.x=5;obstacle.player.z=-3.5;for(let i=0;i<300;i++)M.step(obstacle,0,-1,1/60);assert(obstacle.player.z>-4.5);assert(!M.blocked(obstacle,obstacle.player.x,obstacle.player.z));
const bound=M.fresh();for(let i=0;i<3000;i++)M.step(bound,1,1,1/60);assert(!M.blocked(bound,bound.player.x,bound.player.z));
const speed=M.fresh();M.step(speed,1,0,1/60);assert(speed.player.vx>0&&speed.player.vx<4.2);for(let i=0;i<90;i++)M.step(speed,0,0,1/60);assert(Math.abs(speed.player.vx)<.001);
for(let i=0;i<6;i++){const bad=M.fresh();bad.stage=5;bad.wires=[...M.solution];bad.wires[i]=(bad.wires[i]+1)%4;assert(!M.repair(bad));}
for(const invalid of [null,{}, {...s,stage:99},{...s,held:9},{...s,player:{x:NaN,z:0,yaw:0}},{...s,dust:[]}])assert(!M.valid(invalid));
console.log('PASS wall/boundary collision, acceleration/release, six circuit failures, save validation');
