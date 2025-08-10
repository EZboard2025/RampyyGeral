'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { empresaSelecionada, setUsuarioLogado } = useAppStore()

  useEffect(() => {
    // Se não há empresa selecionada, voltar para a página inicial
    if (!empresaSelecionada) {
      router.push('/')
    }
  }, [empresaSelecionada, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verificar se o cliente Supabase está disponível
      if (!supabase) {
        setError('Sistema temporariamente indisponível')
        return
      }

      // Buscar usuário pelo email e empresa_id
      console.log('Tentando login com:', { email, empresa_id: empresaSelecionada?.id })
      
      // Usar rpc para bypass do RLS durante login
      const { data: usuarios, error: userError } = await supabase
        .rpc('buscar_usuario_login', {
          p_email: email.toLowerCase(),
          p_empresa_id: empresaSelecionada?.id
        })

      console.log('Resultado da busca:', { usuarios, userError })

      if (userError || !usuarios) {
        console.log('Erro na busca do usuário:', userError)
        setError('Email ou senha incorretos')
        return
      }

      // Aqui você implementaria a verificação de senha
      // Por enquanto, vamos simular um login bem-sucedido
      // Em produção, você deve usar bcrypt ou similar para verificar a senha
      
      // Verificar senha (comparando com senha_hash)
      console.log('Verificando senha:', { senha_digitada: senha, senha_hash: usuarios.senha_hash })
      
      if (senha === usuarios.senha_hash) { // Para teste, comparando diretamente
        console.log('Login bem-sucedido!')
        setUsuarioLogado(usuarios)
        router.push('/dashboard')
      } else {
        console.log('Senha incorreta!')
        setError('Email ou senha incorretos')
      }

    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleVoltar = () => {
    router.push('/')
  }

  // Função para obter dados de teste baseado na empresa
  const getTestData = () => {
    switch (empresaSelecionada?.nome) {
      case 'Template':
        return {
          gestor: 'admin@template.com',
          funcionario: 'dev@template.com'
        }
      case 'TechCorp':
        return {
          gestor: 'admin@techcorp.com',
          funcionario: 'dev@techcorp.com'
        }
      case 'SalesPro':
        return {
          gestor: 'admin@salespro.com',
          funcionario: 'rep@salespro.com'
        }
      case 'InnovateLab':
        return {
          gestor: 'admin@innovatelab.com',
          funcionario: 'dev@innovatelab.com'
        }
      default:
        return {
          gestor: 'admin@empresa.com',
          funcionario: 'dev@empresa.com'
        }
    }
  }

  const testData = getTestData()

  if (!empresaSelecionada) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={handleVoltar}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center justify-center mb-6">
            {empresaSelecionada.logo_url ? (
              <img
                src={empresaSelecionada.logo_url}
                alt={empresaSelecionada.nome}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="h-16 w-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: empresaSelecionada.cor_primaria }}
              >
                {empresaSelecionada.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Bem-vindo à {empresaSelecionada.nome}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <input
                  id="senha"
                  name="senha"
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showSenha ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Dados de teste:
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Gestor:</strong> {testData.gestor} / 123456</p>
              <p><strong>Funcionário:</strong> {testData.funcionario} / 123456</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 {empresaSelecionada.nome}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
