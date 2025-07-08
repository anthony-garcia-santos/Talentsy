//src/app/cliente/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obterPerfil } from '@/Services/Cliente/Cliente';

export default function Perfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const dados = await obterPerfil();
        setPerfil(dados.data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    carregarPerfil();
  }, [router]);

  if (loading) return <div>Carregando perfil...</div>;
  if (!perfil) return <div>Não foi possível carregar o perfil</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <div className="space-y-2">
        <p><strong>ID:</strong> {perfil.id}</p>
        <p><strong>Nome:</strong> {perfil.nome}</p>
        <p><strong>Email:</strong> {perfil.email}</p>
        {/* Adicione mais campos conforme necessário */}
      </div>
    </div>
  );
}