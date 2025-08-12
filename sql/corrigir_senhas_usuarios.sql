-- Script para corrigir as senhas dos usuários
-- Execute este SQL no Supabase para corrigir o problema de login

-- Atualizar senhas para '123456' (hash simples para teste)
-- Em produção, você deve usar bcrypt ou similar

UPDATE usuarios 
SET senha_hash = '123456'
WHERE email IN (
  'admin@template.com',
  'dev@template.com',
  'admin@techcorp.com',
  'joao@techcorp.com',
  'maria@techcorp.com',
  'admin@salespro.com',
  'pedro@salespro.com',
  'ana@salespro.com',
  'admin@innovatelab.com',
  'carlos@innovatelab.com',
  'julia@innovatelab.com'
);

-- Verificar se as senhas foram atualizadas
SELECT 
  email, 
  nome, 
  tipo, 
  senha_hash,
  ativo
FROM usuarios 
WHERE email IN (
  'admin@template.com',
  'dev@template.com',
  'admin@techcorp.com',
  'joao@techcorp.com',
  'maria@techcorp.com',
  'admin@salespro.com',
  'pedro@salespro.com',
  'ana@salespro.com',
  'admin@innovatelab.com',
  'carlos@innovatelab.com',
  'julia@innovatelab.com'
)
ORDER BY email;

-- Verificar usuários por empresa
SELECT 
  e.nome as empresa,
  u.email,
  u.nome,
  u.tipo,
  u.senha_hash,
  u.ativo
FROM empresas e
JOIN usuarios u ON e.id = u.empresa_id
ORDER BY e.nome, u.tipo, u.email;
