-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create empresas table
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  logo_url TEXT,
  cor_primaria VARCHAR(7) DEFAULT '#3B82F6',
  cor_secundaria VARCHAR(7) DEFAULT '#1E40AF',
  dominio VARCHAR(255) UNIQUE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usuarios table
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(255),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('gestor', 'funcionario')),
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, email)
);

-- Create configuracoes_empresa table
CREATE TABLE configuracoes_empresa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  feature_chat_ia BOOLEAN DEFAULT true,
  feature_roleplay BOOLEAN DEFAULT true,
  feature_pdi BOOLEAN DEFAULT true,
  feature_dashboard BOOLEAN DEFAULT true,
  feature_base_conhecimento BOOLEAN DEFAULT true,
  feature_mentor_voz BOOLEAN DEFAULT true,
  openai_api_key TEXT,
  elevenlabs_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id)
);

-- Create vendas table
CREATE TABLE vendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  data_venda DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'concluida',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create base_conhecimento table
CREATE TABLE base_conhecimento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  categoria VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create avaliacoes table
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'roleplay', 'pdi', 'mentor'
  pontuacao INTEGER CHECK (pontuacao >= 0 AND pontuacao <= 100),
  feedback TEXT,
  criterios JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pdi table
CREATE TABLE pdi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  objetivos JSONB,
  prazo DATE,
  status VARCHAR(50) DEFAULT 'em_andamento',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdi ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for empresas (public read for selection)
CREATE POLICY "Empresas são visíveis para seleção" ON empresas
  FOR SELECT USING (ativo = true);

-- Create RLS policies for usuarios
CREATE POLICY "Usuários veem apenas usuários da mesma empresa" ON usuarios
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create RLS policies for configuracoes_empresa
CREATE POLICY "Configurações são visíveis apenas para a empresa" ON configuracoes_empresa
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create RLS policies for vendas
CREATE POLICY "Vendas são visíveis apenas para a empresa" ON vendas
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create RLS policies for base_conhecimento
CREATE POLICY "Base de conhecimento é visível apenas para a empresa" ON base_conhecimento
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create RLS policies for avaliacoes
CREATE POLICY "Avaliações são visíveis apenas para a empresa" ON avaliacoes
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create RLS policies for pdi
CREATE POLICY "PDI é visível apenas para a empresa" ON pdi
  FOR ALL USING (empresa_id = current_setting('app.empresa_id')::UUID);

-- Create indexes for better performance
CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_vendas_empresa_id ON vendas(empresa_id);
CREATE INDEX idx_vendas_funcionario_id ON vendas(funcionario_id);
CREATE INDEX idx_vendas_data_venda ON vendas(data_venda);
CREATE INDEX idx_base_conhecimento_empresa_id ON base_conhecimento(empresa_id);
CREATE INDEX idx_avaliacoes_empresa_id ON avaliacoes(empresa_id);
CREATE INDEX idx_avaliacoes_funcionario_id ON avaliacoes(funcionario_id);
CREATE INDEX idx_pdi_empresa_id ON pdi(empresa_id);
CREATE INDEX idx_pdi_funcionario_id ON pdi(funcionario_id);

-- Insert sample data for testing
INSERT INTO empresas (nome, cor_primaria, cor_secundaria, dominio) VALUES
('TechCorp', '#3B82F6', '#1E40AF', 'techcorp.ramppy.com'),
('SalesPro', '#10B981', '#059669', 'salespro.ramppy.com'),
('InnovateLab', '#F59E0B', '#D97706', 'innovatelab.ramppy.com');

-- Insert sample configurations
INSERT INTO configuracoes_empresa (empresa_id, feature_chat_ia, feature_roleplay, feature_pdi, feature_dashboard, feature_base_conhecimento, feature_mentor_voz)
SELECT id, true, true, true, true, true, true FROM empresas;
