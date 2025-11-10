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

## Competition and Maths Demo Page UI Changes (Nov 2024)
- **Competition page** (`/competition`):
  - Added back button (same style as practice page) in top left corner, linking to home page
  - Centered the "Maths Edexcel A Level Demo" button using a wrapper div with `text-align: center`

- **Maths Demo page** (`/maths-demo`):
  - Added back button linking to `/competition` in top left corner
  - Moved treasure chest icon from 60x60 to 150x150 (2.5x bigger)
  - Relocated ghost character to bottom right corner (changed from `left: 60px` to `right: 60px`)
  - Repositioned speech bubble above ghost (changed from side positioning to `bottom: 180px` above ghost)
  - Speech bubble now has centered arrow pointer below it pointing down to ghost
  - Moved achievements sidebar (progress floating box) from top right to **bottom left corner**
  - Made achievements sidebar more compact: width reduced to 200px, padding to 10px
  - Reduced font sizes in sidebar for compactness (label: 9px, value: 10px)
  - Reduced spacing between progress items (margin-bottom: 6px, padding-bottom: 4px)
  - Adjusted toast icon positions to be higher up on screen (moved bottom toasts from 85-90% to 70-75%)
  - Moved toast-6 from left: 45% to left: 35% to avoid obscuring treasure chest
  - Shrank grass pattern from 100px to 60px, then further reduced to 54px (10% reduction)
  - Added 2px solid black border line across top of grass to show where grass ends

## Practice Pages UI Changes (Nov 2024)
- **Practice page** (`/practice`):
  - Admissions dropdown now excludes English Lit, Maths, Chemistry, Biology (only shows TSA, BMAT, Interview)
  - A Level button is now disabled and greyed out (opacity: 0.5, cursor: not-allowed)
  - A Level dropdown no longer appears on hover - button is completely disabled

- **Create Practice Pack page** (`/create-practice-pack`):
  - Subject dropdown displays all subjects but only TSA and BMAT are enabled
  - Other subjects (English Lit, Maths, Chemistry, Biology, Interview) are greyed out (opacity: 0.4, color: #999999)
  - Disabled subjects have cursor: not-allowed and cannot be selected
