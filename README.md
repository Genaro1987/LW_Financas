# LW Finanças - Sistema de Controle Financeiro

Sistema completo de gestão financeira desenvolvido em Google Apps Script para controle de receitas e despesas.

## Funcionalidades

### Principais Recursos

- **Lançamento de Transações**
  - Registro de receitas, gastos fixos e gastos variáveis
  - Sistema de categorias dinâmico com popup para adicionar novas categorias
  - Categorias armazenadas em planilha de configuração externa
  - Validação de dados em tempo real
  - Observações opcionais para cada lançamento

- **Gerenciamento de Categorias**
  - Categorias gerenciadas na planilha de configuração
  - Adicionar novas categorias facilmente através de popup
  - Categorias específicas por tipo (Receitas, Gastos Fixos e Gastos Variáveis)
  - Inserção automática ao final da lista de cada aba

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
  - Formato: R$ 1.234,56

- **Correção de Timezone**
  - Data e hora registradas corretamente no horário de Brasília
  - Eliminação de problemas de fuso horário

- **Resumo Financeiro**
  - Total de receitas
  - Total de gastos fixos
  - Total de gastos variáveis
  - Saldo atual (receitas - despesas)

- **Design Responsivo**
  - Otimizado para uso em smartphone
  - Interface touch-friendly
  - Campos e botões dimensionados para mobile
  - Prevenção de zoom automático em iOS

## Configuração da Planilha

### Planilha de Configurações

ID da Planilha: `1YG6LqlPNiLREQTRNY7h8BLfbiwNXigg0wmnFRhUWX-A`

Esta planilha contém 3 abas para gerenciar as categorias:

1. **Config_receitas** - Categorias de receitas
2. **Config_fixos** - Categorias de gastos fixos
3. **Config_variaveis** - Categorias de gastos variáveis

Cada aba deve ter as categorias listadas na **primeira coluna**, começando da linha 2 (linha 1 é o cabeçalho).

### Esquema de Cores

O sistema utiliza as cores da empresa:
- **Preto (#000000)** - Cabeçalhos e elementos principais
- **Amarelo (#FFD700)** - Destaques e botões principais
- **Branco (#FFFFFF)** - Fundo e texto secundário

## Como Instalar

### 1. Criar Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Dê um nome à planilha (ex: "LW Finanças")

### 2. Abrir Editor de Script

1. Na planilha, vá em **Extensões** > **Apps Script**
2. Remova o código padrão que aparece

### 3. Adicionar os Arquivos

**O sistema possui apenas 2 arquivos principais:**

#### Code.gs
1. Renomeie o arquivo padrão `Code.gs`
2. Cole todo o conteúdo do arquivo `Code.gs` deste repositório

#### index.html
1. Clique em **+** ao lado de "Arquivos"
2. Selecione **HTML**
3. Nomeie como `index`
4. Cole todo o conteúdo do arquivo `index.html` deste repositório

#### appsscript.json
1. No editor, clique no ícone de engrenagem (Configurações do projeto)
2. Marque a opção "Mostrar arquivo de manifesto 'appsscript.json' no editor"
3. Volte ao editor e clique em `appsscript.json`
4. Substitua o conteúdo pelo arquivo `appsscript.json` deste repositório

### 4. Configurar Planilha de Categorias

**IMPORTANTE:** Antes de usar, você deve:

1. Abrir o arquivo `Code.gs`
2. Localizar a constante `PLANILHA_CONFIG_ID` (linha 9)
3. Se necessário, substituir pelo ID da sua planilha de configurações

### 5. Salvar e Executar

1. Clique no ícone de **Salvar**
2. Volte para a planilha Google Sheets
3. Recarregue a página (F5)
4. Aguarde alguns segundos
5. Aparecerá um novo menu: **LW Finanças**
6. Clique em **LW Finanças** > **Abrir Sistema**

### 6. Autorizar Permissões

Na primeira execução:
1. Clique em **LW Finanças** > **Novo Lançamento**
2. Será solicitada autorização
3. Clique em **Continuar**
4. Selecione sua conta Google
5. Clique em **Avançado**
6. Clique em **Ir para LW Finanças (não seguro)**
7. Clique em **Permitir**

Pronto! O sistema está instalado e pronto para uso.

## Como Usar

### Abrir o Sistema

1. Clique em **LW Finanças** > **Abrir Sistema**
2. Uma janela será aberta com o sistema completo
3. O sistema possui 2 abas: **Lançamento** e **Consulta**

### Fazer um Novo Lançamento

1. Na aba **Lançamento**:
2. Selecione o **Tipo** (Receita, Gasto Fixo ou Gasto Variável)
3. Selecione a **Categoria** ou crie uma nova:
   - Para criar nova categoria, selecione "+ Adicionar Nova Categoria..."
   - Digite o nome da categoria no popup
   - Clique em "Adicionar"
   - A categoria será adicionada na planilha de configuração
4. Informe a **Data** (preenchida automaticamente com a data atual, pode ser alterada)
5. Informe o **Valor**
6. Adicione uma **Observação** (opcional)
7. Clique em **Salvar Lançamento**

### Consultar Lançamentos

1. Clique na aba **Consulta**
2. Use o filtro para ver apenas um tipo específico
3. Visualize o resumo financeiro no topo
4. Veja todos os lançamentos na tabela

### Editar um Lançamento

1. Na consulta, clique em **Editar** no lançamento desejado
2. Altere os campos necessários (tipo, categoria, valor, observação)
3. Clique em **Salvar**

**Nota:** Só é possível editar lançamentos com até 30 dias.

### Ver Resumo Financeiro

1. Clique em **LW Finanças** > **Atualizar Resumo**
2. Será exibida uma janela com:
   - Total de receitas
   - Total de gastos (fixos e variáveis)
   - Saldo atual

## Interface

### Design Responsivo para Mobile
- Campos otimizados para touch (mínimo 44px)
- Fonte mínima de 16px (previne zoom automático no iOS)
- Botões grandes e fáceis de tocar
- Layout adaptável para telas pequenas
- Tabelas com scroll horizontal em mobile

### Esquema de Cores
- **Amarelo** - Receitas e botões principais
- **Cinza Claro** - Gastos Fixos
- **Branco** - Gastos Variáveis
- **Preto** - Cabeçalhos e bordas
- **Vermelho** - Valores negativos e alertas

## Estrutura Técnica

### Planilhas Utilizadas

1. **Lançamentos** (criada automaticamente na planilha atual)
   - ID, Data/Hora, Tipo, Categoria, Valor, Observação

2. **Config_receitas** (na planilha de configuração externa)
   - Lista de categorias de receitas

3. **Config_fixos** (na planilha de configuração externa)
   - Lista de categorias de gastos fixos

4. **Config_variaveis** (na planilha de configuração externa)
   - Lista de categorias de gastos variáveis

## Segurança e Validações

- Validação de campos obrigatórios
- Proteção contra valores negativos
- Limite de 30 dias para edição
- Validação de categorias duplicadas
- Tratamento de erros com mensagens amigáveis
- Conexão segura com planilha externa de configurações

## Melhorias Implementadas

1. **Sistema Unificado com Abas**
   - Apenas 2 arquivos: Code.gs e index.html
   - Interface com abas: Lançamento e Consulta
   - Troca rápida sem recarregar
   - Janela otimizada: 900x700px

2. **Sistema de Categorias Dinâmico**
   - Popup elegante para adicionar categorias
   - Categorias armazenadas em planilha externa
   - Inserção automática ao final de cada aba
   - Cache inteligente para performance

3. **Otimização de Performance**
   - Cache de categorias por tipo
   - Carregamento instantâneo ao trocar tipo
   - Cache limpo apenas ao adicionar nova categoria
   - Consulta carregada sob demanda

4. **Correção de Timezone**
   - Data sempre no horário de Brasília (America/Sao_Paulo)
   - Formato: dd/MM/yyyy
   - Campo de hora removido (simplificação)

5. **Edição de Lançamentos**
   - Editar tipo, categoria, valor e observação
   - Restrição de 30 dias
   - Interface intuitiva com cache

6. **Formatação Monetária**
   - Todos os valores em R$
   - Formato brasileiro correto (R$ 1.234,56)

7. **Filtros Avançados**
   - Por tipo de transação
   - Resumo dinâmico

8. **Design Responsivo**
   - Interface otimizada para smartphone
   - Touch-friendly
   - Sem zoom automático

9. **Interface Limpa**
   - Sem ícones emoji
   - Cores da empresa (preto, amarelo, branco)
   - Design profissional e moderno

## Sugestões de Melhorias Futuras

- Gráficos de despesas por categoria
- Exportação para PDF/Excel
- Metas mensais
- Alertas de gastos
- Comparativo mensal
- Backup automático

## Suporte

Para dúvidas ou problemas:
1. Verifique se todos os arquivos foram copiados corretamente
2. Certifique-se de ter concedido as permissões necessárias
3. Verifique se o ID da planilha de configuração está correto
4. Recarregue a planilha (F5)
5. Verifique o log de execução em Apps Script

## Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Desenvolvido para facilitar o controle financeiro pessoal**
