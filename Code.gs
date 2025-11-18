/**
 * Sistema de Controle Financeiro - LW Finanças
 * Gerenciamento de receitas e despesas
 */

// Configurações globais
const CONFIG = {
  PLANILHA_NOME: 'Lançamentos',
  PLANILHA_CATEGORIAS: 'Categorias',
  TIMEZONE: 'America/Sao_Paulo',
  DIAS_EDICAO: 30
};

/**
 * Abre a página principal
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('LW Finanças - Controle Financeiro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Abre a página de consulta
 */
function abrirConsulta() {
  const html = HtmlService.createHtmlOutputFromFile('consulta')
    .setWidth(900)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Consultar Lançamentos');
}

/**
 * Obtém ou cria a planilha de lançamentos
 */
function obterPlanilhaLancamentos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let planilha = ss.getSheetByName(CONFIG.PLANILHA_NOME);

  if (!planilha) {
    planilha = ss.insertSheet(CONFIG.PLANILHA_NOME);
    planilha.appendRow(['ID', 'Data/Hora', 'Tipo', 'Categoria', 'Valor', 'Observação']);
    planilha.getRange('A1:F1').setFontWeight('bold').setBackground('#4CAF50').setFontColor('#FFFFFF');
    planilha.setFrozenRows(1);
  }

  return planilha;
}

/**
 * Obtém ou cria a planilha de categorias
 */
function obterPlanilhaCategorias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let planilha = ss.getSheetByName(CONFIG.PLANILHA_CATEGORIAS);

  if (!planilha) {
    planilha = ss.insertSheet(CONFIG.PLANILHA_CATEGORIAS);
    planilha.appendRow(['Tipo', 'Categoria']);
    planilha.getRange('A1:B1').setFontWeight('bold').setBackground('#2196F3').setFontColor('#FFFFFF');

    // Categorias padrão
    const categoriasDefault = [
      ['Receita', 'Salário'],
      ['Receita', 'Freelance'],
      ['Receita', 'Investimentos'],
      ['Receita', 'Outros'],
      ['Gasto Fixo', 'Aluguel'],
      ['Gasto Fixo', 'Energia'],
      ['Gasto Fixo', 'Água'],
      ['Gasto Fixo', 'Internet'],
      ['Gasto Fixo', 'Telefone'],
      ['Gasto Variável', 'Alimentação'],
      ['Gasto Variável', 'Transporte'],
      ['Gasto Variável', 'Lazer'],
      ['Gasto Variável', 'Saúde'],
      ['Gasto Variável', 'Educação']
    ];

    categoriasDefault.forEach(cat => planilha.appendRow(cat));
  }

  return planilha;
}

/**
 * Obtém categorias por tipo
 */
function obterCategorias(tipo) {
  try {
    const planilha = obterPlanilhaCategorias();
    const dados = planilha.getDataRange().getValues();

    const categorias = [];
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] === tipo) {
        categorias.push(dados[i][1]);
      }
    }

    return categorias;
  } catch (e) {
    Logger.log('Erro ao obter categorias: ' + e.toString());
    return [];
  }
}

/**
 * Adiciona nova categoria
 */
function adicionarCategoria(tipo, nomeCategoria) {
  try {
    if (!nomeCategoria || nomeCategoria.trim() === '') {
      return { sucesso: false, mensagem: 'Nome da categoria não pode ser vazio!' };
    }

    const planilha = obterPlanilhaCategorias();
    const dados = planilha.getDataRange().getValues();

    // Verifica se já existe
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] === tipo && dados[i][1].toLowerCase() === nomeCategoria.toLowerCase()) {
        return { sucesso: false, mensagem: 'Categoria já existe!' };
      }
    }

    // Adiciona nova categoria
    planilha.appendRow([tipo, nomeCategoria]);

    return { sucesso: true, mensagem: 'Categoria adicionada com sucesso!', categoria: nomeCategoria };
  } catch (e) {
    Logger.log('Erro ao adicionar categoria: ' + e.toString());
    return { sucesso: false, mensagem: 'Erro ao adicionar categoria: ' + e.toString() };
  }
}

/**
 * Registra um novo lançamento
 */
function registrarLancamento(dados) {
  try {
    const planilha = obterPlanilhaLancamentos();

    // Gera ID único
    const ultimaLinha = planilha.getLastRow();
    const id = ultimaLinha > 1 ? planilha.getRange(ultimaLinha, 1).getValue() + 1 : 1;

    // Obtém data/hora atual no timezone correto
    const agora = new Date();
    const dataHoraBrasil = Utilities.formatDate(agora, CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');

    // Converte valor para número
    const valor = parseFloat(dados.valor);

    // Adiciona linha
    planilha.appendRow([
      id,
      dataHoraBrasil,
      dados.tipo,
      dados.categoria,
      valor,
      dados.observacao || ''
    ]);

    // Formata a linha
    const novaLinha = planilha.getLastRow();
    planilha.getRange(novaLinha, 5).setNumberFormat('R$ #,##0.00');

    // Aplica cor de fundo baseada no tipo
    let cor = '#FFFFFF';
    if (dados.tipo === 'Receita') {
      cor = '#E8F5E9'; // Verde claro
    } else if (dados.tipo === 'Gasto Fixo') {
      cor = '#FFEBEE'; // Vermelho claro
    } else if (dados.tipo === 'Gasto Variável') {
      cor = '#FFF3E0'; // Laranja claro
    }
    planilha.getRange(novaLinha, 1, 1, 6).setBackground(cor);

    return { sucesso: true, mensagem: 'Lançamento registrado com sucesso!' };
  } catch (e) {
    Logger.log('Erro ao registrar lançamento: ' + e.toString());
    return { sucesso: false, mensagem: 'Erro ao registrar: ' + e.toString() };
  }
}

/**
 * Obtém todos os lançamentos com filtro opcional
 */
function obterLancamentos(filtroTipo = null) {
  try {
    const planilha = obterPlanilhaLancamentos();
    const dados = planilha.getDataRange().getValues();

    if (dados.length <= 1) {
      return [];
    }

    const lancamentos = [];
    const agora = new Date();

    for (let i = 1; i < dados.length; i++) {
      const tipo = dados[i][2];

      // Aplica filtro se especificado
      if (filtroTipo && filtroTipo !== 'Todos' && tipo !== filtroTipo) {
        continue;
      }

      // Calcula se pode editar (até 30 dias)
      const dataLancamento = parseDataBrasileira(dados[i][1]);
      const diasDiferenca = Math.floor((agora - dataLancamento) / (1000 * 60 * 60 * 24));
      const podeEditar = diasDiferenca <= CONFIG.DIAS_EDICAO;

      lancamentos.push({
        id: dados[i][0],
        dataHora: dados[i][1],
        tipo: tipo,
        categoria: dados[i][3],
        valor: dados[i][4],
        observacao: dados[i][5] || '',
        podeEditar: podeEditar,
        diasAtras: diasDiferenca
      });
    }

    // Ordena por ID decrescente (mais recente primeiro)
    lancamentos.sort((a, b) => b.id - a.id);

    return lancamentos;
  } catch (e) {
    Logger.log('Erro ao obter lançamentos: ' + e.toString());
    return [];
  }
}

/**
 * Converte string de data brasileira para objeto Date
 */
function parseDataBrasileira(dataStr) {
  try {
    // Formato: dd/MM/yyyy HH:mm:ss
    const partes = dataStr.split(' ');
    const data = partes[0].split('/');
    const hora = partes[1] ? partes[1].split(':') : ['0', '0', '0'];

    return new Date(
      parseInt(data[2]),
      parseInt(data[1]) - 1,
      parseInt(data[0]),
      parseInt(hora[0]),
      parseInt(hora[1]),
      parseInt(hora[2])
    );
  } catch (e) {
    Logger.log('Erro ao converter data: ' + e.toString());
    return new Date();
  }
}

/**
 * Edita um lançamento existente
 */
function editarLancamento(id, dados) {
  try {
    const planilha = obterPlanilhaLancamentos();
    const todosOsDados = planilha.getDataRange().getValues();

    // Encontra a linha do lançamento
    let linhaLancamento = -1;
    for (let i = 1; i < todosOsDados.length; i++) {
      if (todosOsDados[i][0] === id) {
        linhaLancamento = i + 1; // +1 porque getRange começa em 1
        break;
      }
    }

    if (linhaLancamento === -1) {
      return { sucesso: false, mensagem: 'Lançamento não encontrado!' };
    }

    // Verifica se pode editar (até 30 dias)
    const dataLancamento = parseDataBrasileira(todosOsDados[linhaLancamento - 1][1]);
    const agora = new Date();
    const diasDiferenca = Math.floor((agora - dataLancamento) / (1000 * 60 * 60 * 24));

    if (diasDiferenca > CONFIG.DIAS_EDICAO) {
      return { sucesso: false, mensagem: 'Lançamento com mais de 30 dias não pode ser editado!' };
    }

    // Atualiza os campos
    planilha.getRange(linhaLancamento, 3).setValue(dados.tipo); // Tipo
    planilha.getRange(linhaLancamento, 4).setValue(dados.categoria); // Categoria
    planilha.getRange(linhaLancamento, 5).setValue(parseFloat(dados.valor)); // Valor
    if (dados.observacao !== undefined) {
      planilha.getRange(linhaLancamento, 6).setValue(dados.observacao); // Observação
    }

    // Reaplica formatação
    planilha.getRange(linhaLancamento, 5).setNumberFormat('R$ #,##0.00');

    // Atualiza cor de fundo
    let cor = '#FFFFFF';
    if (dados.tipo === 'Receita') {
      cor = '#E8F5E9';
    } else if (dados.tipo === 'Gasto Fixo') {
      cor = '#FFEBEE';
    } else if (dados.tipo === 'Gasto Variável') {
      cor = '#FFF3E0';
    }
    planilha.getRange(linhaLancamento, 1, 1, 6).setBackground(cor);

    return { sucesso: true, mensagem: 'Lançamento atualizado com sucesso!' };
  } catch (e) {
    Logger.log('Erro ao editar lançamento: ' + e.toString());
    return { sucesso: false, mensagem: 'Erro ao editar: ' + e.toString() };
  }
}

/**
 * Obtém resumo financeiro
 */
function obterResumo() {
  try {
    const planilha = obterPlanilhaLancamentos();
    const dados = planilha.getDataRange().getValues();

    let totalReceitas = 0;
    let totalGastosFixos = 0;
    let totalGastosVariaveis = 0;

    for (let i = 1; i < dados.length; i++) {
      const tipo = dados[i][2];
      const valor = parseFloat(dados[i][4]) || 0;

      if (tipo === 'Receita') {
        totalReceitas += valor;
      } else if (tipo === 'Gasto Fixo') {
        totalGastosFixos += valor;
      } else if (tipo === 'Gasto Variável') {
        totalGastosVariaveis += valor;
      }
    }

    const totalGastos = totalGastosFixos + totalGastosVariaveis;
    const saldo = totalReceitas - totalGastos;

    return {
      receitas: totalReceitas,
      gastosFixos: totalGastosFixos,
      gastosVariaveis: totalGastosVariaveis,
      totalGastos: totalGastos,
      saldo: saldo
    };
  } catch (e) {
    Logger.log('Erro ao obter resumo: ' + e.toString());
    return {
      receitas: 0,
      gastosFixos: 0,
      gastosVariaveis: 0,
      totalGastos: 0,
      saldo: 0
    };
  }
}

/**
 * Cria menu personalizado
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('💰 LW Finanças')
    .addItem('📝 Novo Lançamento', 'abrirFormulario')
    .addItem('🔍 Consultar Lançamentos', 'abrirConsulta')
    .addSeparator()
    .addItem('📊 Atualizar Resumo', 'mostrarResumo')
    .addToUi();
}

/**
 * Abre formulário de lançamento
 */
function abrirFormulario() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(500)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '💰 LW Finanças - Novo Lançamento');
}

/**
 * Mostra resumo financeiro
 */
function mostrarResumo() {
  const resumo = obterResumo();
  const ui = SpreadsheetApp.getUi();

  const mensagem = `
📊 RESUMO FINANCEIRO

💚 Receitas: R$ ${resumo.receitas.toFixed(2).replace('.', ',')}

❌ Gastos:
  • Fixos: R$ ${resumo.gastosFixos.toFixed(2).replace('.', ',')}
  • Variáveis: R$ ${resumo.gastosVariaveis.toFixed(2).replace('.', ',')}
  • Total: R$ ${resumo.totalGastos.toFixed(2).replace('.', ',')}

${resumo.saldo >= 0 ? '✅' : '⚠️'} Saldo: R$ ${resumo.saldo.toFixed(2).replace('.', ',')}
  `;

  ui.alert('Resumo Financeiro', mensagem, ui.ButtonSet.OK);
}
