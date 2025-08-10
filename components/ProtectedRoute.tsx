'use client'

import { ReactNode } from 'react'
import { useAppStore } from '@/lib/store'
import { hasPermission, isGestor, isFuncionario } from '@/lib/auth'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'gestor' | 'funcionario'
  requiredPermission?: {
    action: string
    resource: string
  }
  fallback?: ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) {
  const { usuarioLogado } = useAppStore()

  // Verificar se usuário está logado
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  // Verificar role específico
  if (requiredRole) {
    if (requiredRole === 'gestor' && !isGestor(usuarioLogado)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para gestores.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com o administrador da sua empresa.
            </p>
          </div>
        </div>
      )
    }

    if (requiredRole === 'funcionario' && !isFuncionario(usuarioLogado)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para funcionários.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com o gestor da sua empresa.
            </p>
          </div>
        </div>
      )
    }
  }

  // Verificar permissão específica
  if (requiredPermission) {
    if (!hasPermission(usuarioLogado, requiredPermission.action, requiredPermission.resource)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Permissão Negada
            </h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar este recurso.
            </p>
            <p className="text-sm text-gray-500">
              Ação: {requiredPermission.action} | Recurso: {requiredPermission.resource}
            </p>
          </div>
        </div>
      )
    }
  }

  // Se chegou até aqui, tem permissão
  return <>{children}</>
}
