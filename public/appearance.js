try {
 if(!localStorage.getItem('archvanta:unified-preferences:v1')) {
  const theme=localStorage.getItem('signal-ai:theme')||localStorage.getItem('archvanta:theme');
  const locale=localStorage.getItem('signal-ai:locale')||localStorage.getItem('archvanta:language');
  if(theme==='dark'||theme==='light')localStorage.setItem('signal-ai:theme',theme);
  if(locale==='en'||locale==='fa')localStorage.setItem('signal-ai:locale',locale);
  localStorage.setItem('archvanta:unified-preferences:v1','1');
 }
 const theme=localStorage.getItem('signal-ai:theme');const locale=localStorage.getItem('signal-ai:locale');
 document.documentElement.dataset.theme=theme==='light'?'light':'dark';
 document.documentElement.lang=locale==='fa'?'fa':'en';document.documentElement.dir=locale==='fa'?'rtl':'ltr';
}catch{/* Storage is optional; the application has in-memory preferences. */}
