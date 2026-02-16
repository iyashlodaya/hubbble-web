# Hubbble

A modern client portal platform for freelancers and agencies — keep clients in the loop without the chaos of scattered emails, Google Docs, and Slack threads.

---

## The Problem

Freelancers and small agencies juggle multiple clients at once. Keeping each client updated on project progress, sharing deliverables, and maintaining a professional image is a constant overhead. The typical workflow looks like:

- **Scattered updates** — Progress lives in emails, Slack messages, and random shared docs. Clients miss updates and ask "what's the status?" repeatedly.
- **No single source of truth** — Files get lost across Google Drive links, Dropbox shares, and email attachments. Versioning is a nightmare.
- **Unprofessional experience** — Clients see the mess behind the scenes. There's no branded, dedicated space that says _"I've got this handled."_

## The Solution

**Hubbble** gives every client their own branded portal — a clean, shareable page where they can see project updates, download files, and track progress in real time.

### Core Features

- 🏠 **Dashboard** — A home base for the freelancer with stats, filters, and recent activity across all projects.
- 🧑‍💼 **Client & Project Management** — Create clients, create projects, and organize work with status tracking (Active / Waiting / Completed).
- 📝 **Timeline Updates** — Post titled, timestamped updates to a project's timeline. Clients see a chronological history of progress.
- 📁 **File Sharing** — Attach links and upload files (with drag-and-drop) to each project. Clients access everything from one place.
- 🎨 **Portal Branding** — Customize the public portal with your name, tagline, accent color, and avatar (initials, image, or emoji).
- 🌐 **Public Portal** — Each project gets a unique, shareable public URL. Clients view updates and files without needing to log in — with light/dark mode support.
- 🔗 **Share Modal** — Easily share the portal link with clients via a share dialog.

---

## Tech Stack

| Layer         | Technology                                                               |
| ------------- | ------------------------------------------------------------------------ |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Client Components)        |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                            |
| **UI**        | React 18, CSS Modules, [Lucide React](https://lucide.dev/) icons         |
| **HTTP**      | [Axios](https://axios-http.com/) for API communication                   |
| **Sharing**   | [react-share](https://github.com/nygardk/react-share) for social sharing |
| **Auth**      | Token-based authentication via a separate backend API                    |
| **Backend**   | External REST API (Node.js / Express / Sequelize — separate repo)        |
| **Linting**   | ESLint with `eslint-config-next`                                         |

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API base URL to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── home/             # Freelancer dashboard
├── create-portal/    # 2-step portal creation wizard
├── portals/[id]/     # Portal editor (updates, files, settings)
├── public/[slug]/    # Public client-facing portal
├── login/            # Authentication
├── signup/           # Registration
└── components/       # Shared app-level components (Header, UserMenu)

components/
├── ui/               # Reusable UI primitives (Avatar, Button, Select, Skeleton, etc.)
├── home/             # Dashboard-specific components (PortalCard, StatsRow, RecentActivity)
└── auth/             # Auth form components

lib/
├── api/              # Axios client, service layers, and type definitions
│   └── services/     # auth, clients, projects, public_portal
├── auth.ts           # Auth token helpers
└── validation.ts     # Form validation utilities
```

---

## License

MIT
