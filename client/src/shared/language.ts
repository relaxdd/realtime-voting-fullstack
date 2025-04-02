// TODO: Вынести потом на сервер
import { AllowedLanguage } from '@/shared/defines.ts';

const language = {
  search: { ru: 'Поиск', en: 'Search' },
  title: { ru: 'Название', en: 'Title' },
  finish: { ru: 'Дата окончания', en: 'End date' },
  choice: { ru: 'Вариант', en: 'Choice' },
  sidebar: { ru: 'Сайдбар', en: 'Sidebar' },
  addYet: { ru: 'Добавить', en: 'Add yet' },
  sendData: { ru: 'Отправить', en: 'Send data' },
  description: { ru: 'Описание', en: 'Description' },
  published: { ru: 'Опубликовано', en: 'Published' },
  newVoting: { ru: 'Новое голосование', en: 'New voting' },
  allVoting: { ru: 'Все голосования', en: 'All ongoing voting' },
  createNewVoting: { ru: 'Создать новое голосование', en: 'Create a new voting' },
} as const satisfies Record<string, Record<AllowedLanguage, string>>;

export default language;