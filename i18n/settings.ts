export const fallbackLng = "en"
export const languages = [fallbackLng, "ru"] as const
export type Locale = (typeof languages)[number]
export const defaultNS = "common"
export const cookieName = "i18next"

export function isLocale(value: string): value is Locale {
  return (languages as readonly string[]).includes(value)
}

export function getOptions(lng: Locale = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
