export type NavLink = {
  id: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { id: 'solucoes', label: 'Soluções' },
  { id: 'agricultura-regenerativa', label: 'Agricultura Regenerativa' },
  { id: 'agrotech', label: 'AgroTech' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'sustentabilidade', label: 'Sustentabilidade' },
  { id: 'contato', label: 'Fale com um Especialista' },
];

export type HeroStage = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
};

export const heroStages: HeroStage[] = [
  {
    eyebrow: 'Ciência aplicada ao campo',
    title: 'Transformar pressão em produtividade.',
    description:
      'Da variabilidade climática à tomada de decisão, conectamos ciência e tecnologia para produzir com mais inteligência, resiliência e eficiência.',
    ctaPrimary: 'Conheça nossas soluções',
    ctaSecondary: 'Explorar a jornada',
  },
  {
    title: 'Quando o campo muda, a tecnologia precisa antecipar.',
    description:
      'Proteção de cultivos, sementes, dados e manejo integrados para uma agricultura mais preparada.',
  },
  {
    title: 'Tecnologia para colher um futuro melhor.',
    description: 'Mais precisão. Mais sustentabilidade. Mais resultado no campo.',
    ctaPrimary: 'Ver como atuamos',
  },
];

export type SolutionCard = {
  title: string;
  description: string;
  image: string;
};

export const solutionCards: SolutionCard[] = [
  {
    title: 'Proteção de cultivos',
    description:
      'Mais precisão no manejo para enfrentar pressão biótica e variabilidade de cenário.',
    image: 'images/solucoes-conectadas/1protecao.jpg',
  },
  {
    title: 'Sementes e performance genética',
    description: 'Potencial produtivo começa na escolha certa.',
    image: 'images/solucoes-conectadas/2sementes.jpg',
  },
  {
    title: 'AgroTech',
    description: 'Dados, previsibilidade e decisão com mais inteligência.',
    image: 'images/solucoes-conectadas/3agrotech.webp',
  },
  {
    title: 'Agricultura regenerativa',
    description:
      'Produtividade com visão de longo prazo sobre solo, biodiversidade e eficiência.',
    image: 'images/solucoes-conectadas/4regenerativa.jpg',
  },
  {
    title: 'Portfólio integrado',
    description: 'Soluções conectadas para desafios reais do produtor.',
    image: 'images/solucoes-conectadas/5portfolio.jpg',
  },
];

export const ecosystemLayers = [
  {
    name: 'solo',
    title: 'Solo vivo',
    description: 'Base de produtividade com estrutura, equilíbrio e conservação.',
  },
  {
    name: 'raiz',
    title: 'Raiz',
    description: 'Estabelecimento e absorção com suporte técnico e genético.',
  },
  {
    name: 'planta',
    title: 'Planta',
    description: 'Proteção e desenvolvimento durante todo o ciclo.',
  },
  {
    name: 'clima',
    title: 'Clima',
    description: 'Leitura de cenário para respostas mais rápidas e consistentes.',
  },
  {
    name: 'dados',
    title: 'Dados',
    description: 'Informação acionável para priorizar o que realmente importa.',
  },
  {
    name: 'decisao',
    title: 'Decisão',
    description: 'Integração de variáveis para produtividade com visão sistêmica.',
  },
];

export const digitalSteps = [
  {
    title: 'Leitura de cenário',
    label: 'Clima e risco',
    description: 'Modelos agronômicos para antecipar pressão e direcionar o manejo.',
  },
  {
    title: 'Priorização de ação',
    label: 'Recomendação de manejo',
    description: 'Recomendações contextualizadas por fase da cultura e objetivo produtivo.',
  },
  {
    title: 'Visão operacional',
    label: 'Status da lavoura por talhão',
    description: 'Monitoramento claro para atuação com mais foco e agilidade.',
  },
  {
    title: 'Eficiência com base em dados',
    label: 'Indicadores de eficiência',
    description: 'Decisões orientadas por performance e consistência operacional.',
  },
];

export const regenerativePillars = [
  'Saúde do solo',
  'Eficiência no uso de recursos',
  'Resiliência produtiva',
  'Biodiversidade e equilíbrio',
  'Longo prazo com resultado',
];

export const portfolioCategories = [
  'Todos',
  'Proteção de cultivos',
  'Sementes',
  'Tratamento de sementes',
  'Soluções integradas',
  'Digital',
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export type PortfolioItem = {
  title: string;
  category: Exclude<PortfolioCategory, 'Todos'>;
  description: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Manejo de pressão biótica',
    category: 'Proteção de cultivos',
    description: 'Estratégias técnicas para manter a lavoura estável em cenários variáveis.',
  },
  {
    title: 'Genética orientada a performance',
    category: 'Sementes',
    description: 'Soluções para potencial produtivo com foco em adaptação regional.',
  },
  {
    title: 'Arranque inicial de alta qualidade',
    category: 'Tratamento de sementes',
    description: 'Proteção desde o início do ciclo com consistência operacional.',
  },
  {
    title: 'Programas integrados por cultura',
    category: 'Soluções integradas',
    description: 'Combinação de soluções para desafios reais e metas de produtividade.',
  },
  {
    title: 'Inteligência aplicada ao campo',
    category: 'Digital',
    description: 'Dados e recomendação para ampliar precisão e velocidade de decisão.',
  },
  {
    title: 'Operação orientada por resultado',
    category: 'Soluções integradas',
    description: 'Planejamento técnico para produtividade com visão de longo prazo.',
  },
];

export type ImpactMetric = {
  value: number;
  suffix: string;
  label: string;
  helper: string;
};

export const impactMetrics: ImpactMetric[] = [
  {
    value: 90,
    suffix: '+',
    label: 'Países com presença global',
    helper: 'Placeholder de protótipo. Substituir por dado oficial no CMS/config.',
  },
  {
    value: 30000,
    suffix: '+',
    label: 'Colaboradores',
    helper: 'Placeholder de protótipo. Substituir por dado oficial no CMS/config.',
  },
  {
    value: 100,
    suffix: '%',
    label: 'Foco em inovação aplicada',
    helper: 'Placeholder conceitual para direção visual da seção.',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Suporte à decisão no ciclo produtivo',
    helper: 'Placeholder conceitual para evolução futura via dados oficiais.',
  },
];

export const credibilityBlocks = [
  {
    axis: 'Pesquisa',
    quote: 'Ciência aplicada com visão prática.',
  },
  {
    axis: 'Campo',
    quote: 'Soluções desenhadas para a realidade da produção.',
  },
  {
    axis: 'Tecnologia',
    quote: 'Inovação conectada à performance e à sustentabilidade.',
  },
];

export const footerColumns = [
  {
    title: 'Soluções',
    links: ['Proteção de cultivos', 'Sementes', 'AgroTech', 'Portfólio integrado'],
  },
  {
    title: 'Empresa',
    links: ['Sobre nós', 'Sustentabilidade', 'Carreiras', 'Imprensa'],
  },
  {
    title: 'Contato',
    links: ['Fale com um especialista', 'Atendimento', 'Redes sociais', 'Políticas'],
  },
];
