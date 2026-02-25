import conexion_banco from '@/assets/conexion_banco.webp'
import conexion_datos from '@/assets/conexion_datos.webp'
import conexion_socios from '@/assets/conexion_socios.webp'
import gestiona_movimientos from '@/assets/gestiona_movimientos.webp'
import gestiona_flujo_caja from '@/assets/gestiona_flujo_caja.webp'
import gestiona_dashboards from '@/assets/gestiona_dashboards.webp'
import gestiona_reporting from '@/assets/gestiona_reporting.webp'
import optimiza_liquidez from '@/assets/optimiza_liquidez.webp'
import optimiza_escenarios from '@/assets/optimiza_escenarios.webp'
import optimiza_recomendaciones from '@/assets/optimiza_recomendaciones.webp'
import actua_aprobaciones from '@/assets/actua_aprobaciones.webp'
import actua_ordenes from '@/assets/actua_ordenes.webp'
import actua_documentaria from '@/assets/actua_documentaria.webp'

export const soluciones = (t) => [
  {
    pestañas: [
      // 1) CONECTA
      {
        título: t('Conecta'),
        textinfo: t('Más información'),
        icono: 'conecta',
        titleSub: t('Con rapidez'),
        process: 25,
        SubTitle: t('Unifique todo.'),
        resumen: t(
          'Conecta bancos, ERPs y socios en un ecosistema seguro y confiable. Consolida información crítica con APIs seguras y decisiones ágiles desde una sola fuente.'
        ),
        características: [
          'Integración bancaria y ERP',
          'Normalización de datos',
          'Fuente única de verdad',
          'Automatización con IA',
        ],
        slides: [
          {
            title: t('Conexión con Bancos, ERPs y otras fuentes'),
            description: t(
              'Agentes de IA descargan movimientos, saldos y operaciones del ERP de forma automática cada día.'
            ),
            image: conexion_banco,
            alt: 'Conexión con bancos, ERPs y otras fuentes',
            Icono: 'Bank',
            status: true,
          },
          {
            title: t('Enriquecimiento y calidad de datos'),
            description: t(
              'Automatiza la validación y enriquecimiento de datos con fuentes externas para decisiones confiables.'
            ),
            image: conexion_datos,
            alt: 'Enriquecimiento y calidad de datos',
            Icono: 'data',
            status: true,
          },
          {
            title: t('Conexión con socios de negocios'),
            description: t(
              'Integra fintechs e inversionistas para crear soluciones financieras más competitivas.'
            ),
            image: conexion_socios,
            alt: 'Conexión con socios de negocios',
            Icono: 'conexion',
            status: 'beta',
          },
        ],
      },

      // 2) GESTIONA
      {
        título: t('Gestiona'),
        icono: 'gestiona',
        textinfo: t('Más información'),
        process: 50,
        titleSub: t('Con confianza'),
        SubTitle: t('Liquidez confiable.'),
        resumen: t(
          'Visualiza la liquidez en tiempo real y clasifica movimientos con IA. Controla flujos, riesgos y reportes automáticos con dashboards interactivos.'
        ),
        características: [
          'Clasificación inteligente',
          'Flujo de caja en tiempo real',
          'Dashboards avanzados',
          'Reportes automáticos',
        ],
        slides: [
          {
            title: t('Clasificación inteligente de movimientos'),
            description: t(
              'La IA detecta patrones y coincidencias para automatizar conciliaciones y liberar al equipo financiero.'
            ),
            image: gestiona_movimientos,
            alt: 'Clasificación inteligente',
            Icono: 'movement',
            status: true,
          },
          {
            title: t('Flujo de caja real'),
            description: t(
              'Consolida saldos y movimientos bancarios en un visor único, sin depender de hojas de cálculo.'
            ),
            image: gestiona_flujo_caja,
            alt: 'Flujo de caja real',
            Icono: 'caja',
            status: true,
          },
          {
            title: t('Dashboards interactivos y widgets'),
            description: t(
              'Visualiza métricas clave de liquidez, riesgos y operaciones desde paneles personalizables.'
            ),
            image: gestiona_dashboards,
            alt: 'Dashboards y widgets',
            Icono: 'dashboards',
            status: true,
          },
          {
            title: t('Reporting automático'),
            description: t(
              'Genera informes claros y consistentes con un clic, siempre actualizados y listos para auditores.'
            ),
            image: gestiona_reporting,
            alt: 'Reporting financiero',
            Icono: 'reporte',
            status: true,
          },
        ],
      },

      // 3) OPTIMIZA
      {
        título: t('Optimiza'),
        textinfo: t('Más información'),
        icono: 'optimiza',
        process: 75,
        titleSub: t('Tus decisiones'),
        SubTitle: t('Decide con confianza.'),
        resumen: t(
          'Evalúa tasas, plazos y monedas con IA. Construye estrategias financieras eficientes que reducen costos y riesgos.'
        ),
        características: [
          'Proyecciones dinámicas',
          'Escenarios financieros',
          'Optimización costo/riesgo',
          'Motor algorítmico',
        ],
        slides: [
          {
            title: t('Proyecciones de liquidez'),
            description: t(
              'Genera proyecciones ajustadas a escenarios de negocio para tomar decisiones anticipadas.'
            ),
            image: optimiza_liquidez,
            alt: 'Proyecciones de liquidez',
            Icono: 'liquidez',
            status: true,
          },
          {
            title: t('Escenarios'),
            description: t(
              'Crea escenarios optimista, pesimista y realista, comparando impactos en la liquidez en tiempo real.'
            ),
            image: optimiza_escenarios,
            alt: 'Escenarios financieros',
            Icono: 'escenarios',
            status: true,
          },
          {
            title: t('Recomendaciones de costo/riesgo'),
            description: t(
              'La IA sugiere el mejor uso de productos financieros para optimizar costos y minimizar riesgos.'
            ),
            image: optimiza_recomendaciones,
            alt: 'Recomendaciones costo/riesgo',
            Icono: 'costo',
            status: true,
          },
        ],
      },

      // 4) ACTÚA
      {
        título: t('Actúa'),
        icono: 'actua',
        textinfo: t('Más información'),
        process: 100,
        titleSub: t('Con Precisión'),
        SubTitle: t('Ejecución ágil.'),
        resumen: t(
          'Automatiza workflows y aprobaciones. Controla órdenes, documentos y auditorías con trazabilidad completa.'
        ),
        características: [
          'Workflows configurables',
          'Aprobaciones por jerarquía',
          'Automatización de órdenes',
          'Gestión documental',
          'Auditoría completa',
        ],
        slides: [
          {
            title: t('Workflow y aprobaciones'),
            description: t(
              'Configura jerarquías, valida operaciones y aprueba transacciones trazables y seguras.'
            ),
            image: actua_aprobaciones,
            alt: 'Workflow y aprobaciones',
            Icono: 'aprobaciones',
            status: 'beta',
          },
          {
            title: t('Automatización de órdenes'),
            description: t(
              'Envía instrucciones financieras automáticas para préstamos, coberturas o inversiones.'
            ),
            image: actua_ordenes,
            alt: 'Automatización de órdenes',
            Icono: 'automatizaciones',
            status: 'beta',
          },
          {
            title: t('Gestión documental y auditoría'),
            description: t(
              'Centraliza documentos clave y compártelos al instante para auditorías más ágiles.'
            ),
            image: actua_documentaria,
            alt: 'Gestión documental y auditoría',
            Icono: 'documentaria',
            status: true,
          },
        ],
      },
    ],
  },
]
