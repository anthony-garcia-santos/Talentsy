'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  obterPerfilPorId,
  autenticacaoLogin,
  enviarPerfilCompleto
} from '@/Services/Cliente/Cliente';
import Navbar from "@/components/navbar";
import Rodapé from "@/components/Rodapé";

interface Projeto {
  titulo: string;
  descricao: string;
}

interface Perfil {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  sobre?: string;
  habilidades?: string[];
  projetosRecentes?: Projeto[];
  cargo?: string;
}

export default function EditarPerfil() {
  const router = useRouter();
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : id;
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Verificação de segurança
  useEffect(() => {
    const verificarPermissao = async () => {
      try {
        const usuario = await autenticacaoLogin();
        setUsuarioId(usuario.id.toString());

        if (usuario.id.toString() !== idStr) {
          router.push('/nao-autorizado');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    if (idStr) {
      verificarPermissao();
    }
  }, [idStr, router]);

  const carregarPerfil = useCallback(async () => {
    if (!idStr) return;

    try {
      const dados = await obterPerfilPorId(idStr);

      const habilidadesArray = dados.data.habilidades
        ? dados.data.habilidades.split(',').map((h: string) => h.trim())
        : [];

      let projetosArray: Projeto[] = [];
      if (dados.data.projetosRecentes) {
        try {
          projetosArray = JSON.parse(dados.data.projetosRecentes);
          if (!Array.isArray(projetosArray)) {
            projetosArray = [];
          }
        } catch {
          projetosArray = [];
        }
      }

      setPerfil({
        ...dados.data,
        habilidades: habilidadesArray,
        projetosRecentes: projetosArray
      });
      setPreviewUrl(dados.data.foto || null);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }, [idStr]);

  useEffect(() => {
    if (usuarioId && idStr && usuarioId === idStr) {
      carregarPerfil();
    }
  }, [usuarioId, idStr, carregarPerfil]);







  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.match('image.*')) {
        setError('Por favor, selecione uma imagem (JPEG, PNG)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ser menor que 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };









  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!idStr || !perfil) {
      setError('Dados incompletos para edição');
      setLoading(false);
      return;
    }

    try {
      await enviarPerfilCompleto(
        idStr,
        {
          sobre: perfil.sobre || '',
          habilidades: perfil.habilidades?.join(', ') || '',
          projetos_recentes: JSON.stringify(perfil.projetosRecentes || []),
          cargo: perfil.cargo || '',
        },
        selectedFile || undefined
      );

      setSuccess(true);
      setTimeout(() => {
        router.push(`/PerfilGeral/${idStr}`);
      }, 1500);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };






  const handleProjetosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        setPerfil(prev => prev ? {
          ...prev,
          projetosRecentes: parsed
        } : null);
      }
    } catch (err) {
      console.warn("JSON inválido nos projetos recentes");
    }
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div>Carregando dados de edição...</div>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div>Perfil não encontrado</div>
      </main>
    );
  }











  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar usuarioId={usuarioId} perfilId={idStr} />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">Editar Perfil</h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-4 rounded mb-4">
            Perfil atualizado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#1e1e1e] p-8 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* FOTO */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-bold text-lg mb-2">Foto do Perfil:</label>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-blue-600">
                  <img
                    src={previewUrl || "/default-profile.jpg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="foto"
                    className="inline-block px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300 cursor-pointer"
                  >
                    Alterar Foto
                  </label>
                  {selectedFile && (
                    <p className="text-sm text-gray-400 mt-2">{selectedFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CARGO */}
            <div className="col-span-1">
              <label className="block font-semibold mb-2">Cargo:</label>
              <input
                type="text"
                value={perfil.cargo || ''}
                onChange={(e) => setPerfil(prev => prev ? { ...prev, cargo: e.target.value } : null)}
                className="w-full p-3 rounded-md bg-[#141414] border border-gray-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
                minLength={3}
              />
            </div>

            {/* SOBRE MIM */}
            <div className="col-span-1">
              <label className="block font-semibold mb-2">Sobre mim:</label>
              <textarea
                value={perfil.sobre || ''}
                onChange={(e) => setPerfil(prev => prev ? { ...prev, sobre: e.target.value } : null)}
                rows={4}
                className="w-full p-3 rounded-md bg-[#141414] border border-gray-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            {/* HABILIDADES */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-semibold mb-2">
                Habilidades <span className="text-sm text-gray-400">(separadas por vírgula)</span>:
              </label>
              <textarea
                value={perfil.habilidades?.join(', ') || ''}
                onChange={(e) => setPerfil(prev => prev ? {
                  ...prev,
                  habilidades: e.target.value.split(',').map(h => h.trim())
                } : null)}
                rows={3}
                className="w-full p-3 rounded-md bg-[#141414] border border-gray-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Ex: JavaScript, React, Node.js"
              />
            </div>

            {/* PROJETOS */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-semibold mb-2">
                Projetos Recentes <span className="text-sm text-gray-400">(formato JSON)</span>:
              </label>
              <textarea
                value={JSON.stringify(perfil.projetosRecentes || [], null, 2)}
                onChange={handleProjetosChange}
                rows={6}
                className="w-full p-3 font-mono text-sm rounded-md bg-[#141414] border border-gray-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder='[{"titulo": "Exemplo", "descricao": "Detalhes do projeto"}]'
              />
              <small className="text-gray-500 mt-1 block">
                Formato válido: [{"{"}"titulo": "Título", "descricao": "Descrição"{"}"}]
              </small>
            </div>

            {/* BOTÕES */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => router.push(`/PerfilGeral/${idStr}`)}
                className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:bg-green-800 transition duration-300"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>

      </div>

      <Rodapé />
    </main>
  )
}
