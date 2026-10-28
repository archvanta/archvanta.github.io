import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";
import { useMotionMode } from "../lib/motion";
import OldMastersPreloader from "./ui/old-masters-preloader";
const KEY = "archvanta:entrance-seen:v1";
export function SiteEntrance({ enabled }: { enabled: boolean }) {
  const { locale } = useI18n();
  const mode = useMotionMode();
  const [seen, setSeen] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return true;
    }
  });
  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* The entrance still closes if browser storage is unavailable. */
    }
    setSeen(true);
  }, []);
  useEffect(() => {
    if (mode !== "full" && !seen) finish();
  }, [mode, seen, finish]);
  if (!enabled || seen || mode !== "full") return null;
  return (
    <OldMastersPreloader
      onComplete={finish}
      loadingLabel={locale === "fa" ? "آماده‌سازی صحنه" : "Preparing the scene"}
      skipLabel={locale === "fa" ? "رد کردن معرفی" : "Skip introduction"}
      tagline={
        locale === "fa"
          ? "طراحی فضا. مهندسی آینده."
          : "Designing Space. Engineering the Future."
      }
    />
  );
}
