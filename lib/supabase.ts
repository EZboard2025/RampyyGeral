import { createClient } from '@supabase/supabase-js'

// Criar o cliente Supabase apenas no lado do cliente
let supabase: any = null

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    console.warn('Missing Supabase environment variables')
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
