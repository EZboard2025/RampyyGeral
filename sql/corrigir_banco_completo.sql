-- SCRIPT COMPLETO PARA CORRIGIR O BANCO DE DADOS
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Verificar se a tabela existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'configuracoes_empresa') THEN
        RAISE EXCEPTION 'Tabela configuracoes_empresa não existe!';
    END IF;
END $$;

-- 2. Verificar estrutura atual
SELECT 'ESTRUTURA ATUAL:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY column_name;

-- 3. Adicionar colunas necessárias (se não existirem)
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;

-- 4. Remover colunas desnecessárias (se existirem)
ALTER TABLE configuracoes_empresa 
DROP COLUMN IF EXISTS openai_agent_instructions,
DROP COLUMN IF EXISTS openai_model;

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

-- 6. Verificar empresas e suas configurações
SELECT 'CONFIGURAÇÕES ATUAIS:' as info;
SELECT 
  e.id as empresa_id,
  e.nome as empresa,
  CASE 
    WHEN c.id IS NULL THEN 'SEM CONFIGURAÇÃO'
    ELSE 'CONFIGURADA'
  END as status_config,
  CASE 
    WHEN c.openai_api_key IS NOT NULL THEN 'SIM'
    ELSE 'NÃO'
  END as tem_api_key,
  CASE 
    WHEN c.openai_agent_id IS NOT NULL THEN 'SIM'
    ELSE 'NÃO'
  END as tem_agente
FROM empresas e
LEFT JOIN configuracoes_empresa c ON e.id = c.empresa_id
ORDER BY e.nome;

-- 7. Criar configurações para empresas que não têm
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

-- 8. Verificar resultado final
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

-- 9. Mostrar estrutura final da tabela
SELECT 'ESTRUTURA FINAL:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY column_name;
