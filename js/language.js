// OpenMind — idioma da interface.
// Mesma API de antes (getLang, applyLanguage, OPENMIND_I18N) — só
// formatado de forma legível e com mais chaves (login/cadastro).

const OPENMIND_I18N = {
    "pt-BR": {
        dashboard: "DASHBOARD",
        ready: "Seu plano de estudos começa aqui.",
        todaysTraining: "Treino de hoje",
        startTraining: "COMEÇAR TREINO",
        streak: "Sequência",
        accuracy: "Acertos",
        studyTime: "Tempo",
        exercises: "Exercícios",
        xp: "XP",
        overallProgress: "PROGRESSO GERAL",
        subjects: "Matérias",
        seeAll: "Ver todas",
        home: "Início",
        training: "Treino",
        progress: "Progresso",
        profile: "Perfil",

        loginTitle: "Entrar",
        loginSubtitle: "Entre com seu e-mail e senha.",
        registerTitle: "Criar conta",
        registerSubtitle: "Crie sua conta com e-mail e senha.",
        emailLabel: "E-mail",
        passwordLabel: "Senha",
        confirmLabel: "Confirmar senha",
        loginSubmit: "Entrar",
        registerSubmit: "Criar conta",
        switchToRegister: "Não tenho conta ainda",
        switchToLogin: "Já tenho conta, fazer login",
        logout: "Sair",

        addSubject: "+ Add Subject",
        newSubject: "Nova matéria",
        namePt: "Nome em português",
        nameEn: "Name in English",
        descriptionOpt: "Descrição (opcional)",
        cancel: "Cancelar",
        save: "Salvar",
        topics: "Assuntos",
        addTopic: "+ Add Topic",
        newTopic: "Novo assunto",
        difficultyLabel: "Dificuldade inicial",

        noExercises: "Ainda não há exercícios cadastrados.",
        chooseSubject: "ESCOLHER MATÉRIA",
        next: "Próxima",
        trainingDone: "Treino concluído!",
        backToDashboard: "VOLTAR AO DASHBOARD",

        notStarted: "Ainda não iniciado",
        statusMastered: "🟢 Dominado",
        statusDeveloping: "🟡 Em desenvolvimento",
        statusNeedsReview: "🔴 Precisa revisar",
        needsReviewToday: "Hoje precisamos revisar",
        reviewNow: "REVISAR AGORA",
        reviewCardText: "Você tem tópicos com desempenho fraco. Que tal revisar agora?",

        simulatedTest: "SIMULADO",
        setupSimulated: "Configure seu simulado",
        subjectLabel: "Matéria",
        allSubjects: "Todas as matérias",
        quantityLabel: "Quantidade de questões",
        startSimulated: "INICIAR SIMULADO",
        simulator: "Simulado",
        levelLabel: "Nível",
        achievements: "Conquistas",

        generateWithAI: "✨ GERAR CONTEÚDO COM IA",
        generateContent: "✨ Gerar conteúdo",
        whatToGenerate: "O que deseja gerar?",
        typeTopics: "Assuntos",
        typeQuestions: "Exercícios",
        typeChallenges: "Desafios práticos",
        typeVocabulary: "Vocabulário técnico",
        languageLabel: "Idioma",
        generateButton: "✨ GERAR CONTEÚDO",
        creatingContent: "✨ Criando seu conteúdo...",
        contentGenerated: "✓ Conteúdo gerado!",
        saveSelected: "✓ SALVAR SELECIONADOS",

        technicalEnglish: "Technical English",
        words: "Palavras",
        mastered: "Dominadas",
        toReview: "Pra revisar",
        showTranslation: "MOSTRAR TRADUÇÃO",
        didntKnow: "❌ Não sabia",
        knewIt: "✅ Eu sabia",
        allReviewed: "Tudo revisado por hoje!"
    },
    en: {
        dashboard: "DASHBOARD",
        ready: "Your study plan starts here.",
        todaysTraining: "Today's Training",
        startTraining: "START TRAINING",
        streak: "Streak",
        accuracy: "Accuracy",
        studyTime: "Study time",
        exercises: "Exercises",
        xp: "XP",
        overallProgress: "OVERALL PROGRESS",
        subjects: "Subjects",
        seeAll: "See all",
        home: "Home",
        training: "Training",
        progress: "Progress",
        profile: "Profile",

        loginTitle: "Sign in",
        loginSubtitle: "Sign in with your email and password.",
        registerTitle: "Create account",
        registerSubtitle: "Create your account with email and password.",
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmLabel: "Confirm password",
        loginSubmit: "Sign in",
        registerSubmit: "Create account",
        switchToRegister: "I don't have an account yet",
        switchToLogin: "I already have an account, sign in",
        logout: "Log out",

        addSubject: "+ Add Subject",
        newSubject: "New subject",
        namePt: "Name in Portuguese",
        nameEn: "Name in English",
        descriptionOpt: "Description (optional)",
        cancel: "Cancel",
        save: "Save",
        topics: "Topics",
        addTopic: "+ Add Topic",
        newTopic: "New topic",
        difficultyLabel: "Starting difficulty",

        noExercises: "No exercises added yet.",
        chooseSubject: "CHOOSE SUBJECT",
        next: "Next",
        trainingDone: "Training complete!",
        backToDashboard: "BACK TO DASHBOARD",

        notStarted: "Not started yet",
        statusMastered: "🟢 Mastered",
        statusDeveloping: "🟡 Developing",
        statusNeedsReview: "🔴 Needs review",
        needsReviewToday: "Today we need to review",
        reviewNow: "REVIEW NOW",
        reviewCardText: "You have topics with weak performance. How about reviewing them now?",

        simulatedTest: "SIMULATED TEST",
        setupSimulated: "Set up your simulated test",
        subjectLabel: "Subject",
        allSubjects: "All subjects",
        quantityLabel: "Number of questions",
        startSimulated: "START TEST",
        simulator: "Simulated Test",
        levelLabel: "Level",
        achievements: "Achievements",

        generateWithAI: "✨ GENERATE CONTENT WITH AI",
        generateContent: "✨ Generate content",
        whatToGenerate: "What would you like to generate?",
        typeTopics: "Topics",
        typeQuestions: "Exercises",
        typeChallenges: "Practical challenges",
        typeVocabulary: "Technical vocabulary",
        languageLabel: "Language",
        generateButton: "✨ GENERATE CONTENT",
        creatingContent: "✨ Creating your content...",
        contentGenerated: "✓ Content generated!",
        saveSelected: "✓ SAVE SELECTED",

        technicalEnglish: "Technical English",
        words: "Words",
        mastered: "Mastered",
        toReview: "To review",
        showTranslation: "SHOW TRANSLATION",
        didntKnow: "❌ Didn't know",
        knewIt: "✅ I knew it",
        allReviewed: "All reviewed for today!"
    }
};

function getLang() {
    return localStorage.getItem("openmind.language") || "pt-BR";
}

function applyLanguage() {
    const lang = getLang();
    const dict = OPENMIND_I18N[lang] || OPENMIND_I18N["pt-BR"];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const chave = el.dataset.i18n;
        if (dict[chave]) el.textContent = dict[chave];
    });

    const botaoIdioma = document.getElementById("languageBtn");
    if (botaoIdioma) botaoIdioma.textContent = lang === "en" ? "EN" : "PT";
}

document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();

    const botaoIdioma = document.getElementById("languageBtn");
    if (botaoIdioma) {
        botaoIdioma.onclick = () => {
            localStorage.setItem("openmind.language", getLang() === "en" ? "pt-BR" : "en");
            applyLanguage();
            if (window.renderDashboard && window.OPENMIND_PERFIL) {
                window.renderDashboard(window.OPENMIND_PERFIL, window.OPENMIND_USUARIO && window.OPENMIND_USUARIO.uid);
            }
            if (window.OPENMIND_onLanguageChange) window.OPENMIND_onLanguageChange();
        };
    }
});
