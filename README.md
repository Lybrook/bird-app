# AviKenya Bird Connect

A bird-sighting experience built with the Next.js App Router, React, TypeScript,
and Tailwind CSS.

## Requirements

- Node.js 20.9 or newer
- npm

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run the production checks
and server with:

```bash
npm run lint
npm run build
npm run start
```

## Google Maps configuration

The flyway map needs a Google Maps API key. Copy `.env.example` to `.env.local`
and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. The key is used in the browser, so
restrict it to your site's allowed referrers and the required Maps APIs.
`NEXT_PUBLIC_GOOGLE_MAPS_PROXY_URL` is optional; when omitted, the app uses its
configured default proxy. The rest of the site runs without a map key and shows
a setup message in the map section.

## Project structure

- `src/app` — App Router routes, layout, and global styles
- `src/components` — TypeScript React components and UI primitives
- `src/hooks`, `src/contexts`, `src/lib`, `src/shared` — shared app logic
- `public` — static assets
