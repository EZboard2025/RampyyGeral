# 🚀 Ramppy - Plataforma Multi-Tenant de Treinamento e Análise de Vendas

A Ramppy é uma plataforma SaaS multi-tenant para treinamento e análise de vendas, onde um único código serve múltiplas empresas de forma isolada e personalizada.

## 🎯 Características Principais

- **Multi-Tenant**: Um código, múltiplas empresas
- **Isolamento de Dados**: RLS (Row Level Security) no Supabase
- **Personalização**: Cada empresa tem suas cores, logo e configurações
- **Features Modulares**: Ativar/desativar funcionalidades por empresa
- **Escalabilidade**: Adicionar clientes sem modificar código

## 🏗️ Arquitetura

- **Frontend**: Next.js 14 com App Router
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Sistema próprio com RLS
- **Estado**: Zustand com persistência
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd RampyyGeral
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

Edite o `.env.local` com suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
OPENAI_API_KEY=sua_chave_da_openai
ELEVENLABS_API_KEY=sua_chave_do_elevenlabs
```

### 4. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase/migrations/001_initial_schema.sql`
3. Configure as variáveis de ambiente com suas credenciais

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **empresas**: Dados das empresas clientes
- **usuarios**: Usuários de cada empresa
- **configuracoes_empresa**: Features ativadas/desativadas por empresa
- **vendas**: Registro de vendas dos funcionários
- **base_conhecimento**: Documentos e treinamentos
- **avaliacoes**: Avaliações de desempenho
- **pdi**: Planos de Desenvolvimento Individual

### Row Level Security (RLS)

Todas as tabelas têm RLS ativo, garantindo que cada empresa só acesse seus próprios dados.

## 🎨 Personalização por Empresa

Cada empresa pode ter:
- Logo personalizada
- Cores primária e secundária
- Features ativadas/desativadas
- Configurações de integração (OpenAI, ElevenLabs)

## 🔧 Desenvolvimento

### Estrutura de Pastas
```
app/
├── page.tsx              # Seleção de empresa
├── login/
│   └── page.tsx          # Login da empresa
├── dashboard/
│   └── page.tsx          # Dashboard principal (template base)
└── globals.css           # Estilos globais

lib/
├── supabase.ts           # Cliente Supabase e tipos
└── store.ts              # Store global (Zustand)

supabase/
└── migrations/           # Scripts SQL
```

### Adicionando Novas Features

1. Crie a página em `app/dashboard/[feature]/page.tsx`
2. Adicione a feature na tabela `configuracoes_empresa`
3. Atualize o dashboard para incluir o link
4. Implemente a lógica específica da feature

### Fluxo de Autenticação

1. **Página Inicial** (`/`): Seleção de empresa
2. **Login** (`/login`): Autenticação específica da empresa
3. **Dashboard** (`/dashboard`): Interface personalizada da empresa

## 🧪 Dados de Teste

O sistema vem com dados de exemplo:
- **Empresas**: TechCorp, SalesPro, InnovateLab
- **Login**: admin@empresa.com / 123456

## 📱 Features Disponíveis

- ✅ **Dashboard**: Métricas e análises
- ✅ **Chat IA**: Assistente inteligente
- ✅ **Roleplay**: Simulações de vendas
- ✅ **PDI**: Plano de Desenvolvimento Individual
- ✅ **Base de Conhecimento**: Documentos e treinamentos
- ✅ **Mentor por Voz**: Treinamento com ElevenLabs

## 🔒 Segurança

- Row Level Security (RLS) ativo em todas as tabelas
- Isolamento completo de dados entre empresas
- Autenticação por empresa
- Validação de permissões

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outros
O projeto é compatível com qualquer plataforma que suporte Next.js.

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.
