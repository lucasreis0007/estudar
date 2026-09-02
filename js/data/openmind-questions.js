// OpenMind — banco inicial de exercícios (conteúdo de fábrica).
// Assim como as matérias, isso só serve pra semear o Firestore na
// primeira execução (ver js/questions-service.js) — depois disso o
// Firestore manda. IDs de subjectId/topicId batem com js/openmind-data.js.

window.OPENMIND_QUESTIONS = [

    // ---------------- MOTORS ----------------
    {
        id: "q-motors-001", subjectId: "motors", topicId: "motors-induction", difficulty: "basic",
        questionPt: "Qual é o princípio de funcionamento de um motor de indução trifásico?",
        questionEn: "What is the operating principle of a three-phase induction motor?",
        optionsPt: ["Campo magnético girante induz corrente no rotor", "Comutador inverte a polaridade do rotor", "Ímãs permanentes fixos no estator", "Corrente contínua alimenta diretamente o rotor"],
        optionsEn: ["A rotating magnetic field induces current in the rotor", "A commutator reverses the rotor's polarity", "Fixed permanent magnets in the stator", "Direct current feeds the rotor directly"],
        correct: 0,
        explanationPt: "O estator cria um campo magnético girante que induz corrente no rotor por indução, gerando torque — por isso não há contato elétrico direto com o rotor em motores de gaiola.",
        explanationEn: "The stator creates a rotating magnetic field that induces current in the rotor via induction, producing torque — that's why squirrel-cage rotors have no direct electrical contact."
    },
    {
        id: "q-motors-002", subjectId: "motors", topicId: "motors-direct-start", difficulty: "basic",
        questionPt: "A partida direta de um motor trifásico é indicada principalmente para:",
        questionEn: "Direct-on-line starting of a three-phase motor is mainly suited for:",
        optionsPt: ["Motores de pequena/média potência com rede que suporta a corrente de partida", "Motores de grande potência em redes fracas", "Cargas que exigem partida suave obrigatória", "Motores monofásicos apenas"],
        optionsEn: ["Small/medium power motors on a grid that supports the inrush current", "High power motors on weak grids", "Loads that require mandatory soft starting", "Single-phase motors only"],
        correct: 0,
        explanationPt: "Na partida direta a corrente pode chegar a 6-8x a nominal, por isso só é indicada quando a instalação suporta esse pico — geralmente motores menores.",
        explanationEn: "In DOL starting, inrush current can reach 6-8x rated current, so it's only suitable when the installation can handle that peak — typically smaller motors."
    },
    {
        id: "q-motors-003", subjectId: "motors", topicId: "motors-star-delta", difficulty: "intermediate",
        questionPt: "Na partida estrela-triângulo, a tensão em cada enrolamento na ligação estrela é reduzida por um fator de aproximadamente:",
        questionEn: "In star-delta starting, the voltage on each winding in the star connection is reduced by a factor of approximately:",
        optionsPt: ["√3 (1,73)", "2", "3", "0,5"],
        optionsEn: ["√3 (1.73)", "2", "3", "0.5"],
        correct: 0,
        explanationPt: "Na ligação estrela, a tensão em cada enrolamento é a tensão de linha dividida por √3, reduzindo a corrente de partida a cerca de 1/3 da direta.",
        explanationEn: "In the star connection, voltage across each winding is line voltage divided by √3, reducing inrush current to roughly 1/3 of the direct-on-line value."
    },
    {
        id: "q-motors-004", subjectId: "motors", topicId: "motors-vfd", difficulty: "advanced",
        questionPt: "Uma vantagem do inversor de frequência (VFD) sobre o soft-starter é:",
        questionEn: "An advantage of a variable frequency drive (VFD) over a soft starter is:",
        optionsPt: ["Permite controlar a velocidade do motor continuamente, não só a partida", "É sempre mais barato", "Não precisa de dimensionamento térmico", "Elimina a necessidade de disjuntor"],
        optionsEn: ["It allows continuous speed control, not just soft starting", "It is always cheaper", "No thermal sizing is needed", "It removes the need for a circuit breaker"],
        correct: 0,
        explanationPt: "O soft-starter só atua na partida/parada. O VFD controla frequência e tensão continuamente, variando a velocidade durante toda a operação.",
        explanationEn: "A soft starter only acts during start/stop. A VFD continuously controls frequency and voltage, varying speed throughout operation."
    },

    // ---------------- SIZING ----------------
    {
        id: "q-sizing-001", subjectId: "sizing", topicId: "sizing-cables", difficulty: "basic",
        questionPt: "O principal critério para dimensionar a bitola de um cabo elétrico é:",
        questionEn: "The main criterion for sizing a cable's cross-section is:",
        optionsPt: ["Capacidade de condução de corrente e queda de tensão admissível", "Cor da capa do cabo", "Comprimento do cabo apenas", "Marca do fabricante"],
        optionsEn: ["Current-carrying capacity and allowable voltage drop", "The cable jacket color", "Cable length alone", "The manufacturer's brand"],
        correct: 0,
        explanationPt: "O dimensionamento considera a corrente de projeto (capacidade térmica) e a queda de tensão admissível — ambos precisam ser verificados.",
        explanationEn: "Sizing considers the design current (thermal capacity) and allowable voltage drop — both need to be checked."
    },
    {
        id: "q-sizing-002", subjectId: "sizing", topicId: "sizing-breakers", difficulty: "intermediate",
        questionPt: "A corrente nominal do disjuntor de um circuito deve ser, em relação à capacidade do cabo:",
        questionEn: "A circuit breaker's rated current, relative to the cable's capacity, should be:",
        optionsPt: ["Igual ou inferior à capacidade de condução do cabo", "Sempre o dobro da capacidade do cabo", "Independente da capacidade do cabo", "Sempre a menor disponível no mercado"],
        optionsEn: ["Equal to or lower than the cable's current-carrying capacity", "Always double the cable's capacity", "Independent of the cable's capacity", "Always the smallest one available"],
        correct: 0,
        explanationPt: "O disjuntor deve proteger o cabo: sua corrente nominal não pode ultrapassar a capacidade do condutor, senão o cabo pode superaquecer antes do disjuntor atuar.",
        explanationEn: "The breaker must protect the cable: its rated current cannot exceed the conductor's capacity, or the cable could overheat before the breaker trips."
    },
    {
        id: "q-sizing-003", subjectId: "sizing", topicId: "sizing-motors", difficulty: "intermediate",
        questionPt: "Para dimensionar a proteção de um motor elétrico, além da corrente nominal deve-se considerar:",
        questionEn: "To size a motor's protection, besides rated current one must also consider:",
        optionsPt: ["A corrente de partida e o tempo de partida", "Somente a cor da carcaça", "Apenas o peso do motor", "Somente a tensão de linha"],
        optionsEn: ["The inrush current and starting time", "Only the frame color", "Only the motor's weight", "Only the line voltage"],
        correct: 0,
        explanationPt: "A proteção precisa suportar o pico de partida durante o tempo de partida, sem atuar indevidamente, mas ainda proteger contra sobrecarga real.",
        explanationEn: "The protection must withstand the inrush peak during starting time without nuisance tripping, while still protecting against real overload."
    },

    // ---------------- MAINTENANCE ----------------
    {
        id: "q-maint-001", subjectId: "maintenance", topicId: "maintenance-preventive", difficulty: "basic",
        questionPt: "Manutenção preventiva é caracterizada por:",
        questionEn: "Preventive maintenance is characterized by:",
        optionsPt: ["Intervenções programadas para evitar falhas antes que ocorram", "Consertar o equipamento só depois que ele quebra", "Nunca inspecionar o equipamento", "Trocar peças aleatoriamente sem plano"],
        optionsEn: ["Scheduled interventions to prevent failures before they happen", "Fixing the equipment only after it breaks", "Never inspecting the equipment", "Replacing parts randomly with no plan"],
        correct: 0,
        explanationPt: "A manutenção preventiva segue um plano (tempo de uso, ciclos ou calendário) para reduzir a chance de falha, ao contrário da corretiva.",
        explanationEn: "Preventive maintenance follows a plan (usage time, cycles, or calendar) to reduce failure probability, unlike corrective maintenance."
    },
    {
        id: "q-maint-002", subjectId: "maintenance", topicId: "maintenance-corrective", difficulty: "intermediate",
        questionPt: "Um motor trifásico está aquecendo acima do normal e vibrando. O primeiro passo no diagnóstico deve ser:",
        questionEn: "A three-phase motor is overheating and vibrating. The first diagnostic step should be:",
        optionsPt: ["Verificar alinhamento, balanceamento e fixação mecânica", "Trocar o motor imediatamente sem investigar", "Aumentar a tensão de alimentação", "Ignorar, pois vibração é sempre normal"],
        optionsEn: ["Check alignment, balance, and mechanical mounting", "Replace the motor immediately without investigating", "Increase the supply voltage", "Ignore it, since vibration is always normal"],
        correct: 0,
        explanationPt: "Aquecimento com vibração costuma indicar causa mecânica (desalinhamento, rolamento) ou elétrica (desequilíbrio de fases). Checar o lado mecânico primeiro é rápido e não-destrutivo.",
        explanationEn: "Overheating with vibration usually points to a mechanical cause (misalignment, bearing) or electrical one (phase imbalance). Checking mechanical first is quick and non-destructive."
    },
    {
        id: "q-maint-003", subjectId: "maintenance", topicId: "maintenance-vibration", difficulty: "advanced",
        questionPt: "Na análise de vibração, uma frequência dominante igual a 1x a rotação do eixo geralmente indica:",
        questionEn: "In vibration analysis, a dominant frequency equal to 1x shaft rotation usually indicates:",
        optionsPt: ["Desbalanceamento", "Falha de engrenagem", "Cavitação de bomba", "Curto-circuito no estator"],
        optionsEn: ["Unbalance", "Gear failure", "Pump cavitation", "Stator short circuit"],
        correct: 0,
        explanationPt: "Desbalanceamento tipicamente aparece como um pico dominante em 1x a frequência de rotação no espectro de vibração.",
        explanationEn: "Unbalance typically shows up as a dominant peak at 1x the rotational speed in the vibration spectrum."
    },

    // ---------------- MACHINING ----------------
    {
        id: "q-machining-001", subjectId: "machining", topicId: "machining-parameters", difficulty: "basic",
        questionPt: "Velocidade de corte (Vc) em usinagem se refere a:",
        questionEn: "Cutting speed (Vc) in machining refers to:",
        optionsPt: ["Velocidade relativa entre a ferramenta e a peça na superfície de corte", "Velocidade de deslocamento da mesa da máquina", "Rotação do motor da máquina em RPM apenas", "Velocidade de troca de ferramenta"],
        optionsEn: ["The relative speed between tool and workpiece at the cutting surface", "The machine table's travel speed", "The machine motor's RPM alone", "The tool-change speed"],
        correct: 0,
        explanationPt: "A velocidade de corte é a velocidade periférica relativa entre a aresta de corte e a superfície da peça, geralmente em m/min.",
        explanationEn: "Cutting speed is the relative peripheral speed between the tool's cutting edge and the workpiece surface, usually in m/min."
    },
    {
        id: "q-machining-002", subjectId: "machining", topicId: "machining-parameters", difficulty: "intermediate",
        questionPt: "Se o avanço (feed rate) for aumentado além do recomendado, o resultado mais provável é:",
        questionEn: "If the feed rate is increased beyond what is recommended, the most likely result is:",
        optionsPt: ["Pior acabamento superficial e maior desgaste da ferramenta", "Melhor acabamento superficial sempre", "Nenhum efeito perceptível", "Redução do tempo de vida útil da peça bruta apenas"],
        optionsEn: ["Worse surface finish and faster tool wear", "Always better surface finish", "No noticeable effect", "Only reduces the raw stock's shelf life"],
        correct: 0,
        explanationPt: "Avanço excessivo aumenta a força de corte e as marcas na peça, piorando o acabamento e acelerando o desgaste da ferramenta.",
        explanationEn: "Excessive feed increases cutting force and marks left on the part, worsening finish and speeding up tool wear."
    },
    {
        id: "q-machining-003", subjectId: "machining", topicId: "machining-tools", difficulty: "basic",
        questionPt: "Ferramentas de metal duro (carbureto), comparadas ao aço rápido (HSS), geralmente permitem:",
        questionEn: "Carbide tools, compared to high-speed steel (HSS), generally allow:",
        optionsPt: ["Velocidades de corte mais altas e maior resistência ao desgaste térmico", "Velocidades de corte mais baixas sempre", "Uso exclusivo em madeira", "Nenhuma vantagem sobre o HSS"],
        optionsEn: ["Higher cutting speeds and better resistance to thermal wear", "Always lower cutting speeds", "Exclusive use on wood", "No advantage over HSS"],
        correct: 0,
        explanationPt: "O metal duro mantém a dureza em temperaturas mais altas que o HSS, permitindo velocidades de corte maiores.",
        explanationEn: "Carbide retains hardness at higher temperatures than HSS, allowing higher cutting speeds."
    },

    // ---------------- TECHNICAL DRAWING ----------------
    {
        id: "q-drawing-001", subjectId: "technical-drawing", topicId: "drawing-projections", difficulty: "basic",
        questionPt: "No método do primeiro diedro (usado no Brasil/Europa), a vista lateral esquerda é desenhada:",
        questionEn: "In first-angle projection (used in Brazil/Europe), the left side view is drawn:",
        optionsPt: ["À direita da vista frontal", "À esquerda da vista frontal", "Acima da vista frontal", "Não é utilizada nesse método"],
        optionsEn: ["To the right of the front view", "To the left of the front view", "Above the front view", "It is not used in this method"],
        correct: 0,
        explanationPt: "No primeiro diedro, a peça fica entre o observador e o plano de projeção, então a vista lateral esquerda cai do lado direito do desenho.",
        explanationEn: "In first-angle projection, the object sits between the observer and the projection plane, so the left side view ends up on the right side of the drawing."
    },
    {
        id: "q-drawing-002", subjectId: "technical-drawing", topicId: "drawing-tolerances", difficulty: "intermediate",
        questionPt: "Uma tolerância dimensional de Ø20 ±0,05 mm significa que a peça é aceita se o diâmetro medido estiver:",
        questionEn: "A dimensional tolerance of Ø20 ±0.05 mm means the part is accepted if the measured diameter is:",
        optionsPt: ["Entre 19,95 mm e 20,05 mm", "Exatamente 20,00 mm sempre", "Entre 20,00 mm e 20,50 mm", "Qualquer valor próximo de 20 mm"],
        optionsEn: ["Between 19.95 mm and 20.05 mm", "Always exactly 20.00 mm", "Between 20.00 mm and 20.50 mm", "Any value near 20 mm"],
        correct: 0,
        explanationPt: "A tolerância ±0,05 mm define uma faixa aceitável: de 20 - 0,05 = 19,95 mm até 20 + 0,05 = 20,05 mm.",
        explanationEn: "The ±0.05 mm tolerance defines an acceptable range: from 20 - 0.05 = 19.95 mm to 20 + 0.05 = 20.05 mm."
    }
];
