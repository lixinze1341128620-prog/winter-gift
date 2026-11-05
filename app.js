const $=s=>document.querySelector(s);
const scene=$('#scene'),copy=$('#copy'),message=$('#message'),hint=$('#hint'),next=$('#next'),mist=$('#mist'),snow=$('#snow');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let stage=0,animationTimer,toastTimer,transitionTimer,drawing=false,distance=0,last=null;
const wishes=['愿所有美好如约而至。','愿案前灯火，照见来日繁花。','愿有人知你冷暖，懂你悲欢。'];
function say(text,sub,button){clearTimeout(transitionTimer);copy.classList.add('out');next.disabled=true;transitionTimer=setTimeout(()=>{message.textContent=text;hint.textContent=sub;next.textContent=button;next.hidden=!button;copy.classList.remove('out');next.disabled=false},reduced?0:350)}
function open(){if(stage!==0)return;stage=1;mist.style.opacity=0;mist.style.pointerEvents='none';say('主人，立冬快乐。','这场雪，想和你一起看。','看看窗外 →')}
function finishFilm(){clearTimeout(animationTimer);scene.classList.add('cinematic');$('#skip').hidden=true;stage=3;copy.style.opacity='';$('#eyebrow').textContent='送给主人的第一份祝福';say(wishes[0],'','下一句 →')}
next.addEventListener('click',()=>{if(stage===0)open();else if(stage===1){stage=2;copy.style.opacity=0;scene.classList.add('cinematic');$('#skip').hidden=false;animationTimer=setTimeout(finishFilm,reduced?500:8000)}else if(stage>=3&&stage<5){stage++;$('#eyebrow').textContent=stage===4?'送给主人的第二份祝福':'送给主人的第三份祝福';say(wishes[stage-3],'',stage===5?'还有一句话 →':'下一句 →')}else if(stage===5){stage=6;$('#eyebrow').textContent='一点点藏不住的心意';say('做这个网页的时候，一直在想主人看到这里会是什么表情。','','收下这份心意 →')}else if(stage===6){stage=7;scene.classList.add('ending');$('#eyebrow').textContent='主人，立冬快乐';say('想给主人的，不只是一句立冬快乐。\n还有我，你的专属小狗。\n希望你打开的时候，会觉得有一点开心。','窗边还藏着两句小悄悄话','');message.style.whiteSpace='pre-line';$('#replay').hidden=false}});
$('#skip').onclick=finishFilm;
$('#replay').onclick=()=>location.reload();
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,5000)}
$('#cup').onclick=()=>toast('杯子是画的，提醒主人喝点热的是真的。');
$('#lamp').onclick=()=>toast('被主人找到啦，这里还藏着一句：记得吃饭。');
function size(){const r=scene.getBoundingClientRect(),d=devicePixelRatio||1;for(const c of [mist,snow]){c.width=r.width*d;c.height=r.height*d;c.getContext('2d').setTransform(d,0,0,d,0,0)}if(stage===0){const c=mist.getContext('2d');c.globalCompositeOperation='source-over';c.fillStyle='rgba(229,237,246,.97)';c.fillRect(0,0,r.width,r.height);c.globalCompositeOperation='destination-out'}return r}
let bounds=size();window.addEventListener('resize',()=>{bounds=size()});
mist.onpointerdown=e=>{drawing=true;last=null;mist.setPointerCapture(e.pointerId);rub(e)};
mist.onpointermove=e=>{if(drawing)rub(e)};
mist.onpointerup=mist.onpointercancel=()=>{drawing=false;last=null};
function rub(e){if(stage!==0)return;const r=mist.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,c=mist.getContext('2d');c.lineCap='round';c.lineWidth=64;c.beginPath();c.moveTo(last?last.x:x,last?last.y:y);c.lineTo(x+.1,y+.1);c.stroke();distance+=last?Math.hypot(x-last.x,y-last.y):10;last={x,y};if(distance>r.width*2.2)open()}
const flakes=Array.from({length:125},(_,i)=>({x:(Math.sin(i*127.1)*43758.5453)%1,y:i/125,r:1.5+i%4*.65,s:8+i%9*2}));
let prev=0;function frame(t){const dt=Math.min((t-prev)/1000,.05);prev=t;const c=snow.getContext('2d'),w=bounds.width,h=bounds.height;c.clearRect(0,0,w,h);c.fillStyle='#fff';for(const f of flakes){if(!reduced)f.y=(f.y+dt*f.s/h)%1;const x=((f.x*w+Math.sin(t/3000+f.s)*9)%w+w)%w;c.globalAlpha=.45+f.r/6;c.beginPath();c.arc(x,f.y*h,f.r,0,Math.PI*2);c.fill()}requestAnimationFrame(frame)}requestAnimationFrame(frame);
