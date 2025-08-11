-- SOLUÇÃO DEFINITIVA PARA O INTERNAL SERVER ERROR
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Verificar se a tabela existe
SELECT 'VERIFICANDO TABELA:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'configuracoes_empresa'
) as tabela_existe;

-- 2. Verificar estrutura atual
SELECT 'ESTRUTURA ATUAL:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY column_name;

-- 3. Adicionar colunas necessárias
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_api_key TEXT;
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;

-- 4. Remover colunas desnecessárias (se existirem)
ALTER TABLE configuracoes_empresa DROP COLUMN IF EXISTS openai_agent_instructions;
ALTER TABLE configuracoes_empresa DROP COLUMN IF EXISTS openai_model;

-- 5. Verificar se as colunas foram adicionadas
SELECT 'COLUNAS ADICIONADAS:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name IN ('openai_api_key', 'openai_agent_id')
ORDER BY column_name;

-- 6. Verificar empresas
SELECT 'EMPRESAS DISPONÍVEIS:' as info;
SELECT id, nome, ativo FROM empresas ORDER BY nome;

-- 7. Verificar configurações existentes
SELECT 'CONFIGURAÇÕES EXISTENTES:' as info;
SELECT 
  c.id,
  c.empresa_id,
  e.nome as empresa,
  c.openai_api_key IS NOT NULL as tem_api_key,
  c.openai_agent_id IS NOT NULL as tem_agente
FROM configuracoes_empresa c
JOIN empresas e ON c.empresa_id = e.id
ORDER BY e.nome;

-- 8. Criar configurações para empresas que não têm
INSERT INTO configuracoes_empresa (empresa_id, feature_chat_ia, feature_roleplay, feature_pdi, feature_dashboard, feature_base_conhecimento, feature_mentor_voz, created_at, updated_at)
SELECT 
  e.id,
  true, true, true, true, true, true,
  NOW(),
  NOW()
FROM empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM configuracoes_empresa c WHERE c.empresa_id = e.id
);

-- 9. Resultado final
SELECT 'RESULTADO FINAL:' as info;
SELECT 
  e.nome as empresa,
  c.id as config_id,
  CASE 
    WHEN c.openai_api_key IS NOT NULL THEN 'CONFIGURADA'
    ELSE 'PENDENTE'
  END as api_key_status,
  CASE 
    WHEN c.openai_agent_id IS NOT NULL THEN 'CONFIGURADA'
    ELSE 'PENDENTE'
  END as agente_status
FROM empresas e
LEFT JOIN configuracoes_empresa c ON e.id = c.empresa_id
ORDER BY e.nome;

-- 10. Estrutura final da tabela
SELECT 'ESTRUTURA FINAL:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY column_name;
