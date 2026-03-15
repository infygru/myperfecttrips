/**
 * Adds a `visa_status` select field to the `packages` collection.
 * Run once: node scripts/setup_visa_field.mjs
 */
async function setup() {
    const url = 'https://api.igholidays.com';
    const email = 'admin@igholidays.com';
    const password = 'e4HiSzm3PsFhR3mA6Uh7YoU2uqjOHrF3';

    console.log("Logging in...");
    const authRes = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!authRes.ok) throw new Error(`Login failed: ${authRes.statusText}`);
    const { data: { access_token: token } } = await authRes.json();
    console.log("Logged in.");

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Add visa_status field to packages
    try {
        const res = await fetch(`${url}/fields/packages`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'visa_status',
                type: 'string',
                meta: {
                    interface: 'select-dropdown',
                    display: 'labels',
                    display_options: {
                        choices: [
                            { text: 'None', value: 'none', foreground: '#6B7280', background: '#F3F4F6' },
                            { text: 'Visa Free', value: 'visa_free', foreground: '#065F46', background: '#D1FAE5' },
                            { text: 'Visa on Arrival', value: 'visa_on_arrival', foreground: '#1E40AF', background: '#DBEAFE' },
                        ],
                    },
                    options: {
                        choices: [
                            { text: 'None (standard visa required)', value: 'none' },
                            { text: 'Visa Free', value: 'visa_free' },
                            { text: 'Visa on Arrival', value: 'visa_on_arrival' },
                        ],
                    },
                    note: 'Visa requirement for Indian passport holders. Used to feature packages in the homepage Visa section.',
                    sort: 20,
                    group: null,
                },
                schema: {
                    default_value: 'none',
                    is_nullable: true,
                },
            }),
        });
        const data = await res.json();
        if (data.errors) {
            console.log("Field error (may already exist):", data.errors[0]?.message);
        } else {
            console.log("✓ visa_status field added to packages collection.");
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}

setup().catch(console.error);
