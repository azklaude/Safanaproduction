/* ==========================================================================
   SAFANA PRODUCTION — Site Configuration
   Edit this file to update business information, services, and portfolio.
   No other file needs to change for routine content updates.
   ========================================================================== */

const siteConfig = {
  businessName: "Safana production",
  tagline: "Jasa Percetakan",

  logo: {
    src: "assets/logo/logo.svg",
    // If the file above doesn't exist yet, the wordmark fallback is shown.
  },

  whatsapp: {
    number: "6287718531275", // Replace with the real WhatsApp number, e.g. "6281234567890"
    message:
      "Halo Safana Production, saya ingin bertanya mengenai layanan percetakan.",
  },

  contact: {
    address: "Krasakan, Jebugan, Kec. Klaten Utara, Kabupaten Klaten, Jawa Tengah 57433",
    mapsUrl: "https://maps.app.goo.gl/f966ruxegPR5EyNm6", // Optional: paste a Google Maps link here to make the address clickable
    hours: [
      { label: "Senin – Jumat", value: "08.00 – 16.00" },
      { label: "Sabtu", value: "08.00 – 15.00" },
      { label: "Minggu", value: "Tutup" },
    ],
    email: "", // Optional
  },

  nav: [
    { label: "Layanan", href: "#layanan" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Tentang", href: "#tentang" },
    { label: "Kontak", href: "#kontak" },
  ],
};

/* ---- Services ----
   Add, remove, or edit entries freely — the section renders dynamically. */
const services = [
  {
    title: "Kartu Nama",
    description: "Cetak kartu nama profesional untuk kebutuhan bisnis dan personal branding.",
    image: "assets/services/business-card.webp",
  },
  {
    title: "Banner & Spanduk",
    description: "Media promosi luar ruang dengan berbagai pilihan ukuran dan bahan.",
    image: "assets/services/banner.webp",
  },
  {
    title: "Stiker Custom",
    description: "Stiker custom untuk branding produk, kemasan, dan kebutuhan promosi.",
    image: "assets/services/sticker.webp",
  },
  {
    title: "Undangan",
    description: "Cetak undangan dengan finishing rapi untuk acara penting Anda.",
    image: "assets/services/invitation.webp",
  },
  {
    title: "Brosur & Flyer",
    description: "Materi promosi cetak untuk kebutuhan pemasaran bisnis Anda.",
    image: "assets/services/brochure.webp",
  },
  {
    title: "Kemasan Produk",
    description: "Kemasan custom yang memperkuat identitas dan nilai produk Anda.",
    image: "assets/services/packaging.webp",
  },
];

/* ---- Portfolio ----
   Supports 3–20 items. The layout adapts automatically — add or remove
   entries as needed without touching any other file. */
const portfolio = [
  { image: "assets/portfolio/01.webp", title: "Kartu Nama — Klien Korporat", category: "Kartu Nama" },
  { image: "assets/portfolio/02.webp", title: "Banner Promosi Toko", category: "Banner" },
  { image: "assets/portfolio/03.webp", title: "Stiker Kemasan Produk", category: "Stiker" },
  { image: "assets/portfolio/04.webp", title: "Undangan Pernikahan", category: "Undangan" },
  { image: "assets/portfolio/05.webp", title: "Brosur Produk", category: "Brosur" },
  { image: "assets/portfolio/06.webp", title: "Kemasan Custom", category: "Kemasan" },
  { image: "assets/portfolio/07.webp", title: "Spanduk Acara", category: "Banner" },
  { image: "assets/portfolio/08.webp", title: "Kartu Nama Minimalis", category: "Kartu Nama" },
];

/* ---- Benefits / quick value proposition ---- */
const benefits = [
  {
    title: "Kualitas Terjaga",
    description: "Hasil cetak diperhatikan dari detail hingga finishing.",
  },
  {
    title: "Pilihan Produk Lengkap",
    description: "Berbagai kebutuhan cetak dalam satu tempat.",
  },
  {
    title: "Proses Praktis",
    description: "Konsultasi dan pemesanan dibuat sederhana.",
  },
  {
    title: "Siap Membantu",
    description: "Hubungi kami untuk kebutuhan cetak Anda.",
  },
];
