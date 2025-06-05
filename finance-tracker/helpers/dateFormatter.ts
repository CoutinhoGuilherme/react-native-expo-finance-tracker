// Formata a entrada do usuário para DD/MM/YYYY
export const formatBirthdayInput = (input: string): string => {
  // Remove qualquer caractere que não seja dígito
  const cleaned = input.replace(/\D/g, '');
  
  // Limita a 8 dígitos (DDMMYYYY)
  const limited = cleaned.slice(0, 8);
  
  // Aplica a formatação
  if (limited.length > 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  } else if (limited.length > 2) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
  return limited;
};

// Converte DD/MM/YYYY para YYYY-MM-DD (formato ISO)
export const formatToISO = (dateString: string): string | null => {
  if (!dateString) return null;

  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return null;
  }

  const iso = `${year}-${month}-${day}`;
  const date = new Date(iso);

  // ⚠️ Valida se a data realmente existe
  if (
    isNaN(date.getTime()) ||
    date.getUTCDate().toString().padStart(2, '0') !== day ||
    (date.getUTCMonth() + 1).toString().padStart(2, '0') !== month ||
    date.getUTCFullYear().toString() !== year
  ) {
    return null;
  }

  return iso;
};
