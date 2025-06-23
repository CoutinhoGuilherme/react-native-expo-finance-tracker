import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function PolicyModal() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { theme } = useTheme();

  const privacyPolicyContent = `
Última atualização: 23/06/2025

1. Informações que coletamos
Coletamos informações que você nos fornece diretamente ao usar o aplicativo, incluindo nome, sobrenome e data de nascimento.

2. Como usamos suas informações
Usamos as informações coletadas para:
- Fornecer e manter nossos serviços
- Melhorar a experiência do usuário
- Enviar notificações importantes

3. Segurança de dados
Implementamos medidas de segurança apropriadas para proteger suas informações pessoais.

4. Entre em contato conosco
Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em finwise@email.com.
`;


const termsContent = `
Última atualização: 23/06/2025

1. Aceitação dos Termos
Ao acessar e usar este aplicativo, você aceita e concorda em ficar vinculado a estes Termos e Condições.

2. Licença de uso
É concedida permissão para baixar temporariamente uma cópia do aplicativo apenas para uso pessoal e não comercial.

3. Isenção de responsabilidade
O aplicativo é fornecido "no estado em que se encontra", sem quaisquer garantias, expressas ou implícitas.

4. Limitações
Em nenhuma hipótese seremos responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar o aplicativo.

5. Alterações nos Termos
Reservamo-nos o direito de modificar estes termos a qualquer momento. Por favor, revise-os periodicamente.
`;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text.primary }]}>
          {type === 'privacy' ? privacyPolicyContent : termsContent}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 