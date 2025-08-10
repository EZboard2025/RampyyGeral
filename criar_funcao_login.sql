-- Criar função RPC para buscar usuário durante login
-- Execute este SQL no Supabase

-- Função para buscar usuário durante login (bypass RLS)
CREATE OR REPLACE FUNCTION buscar_usuario_login(
  p_email TEXT,
  p_empresa_id UUID
)
RETURNS TABLE (
  id UUID,
  empresa_id UUID,
  email TEXT,
  nome TEXT,
  cargo TEXT,
  tipo TEXT,
  senha_hash TEXT,
  ativo BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.empresa_id,
    u.email,
    u.nome,
    u.cargo,
    u.tipo,
    u.senha_hash,
    u.ativo,
    u.created_at,
    u.updated_at
  FROM usuarios u
  WHERE u.email = p_email
    AND u.empresa_id = p_empresa_id
    AND u.ativo = true
  LIMIT 1;
END;
$$;

-- Verificar se a função foi criada
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'buscar_usuario_login';
