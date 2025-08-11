-- Adicionar usuário dev@innovatelab.com que está faltando
-- Execute este SQL no Supabase

-- Verificar se o usuário já existe
SELECT id, nome, email, tipo, ativo 
FROM usuarios 
WHERE email = 'dev@innovatelab.com';

-- Inserir o usuário dev@innovatelab.com se não existir
INSERT INTO usuarios (empresa_id, email, nome, cargo, tipo, senha_hash, ativo) 
SELECT 
  (SELECT id FROM empresas WHERE nome = 'InnovateLab'),
  'dev@innovatelab.com',
  'Dev InnovateLab',
  'Desenvolvedor',
  'funcionario',
  '123456',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios 
  WHERE email = 'dev@innovatelab.com' 
  AND empresa_id = (SELECT id FROM empresas WHERE nome = 'InnovateLab')
);

-- Verificar todos os usuários da InnovateLab
SELECT 
  id, 
  nome, 
  email, 
  tipo, 
  senha_hash, 
  ativo
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'InnovateLab')
ORDER BY tipo, nome;
