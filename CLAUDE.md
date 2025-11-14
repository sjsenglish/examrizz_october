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
- **Teacher icon**: Greyed out with opacity-40 and grayscale, made non-clickable (Nov 2024)
- **Learn icon**: Unlocked and clickable, links to `/maths-demo` (unlocked Nov 2024)
- **Video icon**: Greyed out with opacity-40 and grayscale, made non-clickable (Nov 2024)
- **Arena icon**: Greyed out with opacity-40 and grayscale, made non-clickable (locked Nov 2024)

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

## Competition and Subject Selection Flow (Nov 2024)
- **Competition page** (`/competition`):
  - Added back button (same style as practice page) in top left corner, linking to home page
  - Centered the "Maths Edexcel A Level Demo" button using a wrapper div with `text-align: center`
  - **Routing**: Button now links to `/subject-selection` (updated Nov 2024)

- **Subject Selection page** (`/subject-selection`) - **NEW Nov 2024**:
  - Intermediate page between `/competition` and `/maths-demo`
  - Displays three subject options: Pure Maths, Statistics, Mechanics
  - Each subject has a colored book icon:
    - Pure Maths: Blue book (clickable, links to `/maths-demo`)
    - Statistics: Pink book (disabled/greyed out)
    - Mechanics: Purple book (disabled/greyed out)
  - Icons sourced from Firebase Storage (external URLs)
  - Back button links to `/competition`
  - Layout follows competition page styling with 3-column grid
  - Disabled subjects have opacity: 0.4, grayscale filter, and no hover effects
  - Files: `app/subject-selection/page.tsx` and `app/subject-selection/subject-selection.css`

- **Maths Demo page** (`/maths-demo`):
  - Added back button linking to `/subject-selection` in top left corner (updated Nov 2024)
  - Moved treasure chest icon from 60x60 to 150x150 (2.5x bigger)
  - Relocated ghost character to bottom right corner (changed from `left: 60px` to `right: 60px`)
  - Repositioned speech bubble above ghost (changed from side positioning to `bottom: 180px` above ghost)
  - **Speech bubbles are now clean oval shapes** (border-radius: 30px for green ghost, 25px for love letter ghost)
  - **Both speech bubbles no longer have arrow pointers** - removed ::before pseudo-elements for cleaner look
  - Green ghost speech bubble moved to the left (right: -50px instead of -100px)
  - Love letter ghost speech bubble repositioned up and left (top: 10%, left: 14% instead of 12%, 20%)
  - Moved achievements sidebar (progress floating box) from top right to **bottom left corner**
  - **Enlarged sidebar**: width increased to 280px (from 200px), padding to 16px (from 10px)
  - **Increased sidebar font sizes**: label: 11px (from 9px), value: 13px (from 10px)
  - **Increased sidebar spacing**: margin-bottom: 10px, padding-bottom: 8px (from 6px/4px)
  - **Close button is now functional**: clicking × hides the sidebar via conditional rendering
  - **Top-left toast icon (toast-1) has pulse animation**: subtle scale from 1 to 1.05 over 2s loop
  - Adjusted toast icon positions to be higher up on screen (moved bottom toasts from 85-90% to 70-75%)
  - Moved toast-6 from left: 45% to left: 35% to avoid obscuring treasure chest
  - Shrank grass pattern from 100px to 60px, then further reduced to 54px (10% reduction)
  - Added 2px solid black border line across top of grass to show where grass ends
- **Maths Demo page** (`/maths-demo`) - **REDESIGNED Nov 2024**:
  - **Complete layout overhaul**: Changed from scattered toasts to horizontal stepping stones layout
  - **Removed**: Progress sidebar (achievements floating box) completely removed from page
  - **New Layout Structure**:
    - Horizontal stepping stones going left-to-right across the screen
    - Each stepping stone represents one spec point from the curriculum
    - Bar images (Vector 448.svg) serve as platforms for each spec point
    - Multiple toast icons (Group 2376.svg) positioned above each bar - one toast per lesson
    - Spec point info displayed below each bar: ID, name, and completion time in hours
  - **Spec Points Data**: 30 total spec points with lesson counts ranging from 1-6 lessons each
  - **Ghost Character**:
    - Positioned on the first stepping stone (spec point 1.1 Proofs)
    - Position: top: -60px (moved up 15% from -40px)
    - Responsive: top: -45px on tablet (768px breakpoint)
    - Floating animation with subtle up/down movement
    - **Clickable link** to `/spec-point-session` with spec point and lesson parameters
    - Size: 100x100px
  - **Navigation System** (Updated Nov 2024):
    - **Progress bar** at top of page (fixed position, visible during scrolling)
    - **Removed**: Title badge "Maths A Level - 90 hours" and left/right arrow buttons
    - **Progress Bar Features**:
      - Total duration: 92.83 hours displayed in center
      - Light cyan fill (#DBFCFF) showing cumulative progress based on current spec point
      - Love letter icon serves as draggable progress tracker
      - Treasure chest icon positioned at end of progress bar (100% completion)
      - Click anywhere on progress bar to jump to corresponding spec point
      - Drag love letter icon to manually navigate between spec points
      - Progress automatically updates based on scroll position
    - **Icon Navigation**:
      - Love letter icon moves along progress bar based on cumulative hours completed
      - Interactive: click and drag to navigate to any spec point
      - Visual feedback: cursor changes to grab/grabbing during interaction
      - Smooth scrolling animation when navigating between spec points
    - **Progress Calculation**:
      - Dynamically calculates cumulative hours from spec point data
      - Position on bar represents percentage of total course completion
      - Updates in real-time as user scrolls through stepping stones
  - **Toast Icons**: Each toast represents one lesson within the spec point
    - **All toasts are clickable** (Nov 2024) - Link to `/spec-point-session` with parameters
    - URL format: `?spec={id}&lesson={number}&name={encoded name}`
    - Each toast links to its specific lesson session page
    - Hover effect: scale(1.1) on all toast icons
    - Toast arrangement: Flex layout with wrapping, max-width 200px per group
  - **Styling Details**:
    - Gap between stones: 150px (100px on tablet, 80px on mobile)
    - Grass pattern at bottom: 54px height with 2px black border on top, positioned 57px from bottom (fixed position, moved up 105% of height - Nov 2024)
    - Progress bar: 70% width, centered, with responsive sizing for mobile
    - Back button in top-left corner linking to `/subject-selection`
  - **Files**:
    - Page: `app/maths-demo/page.tsx`
    - Styles: `app/maths-demo/maths-demo.css`

**Navigation Flow**: Home → Competition → Subject Selection → Maths Demo → Spec Topic

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

## AskBo Authentication Required (Nov 2024)
- **Authentication**: `/askbo` page now requires user login
- **Behavior**: Unauthenticated users are automatically redirected to `/login` page
- **Implementation** in `/app/askbo/page.tsx`:
  - Auth check runs on page mount via useEffect
  - If `supabase.auth.getUser()` returns no user, redirect to `/login`
  - If auth error occurs, redirect to `/login`
  - Loading state prevents content flash before redirect
- **Note**: This ensures all AskBo interactions are properly tracked and associated with user accounts
## Practice Pages UI Changes (Nov 2024)
- **Practice page** (`/practice`):
  - Admissions dropdown now excludes English Lit, Maths, Chemistry, Biology (only shows TSA, BMAT, Interview)
  - A Level button is now disabled and greyed out (opacity: 0.5, cursor: not-allowed)
  - A Level dropdown no longer appears on hover - button is completely disabled

- **Create Practice Pack page** (`/create-practice-pack`):
  - Subject dropdown displays all subjects but **only TSA is enabled** (BMAT is now greyed out as of Nov 2024)
  - Other subjects (English Lit, Maths, Chemistry, Biology, Interview, BMAT) are greyed out (opacity: 0.4, color: #999999)
  - Disabled subjects have cursor: not-allowed and cannot be selected

- **Select Practice Questions page** (`/select-practice-questions`):
  - Reduced padding between elements and navbar (main-content padding-top reduced from 88px to 63px for more compact layout)
  - Additional padding reductions for tighter spacing:
    - `.modal-container` padding: reduced from 12px 21px to 10px 18px
    - `.inner-container` padding: reduced from 17px to 12px
  - Fixed viewport scrolling: page container has fixed height and no scroll, only the questions container scrolls
  - Layout uses flexbox hierarchy to ensure questions container is scrollable while page remains fixed:
    - `.page-background`: height: 100vh, overflow: hidden
    - `.main-content`: height: calc(100vh - 63px), overflow: hidden
    - `.modal-container`: flex container with flex-direction: column, padding: 10px 18px
    - `.inner-container`: padding: 12px
    - `.questions-container`: flex: 1, min-height: 0, overflow-y: auto for scrollable content

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

## Spec Point Session Page Layout (Nov 2024)
- **Page**: `/spec-point-session` - Individual spec point learning session
- **Layout Structure**:
  - **Content container (left)**: Contains video player, practice questions, and PDF notes (flex: 3)
    - Occupies 60% of horizontal space
    - Includes content type selector tabs (Video, Questions, PDF Notes)
    - No section titles - content displays directly without headers
    - **Video and PDF containers**: Enlarged to min-height: 550px (from 400px) to nearly fill container
  - **Buddy chat container (right)**: Joe chat assistant (flex: 2)
    - Occupies 40% of horizontal space
    - Features chat interface with message history and input
    - No header section - chat area starts directly with messages
  - Total flex ratio: 3:2 (main content : buddy chat)
- **Dynamic Title System** (Nov 2024):
  - Title format: "{specPoint} {specName}: Lesson {lessonNumber}"
  - Uses URL parameters: `?spec=X.X&lesson=N&name=TopicName`
  - Example: "1.1 Proofs: Lesson 1"
  - Chat welcome message also uses dynamic spec point info
  - **Implementation**: Uses `useSearchParams()` wrapped in Suspense boundary (Next.js 15 requirement)
- **Header**: Centered title display
  - Page title dynamically generated from URL parameters
  - No subtitle or bordered container
  - Clean, minimal presentation
- **Removed Elements** (Nov 2024):
  - Chat header: "Joe - Your Maths Buddy" and "Ask me anything about this spec point"
  - Content titles: "Video Walkthrough", "Practice Questions", "Study Notes (PDF)"
  - Question navigation centered (no longer left-aligned with title)
- **Purpose**: Gives primary focus to the learning content with chat assistant on the side
- **Files**:
  - Page: `app/spec-point-session/page.tsx`
  - Styles: `app/spec-point-session/spec-point-session.css`

## Search Page - Interview Resources Index (Nov 2024)
- **New Index Added**: `v2_interview_resources` added to `/search` page
- **Dropdown Label**: "Interview Resources" appears in Admissions dropdown
- **Index Configuration** (`lib/subjectConfig.ts`):
  - Index name: `v2_interview_resources`
  - Available filters: `subject` and `sectionCategory`
  - Filter labels: "Subject" and "Section Category"

- **Data Structure** (example record):
  - Fields: `id`, `slug`, `subject`, `subjectArea`, `sectionCategory`, `sectionType`, `yearRange`, `title`, `overview`
  - `overview`: Contains main content in markdown format
  - `practiceQuestions`: Array of practice questions with `number`, `question`, and `type` fields
  - `tags`: Array of searchable tags
  - Visible filter tags: `subject` and `subjectArea`
  - **`isPremium`**: Boolean field to mark premium content (requires Plus or Max tier)

- **Question Card Display**:
  - Title displayed as H2 heading
  - Overview rendered with **ReactMarkdown** for proper markdown formatting
  - Practice questions displayed in bordered sections with markdown support
  - Question type badges shown (e.g., "explain", "evaluate")
  - **Submit Answer button** available with Discord routing (same flow as Interview questions)
  - No "Show Answer" button (like Interview questions - these are discussion-based)

- **FilterBox Configuration**:
  - Two-column layout: Subject and Section Category
  - Both filters use standard refinement lists with counts
  - Filter title: "Interview Resources"

- **Implementation Details**:
  - Uses `InterviewQuestionsList` component (same as Interview questions for infinite scroll)
  - Markdown rendering via `react-markdown` package
  - Submit answer creates Discord ticket with type: `interview-resources-question`
  - Question content properly sanitized and formatted
  - **Escape sequence handling**: Literal `\n\n` and `\n` strings in data are converted to actual newlines before rendering with ReactMarkdown

## Interview Resources Premium Content (Nov 2024)
- **Premium Access Control**: Interview Resources with `isPremium: true` are restricted to Plus and Max tier users
- **Logged Out and Free User Experience**:
  - Question number, title, and filter tags remain **visible** (not blurred)
  - Overview content is **blurred** with 8px blur filter
  - Practice questions are **blurred** with 8px blur filter
  - Content is non-selectable and non-interactive when blurred (userSelect: none, pointerEvents: none)
  - **Premium badge** displays "⭐ PREMIUM" in gold next to question number for all premium resources
  - **No overlay or upgrade prompts** - just clean blur effect
  - Blur applies immediately on page load (no delay)
- **Plus and Max User Experience**:
  - All content fully accessible with no blur
  - Premium badge still visible to indicate premium quality content
- **Implementation** (`components/ExamSearch/QuestionCard.tsx`):
  - `shouldBlurContent` logic:
    - Returns `true` for logged out users (no delay)
    - Returns `true` while loading user tier (safer default during load)
    - Returns `true` for free tier users
    - Returns `false` for plus/max tier users
  - Blur styling applied via inline styles (filter: blur(8px))
  - Premium badge always shown for isPremium resources

## Interview Questions Access Control (Nov 2024)
- **Login Required**: ALL interview questions in the Interview index now require user login to view
- **Logged Out User Experience**:
  - Question number, year, time, and filter tags remain **visible** (not blurred)
  - Question content (the actual interview question text) is **blurred** with 8px blur filter
  - Content is non-selectable and non-interactive when blurred (userSelect: none, pointerEvents: none)
  - **No overlay or upgrade prompts** - just clean blur effect
  - Blur applies immediately on page load (no delay)
- **Logged In User Experience**:
  - All content fully accessible with no blur
  - Works for ALL tiers (free, plus, max) - only login is required
- **Implementation** (`components/ExamSearch/QuestionCard.tsx`):
  - `shouldBlurInterviewContent` logic:
    - Returns `true` for logged out users (no delay)
    - Returns `false` for all logged in users (regardless of tier)
  - Blur styling applied via inline styles (filter: blur(8px))
  - Only applies to Interview questions (not Interview Resources or other question types)

## Usage Tracking and Limits (Updated Nov 2024)
- **Monthly Cost Limits** (defined in `lib/usage-tracking.ts`):
  - Free tier: **$1.00** per month (reduced from $2.00)
  - Plus tier: $6.00 per month
  - Max tier: $12.00 per month

- **Important**: Limits are **COMBINED** for ALL services (AskBo, Interview prep, etc.) per user per month
  - Not separate limits per service
  - All AI interactions count toward the single monthly limit

- **Bug Fixes Applied** (Nov 2024):
  1. **Comparison operator consistency**: Changed from `>` to `>=` in `canMakeRequest()` to match `hasExceededLimit()`
  2. **Database error handling**: On errors, system now assumes limit is reached (conservative approach) instead of allowing unlimited usage
  3. **Race condition protection**: Added `verifyUsageWithinLimit()` function to detect when concurrent requests cause limit breach
     - API endpoints should call this function AFTER recording usage
     - Logs warning when overage is detected with exact overage amount

- **Key Functions**:
  - `canMakeRequest()`: Pre-flight check before allowing AI requests
  - `recordUsage()`: Records actual token usage after completion
  - `verifyUsageWithinLimit()`: Post-recording verification to catch race conditions
  - `getMonthlyUsage()`: Gets current month's total usage for a user

## Discord Ticket Enhancement (Updated Nov 2024)
- **Discord ID and Username in Tickets**: All Discord tickets now **require** user's Discord username
- **Implementation** (Updated Nov 2024):
  - Updated `/api/discord-webhook` to accept `discordId` and `discordUsername` parameters
  - Parameters are optional - won't break if not provided (backward compatible)
  - Added new "Discord Account" field in Discord embeds showing both username and ID
  - Format: `username (ID: discord_id)` or just `ID: discord_id` if username unavailable
- **Discord Username Requirement** (Updated Nov 2024):
  - **REQUIRED**: Discord username must be provided before ticket submission
  - If user profile doesn't have `discord_username`, a modal prompts user to enter it manually
  - Modal collects:
    - Discord Username (required) - e.g., "username" or "username#1234"
    - Discord ID (optional) - 18-digit number from Discord Developer Mode
  - Manual entry is stored in component state and used for ticket submission
  - Implementation in:
    - `components/ExamSearch/QuestionCard.tsx`: Shows Discord info modal before allowing answer submission
    - `app/askbo/page.tsx`: Shows Discord info modal before creating teacher help tickets
- **Database Backup** (Updated Nov 2024):
  - All tickets are now stored in the `support_tickets` database table as a backup
  - Stored information:
    - `user_id`: User's UUID from auth.users
    - `session_id`: Unique session UUID for tracking
    - `discord_username`: Discord username from profile or manual entry
    - `status`: Ticket status (default: 'open')
    - `notes`: JSON string containing ticket metadata (ticketId, type, userEmail, discordId, contentPreview)
  - Database insert is non-blocking - if it fails, the Discord ticket is still created
  - Both client components pass `userId` to the webhook API
  - Implementation in `app/api/discord-webhook/route.ts`
- **Affected Components**:
  - `components/ExamSearch/QuestionCard.tsx`:
    - Checks for Discord username before opening submission modal
    - Shows Discord info collection modal if username missing
    - Passes Discord info and userId when submitting answers
  - `app/askbo/page.tsx`:
    - Checks for Discord username before creating teacher tickets
    - Shows Discord info collection modal if username missing
    - Passes Discord info and userId when creating tickets
  - `app/api/discord-webhook/route.ts`:
    - Receives and includes Discord info in all ticket embeds
    - Stores ticket in support_tickets table as backup
- **Purpose**: Ensures teachers can always identify and contact students in Discord support channels, with database backup for tracking and analytics
