try {
  const theme = localStorage.getItem("archvanta:theme");
  const lang = localStorage.getItem("archvanta:language");
  if (theme === "light") document.documentElement.dataset.theme = theme;
  if (lang === "fa") {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  }
} catch {
  /* Storage is optional. */
}
