"use client"

import { useState, useEffect } from "react";
import { listarClientes, obterPerfilPorId } from "@/Services/Cliente/Cliente";
import Link from "next/link";



interface Cliente {
    id: string;
    nome: string;
    email: string;
    foto?: string;
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
                console.error("Erro ao renderizar vitrine:", error);
                setClientes([]);
            } finally {
                setLoading(false);
            }
        }
        fetchClientes();
    }, []);

    return (
        <main className="gap-3 mt-[30px] p-2 w-full overflow-x-auto">
            <div className="text-xl sm:text-2xl font-bold mb-2">Clientes</div>

            <div className="flex gap-4 h-[252px] pb-4">

                {loading ? (

                    [...Array(3)].map((_, i) => (
                        <div className="relative w-80 h-56 rounded-lg p-[3px] bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 animate-spin-slow">
                            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white">
                                Carregando...
                            </div>
                        </div>
                    ))

                ) : clientes.length === 0 ? (
                    <p>Nenhum cliente encontrado.</p>
                ) : (
                    clientes.map((cliente) => (


                        <Link key={cliente.id} href={`/PerfilGeral/${cliente.id}`}>
                            <div className="
      bg-[#222222] text-white rounded-lg shadow-md
      h-56 p-6 min-w-[280px] sm:w-80
      flex flex-col items-start justify-center gap-2
      hover:scale-105 transition-transform cursor-pointer
    "
                            >
                                <div className="w-full flex justify-center mb-2">
                                    <img
                                        src={cliente.foto || "/file.jpg"}
                                        alt={`Foto de ${cliente.nome}`}
                                        className="w-[140px] h-[140px] rounded-full object-cover"
                                    />

                                </div>

                                <h2 className="text-lg sm:text-xl font-bold">
                                    {cliente.nome}
                                </h2>
                            </div>

                        </Link>

                    ))
                )}
            </div>
        </main >
    );
}