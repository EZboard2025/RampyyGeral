import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = 'https://ghfhnmjzjgvmaqhvzjdv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZmhubWp6amd2bWFxaHZ6amR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDUxODIsImV4cCI6MjA3MDQyMTE4Mn0.WHB-EwrCSgF5t-WKuK757yDn4WKWfUTISGdqZvziCUM'

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  cargo?: string
  tipo: 'gestor' | 'funcionario'
  senha_hash: string
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
