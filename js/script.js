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
      const currentOption = document.querySelector('.course-option.active');
      const currentPanel = document.querySelector('.course-feature-panel.active');
      const nextPanel = document.querySelector(`[data-course-panel="${selected}"]`);

      if(option === currentOption || !nextPanel) return;

      const previousPositions = new Map();
      courseOptions.forEach(item => {
        if(!item.classList.contains('active')){
          previousPositions.set(item, item.getBoundingClientRect());
        }
      });

      currentOption?.classList.remove('active');
      option.classList.add('active');
      currentPanel?.classList.remove('active');
      nextPanel.classList.add('active');

      courseOptions.forEach(item => {
        if(item.classList.contains('active')) return;

        const nextPosition = item.getBoundingClientRect();
        const previousPosition = previousPositions.get(item);

        if(previousPosition){
          const deltaX = previousPosition.left - nextPosition.left;
          const deltaY = previousPosition.top - nextPosition.top;
          item.animate(
            [
              {transform:`translate(${deltaX}px, ${deltaY}px)`},
              {transform:'translate(0, 0)'}
            ],
            {duration:500,easing:'cubic-bezier(.22,1,.36,1)'}
          );
        }else{
          item.animate(
            [
              {opacity:0,transform:'translateY(-46px)'},
              {opacity:1,transform:'translateY(0)'}
            ],
            {duration:500,easing:'cubic-bezier(.22,1,.36,1)'}
          );
        }
      });
    });
  });
}

/* METODOLOGÍA INTERACTIVA */
const processDots = document.querySelectorAll('.process-dot');
const processSteps = document.querySelectorAll('.process-step');

function activateProcessStep(stepId){
  if(!processDots.length || !processSteps.length) return;

  processDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.process === stepId);
  });
  processSteps.forEach(step => {
    step.classList.toggle('active', step.classList.contains(`step-${stepId}`));
  });
}

if(processDots.length && processSteps.length){
  activateProcessStep('01');

  processDots.forEach(dot => {
    dot.addEventListener('click', () => activateProcessStep(dot.dataset.process));
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
