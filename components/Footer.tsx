export default function Footer() {
  return (
    <footer className="w-full bg-[#181c23] border-t border-[#23272f] py-8 px-6 mt-12 text-center text-[#b0b8c1]">
      <div className="mb-2">
        <span className="font-bold text-[#61dafb]">Jean AI</span> &mdash; Enterprise AI Platform
      </div>
      <div className="mb-2">
        <a href="mailto:contact@jeanai.com" className="hover:text-[#61dafb]">contact@jeanai.com</a> | San Francisco, CA
      </div>
      <div className="mb-2">
        <a href="#" className="hover:text-[#61dafb] mx-2">Privacy Policy</a>
        <a href="#" className="hover:text-[#61dafb] mx-2">Terms of Service</a>
      </div>
      <div className="text-xs mt-4">© {new Date().getFullYear()} Jean AI. All rights reserved.</div>
    </footer>
  )
} 