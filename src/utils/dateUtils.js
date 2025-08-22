export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric',
    month: 'short'
  }).format(date);
}; 