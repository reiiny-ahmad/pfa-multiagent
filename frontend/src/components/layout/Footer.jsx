import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-manus-black border-t border-gray-800 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-white italic mb-1">Less structure,</h2>
          <h2 className="font-serif text-2xl text-white italic">more intelligence.</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
          <p className="text-xs">© 2024 SNRT — PFA Multi-Agents. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
