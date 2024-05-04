export const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
  };