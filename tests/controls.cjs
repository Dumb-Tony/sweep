// Event-level regressions for controls changing during a run. Uses the real
// presentation handlers with DOM stubs, separately from agent browser play.
const {boot}=require('./lifecycle.cjs');
const assert=require('node:assert/strict');
function test(name,fn){fn();console.log('PASS',name);}
const point=(x,y,buttons=0)=>({clientX:x,clientY:y,buttons,isPrimary:true,pointerType:'mouse'});
test('Short strokes finish turning the head after the cursor stops',()=>{
  const b=boot();b.el('start').onclick();b.el('floor').events.pointermove(point(185,560));b.advance(1);
  assert(Math.abs(Math.cos(b.state().s.broom.a))<.05,'head must finish aligning instead of freezing halfway through a turn');
});
test('Scrolling cannot silently change sweep angle',()=>{
  const b=boot();b.el('start').onclick();
  for(let n=0;n<30;n++)b.el('floor').events.wheel({deltaY:1,preventDefault(){}});
  assert.equal(b.state().s.broom.offset,0,'ordinary scrolling must not alter future steering');
});
test('Angle reset restores automatic alignment without resetting progress',()=>{
  const b=boot();b.el('start').onclick();b.key('q');b.advance(.6);b.up('q');
  assert(Math.abs(b.state().s.broom.offset)>.1);const elapsed=b.state().s.time;
  b.key('f');b.up('f');assert.equal(b.state().s.broom.offset,0);assert.equal(b.state().s.time,elapsed);
  b.el('floor').events.pointermove(point(850,560));b.advance(2);
  assert(Math.abs(Math.cos(b.state().s.broom.a))<.05,'head should be perpendicular to horizontal movement');
});
test('Pointer loss cannot leave pressure stuck',()=>{
  const b=boot();b.el('start').onclick();b.el('floor').events.pointerdown({...point(300,300,1),button:0,pointerId:1});
  assert(b.state().input.pressure);b.el('floor').events.pointermove(point(400,300,0));assert(!b.state().input.pressure);
  b.el('floor').events.pointerdown({...point(400,300,1),button:0,pointerId:1});
  b.el('floor').events.lostpointercapture();assert(!b.state().input.pressure);
});
test('Keyboard sampling never overwrites the pointer target',()=>{
  const b=boot();b.el('start').onclick();b.el('floor').events.pointermove(point(800,300));
  const target={...b.state().pointer};b.key('a');b.advance(.2);
  assert.deepEqual({...b.state().pointer},target);
  b.up('a');const x=b.state().s.broom.x;b.advance(.5);assert.equal(b.state().s.broom.x,x,'no stale pointer chase after releasing keyboard');
  b.el('floor').events.pointermove(point(850,300));b.advance(.5);assert(b.state().s.broom.x>x);
});
test('Mouse takes over after keyboard even if a key release was missed',()=>{
  const b=boot();b.el('start').onclick();b.el('floor').events.pointermove(point(700,300));b.advance(.5);
  b.key('a');b.key('q');b.key(' ');b.key('Shift');b.advance(.4);
  const x=b.state().s.broom.x;b.el('floor').events.pointermove(point(850,300));b.advance(.4);
  assert(b.state().s.broom.x>x,'stale keyboard motion must not override returning mouse');
  assert.equal(b.state().held.size,0);assert.equal(b.state().s.broom.offset,0);
  assert(!b.state().input.lift&&!b.state().input.pressure,'mouse handoff releases keyboard lift and pressure');
});
test('Ten minutes of alternating input, pressure/lift, rotation, focus and resets',()=>{
  const b=boot();b.el('start').onclick();
  // Keep the real controls/step/render loop; remove debris only for this input soak.
  b.state().s.pieces=b.state().s.pieces.filter(p=>p.type==='keys');
  for(let n=0;n<150;n++){
    b.el('floor').events.pointermove(point(n%2?900:60,300));b.advance(1);
    b.key('Shift');b.key(' ');b.advance(.3);b.up(' ');b.up('Shift');
    b.key(n%2?'a':'d');b.advance(.7);b.up(n%2?'a':'d');
    b.key('q');b.advance(.2);b.up('q');b.key('f');b.up('f');
    b.el('floor').events.wheel({deltaY:120,preventDefault(){}});
    b.el('floor').events.pointerleave();b.advance(.3);
    b.el('floor').events.pointermove(point(480,300));b.advance(1.5);
    const state=b.state();assert.equal(state.s.broom.offset,0);assert.equal(state.held.size,0);
    assert(!state.input.pressure&&!state.input.lift);assert(Number.isFinite(state.s.broom.a));
    if(n%25===24){b.events.blur();assert.equal(b.state().mode,'pause');b.el('resume').onclick();}
  }
  assert(Math.abs(b.state().s.time-600)<.1);console.log('SOAK',b.state().s.time.toFixed(3),'simulated seconds');
});
