import Link from 'next/link'

const features = [
  {
    icon: '✦',
    title: 'Sounds exactly like you',
    desc: 'Tell us your style once. Every reply matches your tone — warm, casual, professional — whatever makes you, you.',
  },
  {
    icon: '◎',
    title: 'Setup in 2 minutes',
    desc: 'Fill in your property details once. WiFi, check-in times, parking, house rules — the AI handles the rest forever.',
  },
  {
    icon: '⟳',
    title: 'Refine with one click',
    desc: 'Too long? More formal? Warmer? Hit a button and get a new version instantly. No re-typing needed.',
  },
  {
    icon: '▣',
    title: 'Save your best replies',
    desc: 'Build a library of your favourite responses. Reuse them across future guests without starting from scratch.',
  },
]

const steps = [
  { num: '01', title: 'Set up your property', desc: 'Enter your listing info and describe your communication style. Takes under 2 minutes.' },
  { num: '02', title: 'Paste the guest message', desc: 'Copy any message from your Airbnb inbox and paste it into HostReply.' },
  { num: '03', title: 'Copy and send', desc: 'Get a perfect reply instantly. Edit if you want, copy, and paste back into Airbnb.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-lg tracking-tight">
            Host<span className="text-brand-500">Reply</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/app" className="btn-primary text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
          Built for solo hosts with 1–3 listings
        </div>
        <h1 className="text-5xl font-semibold text-gray-900 leading-tight tracking-tight mb-5">
          Reply to guests in seconds,<br />
          <span className="text-brand-500">not minutes</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          AI-powered reply generator that sounds exactly like you. Set up once, generate forever.
          No subscriptions with 40 confusing features.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/app" className="btn-primary text-base px-7 py-3">
            Start for free — no credit card
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">Used by solo hosts in 12+ countries</p>
      </section>

      {/* App Preview */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-3 text-xs text-gray-500">hostreply.app</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Guest message</p>
              <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
                Hi! Quick question — what's the WiFi password? Also, is it okay if we check in a little early around 2pm? Thanks!
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">AI reply — generated in 1.2s</p>
              <div className="bg-brand-500 rounded-lg p-3 text-sm text-white">
                Hey Sarah! WiFi name is "LoftGuest" and the password is "sunshine2024" — connect to it as soon as you walk in. For early check-in at 2pm, that works perfectly! I'll make sure the place is ready for you. See you soon! — Ahmad
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-3">
            Everything you actually need
          </h2>
          <p className="text-center text-gray-500 mb-12">No bloated PMS. No per-channel fees. Just smart replies.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(f => (
              <div key={f.title} className="card">
                <div className="text-brand-500 text-xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-3">How it works</h2>
          <p className="text-center text-gray-500 mb-12">Three steps from inbox to perfect reply</p>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <span className="text-xs font-semibold text-brand-600">{s.num}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-8">One plan. No surprises.</p>
          <div className="card border-2 border-brand-200">
            <div className="text-4xl font-semibold text-gray-900 mb-1">$8<span className="text-lg font-normal text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-500 mb-6">Or $72/yr — save 25%</p>
            <ul className="text-sm text-gray-600 space-y-2.5 text-left mb-7">
              {['Unlimited reply generations','Up to 3 property profiles','Saved reply library','Tone refinement (shorter, warmer, formal)','All future features included'].map(i => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-brand-500 font-bold">✓</span> {i}
                </li>
              ))}
            </ul>
            <Link href="/app" className="btn-primary w-full block text-center py-3">
              Start free for 14 days
            </Link>
            <p className="text-xs text-gray-400 mt-3">No credit card required to start</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Stop copy-pasting the same answers
          </h2>
          <p className="text-gray-500 mb-8">
            Join hosts who've stopped spending 45 minutes a day answering the same WiFi question.
          </p>
          <Link href="/app" className="btn-primary text-base px-8 py-3">
            Try HostReply free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-sm">
            Host<span className="text-brand-500">Reply</span>
          </span>
          <p className="text-xs text-gray-400">© 2025 HostReply. Built for solo hosts.</p>
        </div>
      </footer>
    </div>
  )
}
