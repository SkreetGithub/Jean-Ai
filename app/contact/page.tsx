export default function ContactPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[#61dafb] mb-4">Contact</h1>
      <p className="text-lg text-[#b0b8c1] mb-8">Get in touch with the Jean AI team for support, demos, or partnership opportunities.</p>
      <form className="bg-[#23272f] rounded-lg p-8 max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block text-white mb-2">Name</label>
          <input className="w-full p-2 rounded bg-[#181c23] border border-[#444] text-white" type="text" placeholder="Your Name" />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input className="w-full p-2 rounded bg-[#181c23] border border-[#444] text-white" type="email" placeholder="you@email.com" />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Message</label>
          <textarea className="w-full p-2 rounded bg-[#181c23] border border-[#444] text-white" rows={4} placeholder="How can we help?" />
        </div>
        <button type="submit" className="bg-[#61dafb] text-black font-semibold px-6 py-2 rounded hover:bg-[#21a1f1] transition">Send Message</button>
      </form>
      <div className="text-[#b0b8c1] mt-8 text-center">
        Or email us at <a href="mailto:contact@jeanai.com" className="text-[#61dafb] hover:underline">contact@jeanai.com</a>
      </div>
    </div>
  )
} 