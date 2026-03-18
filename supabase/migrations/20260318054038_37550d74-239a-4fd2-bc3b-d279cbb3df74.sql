
UPDATE diagnoses
SET diagnosis_result = diagnosis_result || '{
  "somatization_map": [
    {
      "body_region": "peito",
      "organ_or_area": "Coração e Pulmões",
      "emotion": "Vergonha, Indignidade, Medo de Receber",
      "description": "A vivência de pedir esmola e a escassez extrema na infância instalaram no peito uma sensação de aperto e dificuldade em respirar plenamente. O coração carrega a dor da humilhação e da indignidade, criando uma barreira energética que impede que você receba abundância com naturalidade. Os pulmões operam em ritmo superficial, como se respirar fundo fosse um luxo que alguém com sua história não merece.",
      "intensity": 88
    },
    {
      "body_region": "estomago",
      "organ_or_area": "Estômago e Plexo Solar",
      "emotion": "Ansiedade Financeira, Insegurança, Autossabotagem",
      "description": "A ansiedade crônica gerada pela instabilidade financeira e o medo constante de voltar à escassez se instalam no plexo solar e estômago. Essa região somatiza a dificuldade em digerir a prosperidade quando ela chega, gerando gastrite nervosa, nó no estômago e a sensação de que algo vai dar errado sempre que o dinheiro aparece. O sistema digestivo reflete a incapacidade de processar e reter abundância.",
      "intensity": 82
    },
    {
      "body_region": "ombros",
      "organ_or_area": "Ombros e Trapézio",
      "emotion": "Peso Emocional, Responsabilidade Excessiva, Falta de Suporte Paterno",
      "description": "A ausência do pai e a necessidade de se sustentar desde cedo criaram uma tensão crônica nos ombros. Você carrega o peso de ter que provar seu valor sozinho, sem reconhecimento paterno. Os ombros rígidos e doloridos são a somatização da crença de que tudo depende exclusivamente de você, e que pedir ajuda ou receber apoio é sinal de fraqueza.",
      "intensity": 78
    },
    {
      "body_region": "garganta",
      "organ_or_area": "Tireoide e Cordas Vocais",
      "emotion": "Voz Reprimida, Dificuldade em Cobrar Valor",
      "description": "A dificuldade em cobrar o valor justo pelo seu trabalho e em vender seus projetos se manifesta na garganta. A tireoide, centro do metabolismo e da expressão, pode estar desregulada pela energia contida de quem aprendeu que pedir é humilhante. O nó na garganta aparece sempre que você precisa se posicionar financeiramente, ecoando a vergonha de ter pedido esmola na infância.",
      "intensity": 75
    }
  ]
}'::jsonb
WHERE id = '2fa7e785-4a44-49dc-ae72-ad16bc1c0770';
