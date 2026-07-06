// TRASTES — interacciones livianas para una web estática.

/* HEADER + MENÚ */
const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive:true });

menuBtn?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

/* REVEAL ANIMATION */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.16});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* CONTADORES */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;

    const el = entry.target;
    const end = Number(el.dataset.count || 0);
    const duration = 1500;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(end * progress) + '+';
      if(progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.5});

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* CURSOS INTERACTIVOS */
const courseOptions = document.querySelectorAll('.course-option');
const coursePanels = document.querySelectorAll('.course-feature-panel');

if(courseOptions.length && coursePanels.length){
  courseOptions.forEach(option => {
    option.addEventListener('click', () => {
      const selected = option.dataset.course;

      courseOptions.forEach(item => {
        item.classList.toggle('active', item.dataset.course === selected);
      });

      coursePanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.coursePanel === selected);
      });
    });
  });
}

/* METODOLOGÍA INTERACTIVA */
const processDots = document.querySelectorAll('.process-dot');
const processSteps = document.querySelectorAll('.process-step');

function activateProcessStep(index){
  if(!processDots.length || !processSteps.length) return;

  processDots.forEach(dot => dot.classList.remove('active'));
  processSteps.forEach(step => step.classList.remove('active'));

  processDots[index]?.classList.add('active');
  processSteps[index]?.classList.add('active');
}

if(processDots.length && processSteps.length){
  activateProcessStep(0);

  processDots.forEach((dot, index) => {
    dot.addEventListener('click', () => activateProcessStep(index));
  });
}

/* TESTIMONIOS - CARRUSEL AUTOMÁTICO + PUNTOS */
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let testimonialIndex = 0;
let testimonialTimer;

function showTestimonial(index){
  if(!testimonialSlides.length || !testimonialDots.length) return;

  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  testimonialDots.forEach(dot => dot.classList.remove('active'));

  testimonialSlides[index]?.classList.add('active');
  testimonialDots[index]?.classList.add('active');
  testimonialIndex = index;
}

function startTestimonialCarousel(){
  if(!testimonialSlides.length || !testimonialDots.length) return;

  testimonialTimer = setInterval(() => {
    const nextIndex = (testimonialIndex + 1) % testimonialSlides.length;
    showTestimonial(nextIndex);
  }, 11000);
}

if(testimonialSlides.length && testimonialDots.length){
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialTimer);
      showTestimonial(index);
      startTestimonialCarousel();
    });
  });

  showTestimonial(0);
  startTestimonialCarousel();
}
