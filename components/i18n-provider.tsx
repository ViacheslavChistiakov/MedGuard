"use client"

import { useState } from "react"
import { createInstance, type Resource } from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"
import { getOptions, type Locale } from "@/i18n/settings"

export function I18nProvider({
  locale,
  resources,
  children,
}: {
  locale: Locale
  resources: Resource
  children: React.ReactNode
}) {
  const [i18n] = useState(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({ ...getOptions(locale), resources })
    return instance
  })

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
