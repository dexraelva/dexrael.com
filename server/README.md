# Availability Backend

Simple Node.js + Express backend to store and serve your availability and referral information.

Quick start

1. Install dependencies

```bash
cd server
npm install
```

2. Set an admin token (required to update availability)

```bash
# Linux/macOS
export ADMIN_TOKEN=some-secret-token

# Windows Powershell
$env:ADMIN_TOKEN="some-secret-token"
```

3. Start server

```bash
npm start
```

API

- GET /api/availability
  - Public endpoint. Returns JSON: { available: boolean, referral: { name, email, calendly }, updatedAt }

- POST /api/availability
  - Protected. Send header `x-admin-token: <your token>`
  - Body JSON: { available: true|false, referral: { name, email, calendly } }

Examples

Read current status:

```bash
curl http://localhost:3000/api/availability
```

Update status (example):

```bash
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -H "x-admin-token: some-secret-token" \
  -d '{"available":false,"referral":{"name":"Jane Doe","calendly":"https://calendly.com/janedoe/30min"}}'
```

Notes

- This is a minimal example intended to run on a small VPS or as a container.
- For production use, run behind HTTPS (reverse proxy), persist data to a proper DB, and rotate the admin token.
- I can integrate this with your frontend so the Admin panel calls the POST endpoint directly. Ask and I'll implement it.
