// Pointer-lock ownership is kept separate from walking and tool inputs.
export function createMouseLook({element,doc=document,canLock,onLook,onRelease,onChange,onError}) {
  let wanted=false;
  const supported=typeof element.requestPointerLock==='function';
  const locked=()=>doc.pointerLockElement===element;
  function release(){wanted=false;if(locked())doc.exitPointerLock();}
  function failed(error){wanted=false;onError(error);}
  function request(){
    if(!supported||!canLock()||locked())return;
    wanted=true;
    try{const result=element.requestPointerLock();if(result?.catch)result.catch(failed);}catch{failed();}
  }
  doc.addEventListener('pointerlockchange',()=>{
    if(locked()&&(!wanted||!canLock())){release();return;}
    if(!locked()){wanted=false;onRelease();}
    onChange(locked());
  });
  doc.addEventListener('pointerlockerror',()=>{if(wanted)failed();});
  doc.addEventListener('mousemove',e=>{
    if(!locked()||!canLock())return;
    if(Number.isFinite(e.movementX)&&Number.isFinite(e.movementY))onLook(e.movementX,e.movementY);
  });
  return {request,release,locked,supported};
}
