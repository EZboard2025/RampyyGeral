-- SOLUÇÃO RÁPIDA PARA O INTERNAL SERVER ERROR
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Adicionar as colunas necessárias
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;

-- 2. Verificar se funcionou
SELECT 'SUCESSO! Colunas adicionadas:' as status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name IN ('openai_api_key', 'openai_agent_id');

-- 3. Verificar empresas
SELECT 'Empresas disponíveis:' as info;
SELECT id, nome FROM empresas WHERE ativo = true;

-- 4. Verificar configurações
SELECT 'Configurações atuais:' as info;
SELECT 
  c.empresa_id,
  e.nome as empresa,
  c.openai_api_key IS NOT NULL as tem_api_key,
  c.openai_agent_id IS NOT NULL as tem_agente
FROM configuracoes_empresa c
JOIN empresas e ON c.empresa_id = e.id;
