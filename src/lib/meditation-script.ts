const POSITIVE_SENTIMENTS = new Set([
  "esperança",
  "desejo de superação",
  "gratidão",
  "alegria",
  "amor",
  "confiança",
  "coragem",
  "otimismo",
  "determinação",
  "fé",
  "resiliência",
  "força",
  "motivação",
  "entusiasmo",
  "paz",
]);

const EXCLUDED_BODY_TERMS = [/plexo solar/i, /chakra/i, /chakras/i];

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function lowerFirst(text: string): string {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : "";
}

function stripLeadingArticles(text: string): string {
  return normalizeText(text).replace(/^(o|a|os|as)\s+/i, "").trim();
}

function simplifyBlockName(name: string): string {
  return stripLeadingArticles(name);
}

function isNegativeSentiment(sentiment: string): boolean {
  return !POSITIVE_SENTIMENTS.has(normalizeText(sentiment).toLowerCase());
}

function buildPainReference(text: string, fallback = "feridas de origem"): string {
  const cleanedBase = stripLeadingArticles(text) || fallback;
  const cleaned = lowerFirst(cleanedBase);

  if (/^(crença|dor|ferida|escassez|vergonha|insegurança|frustração|culpa|raiva|tristeza|ansiedade|rejeição|indignidade|humilhação|dependência|autossabotagem|impotência|energia)/i.test(cleaned)) {
    return `da ${cleaned}`;
  }

  if (/^(crenças|dores|feridas|emoções|memórias)/i.test(cleaned)) {
    return `das ${cleaned}`;
  }

  if (/^(bloqueio|medo|trauma|peso|ciclo|sentimento|padrão)/i.test(cleaned)) {
    return `do ${cleaned}`;
  }

  if (/^(bloqueios|traumas|padrões|sentimentos)/i.test(cleaned)) {
    return `dos ${cleaned}`;
  }

  return `de ${cleaned}`;
}

function buildBlockReference(block: string): string {
  const cleaned = lowerFirst(simplifyBlockName(block));

  if (!cleaned) return "essa dor";
  if (/^(crença|ferida|dor|energia|emoção)/i.test(cleaned)) return `a ${cleaned}`;
  if (/^(crenças|feridas|dores|emoções)/i.test(cleaned)) return `as ${cleaned}`;
  if (/^(bloqueio|ciclo|medo|trauma|padrão|sentimento)/i.test(cleaned)) return `o ${cleaned}`;
  if (/^(bloqueios|traumas|padrões|sentimentos)/i.test(cleaned)) return `os ${cleaned}`;

  return cleaned;
}

function extractCoreWound(rootWound: string): string {
  // Extract just the core wound name, not the full description
  const match = rootWound.match(/^([^,.:;]+)/);
  const core = normalizeText(match?.[1] || rootWound).toLowerCase();
  // Limit to first ~6 words max to keep it concise
  const words = core.split(" ");
  return words.length > 6 ? words.slice(0, 6).join(" ") : core;
}

function mapPositiveState(emotion: string): string {
  const normalized = normalizeText(emotion).toLowerCase();

  const positiveMap: Record<string, string> = {
    vergonha: "orgulho de ser quem eu sou",
    medo: "coragem e confiança plena",
    ansiedade: "calma e serenidade profunda",
    culpa: "perdão e leveza",
    raiva: "paz e aceitação",
    tristeza: "alegria genuína",
    insegurança: "certeza do meu valor",
    rejeição: "acolhimento e pertencimento",
    abandono: "segurança e acolhimento",
    indignidade: "dignidade e merecimento",
    humilhação: "respeito próprio e honra",
    dependência: "autonomia e liberdade",
    autossabotagem: "confiança e prosperidade natural",
    impotência: "poder pessoal restaurado",
    escassez: "abundância e prosperidade plena",
    frustração: "realização e plenitude",
    peso: "leveza e liberdade",
    tensão: "fluidez e relaxamento profundo",
    rigidez: "flexibilidade e entrega",
    dor: "alívio e restauração",
    sufocamento: "respiração livre e expansão",
    aperto: "abertura e acolhimento interno",
    "falta de suporte": "sustentação e segurança interna",
    sobrecarga: "equilíbrio e leveza",
    desamparo: "amparo e proteção",
    solidão: "conexão e presença",
  };

  return Object.entries(positiveMap).find(([key]) => normalized.includes(key))?.[1] || "paz e restauração completa";
}

function buildSomaticCutPhrase(organ: string, emotion: string): string {
  const cleanEmotion = normalizeText(emotion.split(",")[0] || "").toLowerCase();
  if (cleanEmotion) {
    return `${cleanEmotion} em ${organ.toLowerCase()}`;
  }
  return `tensão em ${organ.toLowerCase()}`;
}

export function generateMeditationScript(dr: any): string {
  const blocks = (dr?.blocks || []).map((block: any) => normalizeText(block?.name)).filter(Boolean);
  const sentiments = (dr?.predominant_sentiments || []).map((sentiment: any) => normalizeText(sentiment?.name)).filter(Boolean);
  const rootWoundRaw = normalizeText(dr?.root_wound) || "feridas de origem";
  const rootWoundCore = extractCoreWound(rootWoundRaw);
  const somatizationMap = dr?.somatization_map || [];

  const bodyParts = somatizationMap
    .map((item: any) => ({
      organ: normalizeText(item?.organ_or_area || item?.body_region),
      emotion: normalizeText(item?.emotion),
    }))
    .filter((part: { organ: string }) => part.organ && !EXCLUDED_BODY_TERMS.some((pattern) => pattern.test(part.organ)));

  const uniqueOrgans = Array.from(
    new Map(bodyParts.map((part: { organ: string }) => [part.organ.toLowerCase(), part.organ.toLowerCase()])).values(),
  );

  const woundSentiments = Array.from(
    new Set(sentiments.filter(isNegativeSentiment).map((sentiment) => sentiment.toLowerCase())),
  );

  const organRelax = uniqueOrgans.length > 0 ? uniqueOrgans.join(", ") : "coração, pulmões, estômago e intestinos";
  const somatCutPhrases = bodyParts.length > 0
    ? bodyParts.map((part: { organ: string; emotion: string }) => buildSomaticCutPhrase(part.organ, part.emotion)).join(", ")
    : "desconfortos, tensões e dores acumuladas no corpo";

  const negativeFeelings = woundSentiments.length > 0 ? woundSentiments : ["dor guardada"];
  const blockList = blocks.length > 0 ? blocks : ["dores do passado"];

  // Deduplicate activation phrases by tracking used positive states
  const usedPositiveStates = new Set<string>();
  const activationPhrases = bodyParts.length > 0
    ? bodyParts
        .map((part: { organ: string; emotion: string }) => {
          const mainEmotion = normalizeText(part.emotion.split(",")[0] || "dor").toLowerCase();
          const positiveState = mapPositiveState(mainEmotion);
          // Skip if we already used this exact positive state to avoid repetition
          if (usedPositiveStates.has(positiveState)) return null;
          usedPositiveStates.add(positiveState);
          return `Onde havia ${mainEmotion} em ${part.organ.toLowerCase()}, agora sinto ${positiveState}.`;
        })
        .filter(Boolean)
        .join("\n")
    : [
        "Onde havia dor, agora sinto alívio e restauração.",
        "Onde havia medo, agora sinto coragem e confiança.",
        "Onde havia peso, agora sinto leveza e liberdade.",
      ].join("\n");

  // Merge blocks + sentiments into combined validation paragraphs
  // Each block is paired with a sentiment; extras are appended
  const combinedValidation: string[] = [];
  const maxLen = Math.max(blockList.length, negativeFeelings.length);
  for (let i = 0; i < maxLen; i++) {
    const block = blockList[i];
    const sentiment = negativeFeelings[i];
    if (block && sentiment) {
      combinedValidation.push(
        `Eu me conecto com ${buildBlockReference(block)} e reconheço a dor que isso deixou em mim. Eu acolho e valido a dor da ${sentiment} e entendo que o que eu sentia era a verdade que eu entendia sobre ela naquele momento. Hoje eu não preciso mais ver dessa forma. Eu solto todo o julgamento sobre esse sentimento.`
      );
    } else if (block) {
      combinedValidation.push(
        `Eu me conecto com ${buildBlockReference(block)} e reconheço a dor que isso deixou em mim. Eu solto todo o julgamento sobre essa dor.`
      );
    } else if (sentiment) {
      combinedValidation.push(
        `Eu acolho e valido a dor da ${sentiment} e entendo que o que eu sentia era a verdade que eu entendia sobre ela naquele momento. Hoje eu não preciso mais ver dessa forma. Eu solto todo o julgamento sobre esse sentimento.`
      );
    }
  }

  const rootPainReference = buildPainReference(rootWoundCore);

  const relaxamento = `Querido(a) (diga seu nome), eu agora me conecto com meu subconsciente e com o meu corpo, e agora em um estado profundo de paz eu relaxo totalmente cada parte do meu ser.\n\nEu falo com cada parte de mim que viveu em estado de alerta. Meu subconsciente se acalma agora. Minha mente se acalma agora. Meu corpo se acalma agora. Coração pode relaxar é seguro, pulmões pode relaxar agora estamos seguros, todo comando agora é seguro e para nosso bem. Todos os muros que meu subconsciente levantou caem agora, nós estamos seguros e podemos confiar. Eu solto as defesas, tiro o peso dos ombros e permito que todo o meu corpo relaxe.\n\nMeus órgãos, que trabalharam tanto, recebem esse descanso agora. ${organRelax} podem relaxar agora. Eu estou seguro(a) e não preciso mais lutar contra nada.`;

  const validacao = `Agora eu me conectou com todas as crenças que me limitam.\n\n${combinedValidation.join("\n\n")}\n\nEnquanto olho para essas lembranças, sinto que essa energia pesada já começa a se descolar de mim. Eu reconheço onde essa dor se instalou no meu corpo e dou permissão para que ela comece a se dissolver agora.`;

  const limpeza = `Tudo o que eu esteja inconscientemente ativando no meu corpo para manter viva a dor ${rootPainReference}, como ${somatCutPhrases}, travando minha prosperidade e o meu crescimento, eu corto, desligo e cancelo agora instantaneamente.\n\nAgora, em cima de mim, surge uma bola de luz perolada. Esta luz é a energia da criação, que tem o poder de criar e desfazer qualquer coisa nesse universo. Ela começa a descer pelo meu corpo, limpando todo sentimento de ${negativeFeelings.join(" e ")}, dissolvendo todo bloqueio que esteja me impedindo de viver plenamente. Essa luz passa por cada órgão, cada nervo e cada parte do meu corpo, desintegrando tudo o que não me pertence. Sinto a limpeza em ${organRelax} e em toda a minha estrutura. Tudo o que estava travado agora se dissolve nessa luz.`;

  const ativacao = `${activationPhrases}\n\nEu mando no meu corpo. Sou digno(a) de receber o melhor da vida agora. O sucesso já está vindo. A cura já aconteceu. Cada célula minha vibra nessa nova frequência. Eu ocupo o meu lugar com segurança e alegria.`;

  const gratidao = `Agradeço ao meu corpo por ser tão forte e por me trazer de volta para casa. Obrigado(a) a cada órgão meu por trabalhar com tanto amor. Aos meus pais, gratidão pela vida, e deixo eles seguirem o caminho deles enquanto sigo o meu.\n\nObrigado(a) a cada pessoa que passou pela minha vida, porque tudo me trouxe até essa paz de agora. Meu corpo vibra saúde, meu sangue corre limpo e meu coração bate calmo. Tudo o que foi dito já é verdade. Está feito. Está selado. A paz é total. Vou dormir agora com a certeza de que estou seguro(a). Tudo está bem.`;

  return `${relaxamento}\n\n${validacao}\n\n${limpeza}\n\n${ativacao}\n\n${gratidao}`;
}
