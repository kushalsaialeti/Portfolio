# Portfolio workspace

This repository contains the Vite/React frontend and Express/MongoDB CMS API.

## Commands

```bash
npm run install:all
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
npm test
```

The frontend reads `VITE_API_URL`. The backend reads its deployment values from
`backend/.env` or the hosting provider. Keep that file private and use
`backend/render.yaml` as the non-secret variable checklist.

## Layout

- `frontend/src/app` — application shell and routes
- `frontend/src/cms` — canonical frontend CMS client/context
- `frontend/src/features/public` — public portfolio experience
- `frontend/src/features/admin` — protected admin console
- `backend/modules` — CMS, authentication, and contact modules
- `backend/modules/analytics` — opt-in event collection and admin summaries
- `backend/integrations` — Redis, Cloudinary, and mail integrations
- `backend/data` — versioned seed fixture only

See `PORTFOLIO_OPTIMIZATION.md` for the folder audit, CMS workflow, analytics
definitions, content model, launch checklist, and free UI resources.
