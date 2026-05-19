import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Globe, Smartphone, Brain, BotMessageSquare } from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';

const serviceData: Record<string, any> = {
  'biznesni-avtomatlashtirish': {
    title: 'Biznesni Avtomatlashtirish',
    icon: Briefcase,
    color: '#818CF8',
    desc: 'Biznes jarayonlarini raqamli tizimga o\'tkazish va kundalik ishlarni avtomatlashtirish orqali samaradorlikni oshirish.',
    details: 'Biz sizning biznesingizdagi qo\'l mehnatini kamaytiramiz va jarayonlarni 24/7 ishlovchi tizimlarga aylantiramiz.',
    features: ['CRM tizimlari', 'ERP yechimlari', 'Avtomatlashtirilgan hisobotlar']
  },
  'telegram-ekotizimlari': {
    title: 'Telegram Ekotizimlari',
    icon: BotMessageSquare,
    color: '#38bdf8',
    desc: 'Murakkab Telegram botlar va WebApp ilovalar orqali mijozlarga xizmat ko\'rsatishni yangi bosqichga olib chiqish.',
    details: 'Telegram platformasining barcha imkoniyatlaridan foydalanib, foydalanuvchilar uchun qulay interfeyslar yaratamiz.',
    features: ['E-commerce botlar', 'WebApp integratsiyasi', 'To\'lov tizimlari']
  },
  'ai-yechimlar': {
    title: 'Sun\'iy Intellekt Yechimlari',
    icon: Brain,
    color: '#a78bfa',
    desc: 'Loyiha va biznes jarayonlariga aqlli modellar va AI yordamchilarini integratsiya qilish.',
    details: 'ChatGPT va boshqa LLM modellarini biznesingizga moslashtiramiz.',
    features: ['AI Chatbotlar', 'Ma\'lumotlar tahlili', 'Matn generatsiyasi']
  },
  'veb-saytlar': {
    title: 'Yuqori Sifatli Veb-saytlar',
    icon: Globe,
    color: '#2dd4bf',
    desc: 'Har qanday qurilmaga moslashuvchan, tezkor va qidiruv tizimlarida (SEO) yaxshi chiquvchi professional veb-platformalar.',
    details: 'Eng zamonaviy texnologiyalar yordamida dunyo standartidagi saytlarni tayyorlaymiz.',
    features: ['SEO optimizatsiya', 'Responsive dizayn', 'Tezkor yuklanish']
  },
  'mobil-ilovalar': {
    title: 'Mobil Ilovalar',
    icon: Smartphone,
    color: '#fb7185',
    desc: 'iOS va Android qurilmalari uchun bir vaqtning o\'zida ishlovchi mukammal va qulay mobil dasturlar yaratish.',
    details: 'Foydalanuvchilar uchun qulay va chiroyli interfeysga ega ilovalar.',
    features: ['Cross-platform', 'UI/UX dizayn', 'App Store/Play Store']
  }
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = serviceData[id || ''];

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#050505]">
      <CosmicBackground />
      <div className="relative z-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Xizmat topilmadi</h1>
        <button onClick={() => navigate('/')} className="text-indigo-400 underline">Asosiy sahifaga qaytish</button>
      </div>
    </div>
  );

  const Icon = service.icon;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <CosmicBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto pt-12 md:pt-20 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 md:mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm md:text-base font-medium">Orqaga qaytish</span>
        </button>

        <div className="glass-panel p-6 sm:p-8 md:p-12 border-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 md:mb-10 text-center sm:text-left">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
              <Icon className="w-8 h-8 md:w-12 md:h-12" style={{ color: service.color }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {service.title}
              </h1>
              <div className="h-1 w-20 bg-indigo-500/50 mx-auto sm:mx-0 rounded-full" />
            </div>
          </div>

          <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 leading-relaxed text-center sm:text-left">
            {service.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Biz nima qilamiz?
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {service.details}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Asosiy imkoniyatlar
              </h3>
              <ul className="space-y-3">
                {service.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-3 text-gray-400 text-sm md:text-base">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0" /> 
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
