export const formatBirthdayInput = (input: string): string => {
  // Remove todos os caracteres não numéricos
  let cleaned = input.replace(/\D/g, '');
  
  // Aplica a máscara DD/MM/YYYY
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (match) {
    let formatted = [];
    if (match[1]) formatted.push(match[1]);
    if (match[2]) formatted.push(match[2]);
    if (match[3]) formatted.push(match[3]);
    
    return formatted.join('/').slice(0, 10);
  }
  
  return input;
};