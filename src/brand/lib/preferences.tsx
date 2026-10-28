import {useI18n} from '../../lib/i18n';
import {useTheme} from '../../lib/theme';
import {copy} from './content';
export function usePreferences(){const {locale,setLocale}=useI18n();const {theme,toggle}=useTheme();return {language:locale,setLanguage:setLocale,theme,toggleTheme:toggle,t:copy[locale]};}
