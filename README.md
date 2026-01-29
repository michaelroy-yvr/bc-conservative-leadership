# BC Conservative Leadership Race Tracker

A single-page React website to track the BC Conservative leadership race.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Auto-deploys on push to main

## How to Update Candidates

### Add a New Candidate

1. Create a new `.md` file in `content/candidates/` (e.g., `firstname-lastname.md`)
2. Use this template:

```markdown
---
name: "Full Name"
byline: "Campaign slogan or tagline"
photo: "/photos/firstname-lastname.jpg"
website: "https://candidatewebsite.ca"
withdrawn: false
order: 5
social:
  x: "https://x.com/username"
  facebook: "https://facebook.com/pagename"
  instagram: "https://instagram.com/username"
  youtube: "https://youtube.com/@channelname"
  linkedin: "https://linkedin.com/in/username"
  tiktok: "https://tiktok.com/@username"
  email: "info@candidatewebsite.ca"
---

## Bio

Write the candidate's biography here. This can include multiple paragraphs.

## Announcements

**Date** — Announcement text here.

**Another Date** — Another announcement.
```

3. Place the candidate's photo in `public/photos/`

### Add or Update a Photo

1. Add the image file to `public/photos/`
2. Update the `photo` field in the candidate's markdown file to reference the new path (e.g., `/photos/firstname-lastname.jpg`)

### Mark a Candidate as Withdrawn

1. Open the candidate's `.md` file in `content/candidates/`
2. Change `withdrawn: false` to `withdrawn: true`
3. The card will now display with a red "WITHDRAWN" banner overlay

### Change Candidate Order

1. Edit the `order` field in each candidate's frontmatter
2. Lower numbers appear first (e.g., `order: 1` appears before `order: 2`)

### Update Bio or Announcements

1. Open the candidate's `.md` file
2. Edit the content under `## Bio` or `## Announcements`
3. Use standard Markdown formatting

## Supported Social Platforms

- **x**: X (formerly Twitter)
- **facebook**: Facebook
- **instagram**: Instagram
- **youtube**: YouTube
- **linkedin**: LinkedIn
- **tiktok**: TikTok
- **email**: Email address (will open mail client)

Leave any social field empty (`""`) or omit it to hide that icon.

## Key Dates

- **Membership Deadline**: April 18, 2026 at 5:00 PM Pacific
- **Voting Day**: May 30, 2026

These dates are configured in `src/components/Countdown.tsx`.

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- gray-matter (markdown frontmatter parsing)
- react-markdown (markdown rendering)
- lucide-react (icons)
