"use client"

import { useState, useEffect } from "react";
import { listarClientes } from "@/Services/Cliente/Cliente";
import Link from "next/link";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export default function ClientesVitrine() {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function fetchClientes() {
      try {

        const dados = await listarClientes();
        setClientes(Array.isArray(dados) ? dados : []);

      } catch (error) {
        console.error("Erro ao rederizar vitrine", error);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
  }, []);

  return (
    <main className="gap-3 mt-[-15px] p-2 w-full">
      <div className="w-max text-2xl font-bold">Clientes</div>
      <div className="flex md:flex-row sm:flex-col gap-4 h-[252px]">
        {loading ? (
          <p>Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          clientes.map((cliente) => (
            <Link key={cliente.id} href={`/PerfilGeral/${cliente.id}`}>
              <button className="bg-[#222222] shadow-blue-300 text-white rounded-lg shadow-md h-56 p-6 mb-4 w-80 cursor-pointer"
              >
                <h2 className=" relative bottom-20 right-28 text-xl font-bold">{cliente.nome}</h2>
              </button>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
