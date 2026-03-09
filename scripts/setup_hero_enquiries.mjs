import { createDirectus, rest, authentication, createCollection, createField, readRoles, createPermission } from '@directus/sdk';

const directus = createDirectus('http://127.0.0.1:8055').with(authentication()).with(rest());

async function setup() {
    try {
        await directus.login('admin@example.com', 'd1r3ctu5');
        console.log("Logged in successfully. Setting up new enquiry collections...");

        // 1. Create flight_enquiries
        try {
            await directus.request(createCollection({
                collection: 'flight_enquiries',
                meta: {
                    icon: 'flight_takeoff',
                    note: 'Customer enquiries for flight bookings',
                    display_template: '{{from_airport}} to {{to_airport}}'
                },
                schema: { name: 'flight_enquiries' }
            }));
            console.log("Created flight_enquiries collection.");

            // Add fields
            const flightFields = [
                { field: 'from_airport', type: 'string', meta: { interface: 'input' } },
                { field: 'to_airport', type: 'string', meta: { interface: 'input' } },
                { field: 'depart_date', type: 'date', meta: { interface: 'datetime' } },
                { field: 'return_date', type: 'date', meta: { interface: 'datetime' } },
                { field: 'pax', type: 'integer', meta: { interface: 'input' } },
                { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'New', value: 'new' }, { text: 'Contacted', value: 'contacted' }] } }, schema: { default_value: 'new' } }
            ];

            for (const f of flightFields) {
                await directus.request(createField('flight_enquiries', f));
            }
            console.log("Added fields to flight_enquiries.");
        } catch (e) {
            console.log("flight_enquiries error (or already exists):", e.errors?.[0]?.message || e.message);
        }

        // 2. Create holiday_enquiries
        try {
            await directus.request(createCollection({
                collection: 'holiday_enquiries',
                meta: {
                    icon: 'beach_access',
                    note: 'Customer enquiries for holiday packages',
                    display_template: '{{destination}} - {{pax}} pax'
                },
                schema: { name: 'holiday_enquiries' }
            }));
            console.log("Created holiday_enquiries collection.");

            // Add fields
            const holidayFields = [
                { field: 'destination', type: 'string', meta: { interface: 'input' } },
                { field: 'pax', type: 'integer', meta: { interface: 'input' } },
                { field: 'budget', type: 'string', meta: { interface: 'input' } },
                { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'New', value: 'new' }, { text: 'Contacted', value: 'contacted' }] } }, schema: { default_value: 'new' } }
            ];

            for (const f of holidayFields) {
                await directus.request(createField('holiday_enquiries', f));
            }
            console.log("Added fields to holiday_enquiries.");
        } catch (e) {
            console.log("holiday_enquiries error (or already exists):", e.errors?.[0]?.message || e.message);
        }

        // 3. Set Public Create Permissions
        const roles = await directus.request(readRoles());
        const publicRole = roles.find(r => r.name === 'Public');
        if (publicRole) {
            try {
                await directus.request(createPermission({
                    role: publicRole.id,
                    collection: 'flight_enquiries',
                    action: 'create',
                    permissions: null,
                    validation: null,
                    fields: ['*']
                }));
                console.log("Public create permission set for flight_enquiries.");
            } catch (e) { }

            try {
                await directus.request(createPermission({
                    role: publicRole.id,
                    collection: 'holiday_enquiries',
                    action: 'create',
                    permissions: null,
                    validation: null,
                    fields: ['*']
                }));
                console.log("Public create permission set for holiday_enquiries.");
            } catch (e) { }
        }

        console.log("Setup complete!");

    } catch (error) {
        console.error("Setup failed:");
        console.dir(error, { depth: null });
    }
}

setup();
