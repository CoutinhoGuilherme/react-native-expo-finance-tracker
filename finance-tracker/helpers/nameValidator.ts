export const nameValidator = (
  name: string, 
  fieldName: string = "Name"
): string => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} é obrigatório`;
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return `${fieldName} deve ter 2-50 caracteres`;
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
    return `${fieldName} contém caracteres inválidos`;
  }
  
  return "";
};