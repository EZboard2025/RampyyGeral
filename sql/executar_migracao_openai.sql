-- Execute este SQL no painel do Supabase (SQL Editor)
-- Para corrigir a estrutura da tabela configuracoes_empresa

-- 1. Primeiro, vamos verificar a estrutura atual da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY column_name;

-- 2. Adicionar apenas as colunas necessárias para OpenAI
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;

-- 3. Remover colunas desnecessárias (se existirem)
ALTER TABLE configuracoes_empresa 
DROP COLUMN IF EXISTS openai_agent_instructions,
DROP COLUMN IF EXISTS openai_model;

-- 4. Verificar se as colunas foram adicionadas corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name IN ('openai_api_key', 'openai_agent_id')
ORDER BY column_name;

-- 5. Verificar configurações atuais
SELECT 
  e.nome as empresa,
  c.id as config_id,
  c.openai_api_key IS NOT NULL as tem_api_key,
  c.openai_agent_id IS NOT NULL as tem_agente
FROM empresas e
LEFT JOIN configuracoes_empresa c ON e.id = c.empresa_id
ORDER BY e.nome;
