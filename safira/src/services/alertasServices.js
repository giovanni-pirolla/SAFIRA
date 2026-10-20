// alertasServices.js
import { supabase } from './supabase';
import { listarDispositivos } from './dispositivosService';

const JANELA_DIAS = 2; // padrão da tela: hoje + ontem
const INTERVALO_AMOSTRAGEM_MS = 30 * 1000; // ~2 leituras por minuto

/**
 * Início da janela, sempre alinhado a um bloco de 30 s.
 * O alinhamento garante que, mesmo com a janela deslizando, a mesma leitura
 * seja escolhida na amostragem (e o alerta mantenha o mesmo data_hora).
 */
function calcularInicioJanela(janelaMinutos) {
  let inicioMs;

  if (janelaMinutos) {
    inicioMs = Date.now() - janelaMinutos * 60 * 1000;
  } else {
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - (JANELA_DIAS - 1));
    inicio.setHours(0, 0, 0, 0);
    inicioMs = inicio.getTime();
  }

  return new Date(Math.floor(inicioMs / INTERVALO_AMOSTRAGEM_MS) * INTERVALO_AMOSTRAGEM_MS);
}

/**
 * Mantém a primeira leitura de cada bloco fixo de 30 s (alinhado ao relógio,
 * e não à primeira leitura da janela).
 */
function amostrarLeituras(leituras) {
  if (!leituras || leituras.length === 0) return [];

  const amostradas = [];
  let ultimoBloco = null;

  for (const leitura of leituras) {
    const bloco = Math.floor(new Date(leitura.data_hora).getTime() / INTERVALO_AMOSTRAGEM_MS);

    if (bloco !== ultimoBloco) {
      amostradas.push(leitura);
      ultimoBloco = bloco;
    }
  }

  return amostradas;
}

function statusSom(valor, limites) {
  if (valor === null || valor === undefined || !limites) return 'normal';

  const { confortavel_ate, desconforto_a_partir } = limites;

  if (
    typeof confortavel_ate !== 'number' ||
    typeof desconforto_a_partir !== 'number' ||
    desconforto_a_partir <= confortavel_ate
  ) {
    // Fallback defensivo: valores inconsistentes no banco (ex: bug de cadastro).
    const limiteSeguro = typeof confortavel_ate === 'number' ? confortavel_ate : 55;
    const descontoFallback = limiteSeguro * 1.27; // proporção equivalente a 55 -> 70

    if (valor >= descontoFallback) return 'perigo';
    if (valor > limiteSeguro) return 'aviso';
    return 'normal';
  }

  if (valor >= desconforto_a_partir) return 'perigo';
  if (valor > confortavel_ate) return 'aviso';
  return 'normal';
}

function statusLuz(valor, limites) {
  if (valor === null || valor === undefined || !limites) return 'normal';

  const { confortavel_de, confortavel_ate } = limites;

  if (typeof confortavel_de !== 'number' || typeof confortavel_ate !== 'number') {
    return 'normal';
  }

  const largura = confortavel_ate - confortavel_de;
  const margem = largura * 0.33;

  const inicioAvisoBaixo = confortavel_de;
  const fimAvisoBaixo = confortavel_de + margem;
  const inicioAvisoAlto = confortavel_ate - margem;
  const fimAvisoAlto = confortavel_ate;

  if (valor < confortavel_de || valor > confortavel_ate) return 'perigo';
  if (valor >= inicioAvisoBaixo && valor < fimAvisoBaixo) return 'aviso';
  if (valor > inicioAvisoAlto && valor <= fimAvisoAlto) return 'aviso';
  return 'normal';
}

function formatarHora(dataHora) {
  return new Date(dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function obterRotuloDia(dataHora) {
  const data = new Date(dataHora);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesmoDia = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (mesmoDia(data, hoje)) return 'Hoje';
  if (mesmoDia(data, ontem)) return 'Ontem';

  return data.toLocaleDateString('pt-BR');
}

function statusDaLeitura(leitura, campo, limites, calcularStatus) {
  const valor = leitura?.[campo];
  if (valor === null || valor === undefined) return null;
  return calcularStatus(Number(valor), limites);
}

function gerarAlertasDeSensor({
  leituras,
  campo,
  limites,
  calcularStatus,
  nomeSensor,
  statusInicial = null,
}) {
  const alertas = [];
  // Status da última leitura anterior à janela: permite detectar a transição
  // logo na primeira leitura da janela.
  let statusAnterior = statusInicial;

  for (const leitura of leituras) {
    const valor = leitura[campo];
    if (valor === null || valor === undefined) continue;

    const statusAtual = calcularStatus(Number(valor), limites);

    if (statusAnterior !== null && statusAtual !== statusAnterior) {
      if (statusAtual === 'perigo') {
        alertas.push({
          tipo: 'perigo',
          titulo: `${nomeSensor} Alto(a)`,
          descricao: `Nível de ${nomeSensor} ultrapassou o Limite Definido.`,
          data_hora: leitura.data_hora,
        });
      } else if (statusAtual === 'aviso') {
        alertas.push({
          tipo: 'aviso',
          titulo: `${nomeSensor} Elevado(a)`,
          descricao: `${nomeSensor} está se aproximando do Limite Definido.`,
          data_hora: leitura.data_hora,
        });
      } else if (statusAtual === 'normal' && (statusAnterior === 'perigo' || statusAnterior === 'aviso')) {
        alertas.push({
          tipo: 'sucesso',
          titulo: `${nomeSensor} Normalizado(a)`,
          descricao: `Nível de ${nomeSensor} voltou para a faixa ideal.`,
          data_hora: leitura.data_hora,
        });
      }
    }

    statusAnterior = statusAtual;
  }

  return alertas;
}

/**
 * @param {{ janelaMinutos?: number }} [opcoes]
 *   Sem janelaMinutos: usa hoje + ontem (tela de Alertas).
 *   Com janelaMinutos: busca apenas os últimos N minutos (monitor de notificações).
 */
export async function buscarAlertas({ janelaMinutos } = {}) {
  const { data: dispositivos, error: erroDispositivos } = await listarDispositivos();

  if (erroDispositivos) {
    return { alertasPorDia: [], error: erroDispositivos };
  }

  const dispositivo = dispositivos?.[0];

  if (!dispositivo) {
    return { alertasPorDia: [], error: null };
  }

  const { data: usuarioAutenticado } = await supabase.auth.getUser();
  const idusuario = usuarioAutenticado?.user?.id;

  if (!idusuario) {
    return { alertasPorDia: [], error: { message: 'Usuário não autenticado.' } };
  }

  const { data: usuarioData, error: erroUsuario } = await supabase
    .from('usuario')
    .select('limites_som, limites_luz')
    .eq('id', idusuario)
    .single();

  if (erroUsuario) {
    return { alertasPorDia: [], error: erroUsuario };
  }

  const limitesSom = usuarioData?.limites_som ?? null;
  const limitesLuz = usuarioData?.limites_luz ?? null;

  const inicioJanela = calcularInicioJanela(janelaMinutos);

  const { data: leituras, error: erroLeituras } = await supabase
    .from('leituradossensores')
    .select('luminosidade, ruidos, data_hora')
    .eq('iddispositivos', dispositivo.iddispositivos)
    .gte('data_hora', inicioJanela.toISOString())
    .order('data_hora', { ascending: true });

  if (erroLeituras) {
    return { alertasPorDia: [], error: erroLeituras };
  }

  // Última leitura antes da janela, usada só como status inicial.
  // Se falhar, segue sem ela (apenas perde a transição da 1ª leitura).
  const { data: anteriores } = await supabase
    .from('leituradossensores')
    .select('luminosidade, ruidos, data_hora')
    .eq('iddispositivos', dispositivo.iddispositivos)
    .lt('data_hora', inicioJanela.toISOString())
    .order('data_hora', { ascending: false })
    .limit(1);

  const leituraBase = anteriores?.[0] ?? null;

  const leiturasAmostradas = amostrarLeituras(leituras ?? []);

  const alertasLuz = gerarAlertasDeSensor({
    leituras: leiturasAmostradas,
    campo: 'luminosidade',
    limites: limitesLuz,
    calcularStatus: statusLuz,
    nomeSensor: 'Luminosidade',
    statusInicial: statusDaLeitura(leituraBase, 'luminosidade', limitesLuz, statusLuz),
  });

  const alertasSom = gerarAlertasDeSensor({
    leituras: leiturasAmostradas,
    campo: 'ruidos',
    limites: limitesSom,
    calcularStatus: statusSom,
    nomeSensor: 'Ruído',
    statusInicial: statusDaLeitura(leituraBase, 'ruidos', limitesSom, statusSom),
  });

  const todosAlertas = [...alertasLuz, ...alertasSom].sort(
    (a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
  );

  const grupos = new Map();

  for (const alerta of todosAlertas) {
    const rotuloDia = obterRotuloDia(alerta.data_hora);

    if (!grupos.has(rotuloDia)) {
      grupos.set(rotuloDia, []);
    }

    grupos.get(rotuloDia).push({
      ...alerta,
      hora: formatarHora(alerta.data_hora),
    });
  }

  const alertasPorDia = Array.from(grupos.entries()).map(([dia, alertas]) => ({
    dia,
    alertas,
  }));

  return { alertasPorDia, error: null };
}