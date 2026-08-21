import { createInstance, type i18n as I18nInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next/initReactI18next"
import { getOptions, defaultNS, type Locale } from "./settings"

async function initI18next(locale: Locale, i18nInstance: I18nInstance) {
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(locale, defaultNS))
}

// Creates a fresh i18next instance per request/render so translations never
// leak between concurrent requests for different locales.
export default async function initTranslations(locale: Locale) {
  const i18nInstance = createInstance()
  await initI18next(locale, i18nInstance)
  return {
    t: i18nInstance.t,
    resources: i18nInstance.services.resourceStore.data,
  }
}
