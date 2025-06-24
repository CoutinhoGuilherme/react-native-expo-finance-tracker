export const expenseCategories = [
    'Alimentação',
    'Compras',
    'Transporte',
    'Reforma',
    'Lazer',
    'Contas',
    'Saúde',
    'Educação',
    'Utilities',
    'Viagem',
    'Seguro',
    'Beleza',
    'Presente',
    'Investimentos',
    'Outros'
  ];
  
  export const incomeCategories = [
    'Salário',
    'Negócios',
    'Investimentos',
    'Freelance',
    'Presente',
    'Aluguel',
    'Reembolsos',
    'Outros'
  ];
  
  // Helper function to get categories based on transaction type
  export const getCategoriesByType = (type: 'income' | 'expense' | 'all') => {
    switch (type) {
      case 'income':
        return incomeCategories;
      case 'expense':
        return expenseCategories;
      case 'all':
        return [...new Set([...incomeCategories, ...expenseCategories])];
      default:
        return [];
    }
  }; 