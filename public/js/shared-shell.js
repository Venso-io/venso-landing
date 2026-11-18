'use strict';
/* Header/footer markup comes from the landing page, never copied HTML. */
(async () => {
 try {
  const response=await fetch('/',{credentials:'same-origin'});
  if(!response.ok)throw new Error('Cannot load site shell');
  const source=new DOMParser().parseFromString(await response.text(),'text/html');
  const header=source.querySelector('.site-header'), footer=source.querySelector('.site-footer');
  if(!header||!footer)throw new Error('Missing header/footer');
  const langParam=new URLSearchParams(location.search).get('lang');
  const lang=['ru','kk','en'].includes(langParam)?langParam:
    (['ru','kk','en'].includes(localStorage.getItem('venso_lang'))?localStorage.getItem('venso_lang'):'ru');
  const copy={
   ru: { 'nav.features':'Возможности','nav.how':'Как это работает','nav.demo':'Демо',
     'nav.integrations':'Интеграции','nav.pricing':'Тарифы','nav.login':'Войти',
     'nav.cta':'Зарегистрироваться','footer.product':'Продукт','footer.legal':'Документы',
     'footer.terms':'Пользовательское соглашение','footer.offer':'Публичная оферта',
     'footer.privacy':'Политика конфиденциальности','footer.consent':'Согласие на обработку данных',
     'footer.cookies':'Политика cookie','footer.support':'Связь','footer.city':'Астана, Казахстан',
     'footer.rights':'Все права защищены.' },
   kk: { 'nav.features':'Мүмкіндіктер','nav.how':'Қалай жұмыс істейді','nav.demo':'Демо',
     'nav.integrations':'Интеграциялар','nav.pricing':'Тарифтер','nav.login':'Кіру',
     'nav.cta':'Тіркелу','footer.product':'Өнім','footer.legal':'Құжаттар',
     'footer.terms':'Пайдаланушы келісімі','footer.offer':'Жария оферта',
     'footer.privacy':'Құпиялылық саясаты','footer.consent':'Деректерді өңдеуге келісім',
     'footer.cookies':'Cookie саясаты','footer.support':'Байланыс','footer.city':'Астана, Қазақстан',
     'footer.rights':'Барлық құқықтар қорғалған.' },
   en: { 'nav.features':'Features','nav.how':'How it works','nav.demo':'Demo',
     'nav.integrations':'Integrations','nav.pricing':'Pricing','nav.login':'Log in',
     'nav.cta':'Register','footer.product':'Product','footer.legal':'Legal documents',
     'footer.terms':'Terms of Service','footer.offer':'Public Offer',
     'footer.privacy':'Privacy Policy','footer.consent':'Data Processing Consent',
     'footer.cookies':'Cookie Policy','footer.support':'Contact','footer.city':'Astana, Kazakhstan',
     'footer.rights':'All rights reserved.' }
  };
  for(const element of [header,footer]){
   element.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.href='/'+a.getAttribute('href');
   });
   element.querySelectorAll('[data-i18n]').forEach(el=>{
    const value=copy[lang][el.dataset.i18n];
    if(value)el.textContent=value;
   });
   element.querySelectorAll('[data-account-link]').forEach(a=>{
    // Cabinet: same domain under /app; locally its dev server :4000.
    const base=['localhost','127.0.0.1'].includes(location.hostname)
      ?location.protocol+'//'+location.hostname+':4000':'';
    a.href=base+'/app/'+a.dataset.accountLink;
   });
  }
  document.querySelector('.legal-topbar')?.replaceWith(header);
  document.querySelector('.legal-bottom')?.replaceWith(footer);
  document.documentElement.lang=lang;
  document.querySelectorAll('.site-header [data-lang]').forEach(b=>{
   b.classList.toggle('active',b.dataset.lang===lang);
   b.addEventListener('click',()=>{
    const url=new URL(location.href);
    url.searchParams.set('lang',b.dataset.lang);
    localStorage.setItem('venso_lang',b.dataset.lang);
    location.assign(url.href);
   });
  });
  const menu=document.querySelector('#mobileMenu'),button=document.querySelector('#menuBtn');
  button?.addEventListener('click',()=>{
   const expanded=menu?.classList.toggle('open');
   button.setAttribute('aria-expanded',String(!!expanded));
  });
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
   menu.classList.remove('open');
   button?.setAttribute('aria-expanded','false');
  }));
  document.body.classList.add('shared-site-shell');
 }catch(error){console.warn('Shared shell unavailable, using legal fallback',error);}
})();
