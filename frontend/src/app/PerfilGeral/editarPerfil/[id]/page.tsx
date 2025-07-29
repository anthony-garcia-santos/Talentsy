'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  obterPerfilPorId,
  autenticacaoLogin,
  enviarPerfilCompleto,
  uploadFotoPerfil
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

  useEffect(() => {
    const verificarPermissao = async () => {
      try {
        const usuario = await autenticacaoLogin();
        setUsuarioId(usuario.id.toString());
        if (usuario.id.toString() !== idStr) {
          router.push('/nao-autorizado');
        }
      } catch {
        router.push('/login');
      }
    };
    if (idStr) verificarPermissao();
  }, [idStr, router]);

  const carregarPerfil = useCallback(async () => {
    if (!idStr) return;
    try {
      const dados = await obterPerfilPorId(idStr);
      const habs = dados.data.habilidades
        ? dados.data.habilidades.split(',').map((h: string) => h.trim())
        : [];
      let projetosArr: Projeto[] = [];
      if (dados.data.projetosRecentes) {
        try {
          projetosArr = JSON.parse(dados.data.projetosRecentes);
        } catch {
          projetosArr = [];
        }
      }
      setPerfil({ ...dados.data, habilidades: habs, projetosRecentes: projetosArr });
      setPreviewUrl(dados.data.foto || null);
    } catch {
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
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setError('Selecione uma imagem válida');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!idStr) {
      setError('ID do perfil não encontrado');
      setLoading(false);
      return;
    }

    let fotoUrl = perfil?.foto;
    if (selectedFile) {
      try {
        const { url } = await uploadFotoPerfil(idStr, selectedFile);
        fotoUrl = url;
      } catch {
        setError('Falha ao enviar a foto');
        setLoading(false);
        return;
      }
    }

    try {
      await enviarPerfilCompleto(idStr, {
        sobre: perfil!.sobre || '',
        habilidades: perfil!.habilidades?.join(', ') || '',
        projetos_recentes: JSON.stringify(perfil!.projetosRecentes || []),
        cargo: perfil!.cargo || '',
        foto: fotoUrl,
      });
      setSuccess(true);
      setTimeout(() => router.push(`/PerfilGeral/${idStr}`), 1500);
    } catch {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjetosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setPerfil(prev => prev ? { ...prev, projetosRecentes: parsed } : prev);
      }
    } catch {
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Carregando...</main>;
  }
  if (!perfil) {
    return <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Perfil não encontrado</main>;
  }

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar usuarioId={usuarioId} perfilId={idStr} />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">Editar Perfil</h1>

        {error && <div className="bg-red-500 p-4 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-500 p-4 rounded mb-4">Perfil atualizado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#1e1e1e] p-8 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Foto */}
            <div className="md:col-span-2">
              <label className="block font-bold mb-2">Foto do Perfil:</label>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-blue-600">
                  <img src={previewUrl || "/default-profile.jpg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <input id="foto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="foto" className="px-5 py-2 bg-blue-600 rounded-lg cursor-pointer">Alterar Foto</label>
                  {selectedFile && <p className="mt-2 text-gray-400">{selectedFile.name}</p>}
                </div>
              </div>
            </div>

            {/* Cargo */}
            <div>
              <label className="block mb-2">Cargo:</label>
              <input
                type="text"
                value={perfil.cargo || ''}
                onChange={e => setPerfil(p => p ? { ...p, cargo: e.target.value } : p)}
                className="w-full p-3 bg-[#141414] rounded border border-gray-600"
                placeholder="Ex: Desenvolvedor Full Stack"
                required
              />
            </div>

            {/* Sobre mim */}
            <div>
              <label className="block mb-2">Sobre mim:</label>
              <textarea
                value={perfil.sobre || ''}
                onChange={e => setPerfil(p => p ? { ...p, sobre: e.target.value } : p)}
                rows={4}
                className="w-full p-3 bg-[#141414] rounded border border-gray-600"
              />
            </div>

            {/* Habilidades */}
            <div className="md:col-span-2">
              <label className="block mb-2">Habilidades (vírgula):</label>
              <input
                type="text"
                value={perfil.habilidades?.join(', ') || ''}
                onChange={e => setPerfil(p => p ? { ...p, habilidades: e.target.value.split(',').map(h => h.trim()) } : p)}
                className="w-full p-3 bg-[#141414] rounded border border-gray-600"
              />
            </div>

            {/* Projetos */}
            <div className="md:col-span-2">
              <label className="block mb-2">Projetos Recentes (JSON):</label>
              <textarea
                value={JSON.stringify(perfil.projetosRecentes || [], null, 2)}
                onChange={handleProjetosChange}
                rows={6}
                className="w-full p-3 font-mono bg-[#141414] rounded border border-gray-600"
              />
            </div>

            {/* Botões */}
            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => router.push(`/PerfilGeral/${idStr}`)} className="px-6 py-2 bg-gray-600 rounded">Cancelar</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 rounded">{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </form>
      </div>
      <Rodapé />
    </main>
);
}
