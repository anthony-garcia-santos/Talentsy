"use client"

export default function NavbarInferior() {
    return (
        <nav className="bg-[#1A1A1A] w-full h-16 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 px-4 fixed bottom-0 left-0 z-50 shadow-md border-t border-zinc-800 text-xs sm:text-sm">
            <button className="hover:text-blue-400 transition px-2 py-1 sm:px-0 sm:py-0">Contate-nos</button>
            <button className="hover:text-blue-400 transition px-2 py-1 sm:px-0 sm:py-0">Termos de Serviço</button>
            <button className="hover:text-blue-400 transition px-2 py-1 sm:px-0 sm:py-0">Política de Privacidade</button>
        </nav>
    )
}