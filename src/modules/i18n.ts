import { createI18n } from 'vue-i18n'
import type { UserModule } from '~/types'
import { nextTick } from 'vue'

// Import language files synchronously
import en from '../locales/en.yml'
import zhCN from '../locales/zh-CN.yml'

const messages = {
    en,
    'zh-CN': zhCN
  }

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || navigator.language?.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false
})

export const install: UserModule = ({ app }) => {
  app.use(i18n)
}

export function setI18nLanguage(locale: string) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    (i18n.global.locale as any).value = locale
  }
  localStorage.setItem('locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
  return locale
}

export async function loadLocaleMessages(locale: string) {
  const messages = i18n.global.getLocaleMessage(locale)
  if (Object.keys(messages).length === 0) {
    try {
      const messages = await import(`../locales/${locale}.yml`)
      i18n.global.setLocaleMessage(locale, messages.default)
      await nextTick()
    } catch (e) {
      console.error(`Could not load locale messages for ${locale}`, e)
      return Promise.reject(e)
    }
  }
  return locale
}