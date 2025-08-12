-- Verificar usuários da Template
-- Execute este SQL no Supabase para debugar o problema

-- 1. Verificar se a empresa Template existe
SELECT id, nome FROM empresas WHERE nome = 'Template';

-- 2. Verificar todos os usuários da Template
SELECT 
  id, 
  nome, 
  email, 
  tipo, 
  senha_hash, 
  ativo,
  empresa_id
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
ORDER BY tipo, nome;

-- 3. Verificar especificamente os usuários que deveriam existir
SELECT 
  id, 
  nome, 
  email, 
  tipo, 
  senha_hash, 
  ativo
FROM usuarios 
WHERE email IN ('admin@template.com', 'dev@template.com')
AND empresa_id = (SELECT id FROM empresas WHERE nome = 'Template');

-- 4. Contar quantos usuários existem por empresa
SELECT 
  e.nome as empresa,
  COUNT(u.id) as total_usuarios
FROM empresas e
LEFT JOIN usuarios u ON e.id = u.empresa_id
GROUP BY e.id, e.nome
ORDER BY e.nome;
