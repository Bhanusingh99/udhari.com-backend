export function getRelativeTime(dateString) {
    const currentDate = new Date();
    const date = new Date(dateString);
    const elapsedMilliseconds = currentDate - date;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
    if (elapsedSeconds < 60) {
      return rtf.format(-elapsedSeconds, 'second');
    } else if (elapsedSeconds < 3600) {
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      return rtf.format(-elapsedMinutes, 'minute');
    } else if (elapsedSeconds < 86400) {
      const elapsedHours = Math.floor(elapsedSeconds / 3600);
      return rtf.format(-elapsedHours, 'hour');
    } else if (elapsedSeconds < 604800) {
      const elapsedDays = Math.floor(elapsedSeconds / 86400);
      return rtf.format(-elapsedDays, 'day');
    } else {
      const elapsedWeeks = Math.floor(elapsedSeconds / 604800);
      return rtf.format(-elapsedWeeks, 'week');
    }
  }