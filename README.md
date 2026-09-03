# OpenMind — Passo 08

Projeto de estudos criado especificamente para o OpenMind.

## Neste passo
- Technical English: banco de vocabulário técnico semeado no Firestore (`vocabulary`)
- Tela dedicada (`pages/vocabulary.html`): flashcards com "Mostrar tradução", "Eu sabia" / "Não sabia", e repetição espaçada simples (`vocabularyProgress`)
- Card "Technical English" no Dashboard com contagem real de palavras/dominadas/pra revisar
- No Treino, depois de responder uma questão, aparece uma palavra técnica relacionada à matéria (Technical Vocabulary)

## ⚠️ Ação necessária no Firebase
Faltam regras para 2 coleções novas — adicione dentro do bloco `documents { ... }`, junto das outras:
```
match /vocabulary/{document=**} {
  allow read, write: if request.auth != null;
}
match /vocabularyProgress/{document=**} {
  allow read, write: if request.auth != null;
}
```

## Ainda estático (próximos passos)
- Sem simulado ainda
- Sem conquistas/gamificação visual ainda

## Próximos passos
A cada etapa será gerado um novo ZIP. O conteúdo de IA não será implementado antes do Passo 12.







