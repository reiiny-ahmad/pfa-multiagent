import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Search, PenTool, Calendar, Layers } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-100 py-2.5 text-center text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          PFA Multi-Agents est maintenant disponible — découvrez les nouveautés
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl text-gray-900 mb-8 leading-tight"
          >
            Que puis-je faire pour vous ?
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 max-w-2xl mx-auto mb-8"
          >
            <textarea
              placeholder="Attribuez une tâche ou posez une question"
              className="w-full resize-none outline-none text-gray-700 placeholder-gray-400 min-h-[80px] text-lg"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400 text-xl cursor-pointer">+</span>
              <Link
                to="/login"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: Layers, label: 'Créer des diapositives' },
              { icon: Zap, label: 'Créer un site web' },
              { icon: PenTool, label: 'Conception' },
              { icon: Calendar, label: 'Planification' },
              { icon: Search, label: 'Recherche' },
            ].map(item => (
              <button
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Orchestrateur',       desc: 'Coordonne intelligemment tous vos agents IA',       icon: Layers,   color: 'bg-purple-100 text-purple-600' },
              { title: 'Agent de recherche',  desc: 'Recherche et analyse des données en temps réel',    icon: Search,   color: 'bg-blue-100 text-blue-600' },
              { title: 'Agent de planification', desc: 'Organise et planifie vos projets automatiquement', icon: Calendar, color: 'bg-green-100 text-green-600' },
              { title: 'Agent de rédaction',  desc: 'Génère du contenu de qualité professionnelle',      icon: PenTool,  color: 'bg-orange-100 text-orange-600' },
            ].map(feature => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
