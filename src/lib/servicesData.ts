import { Building2, Briefcase, Users, GraduationCap, FileText, PlaneTakeoff, type LucideIcon } from "lucide-react";

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServiceStep {
  title: string;
  desc: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  tagline: string;
  shortDesc: string;
  Icon: LucideIcon;
  isCorporate: boolean;
  overview: string;
  features: ServiceFeature[];
  process: ServiceStep[];
  forWhom: Array<{ label: string; desc: string }>;
  faqs: ServiceFaq[];
  relatedSlugs: string[];
  accentColor: { hex: string; rgb: string; light: string };
  seoKeywords: string[];
  seoDescription: string;
}

export const servicesList: ServiceData[] = [
  {
    slug: "corporate-mice",
    title: "Corporate MICE",
    tagline: "Meetings · Incentives · Conferences · Exhibitions",
    shortDesc: "End-to-end planning and flawless execution for corporate events of every scale — from intimate boardroom meetings to grand international exhibitions.",
    Icon: Building2,
    isCorporate: true,
    overview: "My Perfect Trips is a leading Corporate MICE specialist trusted by enterprises across India. We take full ownership of your event — from initial concept to post-event analysis — so your team can focus entirely on business outcomes. Our dedicated MICE desk operates round the clock, managing delegate travel, venue contracting, audio-visual production, themed gala dinners, and everything in between.",
    features: [
      { title: "Venue Scouting & Contracting", desc: "Premium venues globally — from luxury hotel ballrooms to purpose-built convention centres." },
      { title: "Delegate Travel Management", desc: "Coordinated flights, visas, transfers, and hotel blocks for groups of any size." },
      { title: "A/V & Production Setup", desc: "Professional audio-visual, stage design, LED walls, and hybrid event tech." },
      { title: "Themed Gala Dinners", desc: "Curated dining experiences with entertainment, décor, and exclusive venues." },
      { title: "Incentive Tour Planning", desc: "Motivational reward trips to premium destinations worldwide with bespoke experiences." },
      { title: "Post-Event Reporting", desc: "Comprehensive analytics, expense summaries, and feedback collation for future planning." },
    ],
    process: [
      { title: "Discovery Brief", desc: "We understand your event goals, theme, scale, budget, and key deliverables in a detailed kickoff." },
      { title: "Concept & Proposal", desc: "Our team crafts a detailed event concept, venue shortlist, budget breakdown, and timeline." },
      { title: "Execution", desc: "Seamless on-ground management with a dedicated event manager and 24/7 support crew." },
      { title: "Review & Wrap-Up", desc: "Post-event debrief, expense reconciliation, and actionable insights for the next edition." },
    ],
    forWhom: [
      { label: "MNCs & Large Enterprises", desc: "Annual conferences, leadership summits, and global incentive programs." },
      { label: "Industry Associations", desc: "Member conventions, trade exhibitions, and award ceremonies." },
      { label: "SMEs & Startups", desc: "Team offsites, sales kick-offs, and product launch events." },
    ],
    faqs: [
      { q: "What is the minimum group size for MICE events?", a: "We handle MICE events from 20 delegates to 5,000+. Our pricing scales efficiently with group size." },
      { q: "Do you manage international MICE events?", a: "Yes. We have established partnerships in Dubai, Singapore, Bangkok, London, and across Europe for international event execution." },
      { q: "Can you handle end-to-end delegate travel?", a: "Absolutely — flights, visas, airport transfers, hotel blocks, and local transport are all managed under one roof." },
      { q: "How early should we plan our MICE event?", a: "For major international events, 4–6 months lead time is ideal. Domestic events with 3 months notice can be managed smoothly." },
    ],
    relatedSlugs: ["corporate-travel", "group-travel"],
    accentColor: { hex: "#0EA5E9", rgb: "14,165,233", light: "#E0F2FE" },
    seoDescription: "Expert Corporate MICE services in Chennai, India — meetings, incentives, conferences and exhibitions managed end-to-end by My Perfect Trips.",
    seoKeywords: ["corporate MICE services India", "MICE event management Chennai", "corporate event planning India", "incentive tour India", "conference management company Chennai", "corporate travel management", "B2B travel agency India", "corporate offsite planning"],
  },
  {
    slug: "corporate-travel",
    title: "Corporate Travel Packages",
    tagline: "Business Travel Solutions for Teams & Executives",
    shortDesc: "Streamlined, policy-compliant corporate travel management for executives and teams — maximising efficiency and minimising costs.",
    Icon: Briefcase,
    isCorporate: true,
    overview: "Managing business travel at scale requires deep expertise, strong supplier relationships, and airtight processes. My Perfect Trips acts as your dedicated corporate travel partner — implementing travel policies, securing negotiated rates, and providing 24/7 traveller support so your employees always move confidently and cost-effectively.",
    features: [
      { title: "Bulk Airfare Contracts", desc: "Negotiated group and corporate fares with major carriers for significant cost savings." },
      { title: "Executive Travel Upgrades", desc: "Business class, premium lounges, and priority services for C-suite and leadership travel." },
      { title: "Travel Policy Implementation", desc: "We help set up and enforce your company travel policy for consistent, compliant bookings." },
      { title: "Expense Tracking & Reports", desc: "Monthly travel spend reports and per-traveller analytics to keep budgets on track." },
      { title: "24/7 Traveller Support", desc: "Round-the-clock helpline for rebooking, cancellations, and emergency travel situations." },
      { title: "Visa & Documentation", desc: "Complete business visa support for all major markets including USA, UK, Schengen, and UAE." },
    ],
    process: [
      { title: "Onboarding & Policy Setup", desc: "We onboard your company, understand your travel patterns, and align with your travel policy." },
      { title: "Booking & Coordination", desc: "Our dedicated corporate desk handles all bookings, approvals, and confirmations." },
      { title: "Travel & Support", desc: "Real-time assistance throughout every journey — from check-in to return." },
      { title: "Monthly Reporting", desc: "Detailed spend analysis, savings reports, and policy compliance summaries." },
    ],
    forWhom: [
      { label: "Corporations & MNCs", desc: "Recurring business travel with multiple travellers across departments." },
      { label: "Industrial & Manufacturing Firms", desc: "Factory visits, vendor meetings, and overseas client site inspections." },
      { label: "Consulting & Professional Services", desc: "Frequent client-facing travel requiring flexibility and premium service." },
    ],
    faqs: [
      { q: "Do you offer dedicated account management?", a: "Yes. Enterprise clients receive a named account manager and a dedicated booking hotline available 24/7." },
      { q: "Can you integrate with our existing expense management tools?", a: "We provide detailed reports in formats compatible with major expense platforms. Custom integrations can be discussed for large accounts." },
      { q: "What kind of savings can we expect?", a: "Clients typically see 15–30% savings on airfare and 10–20% on accommodation through our negotiated rates and consolidation benefits." },
      { q: "Is there a minimum monthly travel spend requirement?", a: "We work with companies of all sizes. For dedicated account management, a monthly spend threshold applies — contact us for details." },
    ],
    relatedSlugs: ["corporate-mice", "visa-assistance"],
    accentColor: { hex: "#8B5CF6", rgb: "139,92,246", light: "#EDE9FE" },
    seoDescription: "Streamlined corporate travel packages for executives and teams in India. My Perfect Trips provides policy-compliant business travel management with 24/7 support.",
    seoKeywords: ["corporate travel packages India", "business travel management Chennai", "executive travel services India", "corporate tour organizer India", "business travel agency Chennai", "bulk airfare booking India", "corporate travel policy management"],
  },
  {
    slug: "group-travel",
    title: "Group Travel Bookings",
    tagline: "Coordinated Travel for Groups of Any Size",
    shortDesc: "From intimate family getaways to large-scale social tours — we handle the logistics so your group can focus on making memories.",
    Icon: Users,
    isCorporate: false,
    overview: "Group travel presents unique challenges: coordinating schedules, securing group rates, managing varied preferences, and ensuring everyone has an exceptional experience. My Perfect Trips specialises in taking the stress entirely off your hands. With dedicated group travel coordinators and volume contracts with airlines and hotels, we deliver exceptional experiences at highly competitive rates.",
    features: [
      { title: "Group Airfare Negotiation", desc: "Exclusive bulk fares and group seat blocks on preferred carriers and routes." },
      { title: "Multi-Room Hotel Blocks", desc: "Guaranteed room blocks at preferred properties with group amenities and dedicated check-in." },
      { title: "Custom Group Itineraries", desc: "Tailored day-by-day programs balancing sightseeing, leisure, dining, and activities." },
      { title: "Group Leader Support", desc: "A dedicated travel coordinator assigned to your group leader throughout the journey." },
      { title: "Special Occasion Packages", desc: "Birthday trips, anniversary tours, reunion packages with personalised touches." },
      { title: "Activity & Experiences Booking", desc: "Curated group activities — safaris, cooking classes, guided tours, and more." },
    ],
    process: [
      { title: "Group Brief", desc: "Share your group size, destination preferences, dates, budget, and any special requirements." },
      { title: "Customised Proposal", desc: "We prepare a fully costed itinerary with multiple accommodation and activity options." },
      { title: "Confirm & Book", desc: "Group contract signed, deposits collected, and all elements pre-confirmed." },
      { title: "Travel Together", desc: "On-trip support from our team ensures smooth sailing from departure to return." },
    ],
    forWhom: [
      { label: "Families & Reunions", desc: "Multi-generational holidays, family reunion trips, and extended family vacations." },
      { label: "Friend Groups", desc: "Bachelor/bachelorette trips, milestone birthdays, and gang holidays." },
      { label: "Clubs & Associations", desc: "Social clubs, cultural associations, religious pilgrimage groups, and hobby communities." },
    ],
    faqs: [
      { q: "What is the minimum group size for group travel rates?", a: "Group rates typically apply from 10 travellers onwards. Smaller groups may still benefit from bundled pricing." },
      { q: "Can you handle mixed nationality groups needing different visas?", a: "Yes. Our visa team processes applications for each nationality independently and coordinates timelines." },
      { q: "What happens if one group member needs to cancel?", a: "We structure contracts with clear cancellation policies. Travel insurance is strongly recommended and can be arranged for all group members." },
      { q: "Can you customise itineraries for groups with varied interests?", a: "Absolutely. We build flexible itineraries with optional activities so each traveller can choose their level of participation." },
    ],
    relatedSlugs: ["college-tours", "holiday-planning"],
    accentColor: { hex: "#10B981", rgb: "16,185,129", light: "#D1FAE5" },
    seoDescription: "Group travel bookings for families, friend groups, and associations in India. My Perfect Trips handles everything — airfare, hotels, activities, and on-trip support.",
    seoKeywords: ["group travel packages India", "group tour booking India", "family group tours India", "group holiday packages Chennai", "bulk travel booking India", "group tour operators India", "social group travel India"],
  },
  {
    slug: "college-tours",
    title: "College Tours & Excursions",
    tagline: "Safe, Educational & Memorable Student Travel",
    shortDesc: "Expertly managed educational tours and campus excursions for schools, colleges, and universities — prioritising safety, learning, and unforgettable experiences.",
    Icon: GraduationCap,
    isCorporate: false,
    overview: "Student travel demands a higher standard of care, communication, and safety than any other segment. My Perfect Trips has managed hundreds of successful college and school tours, developing robust protocols for student group management, parent communication, institutional compliance, and emergency response. We work closely with institutions to craft journeys that complement academic learning while creating lifelong memories.",
    features: [
      { title: "Safety-First Protocols", desc: "Verified accommodation, medical support on tours, 24/7 emergency contact, and risk assessment documentation." },
      { title: "Educational Itineraries", desc: "Curated visits to museums, historical sites, science parks, and cultural landmarks aligned with curriculum." },
      { title: "Institutional Compliance", desc: "Full documentation support including no-objection certificates, insurance, and parent consent forms." },
      { title: "Budget-Friendly Packages", desc: "Special student group rates making premium travel accessible without compromising quality." },
      { title: "Parent Communication Kits", desc: "Pre-tour information packs, emergency contacts, and live updates for parents during the tour." },
      { title: "Experienced Tour Escorts", desc: "Trained and vetted tour managers who specialise in student group supervision." },
    ],
    process: [
      { title: "Institutional Brief", desc: "Understand the academic purpose, student age group, budget limits, and preferred destinations." },
      { title: "Itinerary Design & Approval", desc: "Draft an educational itinerary submitted for institutional and parent committee approval." },
      { title: "Documentation & Registration", desc: "Handle all paperwork, insurance, transport permits, and student registrations." },
      { title: "Tour Execution", desc: "Expert tour escorts manage every day with daily check-ins to faculty and parents." },
    ],
    forWhom: [
      { label: "Schools (K-12)", desc: "Nature camps, heritage tours, science excursions, and sports tours for school students." },
      { label: "Colleges & Universities", desc: "Industrial visits, cultural exchange programs, inter-college trips, and study tours abroad." },
      { label: "Coaching Institutes", desc: "Motivational and refresher trips for competitive exam students." },
    ],
    faqs: [
      { q: "What safety measures are in place for student tours?", a: "We conduct destination risk assessments, provide trained escorts, arrange medical kit access, maintain 24/7 emergency lines, and share live location updates with institutional coordinators." },
      { q: "Can you manage international student tours?", a: "Yes. We handle student group visas, international health insurance, and overseas emergency support for international educational tours." },
      { q: "How do you handle students with dietary restrictions or medical needs?", a: "We collect detailed student profiles and coordinate with accommodation and transport providers to ensure all requirements are met." },
      { q: "What is the ideal booking lead time for college tours?", a: "We recommend booking 2–3 months in advance for domestic tours and 4–5 months for international programs to secure the best rates and complete all documentation." },
    ],
    relatedSlugs: ["group-travel", "holiday-planning"],
    accentColor: { hex: "#F97316", rgb: "249,115,22", light: "#FFEDD5" },
    seoDescription: "Safe, educational college tours and school excursions managed by My Perfect Trips. Trusted student travel operator in Chennai with safety-first protocols.",
    seoKeywords: ["college tours India", "student travel packages India", "school excursions Chennai", "educational tours India", "college trip organizer India", "student group travel India", "college industrial visits India"],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    tagline: "Hassle-Free Visa Processing for Every Destination",
    shortDesc: "Expert visa consultation, documentation support, and application processing for individuals, families, and corporate employees travelling worldwide.",
    Icon: FileText,
    isCorporate: false,
    overview: "Visa rejections and delays can derail carefully planned travel. My Perfect Trips' dedicated visa cell has successfully processed thousands of visa applications across all major markets. Our expert consultants provide end-to-end support — from documentation checklist and application filling to appointment booking and status tracking — giving you the best possible chance of a swift, successful approval.",
    features: [
      { title: "Schengen Visa Processing", desc: "Applications for all Schengen zone countries with high success rates and expedited processing." },
      { title: "UK & USA Visas", desc: "Comprehensive support for BRP, B1/B2, F1, and visitor visa applications with interview preparation." },
      { title: "UAE & GCC Visas", desc: "Tourist, transit, and employment visas for Dubai, Abu Dhabi, Oman, Bahrain, and Qatar." },
      { title: "South-East Asia Visas", desc: "Thailand, Indonesia, Malaysia, Vietnam, and other ASEAN destination processing." },
      { title: "Documentation Audit", desc: "Thorough review of your documents before submission to eliminate common rejection reasons." },
      { title: "Application Tracking", desc: "Real-time updates on your application status and proactive communication throughout." },
    ],
    process: [
      { title: "Consultation", desc: "Review travel plans, assess eligibility, and identify the right visa category and embassy." },
      { title: "Documentation Checklist", desc: "Provide a comprehensive, country-specific checklist and review all documents for completeness." },
      { title: "Application Submission", desc: "Complete and submit the application, book biometric/interview appointments as required." },
      { title: "Tracking & Delivery", desc: "Monitor application status, communicate updates, and arrange passport delivery post-approval." },
    ],
    forWhom: [
      { label: "Individual Travellers & Families", desc: "Holiday, honeymoon, family reunion, and immigration-related visa applications." },
      { label: "Corporate Employees", desc: "Business visas, work permits, and multi-entry visas for frequent corporate travellers." },
      { label: "Students", desc: "Student visas for higher education abroad and short-term study exchange programs." },
    ],
    faqs: [
      { q: "Which countries do you process visas for?", a: "We process for 50+ countries including all Schengen nations, UK, USA, Canada, Australia, UAE, Singapore, Thailand, Malaysia, Maldives, and more." },
      { q: "How long does visa processing take?", a: "Processing times vary by country and visa type — typically 5–15 business days for standard tourist visas. We advise the accurate timeline during consultation." },
      { q: "What happens if my visa is rejected?", a: "We analyse rejection reasons and advise on reapplication strategy. Our pre-submission audit significantly reduces rejection risk." },
      { q: "Do you offer expedited/urgent visa processing?", a: "Yes, for select destinations we can arrange emergency visa processing at an additional fee. Contact us immediately for urgent requirements." },
    ],
    relatedSlugs: ["corporate-travel", "holiday-planning"],
    accentColor: { hex: "#F43F5E", rgb: "244,63,94", light: "#FFE4E6" },
    seoDescription: "Professional visa assistance services for all major destinations. My Perfect Trips processes Schengen, UK, USA, UAE, and South-East Asian visas from Chennai.",
    seoKeywords: ["visa assistance Chennai", "visa processing India", "Schengen visa India", "UK visa agent Chennai", "USA visa consultation India", "travel visa services Chennai", "visa agent near me", "visa documentation support India"],
  },
  {
    slug: "holiday-planning",
    title: "Bespoke Holiday Planning",
    tagline: "Extraordinary Holidays, Crafted Entirely for You",
    shortDesc: "Luxury, personalised holiday itineraries designed around your tastes, timeline, and travel style — from intimate honeymoons to once-in-a-lifetime bucket-list journeys.",
    Icon: PlaneTakeoff,
    isCorporate: false,
    overview: "At My Perfect Trips, we believe a holiday should feel effortless and extraordinary. Our bespoke planning service begins with understanding you — your preferred pace, style, cuisine, interests, and budget — before we craft an itinerary that feels like it was made for you alone. From private villa stays in Bali to helicopter transfers in Switzerland, our curated experiences go far beyond the ordinary.",
    features: [
      { title: "Personalised Itinerary Design", desc: "Every day planned around your interests — culture, adventure, relaxation, gastronomy, or all of the above." },
      { title: "Luxury Accommodation Curation", desc: "Handpicked boutique hotels, private villas, safari lodges, and heritage properties worldwide." },
      { title: "Private Transfers & Charters", desc: "Airport pickups, yacht charters, helicopter transfers, and private car services." },
      { title: "Curated Dining Experiences", desc: "Reservations at Michelin-starred restaurants, rooftop dinners, and exclusive culinary events." },
      { title: "Special Occasion Touches", desc: "Romantic setups, anniversary surprises, in-villa celebrations, and personalised gifts." },
      { title: "24/7 Concierge on Trip", desc: "A dedicated trip concierge available throughout your journey for any assistance." },
    ],
    process: [
      { title: "Discovery Conversation", desc: "We listen — your travel history, wish-list experiences, travel style, and what makes a perfect holiday for you." },
      { title: "Bespoke Itinerary Design", desc: "We craft a day-by-day proposal with accommodation options, activities, dining, and transport." },
      { title: "Refinement & Booking", desc: "You review, we refine until every detail is perfect. Then we handle all bookings and confirmations." },
      { title: "Your Perfect Holiday", desc: "Travel with confidence — your concierge is just a message away for the entire journey." },
    ],
    forWhom: [
      { label: "Honeymoon Couples", desc: "Romantic escapes to Maldives, Santorini, Bali, Paris, and other iconic honeymoon destinations." },
      { label: "Luxury Travellers", desc: "Discerning travellers seeking exceptional experiences beyond conventional packages." },
      { label: "Anniversary & Special Occasions", desc: "Milestone birthdays, retirement trips, and bucket-list journeys crafted with care." },
    ],
    faqs: [
      { q: "What destinations do you specialise in for bespoke holidays?", a: "Globally — Maldives, Bali, Europe (Italy, Greece, France, Switzerland), Santorini, Dubai, Mauritius, Thailand, Sri Lanka, and extensive domestic India destinations." },
      { q: "Can you accommodate last-minute bespoke requests?", a: "For premium experiences, early planning yields better availability. However, we can create a beautiful itinerary within 72 hours for urgent requests using our partner network." },
      { q: "Do you cater to different budget levels?", a: "Our bespoke service spans luxury and ultra-luxury budgets. While we specialise in premium planning, we always seek the best value for your investment." },
      { q: "Can I modify the itinerary after booking?", a: "Minor adjustments are always accommodated. For significant changes, we work with suppliers to rearrange where possible, subject to availability and cancellation policies." },
    ],
    relatedSlugs: ["group-travel", "visa-assistance"],
    accentColor: { hex: "#F59E0B", rgb: "245,158,11", light: "#FEF3C7" },
    seoDescription: "Bespoke luxury holiday planning for honeymoon couples and discerning travellers. My Perfect Trips crafts personalised itineraries to Maldives, Europe, Bali, and beyond.",
    seoKeywords: ["bespoke holiday planning India", "luxury holiday packages India", "honeymoon packages Chennai", "customised tour packages India", "luxury travel agent India", "private holiday planner Chennai", "luxury international holidays India"],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesList.find((s) => s.slug === slug);
}
