import { useState, useEffect } from "react";
import { listarClientes } from "@/Services/Cliente/Cliente";

export default function ClientesVitrine() {
    const [loading, setLoading] = useState(true);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        async function fetchClientes() {
            try {
                const dados = await listarClientes();

                // Garante que seja array, mesmo se a API mudar no futuro
                setClientes(Array.isArray(dados) ? dados : []);
            } catch (error) {
                console.error("Erro ao buscar vitrine:", error);
                setClientes([]); // evitar undefined
            } finally {
                setLoading(false);
            }
        }

        fetchClientes();
    }, []);

    return (
        <main className=" gap-3 mt-[-14px] p-2  w-full">

            <div className=" w-max text-2xl font-bold">Clientes</div>

            <div className="flex md:flex-row sm:flex-col gap-4 h-[252px] ">


                {loading ? (
                    <p>Carregando clientes...</p>
                ) : clientes.length === 0 ? (
                    <p>Nenhum cliente encontrado.</p>
                ) : (
                    clientes.map((cliente) => (
                        <div
                            key={cliente.id}
                            className="bg-[#222222] shadow-blue-300 text-white rounded-lg shadow-md p-6 mb-4 w-80"
                        >
                            <h2 className="relative top-40 text-xl font-bold">{cliente.nome}</h2>

                            {/* Se quiser mostrar email ou outro conteúdo, coloca aqui */}
                            {/* <p className="text-sm text-gray-300">{cliente.email}</p> */}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
