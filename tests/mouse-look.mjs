import assert from 'node:assert/strict';
import {createMouseLook} from '../prototypes/arcade3d/mouse-look.js';
class DocumentMock extends EventTarget {pointerLockElement=null;exitPointerLock(){this.pointerLockElement=null;this.dispatchEvent(new Event('pointerlockchange'));}}
const doc=new DocumentMock();let allowed=true,released=0,errors=0,moves=[],states=[];
const element={requestPointerLock(){doc.pointerLockElement=element;doc.dispatchEvent(new Event('pointerlockchange'));return Promise.resolve();}};
const look=createMouseLook({element,doc,canLock:()=>allowed,onLook:(x,y)=>moves.push([x,y]),onRelease:()=>released++,onChange:x=>states.push(x),onError:()=>errors++});
function move(x,y){doc.dispatchEvent(Object.assign(new Event('mousemove'),{movementX:x,movementY:y}));}
move(20,10);assert.equal(moves.length,0);
look.request();assert(look.locked());move(20,-10);assert.deepEqual(moves,[[20,-10]]);
// Browser Escape clears ownership without an application release call.
doc.exitPointerLock();assert.equal(released,1);move(100,100);assert.equal(moves.length,1);
look.request();allowed=false;move(100,100);assert.equal(moves.length,1);look.release();assert(!look.locked());
look.request();assert(!look.locked(),'menus cannot acquire');allowed=true;
element.requestPointerLock=()=>Promise.reject(new Error('browser cooldown'));
look.request();await Promise.resolve();await Promise.resolve();assert.equal(errors,1);
assert(look.active(),'rejected native lock enables free look');
element.getBoundingClientRect=()=>({left:0,right:1000});
const freeMove=(x,y)=>{const e=Object.assign(new Event('mousemove'),{clientX:x,clientY:y});Object.defineProperty(e,'target',{value:element});doc.dispatchEvent(e);};
freeMove(400,300);const before=moves.length;freeMove(420,310);
assert.deepEqual(moves.at(-1),[20,10]);assert.equal(moves.length,before+1,'no button needed');
freeMove(990,310);look.update(.02);assert.deepEqual(moves.at(-1),[9.6,0]);
look.release();assert(!look.active());const stopped=moves.length;freeMove(500,300);look.update(.02);assert.equal(moves.length,stopped);
// A pending acquisition must not recapture after a menu has opened.
element.requestPointerLock=()=>undefined;look.request();look.release();doc.pointerLockElement=element;doc.dispatchEvent(new Event('pointerlockchange'));assert(!look.locked());
assert(states.includes(true)&&states.includes(false));
console.log('PASS mouse lock, relative motion, Escape, menu release, denied request and late acquisition');
