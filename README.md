# OpenMind — Passo 11

Projeto de estudos criado especificamente para o OpenMind — auditoria geral e polimento antes da IA (Passo 12).

## O que foi auditado (e corrigido)
- ✅ **Bug real encontrado e corrigido**: `manifest.json` apontava pra ícones (`img/icons/icon-192.png` e `icon-512.png`) que não existiam — quebrava a instalação do PWA. Ícones placeholder criados.
- ✅ Toda chave `data-i18n` usada no HTML tem tradução pt-BR e en correspondente (nenhuma faltando)
- ✅ Todo `subjectId`/`topicId` usado nas perguntas e no vocabulário bate com uma matéria/assunto real
- ✅ Nenhum link interno (`href`) quebrado entre as páginas
- ✅ Nenhum `<script src>` apontando pra arquivo inexistente
- ✅ Todo arquivo listado no cache do Service Worker existe de verdade no projeto
- ✅ Todas as 8 coleções do Firestore em uso batem com as regras já publicadas (`users`, `subjects`, `topics`, `questions`, `answers`, `topicProgress`, `vocabulary`, `vocabularyProgress`)
- ✅ Sintaxe de todo arquivo `.js` e balanceamento de tags de todo `.html` validados

## Checklist de teste manual (faça isso antes do Passo 12)
1. **Instalar o PWA**: no celular, abra o site → menu do navegador → "Adicionar à tela inicial" → confirme que agora aparece o ícone "OM" (antes não aparecia nenhum).
2. **Fluxo completo**: cadastro → login → Dashboard → Matérias → adicionar uma matéria → treinar → Progresso → Technical English → Simulado → Perfil → Sair → Login de novo.
3. **Offline**: com o app já aberto uma vez, ative o modo avião e navegue entre as páginas já visitadas — devem continuar abrindo (mesmo sem conseguir buscar dado novo do Firestore).
4. **Idioma**: troque PT/EN no menu e confira se todas as telas trocam (não só o dashboard).

## Próximos passos
Terminada a base — o próximo é o **Passo 12: integração com IA** (geração de conteúdo com backend seguro).










