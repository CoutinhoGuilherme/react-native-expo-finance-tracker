export const dateValidator = (date: string) => {
  if (!date) return "Birthday is required";
  
  // Verifica o formato básico
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return "Invalid date format (DD/MM/YYYY)";
  
  const [day, month, year] = date.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  
  // Validação de ano
  if (year < 1900 || year > currentYear) return "Invalid year";
  
  // Validação de mês
  if (month < 1 || month > 12) return "Invalid month";
  
  // Validação de dia
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return "Invalid day";
  
  // Validação de idade mínima (opcional)
  const minimumAge = 13;
  const userDate = new Date(year, month - 1, day);
  const ageDiff = Date.now() - userDate.getTime();
  const ageDate = new Date(ageDiff);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  
  if (calculatedAge < minimumAge) return `Minimum age is ${minimumAge} years`;
  
  return "";
};