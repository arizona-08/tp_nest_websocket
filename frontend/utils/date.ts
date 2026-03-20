export function formatDate(dateString: string): string {
  const date: Date = new Date(dateString);
  const formattedDate: string = new Intl.DateTimeFormat('fr-FR').format(date);
  return formattedDate;
}

export function formatTime(dateString: string): string {
  const date: Date = new Date(dateString);
  const formattedTime: string = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return formattedTime;
}