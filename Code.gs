/**
 * Sistema de Controle Financeiro - LW Finanças
 * Gerenciamento de receitas e despesas
 */

// Configurações globais
const CONFIG = {
  PLANILHA_NOME: 'Lançamentos',
  PLANILHA_CONFIG_ID: '1YG6LqlPNiLREQTRNY7h8BLfbiwNXigg0wmnFRhUWX-A',
  ABA_RECEITAS: 'Config_receitas',
  ABA_FIXO: 'Config_fixos',
  ABA_VARIAVEL: 'Config_variaveis',
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
 * Obtém ou cria a planilha de lançamentos
 */
function obterPlanilhaLancamentos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let planilha = ss.getSheetByName(CONFIG.PLANILHA_NOME);

  if (!planilha) {
    planilha = ss.insertSheet(CONFIG.PLANILHA_NOME);
    planilha.appendRow(['ID', 'Data/Hora', 'Tipo', 'Categoria', 'Valor', 'Observação']);
    planilha.getRange('A1:F1').setFontWeight('bold').setBackground('#000000').setFontColor('#FFD700');
    planilha.setFrozenRows(1);
  }

  return planilha;
}

/**
 * Obtém a aba correta baseada no tipo
 */
function obterAbaConfig(tipo) {
  const ss = SpreadsheetApp.openById(CONFIG.PLANILHA_CONFIG_ID);

  let nomeAba = '';
  if (tipo === 'Receita') {
    nomeAba = CONFIG.ABA_RECEITAS;
  } else if (tipo === 'Gasto Fixo') {
    nomeAba = CONFIG.ABA_FIXO;
  } else if (tipo === 'Gasto Variável') {
    nomeAba = CONFIG.ABA_VARIAVEL;
  }

  return ss.getSheetByName(nomeAba);
}

/**
 * Obtém categorias por tipo
 */
function obterCategorias(tipo) {
  try {
    const planilha = obterAbaConfig(tipo);

    if (!planilha) {
      Logger.log('Aba não encontrada para tipo: ' + tipo);
      return [];
    }

    const dados = planilha.getDataRange().getValues();
    const categorias = [];

    // Pula o cabeçalho e lê todas as categorias (assumindo que estão na primeira coluna)
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] && dados[i][0].toString().trim() !== '') {
        categorias.push(dados[i][0].toString().trim());
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

    const planilha = obterAbaConfig(tipo);

    if (!planilha) {
      return { sucesso: false, mensagem: 'Aba de configuração não encontrada!' };
    }

    const dados = planilha.getDataRange().getValues();

    // Verifica se já existe (na primeira coluna)
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] && dados[i][0].toString().toLowerCase().trim() === nomeCategoria.toLowerCase().trim()) {
        return { sucesso: false, mensagem: 'Categoria já existe!' };
      }
    }

    // Adiciona nova categoria ao final da lista (primeira coluna)
    planilha.appendRow([nomeCategoria]);

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

    // Usa a data informada (sem hora)
    let dataHoraBrasil;
    if (dados.data) {
      // Adiciona horário padrão 00:00:00
      dataHoraBrasil = dados.data + ' 00:00:00';
    } else {
      // Obtém data/hora atual no timezone correto
      const agora = new Date();
      dataHoraBrasil = Utilities.formatDate(agora, CONFIG.TIMEZONE, 'dd/MM/yyyy 00:00:00');
    }

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
      cor = '#FFFACD'; // Amarelo claro
    } else if (dados.tipo === 'Gasto Fixo') {
      cor = '#F5F5F5'; // Cinza claro
    } else if (dados.tipo === 'Gasto Variável') {
      cor = '#FFFFFF'; // Branco
    }
    planilha.getRange(novaLinha, 1, 1, 6).setBackground(cor);

    return { sucesso: true, mensagem: 'Lançamento registrado com sucesso!' };
  } catch (e) {
    Logger.log('Erro ao registrar lançamento: ' + e.toString());
    return { sucesso: false, mensagem: 'Erro ao registrar: ' + e.toString() };
  }
}

/**
 * Obtém todos os lançamentos com filtros opcionais (OTIMIZADO)
 * Retorna lançamentos E resumo em uma única chamada
 */
function obterDadosConsulta(filtroTipo, dataInicio, dataFim) {
  try {
    Logger.log('Iniciando obterDadosConsulta com filtros - Tipo: ' + filtroTipo + ', DataInicio: ' + dataInicio + ', DataFim: ' + dataFim);

    const planilha = obterPlanilhaLancamentos();

    if (!planilha) {
      throw new Error('Planilha de lançamentos não encontrada');
    }

    const dados = planilha.getDataRange().getValues();
    Logger.log('Total de linhas encontradas: ' + dados.length);

    if (dados.length <= 1) {
      return {
        lancamentos: [],
        resumo: {
          receitas: 0,
          gastosFixos: 0,
          gastosVariaveis: 0,
          totalGastos: 0,
          saldo: 0
        }
      };
    }

    const lancamentos = [];
    const agora = new Date();

    // Converte datas de filtro se fornecidas
    let dataInicioObj = null;
    let dataFimObj = null;

    if (dataInicio && dataInicio.trim() !== '') {
      try {
        const partesInicio = dataInicio.split('/');
        dataInicioObj = new Date(partesInicio[2], partesInicio[1] - 1, partesInicio[0], 0, 0, 0);
        Logger.log('Data início convertida: ' + dataInicioObj);
      } catch (e) {
        Logger.log('Erro ao converter data início: ' + e.toString());
      }
    }

    if (dataFim && dataFim.trim() !== '') {
      try {
        const partesFim = dataFim.split('/');
        dataFimObj = new Date(partesFim[2], partesFim[1] - 1, partesFim[0], 23, 59, 59);
        Logger.log('Data fim convertida: ' + dataFimObj);
      } catch (e) {
        Logger.log('Erro ao converter data fim: ' + e.toString());
      }
    }

    // Variáveis para cálculo do resumo
    let totalReceitas = 0;
    let totalGastosFixos = 0;
    let totalGastosVariaveis = 0;

    for (let i = 1; i < dados.length; i++) {
      try {
        const tipo = dados[i][2];
        const dataLancamento = parseDataBrasileira(dados[i][1]);
        const valor = parseFloat(dados[i][4]) || 0;

        // Aplica filtro de data
        if (dataInicioObj && dataLancamento < dataInicioObj) continue;
        if (dataFimObj && dataLancamento > dataFimObj) continue;

        // Calcula resumo (sem filtro de tipo)
        if (tipo === 'Receita') {
          totalReceitas += valor;
        } else if (tipo === 'Gasto Fixo') {
          totalGastosFixos += valor;
        } else if (tipo === 'Gasto Variável') {
          totalGastosVariaveis += valor;
        }

        // Aplica filtro de tipo para lançamentos
        if (filtroTipo && filtroTipo !== 'Todos' && tipo !== filtroTipo) {
          continue;
        }

        // Calcula se pode editar (até 30 dias)
        const diasDiferenca = Math.floor((agora - dataLancamento) / (1000 * 60 * 60 * 24));
        const podeEditar = diasDiferenca <= CONFIG.DIAS_EDICAO;

        // Formata data corretamente
        let dataHoraFormatada = '';
        if (dados[i][1]) {
          if (typeof dados[i][1] === 'object' && dados[i][1] instanceof Date) {
            // Se for objeto Date, formata manualmente
            dataHoraFormatada = Utilities.formatDate(dados[i][1], CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
          } else {
            // Se já for string, usa diretamente
            dataHoraFormatada = dados[i][1].toString();
          }
        }

        lancamentos.push({
          id: dados[i][0],
          dataHora: dataHoraFormatada,
          tipo: tipo,
          categoria: dados[i][3],
          valor: dados[i][4],
          observacao: dados[i][5] || '',
          podeEditar: podeEditar,
          diasAtras: diasDiferenca
        });
      } catch (e) {
        Logger.log('Erro ao processar linha ' + i + ': ' + e.toString());
        // Continua processando as outras linhas
      }
    }

    // Ordena por ID decrescente (mais recente primeiro)
    lancamentos.sort(function(a, b) { return b.id - a.id; });

    const totalGastos = totalGastosFixos + totalGastosVariaveis;
    const saldo = totalReceitas - totalGastos;

    const resultado = {
      lancamentos: lancamentos,
      resumo: {
        receitas: totalReceitas,
        gastosFixos: totalGastosFixos,
        gastosVariaveis: totalGastosVariaveis,
        totalGastos: totalGastos,
        saldo: saldo
      }
    };

    Logger.log('Retornando ' + lancamentos.length + ' lançamentos');
    return resultado;

  } catch (e) {
    Logger.log('ERRO CRÍTICO ao obter dados da consulta: ' + e.toString());
    Logger.log('Stack trace: ' + e.stack);

    // Retorna estrutura vazia em caso de erro
    return {
      lancamentos: [],
      resumo: {
        receitas: 0,
        gastosFixos: 0,
        gastosVariaveis: 0,
        totalGastos: 0,
        saldo: 0
      }
    };
  }
}

/**
 * MANTÉM FUNÇÃO ANTIGA PARA COMPATIBILIDADE (mas não deve ser usada)
 */
function obterLancamentos(filtroTipo) {
  const resultado = obterDadosConsulta(filtroTipo, null, null);
  return resultado.lancamentos;
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
      cor = '#FFFACD'; // Amarelo claro
    } else if (dados.tipo === 'Gasto Fixo') {
      cor = '#F5F5F5'; // Cinza claro
    } else if (dados.tipo === 'Gasto Variável') {
      cor = '#FFFFFF'; // Branco
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
  ui.createMenu('LW Finanças')
    .addItem('Abrir Sistema', 'abrirSistema')
    .addSeparator()
    .addItem('Atualizar Resumo', 'mostrarResumo')
    .addToUi();
}

/**
 * Abre o sistema completo
 */
function abrirSistema() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(900)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, 'LW Finanças');
}

/**
 * Mostra resumo financeiro
 */
function mostrarResumo() {
  const resumo = obterResumo();
  const ui = SpreadsheetApp.getUi();

  const mensagem = `
RESUMO FINANCEIRO

Receitas: R$ ${resumo.receitas.toFixed(2).replace('.', ',')}

Gastos:
  - Fixos: R$ ${resumo.gastosFixos.toFixed(2).replace('.', ',')}
  - Variáveis: R$ ${resumo.gastosVariaveis.toFixed(2).replace('.', ',')}
  - Total: R$ ${resumo.totalGastos.toFixed(2).replace('.', ',')}

Saldo: R$ ${resumo.saldo.toFixed(2).replace('.', ',')}
  `;

  ui.alert('Resumo Financeiro', mensagem, ui.ButtonSet.OK);
}
