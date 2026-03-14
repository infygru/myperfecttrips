const DIRECTUS_URL = "https://api.igholidays.com";
async function getToken() {
    const r = await fetch(`${DIRECTUS_URL}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:'admin@igholidays.com',password:'e4HiSzm3PsFhR3mA6Uh7YoU2uqjOHrF3'})});
    return (await r.json()).data?.access_token;
}
async function api(token, path) {
    const r = await fetch(`${DIRECTUS_URL}${path}`, { headers:{Authorization:`Bearer ${token}`}});
    return r.json();
}
const token = await getToken();
const cols = await api(token, '/collections');
console.log('Collections:', (cols.data||[]).map(c=>c.collection).filter(c=>!c.startsWith('directus_')).join(', '));
const rels = await api(token, '/relations');
const pkgRels = (rels.data||[]).filter(r=>r.collection==='itinerary_days'||r.related_collection==='packages'||r.collection==='packages');
console.log('\nPackage relations:');
pkgRels.forEach(r=>console.log(' -', r.collection, '.', r.field, '->', r.related_collection, ' | one_field:', r.meta?.one_field));
const flds = await api(token, '/fields/packages');
console.log('\nPackage fields:', (flds.data||[]).map(f=>f.field).join(', '));
const idays = await api(token, '/fields/itinerary_days');
console.log('\nItinerary_days fields:', (idays.data||[]).map(f=>f.field).join(', '));
