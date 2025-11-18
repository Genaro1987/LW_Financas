# LW Finanças – Apps Script

Aplicação de controle financeiro simples (lançamento e consulta) construída para Google Apps Script e ligada à planilha `1YG6LqlPNiLREQTRNY7h8BLfbiwNXigg0wmnFRhUWX-A`.

## Estrutura
- `Code.gs`: backend GAS com criação automática das abas, endpoints para lançar e consultar dados e inclusão dinâmica de categorias.
- `index.html`: front-end responsivo em português com duas telas: **Lançamentos** e **Consulta**.

## Como usar
1. Crie um novo projeto no [Google Apps Script](https://script.google.com/) e cole os arquivos `Code.gs` e `index.html` (o nome do HTML deve ser `index`).
2. Implante como **Aplicativo da Web** (Executar como: você mesmo; Quem tem acesso: qualquer pessoa com o link). Use o link gerado para acessar pelo celular ou desktop.
3. A primeira execução cria automaticamente as abas `Config_receitas`, `Config_fixos`, `Config_variaveis` e `Lancamentos` caso não existam.
4. Use a aba **Lançamentos** para registrar receitas, gastos fixos e variáveis, incluindo novas categorias diretamente pelo front-end.
5. Use a aba **Consulta** para selecionar um período (data inicial e final) e visualizar o fluxo de caixa agrupado por tipo e categoria.

## Observações
- As listas de categorias são ordenadas alfabeticamente no front-end e atualizadas ao incluir novos itens.
- O cálculo do resultado final soma receitas e subtrai gastos fixos e variáveis.
