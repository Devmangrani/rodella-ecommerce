import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "916380897553";
const CONTACT_EMAIL = "rodellaaerospace@gmail.com";
const CONTACT_URL = "https://rodella.in/";

const MaintenancePage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/70 bg-white/80 backdrop-blur shadow-xl p-8 md:p-12 text-center animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Website Temporarily Down
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-700">
          We're currently making improvements. We'll be back soon.
        </p>
        <p className="mt-2 text-sm md:text-base text-slate-600">
          If you need anything, feel free to contact us.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-white font-medium transition-transform duration-300 hover:scale-[1.02] hover:bg-emerald-600"
          >
            <FaWhatsapp className="h-5 w-5" />
            WhatsApp Us
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-slate-800 font-medium transition-transform duration-300 hover:scale-[1.02] hover:bg-slate-50"
          >
            <FaEnvelope className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>

          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-slate-800 font-medium transition-transform duration-300 hover:scale-[1.02] hover:bg-slate-50"
          >
            Contact Us
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default MaintenancePage;
