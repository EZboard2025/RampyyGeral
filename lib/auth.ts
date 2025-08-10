import { Usuario } from './supabase'

// Tipos de roles
export type UserRole = 'gestor' | 'funcionario'

// Interface para permissões
export interface Permission {
  action: string
  resource: string
  roles: UserRole[]
}

// Lista de permissões do sistema
export const PERMISSIONS: Permission[] = [
  // Gestão de usuários
  { action: 'create', resource: 'usuarios', roles: ['gestor'] },
  { action: 'read', resource: 'usuarios', roles: ['gestor', 'funcionario'] },
  { action: 'update', resource: 'usuarios', roles: ['gestor'] },
  { action: 'delete', resource: 'usuarios', roles: ['gestor'] },
  
  // Configurações da empresa
  { action: 'read', resource: 'configuracoes', roles: ['gestor'] },
  { action: 'update', resource: 'configuracoes', roles: ['gestor'] },
  
  // Dashboard e métricas
  { action: 'read', resource: 'dashboard', roles: ['gestor', 'funcionario'] },
  { action: 'read', resource: 'metricas_gerais', roles: ['gestor'] },
  { action: 'read', resource: 'metricas_pessoais', roles: ['funcionario'] },
  
  // Features de treinamento
  { action: 'use', resource: 'chat_ia', roles: ['gestor', 'funcionario'] },
  { action: 'use', resource: 'roleplay', roles: ['gestor', 'funcionario'] },
  { action: 'use', resource: 'mentor_voz', roles: ['gestor', 'funcionario'] },
  
  // PDI
  { action: 'read', resource: 'pdi_pessoal', roles: ['funcionario'] },
  { action: 'read', resource: 'pdi_geral', roles: ['gestor'] },
  { action: 'create', resource: 'pdi', roles: ['gestor'] },
  { action: 'update', resource: 'pdi', roles: ['gestor'] },
  
  // Base de conhecimento
  { action: 'read', resource: 'base_conhecimento', roles: ['gestor', 'funcionario'] },
  { action: 'create', resource: 'base_conhecimento', roles: ['gestor'] },
  { action: 'update', resource: 'base_conhecimento', roles: ['gestor'] },
  { action: 'delete', resource: 'base_conhecimento', roles: ['gestor'] },
  
  // Vendas
  { action: 'read', resource: 'vendas_pessoais', roles: ['funcionario'] },
  { action: 'read', resource: 'vendas_gerais', roles: ['gestor'] },
  { action: 'create', resource: 'vendas', roles: ['gestor', 'funcionario'] },
  
  // Avaliações
  { action: 'read', resource: 'avaliacoes_pessoais', roles: ['funcionario'] },
  { action: 'read', resource: 'avaliacoes_gerais', roles: ['gestor'] },
  { action: 'create', resource: 'avaliacoes', roles: ['gestor'] },
]

// Função para verificar permissão
export function hasPermission(user: Usuario | null, action: string, resource: string): boolean {
  if (!user) return false
  
  const permission = PERMISSIONS.find(p => 
    p.action === action && p.resource === resource
  )
  
  if (!permission) return false
  
  return permission.roles.includes(user.tipo as UserRole)
}

// Função para verificar se é gestor
export function isGestor(user: Usuario | null): boolean {
  return user?.tipo === 'gestor'
}

// Função para verificar se é funcionário
export function isFuncionario(user: Usuario | null): boolean {
  return user?.tipo === 'funcionario'
}

// Função para obter todas as permissões do usuário
export function getUserPermissions(user: Usuario | null): string[] {
  if (!user) return []
  
  return PERMISSIONS
    .filter(p => p.roles.includes(user.tipo as UserRole))
    .map(p => `${p.action}:${p.resource}`)
}

// Hook para usar autorização em componentes
export function useAuth() {
  return {
    hasPermission,
    isGestor,
    isFuncionario,
    getUserPermissions
  }
}
