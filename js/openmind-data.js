// OpenMind — conteúdo inicial de fábrica.
// Isso NÃO é mais a fonte de verdade das matérias — é só a semente
// usada uma vez para popular o Firestore na primeira execução (ver
// js/subjects-service.js). Depois disso, o Firestore manda.

window.OPENMIND_SUBJECTS = [
    {
        id: "motors", namePt: "Motores e tipos de partida", nameEn: "Motors and Starting Methods",
        topics: [
            { id: "motors-induction", namePt: "Motor de indução trifásico", nameEn: "Three-phase induction motor" },
            { id: "motors-direct-start", namePt: "Partida direta", nameEn: "Direct-on-line starting" },
            { id: "motors-star-delta", namePt: "Partida estrela-triângulo", nameEn: "Star-delta starting" },
            { id: "motors-vfd", namePt: "Soft-starter e inversor de frequência", nameEn: "Soft starter and VFD" }
        ]
    },
    {
        id: "sizing", namePt: "Dimensionamento", nameEn: "Sizing and Dimensioning",
        topics: [
            { id: "sizing-cables", namePt: "Dimensionamento de cabos", nameEn: "Cable sizing" },
            { id: "sizing-breakers", namePt: "Dimensionamento de disjuntores", nameEn: "Circuit breaker sizing" },
            { id: "sizing-motors", namePt: "Dimensionamento de motores", nameEn: "Motor sizing" }
        ]
    },
    {
        id: "maintenance", namePt: "Manutenção preventiva e corretiva", nameEn: "Preventive and Corrective Maintenance",
        topics: [
            { id: "maintenance-preventive", namePt: "Planos de manutenção preventiva", nameEn: "Preventive maintenance plans" },
            { id: "maintenance-corrective", namePt: "Diagnóstico e manutenção corretiva", nameEn: "Troubleshooting and corrective maintenance" },
            { id: "maintenance-vibration", namePt: "Análise de vibração", nameEn: "Vibration analysis" }
        ]
    },
    {
        id: "manufacturing", namePt: "Processos de fabricação", nameEn: "Manufacturing Processes",
        topics: [
            { id: "manufacturing-casting", namePt: "Fundição", nameEn: "Casting" },
            { id: "manufacturing-welding", namePt: "Soldagem", nameEn: "Welding" },
            { id: "manufacturing-forming", namePt: "Conformação mecânica", nameEn: "Metal forming" }
        ]
    },
    {
        id: "machining", namePt: "Usinagem", nameEn: "Machining",
        topics: [
            { id: "machining-parameters", namePt: "Parâmetros de corte", nameEn: "Cutting parameters" },
            { id: "machining-tools", namePt: "Ferramentas de corte", nameEn: "Cutting tools" }
        ]
    },
    {
        id: "technical-drawing", namePt: "Desenho técnico", nameEn: "Technical Drawing",
        topics: [
            { id: "drawing-projections", namePt: "Projeções ortográficas", nameEn: "Orthographic projections" },
            { id: "drawing-tolerances", namePt: "Cotagem e tolerâncias", nameEn: "Dimensioning and tolerances" }
        ]
    },
    {
        id: "building-electrical", namePt: "Elétrica predial", nameEn: "Building Electrical Systems",
        topics: [
            { id: "electrical-panels", namePt: "Quadros de distribuição", nameEn: "Distribution panels" },
            { id: "electrical-protection", namePt: "Dispositivos de proteção", nameEn: "Protection devices" }
        ]
    },
    {
        id: "lathe", namePt: "Operação de torno", nameEn: "Lathe Operation",
        topics: [
            { id: "lathe-basics", namePt: "Operações básicas de torno", nameEn: "Basic lathe operations" }
        ]
    },
    {
        id: "milling", namePt: "Operação de fresadora", nameEn: "Milling Machine Operation",
        topics: [
            { id: "milling-basics", namePt: "Operações básicas de fresadora", nameEn: "Basic milling operations" }
        ]
    }
];

window.OPENMIND_DIFFICULTIES = ["basic", "intermediate", "advanced"];
