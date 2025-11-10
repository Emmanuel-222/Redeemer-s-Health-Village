import Link from "next/link";
import { Heart, Stethoscope, Coffee } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0fbff] to-[#f7fff4] flex items-center justify-center py-12 px-6">
      <main className="w-full max-w-6xl">
        <header className="flex flex-col items-center gap-4 text-center mb-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-md">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 21s-7-4.35-9-7.25C1.5 10.5 4 7 7 6c2.25-.75 3.5 1.25 5 2.75C14.5 7.25 15.75 4.25 18 5c3 1 5.5 4.5 4 7.75C19 16.65 12 21 12 21z"
                stroke="#2B6CB0"
                strokeWidth="1.2"
                fill="#DFF6FF"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0f172a]">Redeemer&apos;s Health Village</h1>
          <p className="text-lg text-[#334155]">Meal Ordering System</p>
          <p className="text-sm text-slate-600">Select your role to continue</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <RoleCard
            href="/patient"
            title="Patient"
            description="Order meals and track delivery status"
            accent="blue"
            icon={<Heart size={20} />}
          />

          <RoleCard
            href="/doctor"
            title="Doctor"
            description="Review and approve meal orders"
            accent="purple"
            icon={<Stethoscope size={20} />}
          />

          <RoleCard
            href="/kitchen"
            title="Kitchen"
            description="Prepare approved meals"
            accent="green"
            icon={<Coffee size={20} />}
          />
        </section>
      </main>
    </div>
  );
}

interface RoleCardProps {
  href: string;
  title: string;
  description: string;
  accent?: "blue" | "purple" | "green";
  icon: React.ReactNode;
}

function RoleCard({ href, title, description, accent, icon }: RoleCardProps) {
  const accentBg = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    green: "bg-green-100",
  }[accent || "blue"];

  const accentText = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
  }[accent || "blue"];

  return (
    <Link
      href={href}
      className="group block rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-white/40 transition p-6 h-full no-underline"
    >
      <div className="flex flex-col items-start gap-4">
        <div
          className={`rounded-full p-3 ${accentBg} ${accentText} inline-flex items-center justify-center`}
          aria-hidden
        >
          {icon}
        </div>
        <h3 className="text-lg font-medium text-[#0f172a]">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </Link>
  );
}