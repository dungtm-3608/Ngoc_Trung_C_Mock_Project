import { useAuth } from '../../store/AuthContext'

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_30%),linear-gradient(180deg,#f1f5f9_0%,#dbeafe_100%)] px-6 py-8">
      <section className="w-full max-w-[720px] rounded-[28px] border border-slate-300/60 bg-white/90 p-9 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-sm max-sm:p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-green-600">
          Starter structure
        </p>
        <h1 className="m-0 text-[40px] leading-[1.05] text-slate-900 max-sm:text-[32px]">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-3.5 max-w-[56ch] leading-[1.7] text-slate-600">
          The base project folders are ready for pages, shared components, services,
          hooks, types, and routing.
        </p>

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-5 max-sm:flex-col max-sm:items-start">
          <div>
            <span className="mb-1.5 block text-xs uppercase tracking-[0.08em] text-slate-500">
              Signed in as
            </span>
            <strong>{user?.email ?? 'demo user'}</strong>
          </div>
          <button
            className="cursor-pointer rounded-full bg-slate-900 px-4.5 py-3 font-bold text-white transition hover:bg-slate-700"
            onClick={logout}
            type="button"
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  )
}
