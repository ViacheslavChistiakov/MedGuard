declare module "accept-language" {
  interface AcceptLanguage {
    languages(definedLanguages: string[]): void
    get(languagePriorityList: string | null | undefined): string | null
  }

  const acceptLanguage: AcceptLanguage
  export default acceptLanguage
}
