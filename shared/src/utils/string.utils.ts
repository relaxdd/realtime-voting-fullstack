export function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
}

export function snakeToCamelCase(str: string) {
  return str.replace(/_(.)/g, (_, c) => c.toUpperCase());
}

export function styleToCamelCase(str: string) {
  return str.replace(/-(.)/g, (_, c) => c.toUpperCase());
}

export function toCapitalize(str: string) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function translit(word: string) {
  const converter: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
  };
  
  word = word.toLowerCase();
  let answer = '';
  
  for (let i = 0; i < word.length; ++i) {
    if (converter[word[i]!] === undefined) {
      answer += word[i];
    } else {
      answer += converter[word[i]!];
    }
  }
  
  answer = answer.replace(/[^-0-9a-z]/g, '_');
  answer = answer.replace(/-+/g, '_');
  answer = answer.replace(/^-|-$/g, '');
  
  return answer;
}

export function localeCompare(n1: string, n2: string, locales?: string[], numeric = true) {
  locales = locales ?? ['ru', 'en'];
  return n1.localeCompare(n2, locales, { numeric });
}