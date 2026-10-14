# Portfolio frontend

React/Vite public portfolio and protected admin console.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

Set `VITE_API_URL` to the backend API base URL when the API is not running at
`http://localhost:5000/api`.

## Source layout

- `src/app` — routing and application shell
- `src/cms` — API client, CMS context, and content normalization
- `src/features/public` — public portfolio sections and analytics events
- `src/features/admin` — OTP login, CMS editors, uploads, and inquiries
- `src/components` — shared visual components
- `src/styles` — global theme and layout styles
