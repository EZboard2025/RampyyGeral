import { createClient } from '@supabase/supabase-js'

let supabase: any = null

// Função para criar o cliente Supabase
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Criar o cliente apenas se as variáveis estiverem disponíveis
if (typeof window !== 'undefined') {
  // No lado do cliente
  supabase = createSupabaseClient()
} else {
  // No lado do servidor, criar apenas se as variáveis existirem
  try {
    supabase = createSupabaseClient()
  } catch (error) {
    console.warn('Supabase client not available on server side')
  }
}

export { supabase }

// Tipos para as tabelas
export interface Empresa {
  id: string
  nome: string
  logo_url?: string
  cor_primaria: string
  cor_secundaria: string
  dominio?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  empresa_id: string
  email: string
  nome: string
  cargo: string
  tipo: 'gestor' | 'funcionario'
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface ConfiguracaoEmpresa {
  id: string
  empresa_id: string
  feature_chat_ia: boolean
  feature_roleplay: boolean
  feature_pdi: boolean
  feature_dashboard: boolean
  feature_base_conhecimento: boolean
  feature_mentor_voz: boolean
  openai_api_key?: string
  elevenlabs_api_key?: string
  created_at: string
  updated_at: string
}
