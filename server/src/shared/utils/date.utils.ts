function getPrettyDateTime(dateObj: Date): string {
  const date = dateObj.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const time = dateObj.toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });
  
  return `${date} в ${time}`;
}

export function getDateTime(dateString: Date | string | null = null) {
  const dateObj = (() => {
    if (!dateString) return new Date();
    else if (typeof dateString === 'string') return new Date(dateString);
    else return dateString;
  })();
  
  const iso = dateObj.toISOString();
  const [date, time] = iso.split('T') as [string, string];
  
  return {
    iso,
    date,
    time: time.slice(0, 8),
    gmt: dateObj.toUTCString(),
    pretty: getPrettyDateTime(dateObj),
  };
}