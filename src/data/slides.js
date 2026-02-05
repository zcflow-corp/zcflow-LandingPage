import img1 from '@/assets/section_zcflow_1.svg';
import img2 from '@/assets/section_zcflow_2.svg';
import img3 from '@/assets/section_zcflow_3.svg';


export const getSlides = (t) => [
  {
    title: t('IA predictiva'),
    description: t('Agentes de IA que anticipan escenarios, reducen riesgos y optimizan costos'),
    image: img1,
    alt: 'Conectores y tablero',
    Icono: 'automatizaciones',
    hasFlow: true,
    id: 1,
  },
  {
    title: t('Integración total'),
    description: t(
      'ZCFlow conecta tu ecosistema financiero y ERPs en una plataforma 100% data driven'
    ),
    image: img2,
    alt: 'Paneles de ZCflow con gráficos',
    Icono: 'conexion',
    hasFlow: true,
    id: 2,
  },

  {
    title: t('Decisiones precisas'),
    description: t('De hojas de cálculo a decisiones confiables y asistidas desde un solo lugar'),
    image: img3,
    alt: 'Proyecciones con IA',
    Icono: 'reporte',
    hasFlow: true,
    id: 3,
  },
]
