import dynamic from 'next/dynamic'
import Image from 'next/image'

const JeanAIChat = dynamic(() => import('@/components/JeanAIWidget').then(mod => mod.default), { ssr: false })

export default function JeanAIDemo() {
  return (
    <section className="mb-12">
      <div className="max-w-2xl mx-auto bg-[#23272f] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2d3748] bg-[#181c23]">
          <Image src="/placeholder-logo.png" alt="Jean AI" width={40} height={40} className="rounded-full" />
          <div>
            <div className="font-bold text-lg text-white">Jean AI</div>
            <div className="text-xs text-[#61dafb]">Online</div>
          </div>
        </div>
        <div className="p-0">
          <JeanAIChat />
        </div>
        {/* Footer */}
        <div className="text-center text-xs text-[#b0b8c1] py-2 border-t border-[#2d3748] bg-[#181c23]">Powered by Jean AI</div>
      </div>
    </section>
  )
} 