import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="px-5 pb-10 pt-8">
      <div className="mx-auto max-w-[1280px] rounded-[36px] bg-white px-8 py-12 sm:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <Logo />
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-ink">Platform</p>
              <ul className="space-y-2 text-ink/60">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-ink">Company</p>
              <ul className="space-y-2 text-ink/60">
                <li><a href="#top">About</a></li>
                <li><a href="#top">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-ink">Resources</p>
              <ul className="space-y-2 text-ink/60">
                <li>Help Center</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-ink/8 pt-6 text-sm text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AuraTransit. All rights reserved.</p>
          <div className="flex gap-4">
            <span>LinkedIn</span>
            <span>Instagram</span>
            <span>X</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
