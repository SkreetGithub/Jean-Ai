import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto bg-[#23272f] rounded-lg p-8 mt-16 shadow-lg">
      <h1 className="text-3xl font-bold text-[#61dafb] mb-6 text-center">Sign In</h1>
      <form>
        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input className="w-full p-2 rounded bg-[#181c23] border border-[#444] text-white" type="email" placeholder="you@email.com" />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2">Password</label>
          <input className="w-full p-2 rounded bg-[#181c23] border border-[#444] text-white" type="password" placeholder="Password" />
        </div>
        <button type="submit" className="w-full bg-[#61dafb] text-black font-semibold px-6 py-2 rounded hover:bg-[#21a1f1] transition mb-4">Sign In</button>
      </form>
      <div className="text-center text-[#b0b8c1]">
        Don&apos;t have an account? <Link href="/signup" className="text-[#61dafb] hover:underline">Sign Up</Link>
      </div>
    </div>
  )
} 