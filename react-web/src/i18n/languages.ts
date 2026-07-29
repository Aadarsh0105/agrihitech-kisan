export const LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    shortName: "EN",
    flag: "🇬🇧",
  },

  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    shortName: "हिं",
    flag: "🇮🇳",
  },

  // Future

  // {
  //   code:"mr",
  //   name:"Marathi",
  //   nativeName:"मराठी",
  //   shortName:"मर",
  //   flag:"🇮🇳",
  // }

] as const;

export type Locale =
(typeof LANGUAGES)[number]["code"];