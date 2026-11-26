// Contenido educativo organizado de menor a mayor complejidad.
window.GAME_LEVELS = [
  {
    word: "Autor",
    difficulty: "Muy fácil",
    attempts: 6,
    clue: "Persona que crea una obra original, como un programa, un texto o una ilustración.",
    definition: "Es la persona física que crea una obra original. La autoría identifica quién realizó la creación; no debe confundirse con quién posee los derechos patrimoniales sobre ella.",
    importance: "En un proyecto de software permite reconocer a quienes contribuyeron con código, documentación o recursos creativos, y aclarar las condiciones de uso de cada aporte.",
    tip: "Crear una obra y ser titular de todos sus derechos no siempre son lo mismo."
  },
  {
    word: "Copyright",
    difficulty: "Fácil",
    attempts: 6,
    clue: "Término usado internacionalmente para referirse al conjunto de derechos que protege una obra expresada.",
    definition: "Es el término anglosajón para el sistema de derechos de autor. Protege obras originales —incluido el código fuente como expresión—; no concede propiedad sobre las ideas, métodos o funciones en abstracto.",
    importance: "Ayuda a identificar las condiciones legales para copiar, distribuir o adaptar código y otros materiales, especialmente al colaborar con equipos o repositorios internacionales.",
    tip: "El derecho de autor protege la forma expresada de una idea, no la idea abstracta."
  },
  {
    word: "Patente",
    difficulty: "Fácil",
    attempts: 6,
    clue: "Título legal que puede conceder exclusividad temporal sobre una invención que cumple requisitos establecidos.",
    definition: "Es un derecho exclusivo temporal otorgado por una autoridad para una invención que satisface requisitos legales, como novedad, actividad inventiva y aplicación industrial. Su alcance y elegibilidad dependen de la jurisdicción; las ideas abstractas y el software como tal no son patentables en todos los países.",
    importance: "Al desarrollar una solución técnica novedosa, conviene investigar si podría involucrar una invención patentada y conocer los requisitos del país antes de divulgarla o implementarla.",
    tip: "La protección de una patente no es automática y depende de la ley aplicable."
  },
  {
    word: "Licencia",
    difficulty: "Intermedia",
    attempts: 6,
    clue: "Acuerdo que establece qué usos se permiten sobre una obra o programa y bajo qué condiciones.",
    definition: "Es una autorización del titular de derechos que define permisos, obligaciones y límites para usar una obra. Puede permitir, por ejemplo, ejecutar, copiar, modificar o distribuir software, según sus términos.",
    importance: "Antes de incorporar una biblioteca o publicar una aplicación, el equipo debe revisar las licencias para cumplir sus condiciones y comunicar con claridad los permisos que ofrece.",
    tip: "Tener acceso a un archivo no significa tener permiso para cualquier uso."
  },
  {
    word: "Marca registrada",
    difficulty: "Intermedia",
    attempts: 6,
    clue: "Signo protegido que permite distinguir los productos o servicios de una organización frente a otros.",
    definition: "Es un signo distintivo —por ejemplo, un nombre, logotipo o combinación— cuyo registro puede dar a su titular derechos de uso exclusivo para determinados productos o servicios y territorio, conforme a la legislación aplicable.",
    importance: "Al lanzar una aplicación o empresa tecnológica, revisar nombres y signos distintivos ayuda a evitar confusión con otras marcas y a proteger la identidad del producto.",
    tip: "El registro de una marca se vincula a ciertos productos o servicios y a una jurisdicción."
  },
  {
    word: "Derechos de autor",
    difficulty: "Intermedia",
    attempts: 6,
    clue: "Derechos que nacen sobre una obra original y reconocen facultades a quien la crea o a quien sea titular.",
    definition: "En México, el derecho de autor protege obras literarias y artísticas originales, incluido el software. Comprende derechos morales —como el reconocimiento de autoría— y patrimoniales, relacionados con la explotación de la obra; su alcance y excepciones se rigen por la ley.",
    importance: "Permite comprender quién puede autorizar la copia, modificación o distribución de código, y por qué las aportaciones de estudiantes o equipos deben atribuirse y licenciarse correctamente.",
    tip: "Los derechos morales y los patrimoniales cumplen funciones distintas."
  },
  {
    word: "Software libre",
    difficulty: "Difícil",
    attempts: 6,
    clue: "Modelo que garantiza libertades para ejecutar, estudiar, modificar y compartir un programa, sujeto a su licencia.",
    definition: "Es software cuya licencia respeta las cuatro libertades esenciales: ejecutar el programa para cualquier propósito, estudiar y modificarlo, y redistribuir copias y versiones modificadas. El acceso al código fuente es necesario para ejercer las libertades de estudio y modificación; puede venderse.",
    importance: "Facilita aprender de implementaciones existentes y colaborar en proyectos, siempre que se respeten las obligaciones de la licencia elegida.",
    tip: "Libre se refiere a libertades de uso; no significa necesariamente gratuito."
  },
  {
    word: "Código abierto",
    difficulty: "Difícil",
    attempts: 5,
    clue: "Enfoque de desarrollo y distribución que permite acceder al código fuente bajo una licencia con condiciones específicas.",
    definition: "El código abierto describe software distribuido con licencias que permiten acceder, usar, modificar y redistribuir el código conforme a sus términos. Se solapa ampliamente con el software libre, aunque cada movimiento enfatiza valores y objetivos diferentes.",
    importance: "Permite inspeccionar dependencias, colaborar en mejoras y reutilizar componentes; el equipo debe verificar la licencia en vez de asumir que el código visible puede usarse sin condiciones.",
    tip: "Que el código sea visible no elimina las condiciones de su licencia."
  },
  {
    word: "Propiedad industrial",
    difficulty: "Muy difícil",
    attempts: 5,
    clue: "Rama de la propiedad intelectual que incluye figuras como patentes, marcas y diseños industriales.",
    definition: "Es una rama de la propiedad intelectual que protege, según la legislación aplicable, creaciones e identificadores vinculados con la industria y el comercio, como invenciones, marcas y diseños industriales. No es lo mismo que el derecho de autor, que protege obras literarias y artísticas.",
    importance: "Ayuda a distinguir cómo pueden protegerse una innovación técnica, el nombre de una aplicación y su código, que pueden corresponder a figuras jurídicas diferentes.",
    tip: "Una misma solución tecnológica puede involucrar más de una figura de protección."
  },
  {
    word: "Propiedad intelectual",
    difficulty: "Experto",
    attempts: 5,
    clue: "Marco general de derechos que protege ciertas creaciones de la mente y signos distintivos, conforme a la ley.",
    definition: "Es el conjunto de derechos reconocidos por la legislación sobre determinadas creaciones y signos. Abarca, entre otras áreas, el derecho de autor y la propiedad industrial. No convierte toda idea, dato o conocimiento en propiedad exclusiva: la protección depende de la figura jurídica y sus requisitos.",
    importance: "En ingeniería en computación permite tomar decisiones informadas al crear software, elegir dependencias, compartir código, diseñar productos y proteger innovaciones e identidad tecnológica.",
    tip: "Identifica qué elemento se quiere proteger: obra, invención o signo distintivo."
  }
];
