-- SOLUÇÃO COMPLETA PARA O PROBLEMA DE CONFIGURAÇÕES
-- Execute este SQL no Supabase SQL Editor

-- 1. VERIFICAR SE A TABELA EXISTE
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'configuracoes_empresa'
        ) THEN 'TABELA EXISTE'
        ELSE 'TABELA NÃO EXISTE'
    END as status_tabela;

-- 2. CRIAR TABELA SE NÃO EXISTIR
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID NOT NULL,
    feature_chat_ia BOOLEAN DEFAULT true,
    feature_roleplay BOOLEAN DEFAULT true,
    feature_pdi BOOLEAN DEFAULT true,
    feature_dashboard BOOLEAN DEFAULT true,
    feature_base_conhecimento BOOLEAN DEFAULT true,
    feature_mentor_voz BOOLEAN DEFAULT true,
    openai_api_key TEXT,
    openai_agent_id TEXT,
    openai_agent_instructions TEXT,
    openai_model TEXT DEFAULT 'gpt-4-turbo-preview',
    elevenlabs_api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empresa_id)
);

-- 3. VERIFICAR COLUNAS EXISTENTES
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
ORDER BY ordinal_position;

-- 4. ADICIONAR COLUNAS OPENAI SE NÃO EXISTIREM
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_instructions TEXT,
ADD COLUMN IF NOT EXISTS openai_model TEXT DEFAULT 'gpt-4-turbo-preview';

-- 5. VERIFICAR TABELAS EXISTENTES NO BANCO
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%empresa%'
ORDER BY table_name;

-- 6. VERIFICAR CONFIGURAÇÕES EXISTENTES
SELECT 
    'CONFIGURAÇÕES EXISTENTES' as status,
    COUNT(*) as total_configuracoes
FROM configuracoes_empresa;

-- 7. MOSTRAR TODAS AS CONFIGURAÇÕES
SELECT 
    id,
    empresa_id,
    feature_chat_ia,
    feature_roleplay,
    feature_pdi,
    feature_dashboard,
    feature_base_conhecimento,
    feature_mentor_voz,
    openai_api_key IS NOT NULL as tem_openai_key,
    openai_agent_id IS NOT NULL as tem_agent_id,
    created_at
FROM configuracoes_empresa
ORDER BY created_at DESC;

-- 8. VERIFICAR SE AS COLUNAS OPENAI FORAM CRIADAS
SELECT 
    'COLUNAS OPENAI' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name LIKE '%openai%'
ORDER BY column_name;
