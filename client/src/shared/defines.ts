export class TimeConst {
  public static second = 1000
  public static minute = this.second * 60
  public static hour = this.minute * 60
  public static day = this.hour * 24
  public static week = this.day * 7
}

export const AllowedLanguages = {
  en: 'EN',
  ru: 'RU',
} as const

export type AllowedLanguages = (keyof typeof AllowedLanguages)[]
export type AllowedLanguage = AllowedLanguages[number]

export const LS_JWT_KEY = 'jwt-token'