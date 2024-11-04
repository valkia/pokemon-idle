// src/i18n.js
import { createI18n } from 'vue-i18n'

// 定义语言包
const messages = {
  en: {
    welcome: 'Welcome to Your Vue.js App',
    description: 'This is a description in English.',
  },
  zh: {
    welcome: '欢迎使用您的 Vue.js 应用程序',
    description: '这是一段中文描述。',
  },
}

// 创建 I18n 实例
const i18n = createI18n({
  locale: 'zh', // 设置默认语言
  fallbackLocale: 'zh', // 设置回退语言
  messages,
})

export default i18n
