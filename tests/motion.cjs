// Mechanical feel checks; browser interaction and human feel are separate evidence.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../prototypes/m1/index.html','utf8');
const context={module:{exports:{}}};vm.runInNewContext(html.match(/<script id="simulation">([\s\S]*?)<\/script>/)[1],context);
const C=context.module.exports;
function floor(){const s=C.create();s.pieces=[];s.total=1;return s;}
function move(s,x,y,n=1){for(let i=0;i<n;i++)C.step(s,{x,y,smoothing:.03,sensitivity:1});}
const reports=[];function test(name,fn){const result=fn();reports.push({name,...result});console.log('PASS',name,result||'');}
test('Starts and reversals ramp rather than flip full velocity',()=>{
  const s=floor();move(s,850,560);assert(s.broom.vx>0&&s.broom.vx<=100.001);
  move(s,850,560,30);assert(Math.abs(s.broom.vx-650)<.01);
  let maxChange=0;for(let i=0;i<15;i++){const vx=s.broom.vx,vy=s.broom.vy;move(s,60,560);maxChange=Math.max(maxChange,Math.hypot(s.broom.vx-vx,s.broom.vy-vy));}
  assert(maxChange<=100.001);assert(s.broom.vx<0);return{maxVelocityChangePerStep:maxChange};
});
test('Cursor arrival settles without overshoot or lingering motion',()=>{
  const s=floor();let previous=s.broom.x;for(let i=0;i<240;i++){move(s,700,560);assert(s.broom.x>=previous-1e-8&&s.broom.x<=700+1e-8);previous=s.broom.x;}
  assert(Math.abs(s.broom.x-700)<.001);assert.equal(s.broom.vx,0);
});
test('Subpixel pointer tremor does not swing the broom head',()=>{
  const s=floor();move(s,700,560,240);const initial=s.broom.a;let maxAngleChange=0;
  for(let i=0;i<600;i++){move(s,700+(i%2?.3:-.3),560+(i%4<2?.3:-.3));maxAngleChange=Math.max(maxAngleChange,Math.abs(s.broom.a-initial));}
  assert(maxAngleChange<.01);return{maxAngleChangeRadians:maxAngleChange};
});
test('Turn eases into its final angle and still resolves a short stroke',()=>{
  const s=floor();move(s,185,560);assert(Math.abs(s.broom.av)<=70*C.DT+.001);
  move(s,185,560,119);assert(Math.abs(Math.cos(s.broom.a))<.02);assert(Math.abs(s.broom.av)<.02);
});
fs.writeFileSync(__dirname+'/../artifacts/motion-results.json',JSON.stringify(reports,null,2));
