# OpenMind — Deploy da IA (Passo 12)

Este passo é diferente dos outros: além de subir arquivos pro GitHub,
precisa **instalar uma ferramenta no computador** e **publicar a Cloud
Function** que fala com a OpenAI. Sem isso, o botão "✨ Gerar conteúdo
com IA" não vai funcionar (vai dar erro de "function não encontrada").

Siga na ordem. Precisa ser feito **no computador** (não dá pra fazer
isso pelo celular).

---

## 1. Instalar o Node.js (se ainda não tiver)

Baixe e instale a versão LTS em: https://nodejs.org

Pra confirmar que instalou, abra o Terminal (Mac/Linux) ou PowerShell
(Windows) e digite:
```
node --version
```
Deve mostrar algo como `v20.x.x` ou mais novo.

## 2. Instalar a ferramenta de linha de comando do Firebase

No mesmo terminal:
```
npm install -g firebase-tools
```

## 3. Fazer login na sua conta do Firebase

```
firebase login
```
Vai abrir o navegador pra você confirmar com a conta Google que criou
o projeto `estudos-3b92d`.

## 4. Ativar o plano Blaze (se ainda não ativou)

No [Firebase Console](https://console.firebase.google.com) → projeto
`estudos-3b92d` → ícone de engrenagem → **Uso e faturamento** →
**Alterar plano** → **Blaze**. Sem isso o deploy da function falha.

(Lembrete: configure um alerta de orçamento no Google Cloud Console
pra não ter surpresa na fatura — Faturamento → Orçamentos e alertas.)

## 5. Pegar sua API key da OpenAI

1. Crie uma conta em https://platform.openai.com (se ainda não tiver).
2. Vá em **API keys** → **Create new secret key**.
3. Copie a chave (começa com `sk-...`) — ela só aparece uma vez.
4. Em **Settings → Billing → Limits**, defina um limite de gasto
   mensal (recomendo começar baixo, tipo $5, e aumentar se precisar).

## 6. Extrair o zip e entrar na pasta pelo terminal

Extraia o zip deste passo e, no terminal, entre na pasta do projeto:
```
cd caminho/para/estudar-main
```

## 7. Guardar a API key como secret do Firebase (NUNCA no código)

```
firebase functions:secrets:set OPENAI_API_KEY
```
Vai pedir pra colar a chave — cole (o terminal não mostra o que você
digita/cola, é normal) e aperte Enter.

## 8. Instalar as dependências da function

```
cd functions
npm install
cd ..
```

## 9. Publicar a Cloud Function

```
firebase deploy --only functions
```
Isso leva 1-3 minutos. No final deve aparecer algo como:
```
✔  functions[generateContent(us-central1)] Successful create operation.
```
Se der erro de permissão, confirme que o Blaze está ativo (passo 4).

## 10. Subir o resto do projeto pro GitHub, como sempre

Suba todos os arquivos deste zip pro seu repositório (incluindo os
novos: `functions/`, `firebase.json`, `.firebaserc`, e os `js/`
novos). O GitHub Pages não roda a function — ela já está rodando nos
servidores do Google, o site só precisa saber chamá-la (o que o código
já faz).

## 11. Testar

1. Abra o app, vá em **Matérias → uma matéria → ✨ GERAR CONTEÚDO COM IA**.
2. Marque "Assuntos" e "Exercícios", escolha 10 itens, clique em Gerar.
3. Deve aparecer o loading e, em alguns segundos, a tela de revisão.
4. Revise, desmarque o que não quiser, clique em **Salvar Selecionados**.
5. Volte pra tela da matéria — os assuntos/exercícios novos devem
   aparecer normalmente, misturados com o resto (é o mesmo sistema).

## Se algo der errado

- **"internal" ou erro genérico**: veja os logs com `firebase functions:log`
  — mostra o erro real (sem expor a API key).
- **Erro de billing da OpenAI**: confira o limite de gasto configurado
  no passo 5.
- **"unauthenticated"**: você precisa estar logado no app pra usar a IA.

## Atualizando a function depois

Sempre que eu mudar `functions/index.js`, você só precisa rodar de
novo:
```
firebase deploy --only functions
```
(não precisa refazer os passos 1-8, só esse comando final.)
