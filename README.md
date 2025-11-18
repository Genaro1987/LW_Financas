# 💰 LW Finanças - Sistema de Controle Financeiro

Sistema completo de gestão financeira desenvolvido em Google Apps Script para controle de receitas e despesas.

## 🚀 Funcionalidades

### ✨ Principais Recursos

- **Lançamento de Transações**
  - Registro de receitas, gastos fixos e gastos variáveis
  - Sistema de categorias dinâmico com popup para adicionar novas categorias
  - Validação de dados em tempo real
  - Observações opcionais para cada lançamento

- **Gerenciamento de Categorias**
  - Categorias pré-definidas por tipo de transação
  - Adicionar novas categorias facilmente através de popup
  - Categorias específicas para Receitas, Gastos Fixos e Gastos Variáveis

- **Consulta e Filtros**
  - Visualização de todos os lançamentos
  - Filtros por tipo: Receita, Gasto Fixo, Gasto Variável ou Todos
  - Listagem ordenada por data (mais recente primeiro)

- **Edição de Lançamentos**
  - Editar tipo, categoria, valor e observação
  - Permitido apenas para lançamentos com até 30 dias
  - Indicação visual de lançamentos bloqueados (mais de 30 dias)

- **Formatação Monetária**
  - Todos os valores exibidos em formato brasileiro (R$)
  - Separadores de milhares e decimais corretos
  - Cores diferenciadas para receitas (verde) e despesas (vermelho/laranja)

- **Correção de Timezone**
  - Data e hora registradas corretamente no horário de Brasília
  - Eliminação de problemas de fuso horário

- **Resumo Financeiro**
  - Total de receitas
  - Total de gastos fixos
  - Total de gastos variáveis
  - Saldo atual (receitas - despesas)
  - Indicadores visuais com cores

## 📋 Como Instalar

### 1. Criar Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Dê um nome à planilha (ex: "LW Finanças")

### 2. Abrir Editor de Script

1. Na planilha, vá em **Extensões** > **Apps Script**
2. Remova o código padrão que aparece

### 3. Adicionar os Arquivos

#### Code.gs
1. Renomeie o arquivo padrão `Code.gs`
2. Cole todo o conteúdo do arquivo `Code.gs` deste repositório

#### index.html
1. Clique em **+** ao lado de "Arquivos"
2. Selecione **HTML**
3. Nomeie como `index`
4. Cole todo o conteúdo do arquivo `index.html` deste repositório

#### consulta.html
1. Clique em **+** ao lado de "Arquivos"
2. Selecione **HTML**
3. Nomeie como `consulta`
4. Cole todo o conteúdo do arquivo `consulta.html` deste repositório

#### appsscript.json
1. No editor, clique no ícone de engrenagem ⚙️ (Configurações do projeto)
2. Marque a opção "Mostrar arquivo de manifesto 'appsscript.json' no editor"
3. Volte ao editor e clique em `appsscript.json`
4. Substitua o conteúdo pelo arquivo `appsscript.json` deste repositório

### 4. Salvar e Executar

1. Clique no ícone de **Salvar** (💾)
2. Volte para a planilha Google Sheets
3. Recarregue a página (F5)
4. Aguarde alguns segundos
5. Aparecerá um novo menu: **💰 LW Finanças**

### 5. Autorizar Permissões

Na primeira execução:
1. Clique em **💰 LW Finanças** > **📝 Novo Lançamento**
2. Será solicitada autorização
3. Clique em **Continuar**
4. Selecione sua conta Google
5. Clique em **Avançado**
6. Clique em **Ir para LW Finanças (não seguro)**
7. Clique em **Permitir**

Pronto! O sistema está instalado e pronto para uso.

## 📱 Como Usar

### Fazer um Novo Lançamento

1. Clique em **💰 LW Finanças** > **📝 Novo Lançamento**
2. Selecione o **Tipo** (Receita, Gasto Fixo ou Gasto Variável)
3. Selecione a **Categoria** ou crie uma nova:
   - Para criar nova categoria, selecione "➕ Adicionar Nova Categoria..."
   - Digite o nome da categoria no popup
   - Clique em "Adicionar"
4. Informe o **Valor**
5. Adicione uma **Observação** (opcional)
6. Clique em **💾 Salvar Lançamento**

### Consultar Lançamentos

1. Clique em **💰 LW Finanças** > **🔍 Consultar Lançamentos**
2. Use o filtro para ver apenas um tipo específico
3. Visualize o resumo financeiro no topo
4. Veja todos os lançamentos na tabela

### Editar um Lançamento

1. Na consulta, clique em **✏️ Editar** no lançamento desejado
2. Altere os campos necessários (tipo, categoria, valor, observação)
3. Clique em **Salvar Alterações**

**Nota:** Só é possível editar lançamentos com até 30 dias.

### Ver Resumo Financeiro

1. Clique em **💰 LW Finanças** > **📊 Atualizar Resumo**
2. Será exibida uma janela com:
   - Total de receitas
   - Total de gastos (fixos e variáveis)
   - Saldo atual

## 🎨 Interface

### Design Moderno
- Gradientes coloridos
- Ícones intuitivos
- Animações suaves
- Responsivo e adaptável

### Código de Cores
- **Verde** 💚: Receitas
- **Vermelho** ❌: Gastos Fixos
- **Laranja** ⚠️: Gastos Variáveis
- **Azul** 💙: Saldo positivo
- **Vermelho escuro** ⚠️: Saldo negativo

## 🔧 Estrutura Técnica

### Planilhas Criadas Automaticamente

1. **Lançamentos**: Armazena todos os registros financeiros
   - ID, Data/Hora, Tipo, Categoria, Valor, Observação

2. **Categorias**: Gerencia as categorias disponíveis
   - Tipo, Categoria

### Categorias Padrão

**Receitas:**
- Salário
- Freelance
- Investimentos
- Outros

**Gastos Fixos:**
- Aluguel
- Energia
- Água
- Internet
- Telefone

**Gastos Variáveis:**
- Alimentação
- Transporte
- Lazer
- Saúde
- Educação

## 🛡️ Segurança e Validações

- Validação de campos obrigatórios
- Proteção contra valores negativos
- Limite de 30 dias para edição
- Validação de categorias duplicadas
- Tratamento de erros com mensagens amigáveis

## 🌟 Melhorias Implementadas

### Problemas Corrigidos

1. ✅ **Sistema de Categorias Dinâmico**
   - Popup elegante para adicionar categorias
   - Não precisa mais de campo separado

2. ✅ **Correção de Timezone**
   - Data/hora sempre no horário de Brasília
   - Formato: dd/MM/yyyy HH:mm:ss

3. ✅ **Edição de Lançamentos**
   - Editar tipo, categoria e valor
   - Restrição de 30 dias
   - Interface intuitiva

4. ✅ **Formatação Monetária**
   - Todos os valores em R$
   - Formato brasileiro correto

5. ✅ **Filtros Avançados**
   - Por tipo de transação
   - Resumo dinâmico

## 💡 Sugestões de Melhorias Futuras

- Gráficos de despesas por categoria
- Exportação para PDF/Excel
- Metas mensais
- Alertas de gastos
- Comparativo mensal
- Categorias com ícones personalizados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todos os arquivos foram copiados corretamente
2. Certifique-se de ter concedido as permissões necessárias
3. Recarregue a planilha (F5)
4. Verifique o log de execução em Apps Script

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Desenvolvido com ❤️ para facilitar o controle financeiro pessoal**
