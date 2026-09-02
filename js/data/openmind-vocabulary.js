// OpenMind — banco inicial de vocabulário técnico (conteúdo de fábrica).
// Só semeia o Firestore uma vez (ver js/vocabulary-service.js).

window.OPENMIND_VOCABULARY = [
    { id: "v-motor", english: "Motor", portuguese: "Motor", category: "motors", exampleEn: "The motor is overheating.", examplePt: "O motor está superaquecendo." },
    { id: "v-bearing", english: "Bearing", portuguese: "Rolamento", category: "maintenance", exampleEn: "The bearing needs to be replaced.", examplePt: "O rolamento precisa ser trocado." },
    { id: "v-shaft", english: "Shaft", portuguese: "Eixo", category: "motors", exampleEn: "The shaft is misaligned.", examplePt: "O eixo está desalinhado." },
    { id: "v-gear", english: "Gear", portuguese: "Engrenagem", category: "maintenance", exampleEn: "The gear is worn out.", examplePt: "A engrenagem está desgastada." },
    { id: "v-circuit-breaker", english: "Circuit breaker", portuguese: "Disjuntor", category: "building-electrical", exampleEn: "The circuit breaker tripped.", examplePt: "O disjuntor desarmou." },
    { id: "v-voltage", english: "Voltage", portuguese: "Tensão", category: "sizing", exampleEn: "The voltage is unstable.", examplePt: "A tensão está instável." },
    { id: "v-current", english: "Current", portuguese: "Corrente", category: "sizing", exampleEn: "The current is above normal.", examplePt: "A corrente está acima do normal." },
    { id: "v-resistance", english: "Resistance", portuguese: "Resistência", category: "sizing", exampleEn: "Measure the winding resistance.", examplePt: "Meça a resistência do enrolamento." },
    { id: "v-power", english: "Power", portuguese: "Potência", category: "sizing", exampleEn: "What is the motor's power rating?", examplePt: "Qual é a potência do motor?" },
    { id: "v-maintenance", english: "Maintenance", portuguese: "Manutenção", category: "maintenance", exampleEn: "Maintenance is scheduled.", examplePt: "A manutenção está agendada." },
    { id: "v-failure", english: "Failure", portuguese: "Falha", category: "maintenance", exampleEn: "Identify the cause of the failure.", examplePt: "Identifique a causa da falha." },
    { id: "v-tool", english: "Tool", portuguese: "Ferramenta", category: "machining", exampleEn: "Replace the cutting tool.", examplePt: "Troque a ferramenta de corte." },
    { id: "v-lathe", english: "Lathe", portuguese: "Torno", category: "lathe", exampleEn: "Turn on the lathe.", examplePt: "Ligue o torno." },
    { id: "v-milling-machine", english: "Milling machine", portuguese: "Fresadora", category: "milling", exampleEn: "The milling machine is calibrated.", examplePt: "A fresadora está calibrada." },
    { id: "v-cutting-speed", english: "Cutting speed", portuguese: "Velocidade de corte", category: "machining", exampleEn: "Adjust the cutting speed.", examplePt: "Ajuste a velocidade de corte." },
    { id: "v-feed-rate", english: "Feed rate", portuguese: "Avanço", category: "machining", exampleEn: "The feed rate is too high.", examplePt: "O avanço está muito alto." },
    { id: "v-technical-drawing", english: "Technical drawing", portuguese: "Desenho técnico", category: "technical-drawing", exampleEn: "Read the technical drawing.", examplePt: "Leia o desenho técnico." },
    { id: "v-measurement", english: "Measurement", portuguese: "Medição", category: "technical-drawing", exampleEn: "Check the measurement.", examplePt: "Confira a medição." },
    { id: "v-dimension", english: "Dimension", portuguese: "Dimensão", category: "technical-drawing", exampleEn: "Check the part's dimension.", examplePt: "Verifique a dimensão da peça." }
];
