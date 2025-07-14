export default function Testimonials() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white text-center mb-8">What Our Clients Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#23272f] rounded-lg p-8">
          <div className="text-lg text-white mb-4">"Jean AI transformed our operations, delivering $15M in cost savings within the first year. The ROI exceeded all expectations."</div>
          <div className="font-bold text-[#61dafb]">Sarah Johnson</div>
          <div className="text-[#b0b8c1]">CTO, TechCorp Global</div>
        </div>
        <div className="bg-[#23272f] rounded-lg p-8">
          <div className="text-lg text-white mb-4">"The predictive analytics capabilities are game-changing. We can now anticipate market shifts and adjust our strategy proactively."</div>
          <div className="font-bold text-[#61dafb]">Michael Chen</div>
          <div className="text-[#b0b8c1]">VP Strategy, FinanceFirst</div>
        </div>
        <div className="bg-[#23272f] rounded-lg p-8">
          <div className="text-lg text-white mb-4">"Implementation was seamless and the support team is exceptional. Our efficiency improved by 60% in just 6 months."</div>
          <div className="font-bold text-[#61dafb]">Emily Rodriguez</div>
          <div className="text-[#b0b8c1]">COO, ManufacturingPlus</div>
        </div>
      </div>
    </section>
  )
} 