import {
  Briefcase, Globe, Smartphone, Brain, BotMessageSquare,
  Database, BarChart3, FileText, Cpu, MessageSquare, Bot, LayoutGrid,
  CreditCard, ClipboardList, ScanSearch, CheckCircle2,
  Palette, MonitorSmartphone, Server, Zap, Users, Bell, Rocket,
  type LucideIcon,
} from 'lucide-react';

export type DemoVariant = 'ai-chat' | 'telegram-bot' | 'dashboard' | 'web' | 'mobile';

export interface FlowNode {
  icon: LucideIcon;
  label: string;
  sub?: string;
}

export interface ProcessStep {
  title: string;
  desc: string;
}

export interface Metric {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export interface ComparisonRow {
  label: string;
  before: string;
  after: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
  /** Optional short "thinking" line shown before the assistant answers */
  thinking?: string;
}

export interface ServiceData {
  id: string;
  icon: LucideIcon;
  color: string;
  gradient: [string, string];
  title: string;
  desc: string;
  tagline: string;
  details: string;
  features: string[];
  metrics: Metric[];
  /** Architecture / data-flow diagram nodes */
  flow: FlowNode[];
  /** Delivery process timeline */
  process: ProcessStep[];
  /** Before → after results table */
  comparison: ComparisonRow[];
  demo: DemoVariant;
  chat?: ChatTurn[];
}

export const services: ServiceData[] = [
  {
    id: 'biznesni-avtomatlashtirish',
    icon: Briefcase,
    color: '#818CF8',
    gradient: ['#6366F1', '#818CF8'],
    title: 'Biznesni Avtomatlashtirish',
    desc: "Biznes jarayonlarini raqamli tizimga o'tkazish va kundalik ishlarni avtomatlashtirish orqali samaradorlikni oshirish.",
    tagline: "Qo'l mehnatini 24/7 ishlaydigan aqlli tizimlarga aylantiramiz",
    details:
      "Biz sizning biznesingizdagi takrorlanuvchi ishlarni tahlil qilamiz va ularni avtomatlashtirilgan jarayonlarga aylantiramiz. Barcha ma'lumotlar bir joydan boshqariladi, hisobotlar esa o'z-o'zidan tayyorlanadi.",
    features: ['Buyurtma va mijozlarni boshqarish', "Avtomatik hisobot va jadval", "Bo'limlar o'rtasida bog'liqlik", 'Hujjatlarni avtomatik tayyorlash'],
    metrics: [
      { value: 70, suffix: '%', label: 'Vaqt tejaladi' },
      { value: 24, suffix: '/7', label: 'Uzluksiz ishlash' },
      { value: 99, suffix: '%', label: 'Aniqlik' },
    ],
    flow: [
      { icon: FileText, label: "Ma'lumot kirishi", sub: 'Forma · Jadval' },
      { icon: Cpu, label: 'Avtomatik jarayon', sub: 'Tizim qoidalari' },
      { icon: Database, label: 'Markaziy baza', sub: 'Yagona joy' },
      { icon: BarChart3, label: 'Hisobot va tahlil', sub: 'Jonli panel' },
    ],
    process: [
      { title: 'Audit', desc: "Mavjud jarayonlarni o'rganamiz va to'siqlarni aniqlaymiz." },
      { title: 'Xaritalash', desc: "Avtomatlashtiriladigan oqimlarni loyihalashtiramiz." },
      { title: 'Qurish', desc: "Tizim va bo'limlararo bog'liqlikni quramiz." },
      { title: 'Joriy etish', desc: "Jamoangizni o'qitamiz va tizimni ishga tushiramiz." },
      { title: 'Monitoring', desc: "Ishlashni kuzatib, doimiy yaxshilab boramiz." },
    ],
    comparison: [
      { label: 'Hisobot tayyorlash', before: '3–4 soat qo\'lda', after: '2 daqiqada avtomatik' },
      { label: 'Inson xatosi', before: "~15% xatolik", after: '0% — tizim tekshiradi' },
      { label: 'Ish vaqti', before: 'Faqat ish kunlari', after: "24/7 to'xtovsiz" },
      { label: "Ma'lumotlar joyi", before: 'Tarqoq fayllar', after: 'Yagona markaz' },
    ],
    demo: 'dashboard',
  },
  {
    id: 'telegram-ekotizimlari',
    icon: BotMessageSquare,
    color: '#38BDF8',
    gradient: ['#0EA5E9', '#38BDF8'],
    title: 'Telegram Ekotizimlari',
    desc: "Murakkab Telegram botlar va ilovalar orqali mijozlarga xizmat ko'rsatishni yangi bosqichga olib chiqish.",
    tagline: "Telegram'ni to'liq huquqli savdo va xizmat platformasiga aylantiramiz",
    details:
      "Telegram'ning barcha imkoniyatlaridan foydalanib, mijozlaringiz uchun qulay botlar va ilova oynalarini yaratamiz. To'lov, ombor va mijozlar bazasi bilan to'liq bog'langan tizim quramiz.",
    features: ['Onlayn-do\'kon botlari', 'Ilova oynasi (mini-ilova)', "Payme / Click to'lovlari", 'Boshqaruv paneli va statistika'],
    metrics: [
      { value: 1, suffix: ' soniya', label: "O'rtacha javob" },
      { value: 90, suffix: '%', label: 'Avtomatik javoblar' },
      { value: 1, prefix: '<', suffix: ' kun', label: 'Ishga tushirish' },
    ],
    flow: [
      { icon: MessageSquare, label: 'Mijoz', sub: 'Telegram' },
      { icon: Bot, label: 'Avtomatik bot', sub: 'Darhol javob' },
      { icon: LayoutGrid, label: 'Ilova oynasi', sub: 'Katalog' },
      { icon: CreditCard, label: "To'lov", sub: 'Payme · Click' },
      { icon: ClipboardList, label: 'Buyurtma boshqaruvi', sub: 'Markaz' },
    ],
    process: [
      { title: 'Stsenariy', desc: 'Bot suhbat oqimini va menyularni loyihalaymiz.' },
      { title: 'Dizayn', desc: 'Ilova oynasi interfeysini tayyorlaymiz.' },
      { title: 'Qurish', desc: 'Bot, ilova va boshqaruvni quramiz.' },
      { title: "To'lov", desc: "Payme/Click to'lov tizimlarini ulaymiz." },
      { title: 'Ishga tushirish', desc: 'Sinovdan o\'tkazib, ishga tushiramiz.' },
    ],
    comparison: [
      { label: 'Mijozga javob', before: '5–10 daqiqa kutish', after: 'Bir soniyada' },
      { label: 'Operatorlar yuki', before: 'Kun bo\'yi band', after: '90% avtomatik' },
      { label: 'Buyurtma qabul qilish', before: 'Faqat ish vaqtida', after: 'Kechayu-kunduz' },
      { label: "To'lov nazorati", before: "Qo'lda tekshirish", after: 'Avtomatik tasdiq' },
    ],
    demo: 'telegram-bot',
    chat: [
      { role: 'user', text: 'Salom! Buyurtma bermoqchiman' },
      { role: 'assistant', text: "Assalomu alaykum! 🛍 Katalogdan mahsulot tanlang yoki nomini yozing." },
      { role: 'user', text: 'AirPods Pro narxi qancha?' },
      { role: 'assistant', text: "AirPods Pro 2 — 2 450 000 so'm.\n✅ Mavjud · 🚚 Bepul yetkazib berish\n«Savatga qo'shish» tugmasini bosing 👇" },
    ],
  },
  {
    id: 'ai-yechimlar',
    icon: Brain,
    color: '#A78BFA',
    gradient: ['#8B5CF6', '#A78BFA'],
    title: "Sun'iy Intellekt Yechimlari",
    desc: 'Biznesingiz uchun savollarga javob beradigan, hujjatlarni tahlil qiladigan aqlli yordamchilar.',
    tagline: "Sizning ma'lumotlaringizga asoslangan, gapiradigan aqlli yordamchilar",
    details:
      "Biz biznesingiz uchun aqlli yordamchi quramiz — u faqat sizning hujjatlaringiz va ma'lumotlaringizga tayanib, aniq va ishonchli javoblar beradi. 24/7 ishlaydi, charchamaydi va xato qilmaydi.",
    features: ['Aqlli chat-yordamchi', "Hujjatlardan aniq javob", "Matn va so'rovlar tahlili", "Ovozni matnga o'girish"],
    metrics: [
      { value: 95, suffix: '%', label: 'Javob aniqligi' },
      { value: 40, suffix: '+', label: 'Tillar' },
      { value: 60, suffix: '%', label: 'Xarajat kamayishi' },
    ],
    flow: [
      { icon: MessageSquare, label: 'Savol', sub: 'Mijoz' },
      { icon: ScanSearch, label: 'Tahlil', sub: 'Bilim bazasi' },
      { icon: Brain, label: 'Aqlli yordamchi', sub: 'Javob tayyorlash' },
      { icon: CheckCircle2, label: 'Natija', sub: 'Aniq, manbali' },
    ],
    process: [
      { title: 'Tahlil', desc: 'Vazifa va kerakli ma\'lumot manbalarini aniqlaymiz.' },
      { title: 'Bilim bazasi', desc: "Hujjat va ma'lumotlaringizni tizimga yig'amiz." },
      { title: 'Sozlash', desc: 'Yordamchini biznesingizga moslashtiramiz.' },
      { title: 'Integratsiya', desc: "Saytingiz yoki botingizga ulaymiz." },
      { title: 'Optimizatsiya', desc: 'Aniqlik va tezlikni doimiy yaxshilab boramiz.' },
    ],
    comparison: [
      { label: 'Savolga javob', before: 'Operator qidiradi', after: 'Darhol, aniq javob' },
      { label: 'Qo\'llab-quvvatlash', before: '8 soat / kun', after: '24 soat / kun' },
      { label: 'Tillar', before: '1–2 til', after: '40+ til' },
      { label: 'Xizmat narxi', before: 'Yuqori (jamoa)', after: '60% arzonroq' },
    ],
    demo: 'ai-chat',
    chat: [
      {
        role: 'user',
        text: "Mijozlarimizning shu oydagi eng ko'p so'ralgan savoli nima?",
      },
      {
        role: 'assistant',
        thinking: "1 248 ta murojaat tahlil qilinmoqda…",
        text: "Shu oy 1 248 ta murojaatni tahlil qildim. Eng ko'p (32%) «yetkazib berish muddati» bo'yicha so'ralgan, ikkinchi o'rinda — to'lov usullari (21%). Shu ikki mavzuni avtomatik javoblar ro'yxatiga qo'shsak, operatorlar yuki ~40% kamayadi.",
      },
      { role: 'user', text: "Zo'r! Shu javoblarni avtomatlashtira olamizmi?" },
      {
        role: 'assistant',
        thinking: "Yechim tayyorlanmoqda…",
        text: "Albatta. Sizning ma'lumotlaringizga asoslangan yordamchi 24/7 javob beradi va faqat ishonchli manba topilganda gapiradi — ya'ni xato javob bermaydi.",
      },
    ],
  },
  {
    id: 'veb-saytlar',
    icon: Globe,
    color: '#2DD4BF',
    gradient: ['#14B8A6', '#2DD4BF'],
    title: 'Yuqori Sifatli Veb-saytlar',
    desc: "Har qanday qurilmaga moslashuvchan, tezkor va qidiruv tizimlarida yaxshi chiquvchi professional veb-platformalar.",
    tagline: "Tez, chiroyli va qidiruvda birinchi chiqadigan veb-platformalar",
    details:
      "Dunyo standartidagi saytlarni quramiz: har bir piksel o'ylangan dizayn, soniyaning ulushida yuklanish va qidiruv tizimlari uchun to'liq optimallashtirilgan ko'rinish. Saytingiz mijozlarni mijoz qiladi.",
    features: ['Mobil-birinchi dizayn', 'Qidiruvda yuqori (SEO)', "Tezkor yuklanish", 'Oson boshqaruv paneli'],
    metrics: [
      { value: 98, suffix: '/100', label: 'Tezlik bahosi' },
      { value: 1, prefix: '<', suffix: ' s', label: 'Yuklanish vaqti' },
      { value: 100, suffix: '%', label: 'Mobil moslik' },
    ],
    flow: [
      { icon: Palette, label: 'Dizayn', sub: "Ko'rinish" },
      { icon: MonitorSmartphone, label: 'Ishlab chiqish', sub: 'Sayt' },
      { icon: Server, label: 'Server', sub: "Ma'lumot" },
      { icon: Zap, label: 'Tezkor yetkazish', sub: 'Global tarmoq' },
      { icon: Users, label: 'Foydalanuvchi', sub: 'Tez yuklanish' },
    ],
    process: [
      { title: 'Tadqiqot', desc: "Maqsad va auditoriyani o'rganamiz." },
      { title: 'Dizayn', desc: 'Prototip va vizual identifikatsiya.' },
      { title: 'Qurish', desc: "Sayt va boshqaruvni quramiz." },
      { title: 'Optimizatsiya', desc: 'Qidiruv va tezlikni sozlaymiz.' },
      { title: 'Ishga tushirish', desc: 'Domen, joylashtirish va monitoring.' },
    ],
    comparison: [
      { label: 'Yuklanish tezligi', before: '5–8 soniya', after: '1 soniyadan kam' },
      { label: 'Qidiruvda o\'rin', before: '2–3 sahifa orqada', after: 'Birinchi sahifa' },
      { label: 'Mobil ko\'rinish', before: 'Buziladi', after: 'Mukammal moslashadi' },
      { label: 'Konversiya', before: 'Past', after: '2–3 barobar yuqori' },
    ],
    demo: 'web',
  },
  {
    id: 'mobil-ilovalar',
    icon: Smartphone,
    color: '#FB7185',
    gradient: ['#F43F5E', '#FB7185'],
    title: 'Mobil Ilovalar',
    desc: "iOS va Android qurilmalari uchun bir vaqtda ishlovchi mukammal va qulay mobil dasturlar yaratish.",
    tagline: "Bitta loyihadan iOS va Android uchun mukammal ilovalar",
    details:
      "Bitta loyihadan ham iOS, ham Android uchun ilova quramiz — bu vaqt va xarajatni tejaydi, lekin sifatdan voz kechmaydi. Push-bildirishnomalar, oflayn rejim va do'konlarga nashr — barchasini biz qilamiz.",
    features: ['iOS + Android bir vaqtda', 'Push-bildirishnomalar', 'Oflayn rejim', 'App Store / Play Store nashri'],
    metrics: [
      { value: 2, prefix: 'x', label: 'Tezroq ishlab chiqish' },
      { value: 60, suffix: ' FPS', label: 'Silliq animatsiya' },
      { value: 4.8, suffix: '★', label: "Do'kon reytingi" },
    ],
    flow: [
      { icon: Palette, label: 'Dizayn', sub: "Ko'rinish" },
      { icon: Smartphone, label: 'Mobil ilova', sub: 'iOS + Android' },
      { icon: Server, label: 'Server', sub: "Ma'lumot" },
      { icon: Bell, label: 'Bildirishnoma', sub: 'Push' },
      { icon: Rocket, label: 'Nashr', sub: 'App Store · Play' },
    ],
    process: [
      { title: 'Konsepsiya', desc: "Ilova g'oyasi va funksiyalarini aniqlaymiz." },
      { title: 'Dizayn', desc: 'Foydalanuvchi tajribasini loyihalaymiz.' },
      { title: 'Qurish', desc: 'Ilova va serverni quramiz.' },
      { title: 'Test', desc: 'Haqiqiy qurilmalarda sinovdan o\'tkazamiz.' },
      { title: 'Nashr', desc: "Do'konlarga joylaymiz va qo'llab-quvvatlaymiz." },
    ],
    comparison: [
      { label: 'Ishlab chiqish', before: '2 ta alohida ilova', after: 'Bitta loyiha — 2 platforma' },
      { label: 'Byudjet', before: '2x xarajat', after: '2x tejamkor' },
      { label: 'Yangilanish', before: 'Sekin, alohida', after: 'Bir vaqtda, tez' },
      { label: 'Tezlik', before: 'Sekin interfeys', after: '60 FPS silliq' },
    ],
    demo: 'mobile',
  },
];

export const serviceMap: Record<string, ServiceData> = Object.fromEntries(
  services.map((s) => [s.id, s]),
);

export function getService(id: string | undefined): ServiceData | undefined {
  if (!id) return undefined;
  return serviceMap[id];
}
