/* ---------------- custom cursor + trail ---------------- */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e=>{
  cursor.style.left = e.clientX+'px';
  cursor.style.top = e.clientY+'px';
  if(Math.random() > .7){
    const t = document.createElement('div');
    t.className='trail';
    t.style.left = e.clientX+'px';
    t.style.top = e.clientY+'px';
    document.body.appendChild(t);
    gsap.to(t,{opacity:0, scale:0, duration:.6, onComplete:()=>t.remove()});
  }
});

/* ---------------- loading screen ---------------- */
const loading = document.getElementById('loading');
const bar = document.getElementById('loadbarfill');
const pct = document.getElementById('loadpct');

for(let i=0;i<24;i++){
  const p = document.createElement('div');
  p.className='particle';
  const s = Math.random()*6+2;
  p.style.width = s+'px'; p.style.height=s+'px';
  p.style.left = Math.random()*100+'vw';
  p.style.top = Math.random()*100+'vh';
  loading.appendChild(p);
  gsap.to(p,{y:'-=40', opacity:0, duration:2+Math.random()*2, repeat:-1, delay:Math.random()*2, ease:'sine.inOut'});
}

let progress = 0;
const loadInterval = setInterval(()=>{
  progress += Math.random()*18+6;
  if(progress>=100){
    progress=100;
    clearInterval(loadInterval);
    bar.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(hideLoading, 300);
  }
  bar.style.width = progress+'%';
  pct.textContent = Math.floor(progress)+'%';
}, 280);

function hideLoading(){
  loading.style.pointerEvents = 'none';
  loading.style.opacity = '0';
  gsap.killTweensOf(loading.querySelectorAll('.particle'));
  setTimeout(()=>{
    loading.classList.add('overlay-hidden');
    loading.setAttribute('aria-hidden', 'true');
    loading.remove();
    startStarsIntro();
  }, 820);
}

/* ---------------- stars intro -> reveal rest ---------------- */
const rest = document.getElementById('restOfPage');

function startStarsIntro(){
  initStarsIntro(()=>{
    rest.style.display = 'block';
    rest.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
    document.body.classList.add('main-ready');
    initAfterReveal();
    window.scrollTo({top:0});
  });
}

/* ---------------- scroll reveal (AOS-lite) ---------------- */
function initScrollReveal(){
  const els = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:.2});
  els.forEach(el=>io.observe(el));
}

/* ---------------- floating memory cards ---------------- */
function buildMemories(){
  const wrap = document.getElementById('memWrap');
  const items = ['Our First Smile 😊','Our First Call ☎️','Our First Fight 😂','Still Together ❤️'];
  items.forEach((text)=>{
    const c = document.createElement('div');
    c.className='mem-card';
    c.textContent = text;
    wrap.appendChild(c);
  });
  const cards = wrap.querySelectorAll('.mem-card');
  let started = false;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !started){
        started = true;
        const tl = gsap.timeline({repeat:-1});
        cards.forEach((c)=>{
          tl.to(c,{opacity:1, y:-10, duration:.8, ease:'power2.out'})
            .to(c,{opacity:0, y:-30, duration:.8, ease:'power2.in'}, '+=1.3');
        });
      }
    });
  }, {threshold:.3});
  io.observe(wrap);
}

/* ---------------- gallery lightbox ---------------- */
function initGallery(){
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  document.querySelectorAll('.polaroid').forEach(p=>{
    if(p.closest('.lightbox')) return;
    p.addEventListener('click', ()=>{
      content.innerHTML = p.innerHTML;
      lightbox.classList.add('show');
    });
  });
  lightbox.addEventListener('click', ()=> lightbox.classList.remove('show'));
}

/* ---------------- counter ---------------- */
function initCounter(){
  const start = new Date('2026-02-06T00:00:00');
  const els = {
    m: document.getElementById('cMonths'),
    d: document.getElementById('cDays'),
    h: document.getElementById('cHours'),
    min: document.getElementById('cMinutes')
  };
  function update(){
    const now = new Date();
    const diffMs = now - start;
    const minutes = Math.floor(diffMs/60000);
    const hours = Math.floor(diffMs/3600000);
    const days = Math.floor(diffMs/86400000);
    let months = (now.getFullYear()-start.getFullYear())*12 + (now.getMonth()-start.getMonth());
    if(now.getDate() < start.getDate()) months--;
    els.m.textContent = Math.max(months,0);
    els.d.textContent = Math.max(days,0);
    els.h.textContent = Math.max(hours,0);
    els.min.textContent = Math.max(minutes,0);
  }
  update();
  setInterval(update, 30000);
}

/* ---------------- promise typing ---------------- */
function initPromise(){
  new Typed('#typedTarget', {
    strings: [
      'No matter what happens...^500 I\'ll always choose you.^400 Again.^400 Again.^400 And Again.'
    ],
    typeSpeed: 45,
    backSpeed: 0,
    showCursor: true,
    cursorChar: '|',
    loop: false
  });
}

/* ---------------- gift box ---------------- */
function initGift(){
  const box = document.getElementById('giftbox-wrap');
  const emoji = document.getElementById('giftEmoji');
  let opened = false;
  box.addEventListener('click', ()=>{
    if(opened) return;
    opened = true;
    emoji.classList.remove('shake');
    gsap.to(emoji,{scale:1.4, rotate:15, duration:.3, yoyo:true, repeat:1, onComplete:()=>{
      emoji.textContent='🎉';
    }});
    for(let i=0;i<5;i++){
      const b = document.createElement('div');
      b.className='balloon';
      b.textContent='🎈';
      b.style.left = (40+Math.random()*20)+'%';
      box.appendChild(b);
      gsap.to(b,{y:-300-Math.random()*200, opacity:1, duration:2.2+Math.random(), ease:'power1.out'});
      gsap.to(b,{opacity:0, delay:2, duration:1});
    }
    confetti({particleCount:150, spread:80, origin:{y:.6}, colors:['#FF4D6D','#FFD166','#ffffff']});
  });
}

/* ---------------- letter ---------------- */
function initLetter(){
  const env = document.getElementById('envelope');
  const paper = document.getElementById('letterPaper');
  env.addEventListener('click', ()=>{
    paper.classList.add('show');
    gsap.from(paper,{y:40, opacity:0, duration:.6, ease:'power2.out'});
    env.style.pointerEvents='none';
    gsap.to(env,{opacity:.3, duration:.4});
  });
}

/* ---------------- sky stars + petals ---------------- */
function initSky(){
  const sky = document.getElementById('sky');
  for(let i=0;i<60;i++){
    const s = document.createElement('div');
    s.className='star';
    const size = Math.random()*2+1;
    s.style.width=size+'px'; s.style.height=size+'px';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*70+'%';
    s.style.animationDelay = Math.random()*3+'s';
    sky.appendChild(s);
  }
  for(let i=0;i<14;i++){
    const p = document.createElement('div');
    p.className='petal';
    p.textContent='🌸';
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = (6+Math.random()*6)+'s';
    p.style.animationDelay = Math.random()*6+'s';
    sky.appendChild(p);
  }
}

/* ---------------- final confetti ---------------- */
function initFinal(){
  const final = document.getElementById('final');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        confetti({particleCount:200, spread:120, origin:{y:.5}, colors:['#FF4D6D','#FFD166','#ffffff']});
        io.disconnect();
      }
    });
  }, {threshold:.5});
  io.observe(final);
}

/* ---------------- theme toggle ---------------- */
function initTheme(){
  const html = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  function applyTheme(theme){
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const isDark = theme === 'dark';
    icon.textContent = isDark ? '☀️' : '🌙';
    label.textContent = isDark ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btn.addEventListener('click', ()=>{
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  applyTheme(html.getAttribute('data-theme') || 'dark');
}

/* ---------------- music (Ed Sheeran - Perfect.mp3) ---------------- */
function initMusic(){
  const btn = document.getElementById('musicBtn');
  const audio = document.getElementById('bgm');
  let playing = false;

  function setBtn(isPlaying){
    btn.innerHTML = isPlaying
      ? '❚❚ &nbsp;Pause Our Song'
      : '▶ &nbsp;Play Our Song';
  }

  audio.addEventListener('ended', ()=>{
    playing = false;
    setBtn(false);
  });

  btn.addEventListener('click', ()=>{
    if(playing){
      audio.pause();
      playing = false;
      setBtn(false);
      return;
    }
    audio.play().then(()=>{
      playing = true;
      setBtn(true);
    }).catch(()=>{
      playing = false;
      setBtn(false);
    });
  });
}

/* ---------------- easter egg ---------------- */
let easterReady = false;

function initEasterEgg(){
  if(easterReady) return;
  easterReady = true;

  const heart = document.getElementById('secretHeart');
  const msg = document.getElementById('easterMsg');
  let count = 0;
  let msgTimer = null;

  heart.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();

    count++;
    gsap.fromTo(heart, { scale: 1.35 }, { scale: 1, duration: 0.25 });

    if(count < 5) return;

    count = 0;
    msg.classList.add('show');

    if(msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(()=>{
      msg.classList.remove('show');
      msgTimer = null;
    }, 2600);
  }, { passive: false });
}

/* ---------------- init all after welcome click ---------------- */
function initAfterReveal(){
  buildMemories();
  initGallery();
  initCounter();
  initPromise();
  initGift();
  initLetter();
  initSky();
  initFinal();
  initScrollReveal();
  initEasterEgg();
}

initTheme();
initMusic();
