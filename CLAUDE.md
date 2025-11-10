# CLAUDE.md - Project Instructions

## Git Commit Guidelines
- **IMPORTANT**: Always update this CLAUDE.md file before every git commit
- Include any new project conventions, patterns, or important decisions made during development

## Planning Mode
- Always ask clarifying questions when in planning mode
- Gather all necessary information before starting implementation
- Ensure full understanding of requirements before proceeding with code changes

## Critical Auth Flow Information (Updated Nov 2024)
- **DO NOT** add validation in login/signup pages that signs out users during OAuth callbacks
- OAuth users are automatically created by Supabase - let the process complete
- User profiles are created automatically via database trigger on auth.users INSERT
- The login page should simply redirect authenticated users to home
- Profile creation is handled by the database trigger in `/database/URGENT_FIX_USER_CREATION.sql`

## Landing Page Design (Updated Nov 2024)
- Cloud icons positioned closer to the island platform for better visual cohesion
- Cloud positioning in `components/landing/LandingHub.tsx`:
  - Big clouds: left-[20%] top-[30%], right-[20%] top-[45%]
  - Medium clouds: left-[38%] top-[25%], right-[38%] top-[27%]
## Video Page UI Changes (Nov 2024)
- The "Start maths series" button on `/video` page has been **disabled** (opacity: 0.5, cursor: not-allowed)
- The following buttons are **hidden** (display: none) but remain in code for potential future use:
  - "Select subject" dropdown
  - "Watch later" button
  - "Saved" button
- These elements can be re-enabled by removing the `display: 'none'` or `disabled` properties

## Video Gallery Routing & UI Changes (Nov 2024)
### `/videogallery/english` Page
- "Start video series" button now routes to `/videogallery/english/english-episode-1`
- "Start topic" button now routes to `/videogallery/english/english-episode-1`

### English Episode Pages (`/videogallery/english/english-episode-*`)
- The following elements are **hidden** (display: none) but remain in code for potential future use:
  - Action buttons section (mark as complete, watch later, practice)
  - Previous/Next video navigation buttons
  - "Up Next" section with "open video gallery" button
  - Bottom video navigation carousel (episode cards)
- These elements can be re-enabled by removing the `display: 'none'` property

### `/videogallery/howto` Page Layout Update
- All topics now display **4 videos visible at a time** in a horizontal carousel
  - Topic 1: "How to read, write, and take notes" (8 videos total)
  - Topic 2: "How to make your studying efficient" (8 videos total)
  - Topic 3: "How to make your studying efficient" (8 videos total)
  - Topic 4: "How to make your studying efficient" (8 videos total)
  - Topic 5: "How to make your studying efficient" (8 videos total)
- **Carousel navigation**: Left/Right arrow buttons styled to match site design
  - White background with black borders
  - Smooth scrolling behavior
  - Shows 4 videos at a time, scroll to see more
- Implementation uses React refs and scroll functionality for smooth navigation
