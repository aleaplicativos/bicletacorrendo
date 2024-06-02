var animData = {
 wrapper: document.querySelector(".bm_container"),
 animType: "svg",
 loop: true,
 prerender: true,
 autoplay: true,
 path: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/304639/codevember9.json"
};

var anim = bodymovin.loadAnimation(animData);
anim.addEventListener("DOMLoaded", startAnimation);
anim.setSpeed(1);
bodymovin.setSubframeRendering(false);

var dial = document.querySelector(".dial"),
    useDial = false,
    dragDial,
    road = document.querySelector(".road"),
    fg = document.querySelector(".fg"),
    fgXDistance = 0,
    fgYDistance = 100,
    mg = document.querySelector(".mg"),
    mgXDistance = 0,
    mgYDistance = 0,
    bg = document.querySelector(".bg"),
    bgXDistance = 0,
    bgYDistance = 0,
    animationWindow = document.querySelector(".bm_container"),
    rotateMin = -45,
    rotateMax = 45,
    maxRunSpeed = 1.5,
    minRunSpeed = 0.2,
    beta, 
    gamma,
    rotX = 0,
    rotY = 0,
    runSpeed,
    dragPercent,
    segment04 = false,
    isChanging = false,
    goingFast = false;

dragDial = Draggable.create(dial, {
 type: "rotation",
 bounds: { minRotation: rotateMin, maxRotation: rotateMax },
 onDrag: onTilt
});

function onTilt() {
 useDial = true;
 rotateAll();
}

function rotateAll() {
 dragPercent = (dial._gsTransform.rotation + rotateMax) / (rotateMax * 2);
 runSpeed = dragPercent * maxRunSpeed + minRunSpeed;
 anim.setSpeed(runSpeed);
 hillRotation();
}

function changeComplete() {
 isChanging = false;
 anim.removeEventListener("loopComplete", changeComplete);
}

function goFast() {
 if (isChanging) {
  return;
 } else if (goingFast) {
  return;
 } else {
  isChanging = true;
  goingFast = true;
  anim.playSegments([[25, 35], [35, 60]], true);
  anim.addEventListener("loopComplete", changeComplete);
 }
}

function goSlow() {
 if (isChanging) {
  return;
 } else if (goingFast) {
  isChanging = true;
  goingFast = false;
  anim.playSegments([[60, 70], [0, 25]], true);
  anim.addEventListener("loopComplete", changeComplete);
 }
}

window.onload = function() {
 window.requestAnimationFrame(loop);
};

function loop() {
 window.requestAnimationFrame(loop);
 let speed = 1;
 if (runSpeed > 1.2) {
  // console.log("FAST SEGMENT");
  speed = 10;
  goFast();
 }

 if (runSpeed < 1.2 && runSpeed > 0.5) {
  // console.log("SLOW SEGMENT");
  speed = 5;
  goSlow();
 }
 
 fgXDistance -= 1 * speed;
 fg.style.backgroundPosition = `${fgXDistance}px ${fgYDistance}px`;
 
 mgXDistance -= 0.5 * speed;
 mg.style.backgroundPosition = `${mgXDistance}px ${mgYDistance}px`;
 
 bgXDistance -= 0.1 * speed;
 bg.style.backgroundPosition = `${bgXDistance}px ${bgYDistance}px`;
}

function hillRotation() {
 let svg = animData.wrapper;
 const degrees = rotateMin + (dragPercent * (rotateMax * 2));
 svg.style.transform = `rotate(${degrees}deg)`;
 
 road.style.transform = `rotate(${degrees}deg)`;
 fg.style.transform = `rotate(${degrees * 0.9}deg)`;
 mg.style.transform = `rotate(${degrees * 0.1}deg)`;
}

function startAnimation() {
 anim.playSegments([[0, 25]], true);
}

if ( window.DeviceMotionEvent ) { 
 window.ondeviceorientation = function(e) {
  gamma = e.gamma;
  setTimeout(function(){
   normalizeRotation(gamma)
  }, 100)
 }  
}

function normalizeRotation(horizontalRotation){
 if(useDial) return;
 g = Math.round(horizontalRotation);

 rotY += (g - rotY) / 10;
 let normalRot = rotY;
 if(normalRot >= rotateMax) normalRot = rotateMax;
 if(normalRot <= rotateMin) normalRot = rotateMin;

 dial._gsTransform.rotation = Math.round(normalRot);
 dial.style.transform = `rotate(${Math.round(normalRot)}deg)`;
 // dragDial[0].update();
 rotateAll();
}