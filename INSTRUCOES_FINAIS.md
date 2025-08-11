# 🔧 SOLUÇÃO COMPLETA PARA O INTERNAL SERVER ERROR

## Análise Completa do Problema

Após revisar todo o código, identifiquei **2 problemas principais**:

### 1. **Problema no next.config.js** ✅ CORRIGIDO
- O `appDir: true` estava deprecated no Next.js 14
- **Solução**: Removido o `experimental.appDir`

### 2. **Problema no Banco de Dados** ⚠️ PRECISA SER EXECUTADO
- As colunas `openai_api_key` e `openai_agent_id` não existem na tabela `configuracoes_empresa`
- **Solução**: Execute o SQL de correção

## SOLUÇÃO DEFINITIVA

### Passo 1: Execute o SQL no Supabase

1. **Acesse o painel do Supabase**
2. **Vá para SQL Editor**
3. **Cole e execute o conteúdo do arquivo `SOLUCAO_DEFINITIVA.sql`**

### Passo 2: Acesse a porta correta

O servidor está rodando na **porta 3002**, não na 3000:
- **URL correta**: `http://localhost:3002`
- **Não use**: `http://localhost:3000`

### Passo 3: Recarregue a página

Após executar o SQL:
1. **Aguarde 30 segundos**
2. **Acesse**: `http://localhost:3002`
3. **Recarregue a página** (F5)

## O que o SQL faz:

✅ **Verifica** se a tabela existe  
✅ **Mostra** a estrutura atual  
✅ **Adiciona** as colunas necessárias  
✅ **Remove** colunas desnecessárias  
✅ **Cria** configurações para empresas  
✅ **Mostra** o resultado final  

## Estrutura Final da Tabela:

```
configuracoes_empresa:
├── id
├── empresa_id
├── feature_chat_ia
├── feature_roleplay
├── feature_pdi
├── feature_dashboard
├── feature_base_conhecimento
├── feature_mentor_voz
├── openai_api_key ← NOVA
├── openai_agent_id ← NOVA
├── elevenlabs_api_key
├── created_at
└── updated_at
```

## Resultado Esperado:

Após executar o SQL e acessar `http://localhost:3002`:
- ✅ **Página inicial carrega normalmente**
- ✅ **Lista de empresas aparece**
- ✅ **Login funciona**
- ✅ **Dashboard funciona**
- ✅ **Configurações funcionam**

## Se ainda der erro:

1. **Confirme que executou o SQL com sucesso**
2. **Acesse a porta 3002**: `http://localhost:3002`
3. **Verifique os logs no terminal** onde `npm run dev` está rodando
4. **Me informe o erro exato** que aparece

**Execute o SQL AGORA e acesse a porta 3002!**
