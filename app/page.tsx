'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowRight, Search } from 'lucide-react'
import { supabase, Empresa } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'

export default function HomePage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const { setEmpresaSelecionada } = useAppStore()

  useEffect(() => {
    carregarEmpresas()
  }, [])

  const carregarEmpresas = async () => {
    try {
      // Verificar se o cliente Supabase está disponível
      if (!supabase) {
        console.error('Supabase client not available')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setEmpresas(data || [])
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmpresaSelect = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa)
    router.push('/login')
  }

  const empresasFiltradas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Ramppy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma de treinamento e análise de vendas
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Selecione sua empresa para continuar
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Empresas Grid */}
        <div className="max-w-4xl mx-auto">
          {empresasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa disponível'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresasFiltradas.map((empresa) => (
                <div
                  key={empresa.id}
                  onClick={() => handleEmpresaSelect(empresa)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {empresa.logo_url ? (
                          <img
                            src={empresa.logo_url}
                            alt={empresa.nome}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div 
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: empresa.cor_primaria }}
                          >
                            {empresa.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {empresa.nome}
                          </h3>
                          {empresa.dominio && (
                            <p className="text-sm text-gray-500">{empresa.dominio}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: empresa.cor_primaria }}
                      ></div>
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: empresa.cor_secundaria }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500">
            © 2024 Ramppy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
