/*
  ESTRUTURA DE DADOS DO JOGO

  Este arquivo centraliza todo o conteúdo do jogo. Para editar perguntas, respostas ou pontuações,
  basta modificar este objeto.

  A estrutura é a seguinte:
  - DATA
    - biomes: Array de todos os temas do jogo.
      - Cada BIOMA contém:
        - id, name, desc, emoji, img: Informações básicas do bioma.
        - problems: Array com 4 problemas específicos daquele bioma.
          - Cada PROBLEMA contém:
            - id, name, desc: Informações do problema.
            - solutions: Array com 4 soluções possíveis para o problema.
              - Cada SOLUÇÃO contém:
                - text: O texto da resposta.
                - points: A pontuação que esta resposta vale.
*/
export const DATA = {
  biomes: [
    {
      id: "amazonia", // Identificador único para o bioma.
      name: "Amazônia", // Nome do bioma exibido na UI.
      desc: "Maior floresta tropical do mundo.", // Descrição curta.
      emoji: "🌳", // Emoji que representa o bioma.
      img: "img/amazonia.jpg", // Caminho para a imagem de fundo do bioma.
      problems: [
        {
          id: "amazonia-desmatamento", // ID único para o problema.
          name: "Desmatamento", // Nome do problema.
          desc: "Corte ilegal de árvores para pastagem e agricultura.", // Descrição do problema.
          solutions: [
            {
              text: "Aumentar a fiscalização e aplicar multas severas.", // Texto da solução (resposta).
              points: 40,
            },
            {
              text: "Criar reservas extrativistas para uso sustentável.", // Pontos que esta resposta vale.
              points: 30,
            },
            { text: "Incentivar o ecoturismo na região.", points: 20 },
            {
              text: "Promover projetos de reflorestamento em larga escala.",
              points: 35,
            },
          ],
        },
        {
          id: "amazonia-garimpo",
          name: "Garimpo Ilegal",
          desc: "Extração de minérios que contamina rios com mercúrio.",
          solutions: [
            {
              text: "Utilizar tecnologias de extração sem mercúrio.",
              points: 40,
            },
            {
              text: "Fechar garimpos ilegais e recuperar áreas degradadas.",
              points: 35,
            },
            {
              text: "Oferecer alternativas de renda para garimpeiros.",
              points: 25,
            },
            { text: "Monitorar a qualidade da água dos rios.", points: 15 },
          ],
        },
        {
          id: "amazonia-queimadas",
          name: "Queimadas",
          desc: "Uso de fogo para limpar áreas de plantio que saem de controle.",
          solutions: [
            {
              text: "Equipar e treinar brigadas de incêndio locais.",
              points: 35,
            },
            {
              text: "Proibir o uso de fogo em períodos de seca.",
              points: 40,
            },
            { text: "Criar campanhas de conscientização.", points: 20 },
            {
              text: "Usar satélites para detecção rápida de focos de incêndio.",
              points: 30,
            },
          ],
        },
        {
          id: "amazonia-trafico",
          name: "Tráfico de Animais",
          desc: "Captura e venda ilegal de animais silvestres.",
          solutions: [
            { text: "Aumentar a fiscalização nas fronteiras.", points: 35 },
            { text: "Endurecer as leis contra o tráfico.", points: 40 },
            { text: "Criar centros de reabilitação de animais.", points: 25 },
            { text: "Não comprar animais silvestres.", points: 15 },
          ],
        },
      ],
    },
    {
      id: "cerrado",
      name: "Cerrado",
      desc: "Savanas brasileiras ricas em biodiversidade.",
      emoji: "🌾",
      img: "img/cerrado.jpg",
      problems: [
        {
          id: "cerrado-agropecuaria",
          name: "Expansão da Agropecuária",
          desc: "Conversão de áreas nativas para soja e gado.",
          solutions: [
            {
              text: "Incentivar a técnica de plantio direto na palha.",
              points: 30,
            },
            {
              text: "Demarcar e proteger áreas de conservação.",
              points: 40,
            },
            {
              text: "Promover a rotação de culturas para proteger o solo.",
              points: 25,
            },
            {
              text: "Criar selos para produtos de agricultura sustentável.",
              points: 20,
            },
          ],
        },
        {
          id: "cerrado-incendios",
          name: "Incêndios Frequentes",
          desc: "Queimadas descontroladas que ameaçam a flora e a fauna.",
          solutions: [
            {
              text: "Manter aceiros (faixas sem vegetação) em fazendas.",
              points: 35,
            },
            {
              text: "Proibir queimadas controladas em épocas de risco.",
              points: 40,
            },
            {
              text: "Educar a população sobre os perigos do fogo.",
              points: 20,
            },
            { text: "Monitorar focos de calor via satélite.", points: 30 },
          ],
        },
        {
          id: "cerrado-agua",
          name: "Crise Hídrica",
          desc: "O desmatamento afeta nascentes de rios importantes.",
          solutions: [
            { text: "Recuperar e proteger as matas ciliares.", points: 40 },
            {
              text: "Incentivar o uso racional da água na irrigação.",
              points: 30,
            },
            {
              text: "Implementar sistemas de captação de água da chuva.",
              points: 25,
            },
            {
              text: "Fiscalizar o uso de agrotóxicos perto de rios.",
              points: 20,
            },
          ],
        },
        {
          id: "cerrado-extrativismo",
          name: "Extrativismo Predatório",
          desc: "Coleta excessiva de plantas nativas sem manejo adequado.",
          solutions: [
            {
              text: "Apoiar cooperativas de extrativismo sustentável.",
              points: 35,
            },
            { text: "Mapear e fiscalizar áreas de coleta.", points: 30 },
            {
              text: "Criar viveiros para mudas de plantas nativas.",
              points: 25,
            },
            {
              text: "Valorizar produtos locais como pequi e baru.",
              points: 20,
            },
          ],
        },
      ],
    },
    {
      id: "caatinga",
      name: "Caatinga",
      desc: "Bioma semiárido com espécies adaptadas à seca.",
      emoji: "🌵",
      img: "img/caatinga.jpg",
      problems: [
        {
          id: "caatinga-desertificacao",
          name: "Desertificação",
          desc: "Degradação do solo que o torna improdutivo.",
          solutions: [
            {
              text: "Implementar sistemas agroflorestais adaptados.",
              points: 40,
            },
            { text: "Construir barreiras para conter a areia.", points: 30 },
            {
              text: "Plantar espécies nativas resistentes à seca.",
              points: 35,
            },
            { text: "Evitar o superpastoreio de gado.", points: 25 },
          ],
        },
        {
          id: "caatinga-corte",
          name: "Corte da Vegetação",
          desc: "Uso da lenha como fonte de energia para indústrias.",
          solutions: [
            {
              text: "Incentivar o uso de energia solar e eólica.",
              points: 40,
            },
            { text: "Promover o manejo florestal sustentável.", points: 35 },
            {
              text: "Fiscalizar olarias e padarias que usam lenha ilegal.",
              points: 30,
            },
            {
              text: "Distribuir fogões ecológicos para a população.",
              points: 20,
            },
          ],
        },
        {
          id: "caatinga-seca",
          name: "Escassez de Água",
          desc: "Longos períodos de seca e falta de infraestrutura hídrica.",
          solutions: [
            {
              text: "Construir cisternas para captar água da chuva.",
              points: 40,
            },
            { text: "Revitalizar rios e nascentes.", points: 35 },
            { text: "Implantar sistemas de reuso de água.", points: 25 },
            {
              text: "Perfurar poços artesianos de forma planejada.",
              points: 20,
            },
          ],
        },
        {
          id: "caatinga-caca",
          name: "Caça Predatória",
          desc: "Caça ilegal de animais para consumo ou venda.",
          solutions: [
            {
              text: "Intensificar a fiscalização por guardas florestais.",
              points: 35,
            },
            {
              text: "Criar programas de educação ambiental nas escolas.",
              points: 30,
            },
            { text: "Aumentar a área de parques de conservação.", points: 40 },
            { text: "Promover o turismo de observação de aves.", points: 20 },
          ],
        },
      ],
    },
    {
      id: "pantanal",
      name: "Pantanal",
      desc: "Maior planície alagável do planeta.",
      emoji: "🦜",
      img: "img/pantanal.jpg",
      problems: [
        {
          id: "pantanal-queimadas",
          name: "Queimadas",
          desc: "Fogo para renovar pastagens que sai de controle.",
          solutions: [
            {
              text: "Proibir o uso de fogo para manejo de pasto.",
              points: 40,
            },
            {
              text: "Criar e treinar brigadas de incêndio pantaneiras.",
              points: 35,
            },
            { text: "Usar drones para monitoramento de focos.", points: 30 },
            {
              text: "Restaurar áreas queimadas com espécies nativas.",
              points: 25,
            },
          ],
        },
        {
          id: "pantanal-pesca",
          name: "Pesca Predatória",
          desc: "Pesca ilegal que ameaça a sobrevivência das espécies.",
          solutions: [
            {
              text: "Respeitar o período da Piracema (reprodução dos peixes).",
              points: 40,
            },
            { text: "Aumentar a fiscalização nos rios.", points: 35 },
            {
              text: "Incentivar a pesca esportiva (pesque e solte).",
              points: 25,
            },
            {
              text: "Definir tamanhos mínimos para a captura de peixes.",
              points: 20,
            },
          ],
        },
        {
          id: "pantanal-assoreamento",
          name: "Assoreamento dos Rios",
          desc: "Sedimentos do desmatamento no planalto chegam aos rios.",
          solutions: [
            {
              text: "Recuperar nascentes e matas ciliares no planalto.",
              points: 40,
            },
            {
              text: "Fiscalizar o uso do solo na bacia do Alto Paraguai.",
              points: 35,
            },
            { text: "Implementar curvas de nível na agricultura.", points: 25 },
            { text: "Monitorar a turbidez da água.", points: 15 },
          ],
        },
        {
          id: "pantanal-turismo",
          name: "Turismo Desordenado",
          desc: "Turismo sem planejamento que pode prejudicar a fauna.",
          solutions: [
            { text: "Criar regras para observação de animais.", points: 30 },
            { text: "Certificar hotéis e pousadas sustentáveis.", points: 35 },
            {
              text: "Limitar o número de visitantes em áreas sensíveis.",
              points: 25,
            },
            { text: "Treinar guias turísticos locais.", points: 20 },
          ],
        },
      ],
    },
    {
      id: "mata",
      name: "Mata Atlântica",
      desc: "Bioma costeiro muito ameaçado.",
      emoji: "🌲",
      img: "img/mata.jpg",
      problems: [
        {
          id: "mata-urbanizacao",
          name: "Urbanização Desordenada",
          desc: "Crescimento de cidades sobre áreas de floresta.",
          solutions: [
            {
              text: "Criar e fiscalizar planos diretores municipais.",
              points: 40,
            },
            {
              text: "Estabelecer corredores ecológicos entre fragmentos.",
              points: 35,
            },
            { text: "Incentivar a criação de parques urbanos.", points: 25 },
            {
              text: "Não construir em áreas de encosta ou mananciais.",
              points: 30,
            },
          ],
        },
        {
          id: "mata-poluicao",
          name: "Poluição de Rios",
          desc: "Despejo de esgoto e lixo em rios que cortam a mata.",
          solutions: [
            {
              text: "Investir em saneamento básico e tratamento de esgoto.",
              points: 40,
            },
            { text: "Recuperar as matas nas margens dos rios.", points: 35 },
            { text: "Realizar mutirões de limpeza de rios.", points: 20 },
            {
              text: "Fiscalizar indústrias para que tratem seus efluentes.",
              points: 30,
            },
          ],
        },
        {
          id: "mata-fragmentacao",
          name: "Fragmentação",
          desc: "Florestas isoladas em pequenas 'ilhas', dificultando a vida animal.",
          solutions: [
            {
              text: "Criar corredores ecológicos ligando os fragmentos.",
              points: 40,
            },
            {
              text: "Plantar árvores em áreas de pastagem abandonadas.",
              points: 30,
            },
            { text: "Construir passagens de fauna em rodovias.", points: 25 },
            {
              text: "Apoiar proprietários que mantêm reservas legais.",
              points: 35,
            },
          ],
        },
        {
          id: "mata-especies",
          name: "Espécies Exóticas",
          desc: "Plantas e animais invasores que competem com espécies nativas.",
          solutions: [
            { text: "Erradicar espécies invasoras como o pinus.", points: 35 },
            { text: "Controlar a população de saguis e micos.", points: 30 },
            {
              text: "Nunca soltar animais de estimação na natureza.",
              points: 20,
            },
            {
              text: "Priorizar o plantio de mudas nativas em projetos.",
              points: 40,
            },
          ],
        },
      ],
    },
    {
      id: "pampa",
      name: "Pampa",
      desc: "Campos do sul com rica fauna e flora.",
      emoji: "🐄",
      img: "img/pampa.jpg",
      problems: [
        {
          id: "pampa-arenizacao",
          name: "Arenização",
          desc: "Formação de bancos de areia pela degradação do solo.",
          solutions: [
            { text: "Evitar o sobrepastoreio do gado.", points: 40 },
            { text: "Fazer rotação de pastagens.", points: 35 },
            {
              text: "Recuperar a vegetação nativa em áreas degradadas.",
              points: 30,
            },
            { text: "Usar técnicas de plantio direto.", points: 25 },
          ],
        },
        {
          id: "pampa-monocultura",
          name: "Monocultura",
          desc: "Plantio extensivo de uma só espécie, como a soja.",
          solutions: [
            {
              text: "Incentivar a pecuária sustentável em pastagens nativas.",
              points: 40,
            },
            { text: "Promover a diversificação de culturas.", points: 30 },
            {
              text: "Respeitar as áreas de preservação permanente.",
              points: 35,
            },
            { text: "Evitar o uso excessivo de agrotóxicos.", points: 20 },
          ],
        },
        {
          id: "pampa-silvicultura",
          name: "Silvicultura",
          desc: "Substituição de campos nativos por florestas de pinus e eucalipto.",
          solutions: [
            {
              text: "Mapear e proteger áreas prioritárias do Pampa.",
              points: 40,
            },
            {
              text: "Criar um selo para 'Carne do Pampa' sustentável.",
              points: 35,
            },
            {
              text: "Limitar a expansão da silvicultura em áreas nativas.",
              points: 30,
            },
            { text: "Valorizar o turismo rural nos campos.", points: 20 },
          ],
        },
        {
          id: "pampa-agua",
          name: "Contaminação da Água",
          desc: "Agrotóxicos da lavoura de arroz contaminam rios e banhados.",
          solutions: [
            { text: "Fiscalizar e limitar o uso de agrotóxicos.", points: 35 },
            { text: "Incentivar o plantio de arroz orgânico.", points: 40 },
            {
              text: "Proteger as áreas de banhado, que são filtros naturais.",
              points: 30,
            },
            {
              text: "Monitorar a qualidade da água do Aquífero Guarani.",
              points: 25,
            },
          ],
        },
      ],
    },
  ],
};
