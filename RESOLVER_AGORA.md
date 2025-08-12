# 🚨 RESOLVER AGORA - Problema de Configurações

## O Problema
A página de configurações está mostrando erro mesmo após executar o SQL. O problema é que a tabela `empresas` não existe no banco.

## SOLUÇÃO IMEDIATA

### Passo 1: Execute o SQL Simples Primeiro
1. Vá para **Supabase Dashboard**
2. Abra **SQL Editor**
3. Execute o arquivo `TESTE_SIMPLES.sql` (mais simples, sem referências a tabelas que não existem)
4. **Aguarde a execução completa**

### Passo 2: Verifique o Resultado
Após executar o SQL, você deve ver:
- ✅ "TABELA EXISTE" ou "TABELA NÃO EXISTE"
- ✅ "TABELA CRIADA/ATUALIZADA COM SUCESSO!"

### Passo 3: Teste a Aplicação
1. **Recarregue a página** de configurações
2. **Verifique o console** (F12) para logs detalhados
3. **Me informe o que aparece**

## Se ainda der erro:

### Verificação Manual no Supabase:
1. Vá para **Table Editor**
2. Procure pela tabela `configuracoes_empresa`
3. Verifique se existe
4. Verifique se tem as colunas:
   - `openai_api_key`
   - `openai_agent_id`
   - `openai_agent_instructions`
   - `openai_model`

### SQL de Verificação Rápida:
```sql
-- Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'configuracoes_empresa'
);

-- Verificar colunas
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name LIKE '%openai%';

-- Verificar configurações
SELECT COUNT(*) FROM configuracoes_empresa;
```

## Logs para Verificar:
Abra o console do navegador (F12) e procure por:
- `Testando consulta básica...`
- `Consulta básica OK, testando consulta completa...`
- `Configuração carregada com sucesso:`

**Execute o SQL simples primeiro e me informe o resultado!**
