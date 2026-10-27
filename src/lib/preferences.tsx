import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { copy, type Language } from "./content";
type Theme = "dark" | "light";
interface Preferences {
  language: Language;
  theme: Theme;
  setLanguage: (value: Language) => void;
  toggleTheme: () => void;
  t: typeof copy.en;
}
const Context = createContext<Preferences | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    document.documentElement.lang === "fa" ? "fa" : "en",
  );
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    try {
      localStorage.setItem("archvanta:language", language);
    } catch {
      /* Optional storage. */
    }
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080b10" : "#f4f3ef");
    try {
      localStorage.setItem("archvanta:theme", theme);
    } catch {
      /* Optional storage. */
    }
  }, [theme]);
  return (
    <Context.Provider
      value={{
        language,
        theme,
        setLanguage,
        toggleTheme: () => setTheme((v) => (v === "dark" ? "light" : "dark")),
        t: copy[language],
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw Error("Preferences provider missing");
  return context;
}
