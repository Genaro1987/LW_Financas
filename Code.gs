const SPREADSHEET_ID = '1YG6LqlPNiLREQTRNY7h8BLfbiwNXigg0wmnFRhUWX-A';
const SHEETS = {
  lancamentos: 'Lancamentos',
  receitas: 'Config_receitas',
  fixos: 'Config_fixos',
  variaveis: 'Config_variaveis'
};

/**
 * Cria as abas e cabeçalhos necessários caso não existam.
 */
function configurarEstrutura() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const configReceitas = ss.getSheetByName(SHEETS.receitas) || ss.insertSheet(SHEETS.receitas);
  if (configReceitas.getLastRow() === 0) {
    configReceitas.appendRow(['Receitas']);
  }

  const configFixos = ss.getSheetByName(SHEETS.fixos) || ss.insertSheet(SHEETS.fixos);
  if (configFixos.getLastRow() === 0) {
    configFixos.appendRow(['Contas Fixas']);
  }

  const configVariaveis = ss.getSheetByName(SHEETS.variaveis) || ss.insertSheet(SHEETS.variaveis);
  if (configVariaveis.getLastRow() === 0) {
    configVariaveis.appendRow(['Contas Variáveis']);
  }

  const lancamentos = ss.getSheetByName(SHEETS.lancamentos) || ss.insertSheet(SHEETS.lancamentos);
  if (lancamentos.getLastRow() === 0) {
    lancamentos.appendRow(['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']);
  }
}

/**
 * Retorna HTML do front-end.
 */
function doGet() {
  configurarEstrutura();
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('Controle Financeiro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Obtém listas de categorias.
 */
function obterConfiguracoes() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const data = {};
  data.receitas = lerColuna(ss, SHEETS.receitas);
  data.fixos = lerColuna(ss, SHEETS.fixos);
  data.variaveis = lerColuna(ss, SHEETS.variaveis);
  return data;
}

function lerColuna(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), 1).getValues()
    .flat()
    .filter(Boolean)
    .map(String);
  return values.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
}

/**
 * Adiciona nova categoria nas folhas de configuração.
 */
function adicionarCategoria(tipo, nome) {
  if (!nome) return;
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheetName;
  switch (tipo) {
    case 'receita':
      sheetName = SHEETS.receitas;
      break;
    case 'fixo':
      sheetName = SHEETS.fixos;
      break;
    case 'variavel':
      sheetName = SHEETS.variaveis;
      break;
    default:
      throw new Error('Tipo inválido');
  }
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  const valores = lerColuna(ss, sheetName);
  if (!valores.includes(nome)) {
    sheet.appendRow([nome]);
  }
  return lerColuna(ss, sheetName);
}

/**
 * Registra um lançamento na aba principal.
 */
function registrarLancamento(lancamento) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.lancamentos) || ss.insertSheet(SHEETS.lancamentos);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']);
  }
  const linha = [
    lancamento.data ? new Date(lancamento.data) : new Date(),
    lancamento.tipo,
    lancamento.categoria,
    lancamento.descricao || '',
    Number(lancamento.valor || 0)
  ];
  sheet.appendRow(linha);
  return true;
}

/**
 * Obtém fluxo de caixa por período, agrupado por tipo.
 */
function consultarFluxo(inicioIso, fimIso) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.lancamentos);
  if (!sheet || sheet.getLastRow() < 2) {
    return { receitas: {}, fixos: {}, variaveis: {}, total: 0 };
  }
  const dados = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const inicio = inicioIso ? new Date(inicioIso) : null;
  const fim = fimIso ? new Date(fimIso) : null;
  const fluxo = { receitas: {}, fixos: {}, variaveis: {}, total: 0 };

  dados.forEach(([data, tipo, categoria, , valor]) => {
    if (inicio && data < inicio) return;
    if (fim && data > fim) return;
    const valorNum = Number(valor || 0);
    switch (tipo) {
      case 'receita':
        fluxo.receitas[categoria] = (fluxo.receitas[categoria] || 0) + valorNum;
        fluxo.total += valorNum;
        break;
      case 'fixo':
        fluxo.fixos[categoria] = (fluxo.fixos[categoria] || 0) + valorNum;
        fluxo.total -= valorNum;
        break;
      case 'variavel':
        fluxo.variaveis[categoria] = (fluxo.variaveis[categoria] || 0) + valorNum;
        fluxo.total -= valorNum;
        break;
    }
  });
  return fluxo;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
