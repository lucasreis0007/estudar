# OpenMind — Passo 05

Projeto de estudos criado especificamente para o OpenMind.

## Neste passo
- Sistema adaptativo: cada resposta atualiza o progresso do usuário por tópico e nível (basic/intermediate/advanced), na coleção `topicProgress`
- O treino agora prioriza o nível recomendado por tópico (domina o básico → sobe pro intermediário; erra muito → reforça o nível atual)
- Matérias e Dashboard mostram status real (🟢 Dominado / 🟡 Em desenvolvimento / 🔴 Precisa revisar / Ainda não iniciado) e barra de progresso real, calculados do histórico de respostas — nada mais fixo
- Bug corrigido: coleções revertidas para `questions`/`answers` (as que já têm regra liberada no seu Firestore)

## Ainda estático (próximos passos)
- Progresso ainda não tem tela dedicada com histórico (fica pra depois)
- Sem Technical English / vocabulário ainda

## Próximos passos
A cada etapa será gerado um novo ZIP. O conteúdo de IA não será implementado antes do Passo 12.




