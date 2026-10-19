const RESEND_API_KEY  = process.env.RESEND_API_KEY || '';
const FROM_EMAIL      = process.env.RESEND_FROM_EMAIL || 'My Perfect Trips <bookings@myperfecttrips.com>';
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL || 'info@myperfecttrips.com';
const NOTIFY_EMAIL    = process.env.ADMIN_EMAIL || 'info@myperfecttrips.com';
const ADMIN_EMAILS    = [ADMIN_EMAIL, NOTIFY_EMAIL];
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

async function sendEmail(to: string | string[], subject: string, html: string): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.warn('[Email] RESEND_API_KEY not set — skipping email');
        return false;
    }
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error('[Email] Resend error:', data);
            return false;
        }
        return true;
    } catch (err) {
        console.error('[Email] send failed:', err);
        return false;
    }
}

// ── Shared styles ────────────────────────────────────────────────────────────
const BASE_STYLE = `
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #f5f5f4;
    margin: 0; padding: 0;
`;
const CARD_STYLE = `
    max-width: 600px; margin: 32px auto; background: #ffffff;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;
const HEADER_STYLE = `
    background: #1c1917; padding: 32px 40px; text-align: center;
`;
const BODY_STYLE  = `padding: 36px 40px;`;
const FOOTER_STYLE = `
    background: #f5f5f4; padding: 20px 40px; text-align: center;
    font-size: 12px; color: #a8a29e; border-top: 1px solid #e7e5e4;
`;
const BADGE_STYLE = `
    display: inline-block; background: #fef3c7; color: #92400e;
    border-radius: 100px; padding: 4px 14px; font-size: 12px;
    font-weight: 700; letter-spacing: 0.05em; margin-bottom: 12px;
`;
const ROW_STYLE = `
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 0; border-bottom: 1px solid #f5f5f4;
    font-size: 14px;
`;
const LABEL_STYLE = `color: #78716c; font-weight: 500; min-width: 140px;`;
const VALUE_STYLE = `color: #1c1917; font-weight: 600; text-align: right;`;
const BTN_STYLE = `
    display: inline-block; background: #1c1917; color: #ffffff !important;
    text-decoration: none; padding: 14px 32px; border-radius: 10px;
    font-weight: 700; font-size: 15px; margin-top: 24px;
`;

// ── 1. Booking Confirmation → Customer ───────────────────────────────────────
export interface BookingEmailData {
    customerName:   string;
    customerEmail:  string;
    customerPhone:  string;
    packageTitle:   string;
    destination:    string;
    travelDate:     string;
    numAdults:      number;
    numChildren:    number;
    totalAmount:    number;
    referenceNumber: string;
    specialRequests?: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">

        <!-- Header -->
        <div style="${HEADER_STYLE}">
          <img src="${SITE_URL}/logo.png" alt="My Perfect Trips" height="40"
               style="height:40px; margin-bottom:16px;" onerror="this.style.display='none'" />
          <h1 style="color:#f59e0b; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
            Booking Confirmed!
          </h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:14px;">
            Reference: <strong style="color:#ffffff;">${data.referenceNumber}</strong>
          </p>
        </div>

        <!-- Body -->
        <div style="${BODY_STYLE}">
          <span style="${BADGE_STYLE}">✈ Your Trip is Booked</span>
          <h2 style="margin:0 0 4px; color:#1c1917; font-size:20px;">${data.packageTitle}</h2>
          <p style="margin:0 0 24px; color:#78716c; font-size:14px;">
            Hi ${data.customerName.split(' ')[0]}, your booking is confirmed and we're excited to plan your trip!
          </p>

          <!-- Booking details table -->
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:24px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Destination</span>
              <span style="${VALUE_STYLE}">${data.destination || data.packageTitle}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travel Date</span>
              <span style="${VALUE_STYLE}">${data.travelDate}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travellers</span>
              <span style="${VALUE_STYLE}">
                ${data.numAdults} Adult${data.numAdults !== 1 ? 's' : ''}
                ${data.numChildren > 0 ? ` + ${data.numChildren} Child${data.numChildren !== 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Amount Paid</span>
              <span style="${VALUE_STYLE}; color:#16a34a;">£${Number(data.totalAmount).toLocaleString('en-GB')}</span>
            </div>
            <div style="${ROW_STYLE} border-bottom:none;">
              <span style="${LABEL_STYLE}">Booking Ref</span>
              <span style="${VALUE_STYLE}">${data.referenceNumber}</span>
            </div>
            ${data.specialRequests ? `
            <div style="${ROW_STYLE} border-bottom:none; margin-top:4px;">
              <span style="${LABEL_STYLE}">Special Requests</span>
              <span style="${VALUE_STYLE}; max-width:300px;">${data.specialRequests}</span>
            </div>` : ''}
          </div>

          <!-- What happens next -->
          <h3 style="font-size:14px; font-weight:700; color:#1c1917; margin:0 0 12px;">What happens next?</h3>
          <div style="font-size:13px; color:#57534e; line-height:1.8;">
            <p style="margin:0 0 6px;">📞 Our travel expert will call you within <strong>24 hours</strong> to confirm your itinerary.</p>
            <p style="margin:0 0 6px;">📋 You'll receive a detailed day-by-day itinerary and hotel confirmation.</p>
            <p style="margin:0;">💬 For any queries, call us at <strong>+91 8807709919</strong> or reply to this email.</p>
          </div>

          <div style="text-align:center;">
            <a href="${SITE_URL}/dashboard" style="${BTN_STYLE}">View My Booking</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="${FOOTER_STYLE}">
          <p style="margin:0 0 4px;">My Perfect Trips — A brand of Infygru Private Limited</p>
          <p style="margin:0;">Tamil Nadu, India · +91 8807709919 · info@myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(
        data.customerEmail,
        `Booking Confirmed — ${data.packageTitle} (${data.referenceNumber})`,
        html,
    );
}

// ── 2. New Booking Alert → Admin ─────────────────────────────────────────────
export async function sendAdminBookingAlert(data: BookingEmailData): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">

        <div style="${HEADER_STYLE}">
          <h1 style="color:#f59e0b; margin:0; font-size:20px; font-weight:800;">
            🎉 New Booking Received
          </h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:14px;">
            Ref: <strong style="color:#fff;">${data.referenceNumber}</strong>
          </p>
        </div>

        <div style="${BODY_STYLE}">
          <h2 style="margin:0 0 20px; font-size:18px; color:#1c1917;">${data.packageTitle}</h2>

          <!-- Customer details -->
          <h3 style="font-size:12px; font-weight:700; color:#a8a29e; text-transform:uppercase;
                     letter-spacing:0.08em; margin:0 0 8px;">Customer</h3>
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:20px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Name</span>
              <span style="${VALUE_STYLE}">${data.customerName}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Email</span>
              <span style="${VALUE_STYLE}">
                <a href="mailto:${data.customerEmail}" style="color:#1c1917;">${data.customerEmail}</a>
              </span>
            </div>
            <div style="${ROW_STYLE} border-bottom:none;">
              <span style="${LABEL_STYLE}">Phone</span>
              <span style="${VALUE_STYLE}">
                <a href="tel:${data.customerPhone}" style="color:#1c1917;">${data.customerPhone || 'Not provided'}</a>
              </span>
            </div>
          </div>

          <!-- Booking details -->
          <h3 style="font-size:12px; font-weight:700; color:#a8a29e; text-transform:uppercase;
                     letter-spacing:0.08em; margin:0 0 8px;">Booking Details</h3>
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:20px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travel Date</span>
              <span style="${VALUE_STYLE}">${data.travelDate}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travellers</span>
              <span style="${VALUE_STYLE}">
                ${data.numAdults} Adult${data.numAdults !== 1 ? 's' : ''}
                ${data.numChildren > 0 ? ` + ${data.numChildren} Child${data.numChildren !== 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Amount Paid</span>
              <span style="${VALUE_STYLE}; color:#16a34a; font-size:16px;">
                £${Number(data.totalAmount).toLocaleString('en-GB')}
              </span>
            </div>
            ${data.specialRequests ? `
            <div style="${ROW_STYLE} border-bottom:none;">
              <span style="${LABEL_STYLE}">Special Requests</span>
              <span style="${VALUE_STYLE}">${data.specialRequests}</span>
            </div>` : ''}
          </div>

          <div style="text-align:center;">
            <a href="${SITE_URL}/dashboard" style="${BTN_STYLE}; background:#1c1917;">
              View in Dashboard
            </a>
          </div>
        </div>

        <div style="${FOOTER_STYLE}">
          <p style="margin:0;">My Perfect Trips Admin Alert · myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(
        ADMIN_EMAILS,
        `[New Booking] ${data.packageTitle} — £${Number(data.totalAmount).toLocaleString('en-GB')} — ${data.customerName}`,
        html,
    );
}

// ── 3. OTP Email ─────────────────────────────────────────────────────────────
export async function sendOTPEmail(email: string, otp: string, phone: string): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <h1 style="color:#f59e0b; margin:0; font-size:20px; font-weight:800;">Phone Verification</h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:13px;">My Perfect Trips</p>
        </div>
        <div style="${BODY_STYLE}">
          <p style="color:#57534e; font-size:14px; margin:0 0 20px;">
            Use the code below to verify your mobile number <strong style="color:#1c1917;">+91 ${phone}</strong>
          </p>
          <div style="text-align:center; margin:28px 0;">
            <div style="display:inline-block; background:#1c1917; border-radius:16px; padding:20px 48px;">
              <p style="margin:0; font-size:11px; font-weight:700; color:#a8a29e; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:8px;">Your OTP</p>
              <p style="margin:0; font-size:40px; font-weight:900; color:#f59e0b; letter-spacing:0.2em;">${otp}</p>
            </div>
          </div>
          <p style="color:#a8a29e; font-size:12px; text-align:center; margin:0;">
            Valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>
        <div style="${FOOTER_STYLE}">
          <p style="margin:0;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    </body>`;

    return sendEmail(email, `${otp} is your My Perfect Trips verification code`, html);
}

// ── 4. Welcome Email → New User ──────────────────────────────────────────────
export async function sendWelcomeEmail(name: string, email: string): Promise<boolean> {
    const firstName = name.split(' ')[0] || 'Traveller';
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">

        <div style="${HEADER_STYLE}">
          <img src="${SITE_URL}/logo.png" alt="My Perfect Trips" height="40"
               style="height:40px; margin-bottom:16px;" onerror="this.style.display='none'" />
          <h1 style="color:#f59e0b; margin:0; font-size:22px; font-weight:800;">
            Welcome to My Perfect Trips!
          </h1>
        </div>

        <div style="${BODY_STYLE}">
          <h2 style="margin:0 0 12px; color:#1c1917; font-size:18px;">
            Hi ${firstName}, great to have you! 👋
          </h2>
          <p style="color:#57534e; font-size:14px; line-height:1.7; margin:0 0 20px;">
            Your account is ready. Browse our handcrafted holiday packages, book online, and
            earn <strong>IG Reward Points</strong> on every booking.
          </p>

          <div style="background:#fef3c7; border-radius:12px; padding:16px 20px; margin-bottom:24px;">
            <p style="margin:0; font-size:13px; color:#92400e; font-weight:600;">
              🎁 First-time booking perks
            </p>
            <ul style="margin:8px 0 0; padding-left:18px; color:#92400e; font-size:13px; line-height:1.8;">
              <li>Earn 1 loyalty point for every £100 spent</li>
              <li>Priority customer support on all bookings</li>
              <li>Free itinerary planning consultation</li>
            </ul>
          </div>

          <div style="text-align:center;">
            <a href="${SITE_URL}/packages" style="${BTN_STYLE}">Explore Holiday Packages</a>
          </div>
        </div>

        <div style="${FOOTER_STYLE}">
          <p style="margin:0 0 4px;">My Perfect Trips — A brand of Infygru Private Limited</p>
          <p style="margin:0;">+91 8807709919 · info@myperfecttrips.com · myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(email, 'Welcome to My Perfect Trips — Start Planning Your Trip!', html);
}

// ── 5. Holiday Enquiry Alert → Admin ─────────────────────────────────────────
export interface HolidayEnquiryData {
    name:        string;
    phone:       string;
    destination: string;
    budget:      string;
    adults:      number;
    children:    number;
}

export async function sendHolidayEnquiryAlert(data: HolidayEnquiryData): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <h1 style="color:#f59e0b; margin:0; font-size:20px; font-weight:800;">
            🏖 New Holiday Enquiry
          </h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:13px;">Submitted via myperfecttrips.com</p>
        </div>
        <div style="${BODY_STYLE}">
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:20px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Name</span>
              <span style="${VALUE_STYLE}">${data.name}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Phone</span>
              <span style="${VALUE_STYLE}">
                <a href="tel:${data.phone}" style="color:#1c1917;">${data.phone}</a>
              </span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Destination</span>
              <span style="${VALUE_STYLE}">${data.destination}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Budget</span>
              <span style="${VALUE_STYLE}">${data.budget}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travellers</span>
              <span style="${VALUE_STYLE}">
                ${data.adults} Adult${data.adults !== 1 ? 's' : ''}
                ${data.children > 0 ? ` + ${data.children} Child${data.children !== 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
          </div>
          <div style="text-align:center;">
            <a href="https://api.myperfecttrips.com/admin/content/holiday_enquiries" style="${BTN_STYLE}">
              View in Directus
            </a>
          </div>
        </div>
        <div style="${FOOTER_STYLE}">
          <p style="margin:0;">My Perfect Trips Admin Alert · myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(
        ADMIN_EMAILS,
        `[Holiday Enquiry] ${data.destination} — ${data.name} (${data.phone})`,
        html,
    );
}

// ── 6. Flight Enquiry Alert → Admin ──────────────────────────────────────────
export interface FlightEnquiryData {
    name:         string;
    phone:        string;
    from_airport: string;
    to_airport:   string;
    depart_date:  string;
    return_date?: string;
    adults:       number;
    children:     number;
}

export async function sendFlightEnquiryAlert(data: FlightEnquiryData): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <h1 style="color:#f59e0b; margin:0; font-size:20px; font-weight:800;">
            ✈ New Flight Enquiry
          </h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:13px;">Submitted via myperfecttrips.com</p>
        </div>
        <div style="${BODY_STYLE}">
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:20px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Name</span>
              <span style="${VALUE_STYLE}">${data.name}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Phone</span>
              <span style="${VALUE_STYLE}">
                <a href="tel:${data.phone}" style="color:#1c1917;">${data.phone}</a>
              </span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">From</span>
              <span style="${VALUE_STYLE}">${data.from_airport}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">To</span>
              <span style="${VALUE_STYLE}">${data.to_airport}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Depart</span>
              <span style="${VALUE_STYLE}">${data.depart_date}</span>
            </div>
            ${data.return_date ? `
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Return</span>
              <span style="${VALUE_STYLE}">${data.return_date}</span>
            </div>` : ''}
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Travellers</span>
              <span style="${VALUE_STYLE}">
                ${data.adults} Adult${data.adults !== 1 ? 's' : ''}
                ${data.children > 0 ? ` + ${data.children} Child${data.children !== 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
          </div>
          <div style="text-align:center;">
            <a href="https://api.myperfecttrips.com/admin/content/flight_enquiries" style="${BTN_STYLE}">
              View in Directus
            </a>
          </div>
        </div>
        <div style="${FOOTER_STYLE}">
          <p style="margin:0;">My Perfect Trips Admin Alert · myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(
        ADMIN_EMAILS,
        `[Flight Enquiry] ${data.from_airport} → ${data.to_airport} — ${data.name} (${data.phone})`,
        html,
    );
}

// ── 7. Contact Enquiry Alert → Admin ─────────────────────────────────────────
export interface ContactEnquiryData {
    name:    string;
    email:   string;
    phone?:  string;
    message: string;
}

export async function sendContactEnquiryAlert(data: ContactEnquiryData): Promise<boolean> {
    const html = `
    <body style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <h1 style="color:#f59e0b; margin:0; font-size:20px; font-weight:800;">
            📩 New Contact Enquiry
          </h1>
          <p style="color:#a8a29e; margin:8px 0 0; font-size:13px;">Submitted via myperfecttrips.com</p>
        </div>
        <div style="${BODY_STYLE}">
          <div style="background:#fafaf9; border-radius:12px; padding:4px 20px 8px; margin-bottom:20px;">
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Name</span>
              <span style="${VALUE_STYLE}">${data.name}</span>
            </div>
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Email</span>
              <span style="${VALUE_STYLE}">
                <a href="mailto:${data.email}" style="color:#1c1917;">${data.email}</a>
              </span>
            </div>
            ${data.phone ? `
            <div style="${ROW_STYLE}">
              <span style="${LABEL_STYLE}">Phone</span>
              <span style="${VALUE_STYLE}">
                <a href="tel:${data.phone}" style="color:#1c1917;">${data.phone}</a>
              </span>
            </div>` : ''}
            <div style="${ROW_STYLE} border-bottom:none;">
              <span style="${LABEL_STYLE}">Message</span>
              <span style="${VALUE_STYLE}; max-width:320px; white-space:pre-wrap;">${data.message}</span>
            </div>
          </div>
          <div style="text-align:center;">
            <a href="https://api.myperfecttrips.com/admin/content/enquiries" style="${BTN_STYLE}">
              View in Directus
            </a>
          </div>
        </div>
        <div style="${FOOTER_STYLE}">
          <p style="margin:0;">My Perfect Trips Admin Alert · myperfecttrips.com</p>
        </div>
      </div>
    </body>`;

    return sendEmail(
        ADMIN_EMAILS,
        `[Contact Enquiry] ${data.name} — ${data.email}`,
        html,
    );
}
