/* STARS CANVAS */
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
function initStars(){stars=[];for(let i=0;i<160;i++){stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+0.3,o:Math.random()*0.7+0.1,sp:Math.random()*0.3+0.05})}}
function drawStars(){ctx.clearRect(0,0,canvas.width,canvas.height);stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.o})`;ctx.fill();s.y-=s.sp;if(s.y<0){s.y=canvas.height;s.x=Math.random()*canvas.width}})}
resizeCanvas();initStars();
window.addEventListener('resize',()=>{resizeCanvas();initStars()});
setInterval(drawStars,40);

/* TYPED */
const typed=document.getElementById('typedRole');
const phrases=['Python Developer 🐍','ML Engineer 🤖','Full Stack Dev 💻','DSA Problem Solver 🧠','AI Builder 🚀'];
let pi=0,ci=0,del=false;
function typeIt(){
  if(!typed)return;
  const p=phrases[pi];
  typed.textContent=(del?p.slice(0,ci--):p.slice(0,ci++))+'|';
  if(!del&&ci===p.length+1){setTimeout(()=>{del=true;typeIt()},1800);return}
  if(del&&ci===0){del=false;pi=(pi+1)%phrases.length}
  setTimeout(typeIt,del?45:90)
}
typeIt();

/* NAVBAR */
const navbar=document.getElementById('navbar');
const navAs=document.querySelectorAll('.nav-a');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>50);
  document.getElementById('backTop').classList.toggle('show',window.scrollY>400);
  const secs=document.querySelectorAll('section[id]');
  let cur='';
  secs.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id});
  navAs.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
});

/* HAMBURGER */
const hbg=document.getElementById('hamburger');
const nl=document.getElementById('navLinks');
hbg?.addEventListener('click',()=>nl.classList.toggle('open'));
nl?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open')));

/* BACK TO TOP */
document.getElementById('backTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  })
});

/* REVEAL */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target)}})
},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* SKILL BARS */
const skillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sb-fill').forEach(b=>{setTimeout(()=>{b.style.width=b.dataset.w+'%'},150)});
      skillObs.unobserve(e.target)
    }
  })
},{threshold:0.2});
document.querySelectorAll('.skill-group').forEach(g=>skillObs.observe(g));

/* COUNT UP */
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&e.target.dataset.count){
      const target=+e.target.dataset.count,dur=1200,start=performance.now();
      const step=now=>{
        const prog=Math.min((now-start)/dur,1);
        const ease=1-Math.pow(1-prog,3);
        e.target.textContent=Math.round(ease*target);
        if(prog<1)requestAnimationFrame(step)
      };
      requestAnimationFrame(step);
      countObs.unobserve(e.target)
    }
  })
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

/* CONTACT FORM */
document.getElementById('contactForm')?.addEventListener('submit',async function(e){
  e.preventDefault();
  const btn=document.getElementById('submitBtn');
  const alert=document.getElementById('formAlert');
  const orig=btn.innerHTML;
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled=true;
  try{
    const res=await fetch('/api/contact',{method:'POST',body:new FormData(this)});
    const data=await res.json();
    alert.style.display='block';
    if(data.status==='success'){alert.className='form-alert success';alert.textContent='✓ Message sent! I\'ll get back to you soon.';this.reset()}
    else{alert.className='form-alert error';alert.textContent='✗ '+data.message}
  }catch{alert.className='form-alert error';alert.style.display='block';alert.textContent='✗ Something went wrong. Email me directly!'}
  btn.innerHTML=orig;btn.disabled=false;
});

/* ── CHATBOT ── */
function toggleChat(){
  const w=document.getElementById('chatWindow');
  const n=document.querySelector('.chat-notif');
  w.classList.toggle('open');
  if(n)n.style.display='none';
}

async function sendChat(){
  const inp=document.getElementById('chatInput');
  const msgs=document.getElementById('chatMessages');
  const msg=inp.value.trim();
  if(!msg)return;
  inp.value='';

  // user message
  msgs.innerHTML+=`<div class="chat-msg user"><div class="msg-bubble">${msg}</div></div>`;

  // typing indicator
  msgs.innerHTML+=`<div class="chat-msg bot chat-typing" id="typing"><div class="msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
  msgs.scrollTop=msgs.scrollHeight;

  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
    const data=await res.json();
    document.getElementById('typing')?.remove();
    msgs.innerHTML+=`<div class="chat-msg bot"><div class="msg-bubble">${data.reply||data.message}</div></div>`;
  }catch{
    document.getElementById('typing')?.remove();
    msgs.innerHTML+=`<div class="chat-msg bot"><div class="msg-bubble">Sorry, something went wrong! Email tarunji1322@gmail.com directly.</div></div>`;
  }
  msgs.scrollTop=msgs.scrollHeight;
}

/* ── COVER LETTER ── */
function closeCL(){document.getElementById('clModal').style.display='none'}
document.getElementById('clModal')?.addEventListener('click',function(e){if(e.target===this)closeCL()});

async function generateCL(){
  const job=document.getElementById('clJob').value.trim();
  const company=document.getElementById('clCompany').value.trim();
  const desc=document.getElementById('clDesc').value.trim();
  if(!job||!company){alert('Please enter Job Title and Company!');return}

  const btn=document.getElementById('clBtn');
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Generating...';
  btn.disabled=true;

  try{
    const res=await fetch('/api/cover-letter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({job_title:job,company:company,description:desc})});
    const data=await res.json();
    if(data.status==='success'){
      document.getElementById('clOutput').value=data.cover_letter;
      document.getElementById('clResult').style.display='block';
    }else{
      alert(data.message||'Generation failed!');
    }
  }catch{
    alert('Something went wrong. Try again!');
  }
  btn.innerHTML='<i class="fas fa-magic"></i> Generate Cover Letter';
  btn.disabled=false;
}

function copyCL(){
  const out=document.getElementById('clOutput');
  out.select();
  document.execCommand('copy');
  const btn=document.querySelector('.copy-btn');
  btn.innerHTML='<i class="fas fa-check"></i> Copied!';
  setTimeout(()=>{btn.innerHTML='<i class="fas fa-copy"></i> Copy'},2000);
}
