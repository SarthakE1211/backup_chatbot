// ─── Site Meta ───────────────────────────────────────────────────────────────
export const SITE_META = {
    title: "Pockit Engineers — On-Demand IT Support",
    description:
        "Bharat's only dedicated IT on-demand service app. Background-verified experts at your door in under 60 minutes.",
};

// ─── Header ──────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
    { label: "Services", href: "#download" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Our Promise", href: "#promise" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
];

export const HEADER = {
    loginLabel: "Get the app",
    /** In-app: use `/#download` so hash works from any route */
    loginHref: "/#download",
    bookLabel: "Book a Service",
    bookHref: "#download",
    themeToggleLabel: "Toggle Theme",
    themeDarkLabel: "Dark",
    themeLightLabel: "Light",
    googlePlayLabel: "Google Play",
    googlePlaySuperLabel: "Get it on",
    appStoreLabel: "App Store",
    appStoreSuperLabel: "Download on the",
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO = {
    badge: "Instant IT Help in 10 mins",
    headlineLine1: "Bharat's Only",
    headlineLine2: "IT Services App",
    description:
        "Get Trusted, Verified & Certified Technicians at home to fix all your tech troubles.",
    googlePlaySuperLabel: "Get it on",
    googlePlayLabel: "Google Play",
    appStoreSuperLabel: "Download on the",
    appStoreLabel: "App Store",
    nowLiveIn: "Now live in —",
    cities: ["Delhi NCR", "Mumbai", "Noida", "Pune"],
    floatingCard1Title: "Laptop Repair",
    floatingCard1Price: "₹299+",
    floatingCard2Title: "Expert Booked!",
    floatingCard2Subtitle: "Arrives in ~10 mins",
    floatingCard3Title: "Smart TV Setup",
    floatingCard3Price: "₹349+",
};

// ─── How It Works ─────────────────────────────────────────────────────────────
export const HOW_IT_WORKS = {
    sectionPill: "How It Works",
    heading: "Fix Your Tech in",
    headingHighlight: "Minutes",
    subheading: "Three simple steps. Zero confusion.",
};

export const STEPS = [
    {
        num: "01",
        pill: "STEP 01",
        title: "Select a Service",
        desc: "Browse 10+ IT categories from the app. Choose exactly what you need — no hidden packages, no surprise fees.",
        accent: "from-orange-500 to-amber-500",
    },
    {
        num: "02",
        pill: "STEP 02",
        title: "Expert Dispatched",
        desc: "A background-verified technician accepts your booking and is en-route — tracked live on your map in real time.",
        accent: "from-blue-500 to-cyan-500",
    },
    {
        num: "03",
        pill: "STEP 03",
        title: "Device Fixed",
        desc: "Your issue is resolved by a verified expert. Test everything and get back to work stress-free.",
        accent: "from-emerald-500 to-teal-500",
    },
];

// Phone screen strings used inside HowItWorks sub-components
export const PHONE_BROWSE = {
    greeting: "Good morning 👋",
    prompt: "What needs fixing?",
    searchPlaceholder: "Search services...",
    popularLabel: "Popular",
    bookButton: "BOOK",
    services: [
        { name: "Laptop Repair", price: "₹299", color: "bg-orange-500/15 text-orange-400" },
        { name: "WiFi Setup", price: "₹199", color: "bg-blue-500/15 text-blue-400" },
        { name: "Smart TV", price: "₹349", color: "bg-indigo-500/15 text-indigo-400" },
        { name: "CCTV Install", price: "₹499", color: "bg-emerald-500/15 text-emerald-400" },
    ],
};

export const PHONE_TRACKING = {
    heading: "Expert on the way",
    eta: "Arriving in ~12 mins",
    expertInitials: "RK",
    expertName: "Rajesh Kumar",
    expertRating: "⭐ 4.9",
    expertBadge: "VERIFIED",
};

export const PHONE_PAYMENT = {
    heading: "Service Complete ✓",
    subheading: "Laptop Repair — 45 mins",
    allDone: "All Done!",
    ratePrompt: "Rate your experience",
    lineItem1Label: "Screen Repair",
    lineItem1Price: "₹2,499",
    lineItem2Label: "Diagnostics",
    lineItem2Price: "FREE",
    totalLabel: "Total",
    totalPrice: "₹2,499",
    payButton: "PAY NOW",
};

// ─── KPI Stats ────────────────────────────────────────────────────────────────
export const KPI_STATS = {
    sectionPill: "Why Trust Us",
    heading: "Reliable Tech Help,",
    headingHighlight: "Every Time",
    subheading: "Thousands of homes already trust Pockit with their tech.",
    stats: [
        { target: 10113, suffix: "", label: "Customers Served" },
        { target: 10, suffix: " mins", label: "Avg Response Time" },
        { target: 562, suffix: "", label: "Verified Technicians" },
    ],
};

// ─── Pockit Promise ───────────────────────────────────────────────────────────
export const PROMISE = {
    sectionPill: "The Pockit Promise",
    heading: "Trust &",
    headingHighlight: "Transparency First.",
    subheading:
        "We don't send just anyone. Only verified, background-checked professionals you can trust.",
};

export const POCKIT_PROMISES = [
    {
        title: "Background Checked",
        desc: "Every expert undergoes police verification, ID validation, and reference checks before joining Pockit. Your safety is our highest priority — no shortcuts, no exceptions.",
        stat: "100%",
        statLabel: "Verified Experts",
        features: ["Police Verification", "ID Validation", "Reference Checks"],
    },
    {
        title: "Verified Identity",
        desc: "Real-time photo ID matching and live location tracking on every service call for complete transparency. Know exactly who's coming and when they'll arrive.",
        stat: "Live",
        statLabel: "Real-time Tracking",
        features: ["Photo ID Match", "Live GPS Tracking", "Service Timeline"],
    },
    {
        title: "Certified Experts",
        desc: "All technicians hold industry certifications and complete quarterly skill assessments to stay current. Only the top-rated professionals make the cut.",
        stat: "A+",
        statLabel: "Industry Certified",
        features: ["Industry Certs", "Quarterly Reviews", "Top-Rated Only"],
    },
] as const;

// ─── Testimonials (Bento Grid) ───────────────────────────────────────────────
export const TESTIMONIALS_SECTION = {
    sectionPill: "Testimonials",
    heading: "What Our Customers",
    headingHighlight: "Say",
    subheading: "Don't just take our word for it. Here's what thousands of happy customers have to say about their Pockit experience.",
};

// ─── Social Proof (legacy ticker — kept for reference) ────────────────────────
export const SOCIAL_PROOF = {
    sectionPill: "Reviews",
    heading: "Loved by thousands across",
    headingHighlight: "India",
    subheading: "4.9 / 5 average across 10,000+ verified reviews",
};

export const REVIEWS = [
    { name: "Tanaya Sahasrabhojane", text: "Highly recommended for quick, reliable, and hassle-free tech support at home! Fantastic app for at-home laptop and IT service! The interface is super easy to navigate, and booking takes just minutes.", rating: 5, city: "Pune", source: "Verified", avatar: "/images/tanya.jpg", image: "/images/tanya.jpg" },
    { name: "Yashodhan Pawar", text: "Pockit is a very reliable and well-designed app. It runs smoothly, feels easy to use and makes handling service requests much simpler.", rating: 5, city: "Pune", source: "Verified", avatar: "/images/Yashodhan.jpg", image: "/images/Yashodhan.jpg" },
    { name: "Aarya Kenjale", text: "Pockit's made things a lot simpler for me. They handle all my software and hardware issues, and when I accidentally wiped my macOS, their service executive came home and fixed it almost immediately. Everything was back up and running without any downtime. Highly recommend!!", rating: 5, city: "Pune", source: "Verified", avatar: "/images/Aarya.jpg", image: "/images/Aarya.jpg" },
    { name: "Kartik Ambokar", text: "Impressed with the professionalism. The engineer explained the problem clearly, suggested the best option, and got my laptop running like new.", rating: 5, city: "Mumbai", source: "Verified", avatar: "/images/Kartik.jpg", image: "/images/Kartik.jpg" },
    { name: "Tanmay Kesarkar", text: "Service ka experience kaafi smooth tha. Booking easy thi, technician time par aaya aur bina kisi hassle ke issue fix kar diya.", rating: 5, city: "Mumbai", source: "Verified", avatar: "/images/Tanmay.JPG.jpeg", image: "/images/Tanmay.JPG.jpeg" },
    { name: "Amit Phadke", text: "The App is fast and reliable laptop repairs at home! The app is easy to use, the technician arrived on time, and fixed my issue in a single visit at a very reasonable price.", rating: 5, city: "Powai, Mumbai", source: "Verified", avatar: "/images/Amit.jpg", image: "/images/Amit.jpg" },
];

// ─── Download Band ────────────────────────────────────────────────────────────
export const DOWNLOAD_BAND = {
    sectionPill: "Download Now",
    headingLine1: "IT Support.",
    headingHighlight: "In Your Pocket.",
    description:
        "Download the Pockit Engineers app and get a background-verified IT expert at your door in under 60 minutes. Available on Android & iOS.",
    googlePlaySuperLabel: "GET IT ON",
    googlePlayLabel: "Google Play",
    appStoreSuperLabel: "Available on the",
    appStoreLabel: "App Store",
    qrScanLabel: "Scan to Download",
    qrAlt: "Download Pockit App QR Code",
};

// ─── Floating Download CTA ────────────────────────────────────────────────────
export const FLOATING_DOWNLOAD = {
    googlePlaySuperLabel: "GET IT ON",
    googlePlayLabel: "Google Play",
    appStoreSuperLabel: "Download on the",
    appStoreLabel: "App Store",
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER = {
    logoAlt: "Pockit Engineers Logo",
    description:
        "Bharat's only dedicated IT on-demand service app. Background-verified experts at your door in under 10 minutes.",
    copyright: `© ${new Date().getFullYear()} Pockit Engineers. All rights reserved.`,
    bookCTA: "Book a Service",
    bookHref: "/#download",
    whatsappHref: "https://wa.me/918882280156",
};

export const FOOTER_LINKS = [
    {
        title: "Services",
        links: [
            { label: "Laptop Repair", href: "/#download" },
            { label: "WiFi Setup", href: "/#download" },
            { label: "Smart TV Setup", href: "/#download" },
            { label: "CCTV Installation", href: "/#download" },
            { label: "Data Recovery", href: "/#download" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Join as a Technician", href: "/become-a-technician" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Download app", href: "/#download" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms & Conditions", href: "/terms" },
        ],
    },
];

// ─── Expert Page (Join as a Technician) ────────────────────────────────────────
export const EXPERT_HERO = {
    headlineLine1: "Your skills.",
    headlineLine2: "Real demand.",
    headlineLine3: "Your terms.",
    description: "Join 10,000+ skilled engineers across Delhi, Mumbai, Bangalore.",
    formInstruction: "Share your WhatsApp number and we'll reach out via our WhatsApp Business Account.",
    inputPlaceholder: "Your phone number",
    ctaLabel: "Join Us",
    ctaHref: "https://wa.me/918882280156",
};

export const EXPERT_BELOW = {
    heading: "Built for experts who know their worth",
    subheading: "We bring the customers. You bring the craft. Get verified, set your schedule, and grow your practice with India's trusted network of on-demand IT professionals.",
};

/** Join as a Technician — hero copy */
export const EXPERT_PAGE_UC = {
    hero: {
        headline: "Become a Pockit Expert",
        tagline: "Kaam rukna nahi chahiye. Earning rukni nahi chahiye.",
        body: "Pockit helps you get regular work, clear payments, and a system you can rely on. No chasing customers, no uncertainty — just steady jobs based on your skills.",
        cta: "Join as a Technician",
    },
} as const;

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const FAQ_SECTION = {
    sectionPill: "FAQ",
    heading: "Got",
    headingHighlight: "Questions?",
    subheading: "Everything you need to know about Pockit Engineers.",
};

export const FAQ_ITEMS = [

    {
        q: "Is there a warranty on repairs?",
        a: "Yes, we provide a 30-day service warranty on all completed jobs. If the same issue recurs within the warranty period, we'll fix it again at no extra cost.",
    },
    {
        q: "How do I track my technician?",
        a: "Once a technician accepts your booking, you can track their real-time location directly in the Pockit app. You'll also receive SMS and in-app notifications as they get closer to your location.",
    },
    {
        q: "What IT services does Pockit offer?",
        a: "We cover 10+ IT categories including Laptop & Desktop Repair, WiFi Setup & Troubleshooting, Smart TV Installation, CCTV & Security Camera Setup, Data Recovery, Printer Setup, Software Installation, Networking, and more.",
    },
    {
        q: "How do I contact Pockit support?",
        a: "You can reach us via WhatsApp at +91 88822 80156, or through the Help section in the Pockit app. Our support team is available 7 days a week.",
    },
    {
        q: "How do I become a Pockit technician?",
        a: "If you're a certified IT professional looking to join our expert network, visit the 'Join as a Technician' section on our website or app. You'll go through our verification process and skill assessment before being onboarded.",
    },
    {
        q: "How fast can a technician reach my location?",
        a: "Our average response time is under 10 minutes from booking confirmation. Once you book via the app, a background-verified expert is dispatched immediately — with live tracking so you know exactly when they'll arrive.",
    },
    {
        q: "Which cities is Pockit available in?",
        a: "Pockit Engineers is currently live in Delhi NCR, Mumbai, Pune, and Noida. We're rapidly expanding — stay tuned for your city!",
    },
    {
        q: "Are the technicians background-verified?",
        a: "Yes, every Pockit expert undergoes a strict 5-step background verification including police verification, Aadhaar validation, reference checks, skill certification, and quarterly performance reviews. Your safety is our highest priority.",
    },
    {
        q: "Do I pay before or after the service?",
        a: "You only pay after you are completely satisfied with the repair or setup. We provide upfront transparent pricing before work begins — no hidden charges, no surprises, no upfront commitment.",
    },
    {
        q: "Can I cancel or reschedule a booking?",
        a: "Yes. You can cancel or reschedule a booking anytime before the technician is dispatched, directly from the app — free of charge. Once the expert is en-route, cancellation may be subject to a small convenience fee.",
    },
    {
        q: "What if I'm not satisfied with the service?",
        a: "Your satisfaction is guaranteed. If you're not happy with the completed work, raise a complaint through the app within 24 hours and we'll arrange a free re-visit or full refund — no questions asked.",
    },
    {
        q: "What payment methods are accepted?",
        a: "We accept all major payment methods including UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking, and cash. You pay only after the service is complete.",
    },
];
