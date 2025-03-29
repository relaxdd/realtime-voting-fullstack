/**
 * Склонение слова после числа.
 *
 * @param number       Число после которого будет слово. Можно указать число в HTML тегах.
 * @param titles       Варианты склонения или первое слово для кратного 1.
 * @param show_number  Указываем тут 00, когда не нужно выводить само число.
 *
 * @return string Например: 1 книга, 2 книги, 10 книг.
 * @version 3.1
 */
export function numDecline(number: number, titles: string | string[], show_number = false): string {
  if (typeof titles === 'string') titles = titles.split(/, */);
  if (typeof titles[2] === 'undefined') titles[2] = titles[1];
  
  const cases = [2, 0, 1, 1, 1, 2];
  const intnum = Math.abs(parseInt(`${number}`.replace(/<\/?[^>]+>/gi, '')));
  const title_index = (intnum % 100 > 4 && intnum % 100 < 20) ? 2 : cases[Math.min(intnum % 10, 5)];
  
  return (show_number ? `${number} ` : '') + titles[title_index];
}

export const numDeclineVotes = (votes: number) => numDecline(votes, ['голос', 'голоса', 'голосов'], true);
export const numDeclinePeople = (people: number) => numDecline(people, ['человек', 'человека', 'человек'], true)

export function getPercent(votes: number, total: number): number {
  return votes ? +(votes / (total / 100)).toFixed(2) : 0;
}