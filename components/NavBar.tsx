import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="w-full bg-[#181c23] border-b border-[#23272f] py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-[#61dafb] tracking-tight">Jean AI</span>
        <Link href="/" className="ml-6 text-white hover:text-[#61dafb] transition">Home</Link>
        <Link href="/platform" className="text-white hover:text-[#61dafb] transition">Platform</Link>
        <Link href="/services" className="text-white hover:text-[#61dafb] transition">Services</Link>
        <Link href="/industries" className="text-white hover:text-[#61dafb] transition">Industries</Link>
        <Link href="/contact" className="text-white hover:text-[#61dafb] transition">Contact</Link>
      </div>
      <div>
        <button className="bg-[#61dafb] text-black font-semibold px-4 py-2 rounded hover:bg-[#21a1f1] transition">Sign in</button>
        <button className="ml-2 bg-transparent border border-[#61dafb] text-[#61dafb] font-semibold px-4 py-2 rounded hover:bg-[#21a1f1] hover:text-black transition">Get Started</button>
      </div>
    </nav>
  )
} 