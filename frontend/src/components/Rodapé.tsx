
"use client"

export default function NavbarInferior() {
    return (
        <nav className="bg-[#1A1A1A] w-full h-16 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 px-4 fixed bottom-0 left-0 z-50 shadow-md border-t border-zinc-800 text-sm">
            <button className="hover:text-blue-400 transition">Contate-nos</button>
            <button className="hover:text-blue-400 transition">Termos de Serviço</button>
            <button className="hover:text-blue-400 transition">Política de Privacidade</button>
        </nav>
    )
}