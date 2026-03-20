export function formatDate(dateString: string): string {
  const date: Date = new Date(dateString);
  const formattedDate: string = new Intl.DateTimeFormat('fr-FR').format(date);
  return formattedDate;
}

export function formatTime(dateString: string): string {
  if (!dateString) return "";

  const date: Date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn("Format de date non reconnu :", dateString);
    return "Heure invalide"; 
  }

  
  const formattedTime: string = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return formattedTime;
}