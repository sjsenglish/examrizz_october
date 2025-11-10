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
- **Teacher icon**: Removed "Coming Soon" hover tooltip (now just shows greyed-out icon)
- **Learn icon**: Greyed out with opacity-40 and grayscale, made non-clickable

## Practice Page Design (Updated Nov 2024)
- Cloud decorations moved closer to title for better visual hierarchy
- Cloud positioning in `app/practice/page.tsx`:
  - Left cloud: left: 5%, top: 3%
  - Right cloud: right: 5%, top: 5%
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

## AskBo Page Layout Fix (Nov 2024)
- **Issue**: Page experienced layout shift on initial load - loading screen had different structure than actual content
- **Root cause**: Loading spinner showed full-page centered layout, then jumped to Navbar + sidebar layout when loaded
- **Fix implemented** in `/app/askbo/page.tsx` and `/app/askbo/study-book.css`:
  - Changed loading pattern to conditionally render content instead of early return
  - Navbar now remains visible during loading state
  - Loading spinner positioned below navbar (margin-top: 60px, min-height: calc(100vh - 60px))
  - Loading container uses transparent background to match page background
  - Main content wrapped in fragment that only renders when loading completes
  - This eliminates visual "jump" and provides smooth transition from loading to loaded state
- **Note**: This fix does NOT affect any functionality - only improves visual experience
## Practice Pages UI Changes (Nov 2024)
- **Practice page** (`/practice`):
  - Admissions dropdown now excludes English Lit, Maths, Chemistry, Biology (only shows TSA, BMAT, Interview)
  - A Level button is now disabled and greyed out (opacity: 0.5, cursor: not-allowed)
  - A Level dropdown no longer appears on hover - button is completely disabled

- **Create Practice Pack page** (`/create-practice-pack`):
  - Subject dropdown displays all subjects but only TSA and BMAT are enabled
  - Other subjects (English Lit, Maths, Chemistry, Biology, Interview) are greyed out (opacity: 0.4, color: #999999)
  - Disabled subjects have cursor: not-allowed and cannot be selected

## Maths Demo Page Interactive Elements (Nov 2024)
- **Toast Icons** (`/maths-demo`):
  - Disabled popout effect (hover scale) on all toast icons except toast-1 (top-left corner)
  - Only toast-1 maintains the `transform: scale(1.1)` on hover
  - Toast-1 is clickable and links to `/spec-topic` page

- **Love Letter Ghost Guide** (`/maths-demo`):
  - Added love-letter.svg icon next to toast-1 at position (top: 15%, left: 16%)
  - Ghost has floating animation (10px vertical movement over 3s)
  - Speech bubble positioned at (top: 12%, left: 20%) with text "skip straight to spec topic"
  - Speech bubble has left-pointing arrow connecting to the ghost icon
  - Styles defined in `app/maths-demo/maths-demo.css` with `.love-letter-ghost` and `.love-letter-speech` classes

## Spec Topic Page (Nov 2024)
- **New Page**: `/spec-topic` - "7.2 Differentiating Functions"
- **Purpose**: Dedicated topic page for specific spec point practice and learning
- **Layout**: Based on `/practice` page structure but with custom tabs and no "Create Pack" functionality
- **Three Tabs**:
  1. **Video Content** (replaces "A Level" tab):
     - Shows 3 placeholder video containers
     - Each container has 300px height with space for embedded video players
     - Designed for future video lesson integration

  2. **Question Packs** (replaces "Admissions" tab):
     - Shows 5 mock question packs related to differentiation
     - Packs include: Differentiating Polynomials, Chain Rule Practice, Product & Quotient Rules, Implicit Differentiation, Applications of Differentiation
     - Each pack has full functionality: View Pack, Practice, and Review buttons
     - Includes save/bookmark, share, and send-to-friend icons
     - Uses same question pack SVG styling as main practice page

  3. **Notes** (replaces "Saved" tab):
     - Shows 3 PDF/note containers
     - Each container has upload button for PDF functionality
     - 200px height placeholder with dashed border for drag-and-drop area
     - Designed for students to upload and store topic-specific notes

- **Navigation**:
  - Back button in top-left links to `/maths-demo`
  - Page title: "7.2 Differentiating Functions"
  - Search bar for filtering resources
  - Cloud decorations matching practice page aesthetic

- **Files**:
  - Page: `app/spec-topic/page.tsx`
  - Styles: `app/spec-topic/spec-topic.css`
