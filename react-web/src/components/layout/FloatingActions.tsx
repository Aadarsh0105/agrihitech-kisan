import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Phone } from 'lucide-react';
import supportAssistant from '../../data/support-assistant.json';
import { ChatbotWidget } from './ChatbotWidget';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12.04 2a9.84 9.84 0 0 0-8.53 14.74L2 22l5.4-1.42A9.94 9.94 0 1 0 12.04 2Zm0 17.97a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.2.84.85-3.12-.2-.32A8.1 8.1 0 1 1 12.04 19.97Zm4.45-6.07c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.25-.63.79-.77.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.96-1.21a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.02-.37.1-.5.11-.11.24-.28.37-.42.12-.14.16-.24.24-.41.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.46c-.16 0-.42.06-.65.3-.22.25-.85.84-.85 2.04 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.19 3.7.58.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const phone = (import.meta.env.VITE_SUPPORT_PHONE || supportAssistant.contact.phone).replace(/[^+\d]/g, '');
  const whatsapp = (import.meta.env.VITE_WHATSAPP_NUMBER || supportAssistant.contact.whatsapp).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(supportAssistant.contact.whatsappMessage)}`;
  const actions = [
    { label: 'Call us', href: `tel:${phone}`, icon: Phone, color: 'bg-sky-600 hover:bg-sky-700', external: false },
    { label: 'WhatsApp', href: whatsappUrl, icon: WhatsAppIcon, color: 'bg-[#20b858] hover:bg-[#179c49]', external: true },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:right-6">
        {actions.map((action, index) => (
          <motion.a
            key={action.label}
            href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 }}
            className="group flex items-center gap-2"
            aria-label={action.label}
          >
            <span className="pointer-events-none hidden -translate-x-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 shadow-soft transition-all group-hover:translate-x-0 group-hover:opacity-100 sm:block">{action.label}</span>
            <span className={`grid h-12 w-12 place-items-center rounded-full text-white shadow-soft-lg transition-transform group-hover:scale-105 sm:h-14 sm:w-14 ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </span>
          </motion.a>
        ))}

        <motion.button
          type="button"
          onClick={() => setChatOpen((current) => !current)}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="group flex items-center gap-2"
          aria-label={chatOpen ? 'Close chatbot' : 'Open chatbot'}
          aria-expanded={chatOpen}
        >
          <span className="pointer-events-none hidden -translate-x-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 shadow-soft transition-all group-hover:translate-x-0 group-hover:opacity-100 sm:block">Chat with us</span>
          <span className={`grid h-12 w-12 place-items-center rounded-full text-white shadow-soft-lg transition-all sm:h-14 sm:w-14 ${chatOpen ? 'bg-foreground' : 'bg-primary hover:brightness-110'}`}>
            <MessageSquareText className="h-5 w-5" />
          </span>
        </motion.button>
      </motion.div>

      <ChatbotWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
