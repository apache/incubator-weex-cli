import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { en } from './langs/en'
import { cn } from './langs/cn'

Vue.use(VueI18n)

export default new VueI18n({
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en, cn
  }
})
