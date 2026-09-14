// Pointer-lock ownership is kept separate from walking and tool inputs.
export function createMouseLook({element,doc=document,canLock,onLook,onRelease,onChange,onError}) {
  let wanted=false,free=false,previous=null,edge=0,generation=0;
  const supported=typeof element.requestPointerLock==='function';
  const locked=()=>doc.pointerLockElement===element;
  const active=()=>locked()||free;
  function release(){generation++;wanted=false;previous=null;edge=0;const wasFree=free;free=false;if(locked())doc.exitPointerLock();else if(wasFree){onRelease();onChange(false);}}
  function failed(error){if(!wanted||!canLock()||free)return;free=true;previous=null;onChange(true);onError(error);}
  function request(){
    if(!canLock()||active())return;
    wanted=true;
    const attempt=++generation;
    if(!supported){failed();return;}
    try{const result=element.requestPointerLock();if(result?.catch)result.catch(error=>{if(attempt===generation)failed(error);});}catch(error){failed(error);}
  }
  doc.addEventListener('pointerlockchange',()=>{
    if(locked()&&(!wanted||!canLock())){release();return;}
    if(locked()){free=false;previous=null;edge=0;}
    else if(!free){wanted=false;onRelease();}
    onChange(active());
  });
  doc.addEventListener('pointerlockerror',()=>{if(wanted)failed();});
  doc.addEventListener('mousemove',e=>{
    if(!active()||!canLock())return;
    if(free){
      if(e.target!==element){previous=null;edge=0;return;}
      const rect=element.getBoundingClientRect();
      edge=e.clientX<rect.left+24?-1:e.clientX>rect.right-24?1:0;
      if(previous)onLook(e.clientX-previous.x,e.clientY-previous.y);
      previous={x:e.clientX,y:e.clientY};return;
    }
    if(Number.isFinite(e.movementX)&&Number.isFinite(e.movementY))onLook(e.movementX,e.movementY);
  });
  element.addEventListener?.('mouseleave',()=>{previous=null;edge=0;});
  function update(dt){if(free&&canLock()&&edge)onLook(edge*480*Math.min(dt,.05),0);}
  return {request,release,locked,active,supported,update};
}
