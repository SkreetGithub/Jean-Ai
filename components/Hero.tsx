export default function Hero() {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-[#181c23] to-[#23272f] rounded-lg mb-12">
      <h1 className="text-5xl font-extrabold text-white mb-4">Transform Your Business with <span className="text-[#61dafb]">Jean AI</span></h1>
      <p className="text-xl text-[#b0b8c1] mb-8 max-w-2xl mx-auto">Enterprise AI platform delivering measurable ROI through advanced AI-driven insights, predictive analytics, and automated optimization.</p>
      <div className="flex justify-center gap-4">
        <button className="bg-[#61dafb] text-black font-semibold px-8 py-3 rounded hover:bg-[#21a1f1] transition text-lg">Start Free Trial</button>
        <button className="bg-transparent border border-[#61dafb] text-[#61dafb] font-semibold px-8 py-3 rounded hover:bg-[#21a1f1] hover:text-black transition text-lg">View Demo</button>
      </div>
    </section>
  )
} 