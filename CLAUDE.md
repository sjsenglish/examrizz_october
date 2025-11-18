# CLAUDE.md - Project Instructions

## Git Commit Guidelines
- **IMPORTANT**: Always update this CLAUDE.md file before every git commit
- Include any new project conventions, patterns, or important decisions made during development

## Referrals System (Added Nov 2024, Rewards Added Nov 2024)
- **Page**: `/referrals` - Accessible via hamburger menu in navbar
- **Design Approach**: Mix of SVG images and custom-built functional sections on white background
- **Page Layout**: All elements positioned 10% lower (120px top padding) with unified 70% width
- **SVG Images Used** (70% width, centered):
  - Header: `Group 2797.svg` - Title and introduction section (Updated Nov 2024)
  - Details Section 1: `Group 2792.svg` - Information section
  - Details Section 2: `Group 2791.svg` - Terms section
- **Custom-Built Sections** (70% width, centered):
  - **Your Referral Link** (background: #DEF9F9):
    - Section title in Madimi One font
    - Rectangle with bottom drop shadow
    - Link input field with copy icon (Figtree font)
    - Copy functionality with visual feedback
  - **Friends Referred** (background: #D3F6F7):
    - Section title in Madimi One font
    - Dynamic list of referred users
    - Each item in white rectangle with bottom drop shadow
    - Shows email, date, status (completed/pending), and reward status
    - **Reward badges**: "🎁 +1 Month Plus" shown when rewards are applied
    - **Pending indicator**: "Waiting for Discord" shown for incomplete referrals
    - Figtree font throughout
- **Automatic Reward System** (Updated Nov 2024):
  - **Reward**: Both referrer and referred user get **1 month of Plus tier**
  - **Trigger**: Rewards automatically applied when referred user adds Discord username
  - **Status Flow**:
    1. User signs up with referral link → referral status = `pending`
    2. User adds Discord username → triggers `check_referral_completion()`
    3. System grants Plus tier to both users → status = `completed`
  - **Smart Handling**:
    - Free tier users: Get Plus for 1 month
    - Active Plus users: Extended by 1 month
    - Max tier users: Keep Max (no downgrade)
  - **Prevents Double-Rewarding**: Tracks `referrer_rewarded_at` and `referred_rewarded_at` timestamps
- **Database Tables**:
  - `referral_codes`: Stores unique 8-character codes for each user (auto-generated on signup)
  - `referrals`: Tracks all referrals with status (pending/completed), reward status, and reward timestamps
    - New fields: `reward_status`, `referrer_rewarded_at`, `referred_rewarded_at`
- **Database Functions** (Added Nov 2024):
  - `grant_referral_reward(user_id)`: Grants 1 month Plus tier to specific user
  - `process_referral_rewards(referral_id)`: Processes rewards for both users
  - `check_referral_completion()`: Trigger that auto-applies rewards when Discord username added
  - `admin_process_pending_referrals()`: Admin function to manually process stuck referrals
- **Integration**:
  - Signup page extracts `?ref=CODE` from URL and passes to auth metadata
  - Works with all signup methods (Email, Google, Discord)
  - Database triggers automatically track referrals and update status
  - Profile update triggers check for Discord username and apply rewards
- **API Endpoint**: `/api/referrals` - Returns user's referral code, stats, referrals list, and reward status
- **Files**:
  - Page: `app/referrals/page.tsx`
  - Styles: `app/referrals/referrals.css`
  - API: `app/api/referrals/route.ts`
  - Schema: `database/referrals_schema.sql`
  - Rewards: `database/referral_rewards_system.sql`
  - Documentation: `REFERRAL_REWARDS_GUIDE.md`

## Profile Page (Added Nov 2024)
- **Page**: `/profile` - Accessible via hamburger menu in navbar
- **Purpose**: User profile management with Discord username editing
- **Design**: Clean white background with purple ghost icon, matching site aesthetic
- **Key Features**:
  - **Personal Information Section**: Edit full name, username, school, rank in school
  - **Discord Information Section** (Highlighted):
    - **Critical for Referral Rewards**: Adding Discord username triggers referral reward processing
    - Discord username input field (only field required for rewards)
    - Clear instructions and hints for users
    - Special styling with #DEF9F9 background and "Required for Referral Rewards" badge
  - **Account Information Section** (Read-Only): Email address and member since date
  - **Tier Badge**: Displays user's subscription tier (Free/Plus/Max) with colored badge
  - **Real-Time Saving**: Save button with loading state and success/error messages
  - **Profile Context Integration**: Uses ProfileContext for data and refreshes after save
- **Trigger for Referral Rewards**:
  - When user updates Discord username, database trigger `check_referral_completion()` fires
  - Automatically processes pending referrals and grants 1 month Plus tier to both users
  - Critical component of referral rewards flow
- **Styling**:
  - Purple ghost icon floats with animation at top
  - Form sections with rounded corners and subtle backgrounds
  - Discord section highlighted with cyan background (#DEF9F9)
  - Responsive design for mobile/tablet/desktop
  - Consistent with site's Figtree and Madimi One fonts
- **Files**:
  - Page: `app/profile/page.tsx`
  - Styles: `app/profile/profile.css`
  - Navbar updated with Profile link in hamburger menu

## Planning Mode
- Always ask clarifying questions when in planning mode
- Gather all necessary information before starting implementation
- Ensure full understanding of requirements before proceeding with code changes

## Navbar CSS Reset Override Pattern (Added Nov 2024)
- **Issue**: Pages with universal CSS resets (`* { margin: 0; padding: 0; }`) override navbar's intentional padding/spacing
- **Solution**: Add navbar-specific override rules at the end of page CSS files using `!important`
- **Pattern to add** (at end of each affected page's CSS file):
  ```css
  /* NAVBAR OVERRIDE - Restore navbar styling after page reset */
  .page-wrapper .navbar-main { padding: 0 40px !important; }
  .page-wrapper .navbar-actions { gap: 16px !important; }
  .page-wrapper .nav-btn { padding: 8px 16px !important; }
  .page-wrapper .nav-user-email { margin-right: 8px !important; }
  /* Include all responsive breakpoints */
  ```
- **Affected pages fixed**: competition, subject-selection, maths-demo, spec-point-session, spec-topic
- **Why this approach**: Using `!important` overrides preserves navbar styling without affecting other page elements
- **DO NOT** exclude navbar from page resets - this can break other page element layouts

## Responsive Design Standards (Added Nov 2024)
### Overview
The entire site is now responsive across desktop, tablet, and mobile devices with consistent breakpoints and design patterns.

### Standard Breakpoints
- **Desktop**: Default styles (> 1024px)
- **Tablet**: `@media (max-width: 1024px)` - Adjusted layouts, reduced spacing
- **Mobile**: `@media (max-width: 768px)` - Stacked layouts, full-width elements, hidden decorations
- **Small Mobile**: `@media (max-width: 480px)` - Compact spacing, smaller fonts, essential elements only
- **Very Small Mobile**: `@media (max-width: 375px)` - Minimal UI, critical features only

### Responsive Pages Implemented
1. **Landing/Home Page** (`app/page.tsx`, `app/home.css`):
   - Island platform and icons scale proportionally on smaller screens
   - Icons repositioned and resized for mobile layouts
   - Cloud decorations fade out progressively on smaller devices
   - Fully responsive from 375px to desktop widths

2. **Navbar Component** (`components/Navbar.tsx`, `components/Navbar.css`):
   - Fixed height navbar (60px desktop, 55px tablet, 50px small mobile)
   - Buttons adapt: full text → abbreviated → icons only
   - User email hidden on mobile devices
   - Dropdown menu adjusts positioning for small screens

3. **Practice Page** (`app/practice/practice.css`):
   - Tabs stack vertically on mobile
   - Pack rectangles become full-width and reduce height
   - Floating buttons reposition to corners
   - Cloud decorations hidden on mobile

4. **AskBo Page** (`app/askbo/study-book.css`):
   - Sidebar becomes slide-out drawer on mobile
   - Chat input and materials layout adapt to single column
   - Category grid collapses from 3 columns → 2 → 1
   - Floating draft button scales down proportionally

5. **Existing Pages Enhanced**:
   - Competition page: Already had responsive design at 1024px, 768px, 480px
   - Subject Selection page: Already had responsive design at 1024px, 768px, 480px
   - Maths Demo page: Already had responsive design at 768px, 480px
   - Spec Point Session page: Already had responsive design at 1200px, 768px

### Responsive Design Patterns
- **Typography Scaling**: Font sizes reduce by ~10-20% at each breakpoint
- **Spacing Reduction**: Padding/margins reduce proportionally (40px → 30px → 20px → 15px → 12px)
- **Layout Changes**: Grid/flex layouts collapse to single column on mobile
- **Element Hiding**: Decorative elements (clouds, icons) hidden on smaller screens
- **Touch Targets**: Minimum 44px touch targets for mobile buttons
- **Full Width**: Content containers become 100% width on mobile (no fixed max-widths)

### CSS Organization
- Responsive styles added at bottom of each page's CSS file
- Media queries ordered from largest to smallest breakpoint
- Mobile-first approach considered for new components
- Use of CSS custom properties (variables) for consistent spacing

### Files Modified
- `/app/home.css` - New responsive styles for landing page
- `/components/Navbar.css` - New file with responsive navbar styles
- `/components/landing/LandingHub.tsx` - Converted to CSS classes
- `/app/practice/practice.css` - Added comprehensive responsive sections
- `/app/askbo/study-book.css` - Enhanced existing responsive styles

### Testing Recommendations
- Test at standard breakpoints: 375px, 480px, 768px, 1024px, 1440px
- Check both portrait and landscape orientations on mobile
- Verify touch targets are adequately sized (minimum 44x44px)
- Ensure no horizontal scrolling on any screen size
- Test with browser dev tools responsive mode

## Learn Joe Prompt (Updated Nov 2024)
- **Teaching Style**: Joe is a no-nonsense, direct A-level maths tutor
- **Core Approach**: Clear explanation and worked examples - efficiency over encouragement
- **Voice**: Direct, concise, fact-based. No fluff, minimal praise ("Correct" is sufficient)
- **Response Style**: Short sentences, step-by-step problem solving, quick understanding checks
- **Math Formatting** (Updated Nov 2024): ALL mathematical expressions MUST use LaTeX syntax
  - Inline math: `$x^{12}$`, `$\frac{dy}{dx}$` (wrapped in single dollar signs)
  - Display math: `$$\frac{d}{dx}x^n = nx^{n-1}$$` (wrapped in double dollar signs)
  - Powers with braces: `$x^{12}$` NOT `$x^12$`
  - Fractions: `$\frac{a}{b}$` NOT `a/b`
  - Rendered using KaTeX via ReactMarkdown with `remark-math` and `rehype-katex` plugins
  - Frontend: `/app/spec-point-session/page.tsx` imports `katex/dist/katex.min.css`
- **Content Switching** (Updated Nov 2024): Proactively suggests switching between video/questions/PDF via clickable buttons
  - Joe uses `[SWITCH_CONTENT:video]`, `[SWITCH_CONTENT:questions]`, `[SWITCH_CONTENT:pdf]` markers
  - API automatically converts markers to clickable "Switch to [Content]" buttons
  - Students click buttons to switch tabs (user-controlled, not automatic)
  - Prevents jarring auto-switches while preserving Joe's guidance capability
- **Intervention Logic**: Monitors conversation patterns and redirects when stuck or mismatched difficulty
- **Exam Preparation**: Focuses on time management, showing working, and exam technique
- **Escalation**: Knows limits and directs to Discord community when needed
- **Implementation**: Located in `/app/api/chat/learn/route.ts` as `JOE_SYSTEM_PROMPT` constant
- **Lesson Content Awareness** (Added Nov 2024):
  - Joe receives comprehensive lesson content context in every message
  - **Context includes**:
    - All questions loaded in the lesson with full details (code, difficulty, parts, marks, LaTeX)
    - Which specific question the student is currently viewing
    - Video URL availability status
    - PDF URL availability status
    - Student progress data (questions correct, video watched, PDF viewed)
  - Joe can reference specific questions by code or number
  - Joe can provide targeted help based on exact question student is working on
  - Joe knows student's progress and can adjust difficulty/suggestions accordingly
  - Context passed from `/app/spec-point-session/page.tsx` via `lessonContent` parameter
  - Context formatted in `/app/api/chat/learn/route.ts` for clarity and easy reference

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
- **Learn icon**: Greyed out with opacity-40 and grayscale, made non-clickable (disabled Nov 2024)
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
    - **Block Images** (Updated Nov 2024):
      - Purple blocks for odd-numbered chapters (1, 3, 5, 7): `purpleblock.svg`
      - Blue blocks for even-numbered chapters (2, 4, 6, 8, 10): `blueblock.svg`
      - Each block is 132x33px
    - Multiple toast icons (Group 2376.svg) positioned above each bar - one toast per lesson
    - Spec point info displayed below each bar: ID, name, and completion time in hours
  - **Spec Points Data**: 39 total spec points including blended blocks at chapter ends (Updated Nov 2024)
    - 30 normal spec points with lesson counts ranging from 1-6 lessons each
    - 9 blended practice blocks positioned at the end of each chapter (chapters 1-8, 10)
  - **Blended Blocks** (Updated Nov 2024):
    - Added at the end of every chapter as special stepping stones
    - Display treasure chest icon (150x150px) above the block
    - **Two types of blended blocks**:
      - Standard blended block: Used for odd chapters (1, 3, 5, 7) using `blendedblock.svg`
      - Transition block: Used when transitioning from even to odd chapters (after chapters 2, 4, 6, 8) using `end-of-ch-blue-to-purple.svg`
    - No lessons or hours associated with blended blocks
    - Serve as visual chapter markers and practice checkpoints
  - **Ghost Character**:
    - Positioned on the first stepping stone (spec point 1.1 Proofs)
    - Position: top: -60px (moved up 15% from -40px)
    - Responsive: top: -45px on tablet (768px breakpoint)
    - Floating animation with subtle up/down movement
    - **Clickable link** to `/spec-point-session` with spec point and lesson parameters
    - Size: 100x100px
  - **Search Bar** (Added Nov 2024):
    - **Position**: Fixed at top of page (top: 70px), above progress bar
    - **Width**: 40% of viewport (max-width: 550px) - half the width of progress bar
    - **Styling**: Rectangular with rounded corners (12px radius), drop shadow on bottom edge
    - **Functionality**: Real-time filtering of spec points as user types
    - **Dropdown**: Appears when typing, exact same width as search bar, no gap
    - **Selection Color**: #B3F0F2 (light cyan) on hover
    - **Font**: Figtree family
    - **Display**: Shows spec ID and name in each dropdown item
    - Clicking a topic from dropdown scrolls to that spec point
  - **Navigation System** (Updated Nov 2024):
    - **Search bar** at top of page (top: 70px, fixed position, visible during scrolling)
    - **Progress bar** below search bar (top: 160px, fixed position, visible during scrolling)
    - **Spacing**: 90px gap between search bar and progress bar for clear visual separation
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
    - Toast arrangement: Flex layout with wrapping, max-width 154px per group (Nov 2024)
    - **Lesson Completion Icons** (Added Nov 2024):
      - **Incomplete lessons**: Display default gray toast icon (`Group 2376.svg`)
      - **Completed lessons** (video watched): Display colored icons based on chapter
        - Odd chapters (1, 3, 5, 7): Purple completion icon (`toast-purple.svg`)
        - Even chapters (2, 4, 6, 8, 10): Blue completion icon (`toast-blue.svg`)
      - Completion status fetched from `learn_user_progress` table
      - Lessons identified by combining spec point ID and lesson number (e.g., "1.1-1", "7.2-2")
      - Progress data only fetched for logged-in users
  - **Styling Details**:
    - **Vertical positioning** (Updated Nov 2024): Stepping stones moved down 10% on page for better visual balance
      - Desktop padding-top: 260px (increased from 180px)
      - Tablet padding-top: 200px (increased from 140px)
      - Mobile padding-top: 170px (increased from 120px)
    - **Horizontal spacing** (Updated Nov 2024): Levels positioned closer together for tighter layout
      - Desktop gap: 100px (reduced from 180px)
      - Tablet gap: 90px (reduced from 160px)
      - Mobile gap: 80px (reduced from 140px)
    - **Chapter signposts** (Updated Nov 2024): Positioned to appear in grass area near divider line
      - **CRITICAL**: These values are calculated based on wrapper extending 80px below viewport and grass fixed at bottom: 64px
      - Desktop: bottom: 118px (NOT negative - positions signpost to appear in grass with ~70px visible above grass divider line)
      - Tablet: bottom: 133px (adjusted for 135px signpost height)
      - Mobile: bottom: 148px (adjusted for 120px signpost height)
      - **DO NOT use negative values** - they push signposts below viewport making them invisible
      - Positioning calculation: Grass top is at 118px from viewport bottom; wrapper bottom extends 80px below viewport; positive bottom value keeps signposts visible in grass area
      - **Signpost Images** (Updated Nov 2024):
        - Even chapters (2, 4, 6, 8, 10): Blue empty flagpost (`flagpost-blue-empty.svg`)
        - Odd chapters (1, 3, 5, 7): Purple empty flagpost (`flagpost-purple-empty.svg`)
        - Dimensions: 120x150px (desktop), 105x135px (tablet), 90x120px (mobile)
      - **Signpost Text Overlay** (Added Nov 2024):
        - Chapter number and title displayed as text overlay on signpost images
        - Chapter titles mapping: 1=Proof, 2=Algebra and Functions, 3=Coordinate Geometry, 4=Binomial Expansion, 5=Trigonometry, 6=Exponentials and Logarithms, 7=Differentiation, 8=Integration, 10=Vectors
        - **Styling**: Figtree font, black color (#000000), no text shadow
        - **Layout**: Chapter number and title displayed inline with flexbox, wraps to two lines for longer titles
        - Font sizes: 14px (desktop), 12px (tablet), 11px (mobile)
        - Gap between elements: 2px horizontal gap for all sizes
        - Row gap (vertical spacing): 2px (desktop/tablet), 1px (mobile) for tighter wrapped lines
        - Text positioned at 12% from top of signpost, centered horizontally with flex-wrap enabled
    - **Background** (Updated Nov 2024): Full background SVG image
      - Image URL: Firebase storage `background-grey-updated.svg`
      - Background applied to `.stepping-stones-container` with `background-attachment: local`
      - Background repeats horizontally (repeat-x) so users see more as they scroll
      - Background positioned at bottom, auto height scaling to 100% of viewport
      - Scrolls with stepping stones content while maintaining viewport-relative sizing
      - Replaces previous grass pattern and divider line
      - **Image rendering optimization** (Updated Nov 2024): Enhanced SVG quality with multiple rendering optimizations:
        - `image-rendering: high-quality` and `optimizeQuality` for crisp rendering
        - `transform: translateZ(0)` and `backface-visibility: hidden` for GPU acceleration
        - `-webkit-optimize-contrast` for WebKit browsers
        - `-ms-interpolation-mode: bicubic` for smooth scaling in IE/Edge
    - Progress bar: 80% width, centered, with responsive sizing for mobile
    - Back button in top-left corner linking to `/subject-selection`
    - **Icon sizes** (optimized for 5 topics in view - Nov 2024):
      - Toast icons: 38x38px
      - Bar/platform: 132x33px
      - Ghost character: 77x77px
      - Ghost position: top: -50px
    - **Spec info typography** (Nov 2024):
      - ID: 14px
      - Name: 12px
      - Time badge: 11px
      - Min-width: 132px
  - **Files**:
    - Page: `app/maths-demo/page.tsx`
    - Styles: `app/maths-demo/maths-demo.css`

**Navigation Flow**: Home (Learn icon) → Competition → Subject Selection → Maths Demo → Spec Topic

## Progress Dashboard (Redesigned Nov 2024)
- **Location**: Accessible via blue folder icon in top-right corner of `/maths-demo` page
- **Component**: `/components/ProgressDashboard.tsx` with styles in `/components/ProgressDashboard.css`
- **Purpose**: Comprehensive student performance dashboard showing grades, streaks, and progress metrics
- **Design**: Modern metrics-focused layout with light cyan background (#F3FDFD) and rounded corners

### Dashboard Layout Structure
**Top Row (4 metric boxes):**
1. **Working Grade**: Current grade displayed in cyan (#00CED1) with progress bar
   - Shows: A* grade
   - Progress bar shows completion percentage

2. **Predicted Grade**: Future grade prediction
   - Shows: A** grade

3. **Learning Streak**: Days logged in consecutively
   - Shows flame icon from Firebase Storage
   - Displays: 7 days logged in

4. **Exam Readiness**: Topic coverage tracking
   - Shows: 12 / 30 topics completed
   - Progress bar with cyan fill

**Bottom Row (3 boxes - 2 left + 1 tall right):**
5. **This Week** (bottom left):
   - Questions Answered: 42
   - Accuracy: 85%
   - Study Time: 3.5h
   - Each stat in mini container with drop shadow on bottom edge

6. **Grade Trajectory** (bottom left):
   - Line graph showing grade progression over 5 weeks (W1-W5)
   - Cyan line (#00CED1) with data points
   - Grid lines for reference

7. **Grade Split by Topic** (tall box spanning both rows on right):
   - Pie chart showing topic grade distribution
   - Colors: A** (#6CE5E8), A* (white), A (#C8F4F6), B (#E7E6FF), C (#0AB2B4)
   - Legend with counts: A** (6), A* (8), A (9), B (5), C (2)

### Styling Details
- **Typography**:
  - Labels/text: Figtree font family
  - Numbers/grades: Madimi One font family
- **Containers**:
  - All boxes: White background with 1px black borders, 12px border radius
  - Mini stat boxes: 8px border radius with `box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1)`
- **Progress Bars**:
  - Height: 8px
  - Border: 1px solid black
  - Fill color: #00CED1 (cyan)
  - Background: #E5E7EB (light gray)
- **Modal**:
  - Max-width: 1100px
  - Background: #F3FDFD
  - Border-radius: 16px
  - Padding: 32px

### Data Source
- **Current State**: Using default placeholder data
- **Future Implementation**: Will fetch real user data from database tables:
  - Working/Predicted grades from user performance metrics
  - Learning streak from login history
  - Exam readiness from topic completion tracking
  - Weekly stats from question attempt records
  - Grade trajectory from historical performance data
  - Topic grades from lesson completion scores

### Responsive Design
- **1024px**: Top row becomes 2 columns, bottom section stacks vertically
- **768px**: Top row becomes single column, trajectory chart adjusts
- **480px**: Compact spacing, smaller fonts, mobile-optimized layout

### Files
- Component: `/components/ProgressDashboard.tsx`
- Styles: `/components/ProgressDashboard.css`
- Trigger: Blue folder icon in `/app/maths-demo/page.tsx`

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
- **Loading States Fix** (Nov 2024):
  - Video and PDF loading states initialized to `true` (not `false`)
  - Ensures loading screens are visible on initial page render
  - Prevents flash of "no content" before data fetches
  - Loading states set to `false` after lesson data successfully loads
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
- **Video Player Fix** (Nov 2024):
  - VideoPlayer component now detects URL type (YouTube vs. direct video file)
  - **YouTube URLs**: Rendered using ReactPlayer with iframe
  - **Direct video URLs** (.mp4, .mov, .webm, etc.): Rendered using native HTML5 `<video>` element
  - Custom controls work with both video types
  - onProgress and onEnded callbacks maintained for both implementations
  - Fixes playback issues with S3-hosted .mov files
- **Progress Tracking Fix** (Nov 2024):
  - **Issue**: Supabase queries using `.single()` threw 406 errors when no progress record existed
  - **Solution**: Removed `.single()` from all progress queries and handle empty arrays gracefully
  - Affected functions: `fetchProgressData`, `trackPdfViewed`, `handleVideoProgress`, `handleVideoEnded`
  - Now returns default values when no progress record exists instead of throwing errors
  - Prevents console error spam and improves user experience
- **Files**:
  - Page: `app/spec-point-session/page.tsx`
  - Video component: `components/VideoPlayer.tsx`
  - Styles: `app/spec-point-session/spec-point-session.css`
- **Questions Integration** (Nov 2024):
  - Questions loaded from database via `/api/lessons/[lessonId]/questions` endpoint
  - Each question displays code (e.g., B1, A1), difficulty level, and instructions
  - Question parts (a, b, c, d) displayed with human-readable text
  - **MathInput component** used for LaTeX answer input instead of multiple choice
  - User answers stored in state with key format: `{questionCode}-{partLetter}`
  - Question navigation: Previous/Next buttons with counter showing current position
  - Loading states for questions fetching
  - Empty state when no questions available
- **Answer Submission & Feedback** (Nov 2024):
  - **Check Answer button** below each MathInput component
    - Disabled when no answer entered or while submitting
    - Shows "Checking..." during submission
  - **Time Tracking**: Automatically tracks time spent on each question part from first input
  - **Submission State Management**: Tracks submitted status, correctness, attempt number, marks awarded
  - **Feedback Display**:
    - **Correct answers**: Green checkmark icon, "Correct! ✓" message, shows marks awarded
    - **Incorrect answers**: Red X icon, "Incorrect. Try again or view solution." message
    - Shows attempt number for multiple attempts
    - Feedback container with color-coded borders (green for correct, red for incorrect)
  - **Show Solution Feature**:
    - "Show Solution" button appears for incorrect answers (if solution available)
    - Toggle button to show/hide solution
    - Solution displayed with markdown rendering via ReactMarkdown
    - Solution styled with gray background and left border accent
  - **Multiple Attempts**: Users can resubmit answers, attempt number increments automatically
  - **Login Requirement**: Non-logged-in users are prompted to log in before submitting answers
- **Progress Indicator** (Nov 2024):
  - **Display Location**: Between page header and main content
  - **Only visible for logged-in users**
  - **Progress Statistics**:
    - Questions answered correctly count (e.g., "12 / 41 answered correctly")
    - Video watched indicator: ✓ (green) when watched, ○ (gray) when not watched
    - PDF viewed indicator: ✓ (green) when viewed, ○ (gray) when not viewed
  - **Progress Bar**:
    - Shows completion percentage based on questions answered correctly
    - Background: #E0E0E0
    - Fill: #B3F0F2
    - Height: 8px
    - Border: 1px solid #000
    - Border radius: 4px
    - Smooth animation on width change (0.5s transition)
  - **Real-time Updates**:
    - Question count updates when user submits correct answers
    - Video indicator updates when video finishes playing
    - PDF indicator updates when user views PDF (switches to PDF tab)
  - **Data Sources**:
    - Fetches from `learn_user_progress` table for video_watched and pdf_viewed
    - Counts unique correct answers from `learn_user_answers` table
    - Calculates total questions from loaded questions data
- **Database Query Fix** (Nov 2024):
  - **Issue**: Original code queried `learn_lessons` using non-existent `spec_point` column
  - **Solution**: Changed to direct lesson ID query instead
  - **Implementation**:
    - Hardcoded lesson ID: `d0000000-0000-0000-0000-000000000001` (Power Rule lesson)
    - Query uses `.eq('id', lessonId)` instead of `.eq('spec_point', specPoint)`
    - Added join with `learn_spec_points` table to get spec point code and name
    - Questions already fetched correctly using `lesson_id`
  - **Database Schema Note**: `learn_lessons.spec_point_id` is a UUID foreign key, not a string column

## Lessons Questions API Route (Nov 2024)
- **Endpoint**: `/api/lessons/[lessonId]/questions` - GET endpoint for fetching lesson questions
- **File**: `app/api/lessons/[lessonId]/questions/route.ts`
- **Authentication**: No authentication required (content is public)
- **Parameters**:
  - `lessonId` (string, required): UUID of the lesson from learn_lessons table
- **Response Data**:
  - `success`: Boolean indicating success
  - `questions`: Array of question objects with nested parts (transformed to camelCase)
  - Each question has: `code`, `difficulty`, `instructions`, `parts[]`
  - Each part has: `id`, `letter`, `questionLatex`, `questionDisplay`, `solutionSteps`, `marks`
- **Database Query** (Updated Nov 2024):
  - **Single nested query** using Supabase relationship syntax for better performance
  - Fetches `learn_questions` with embedded `learn_question_parts` in one database call
  - Database fields: `question_code`, `difficulty_level`, `part_letter`, `question_latex`, `question_display`, `solution_steps`
  - **Data transformation**: Converts database snake_case fields to camelCase for frontend compatibility
  - Ordered by `display_order` for consistent presentation
  - Uses service role client (`@supabase/supabase-js`) matching project pattern
- **Error Handling**:
  - 400: Missing lesson ID
  - 500: Database error
  - Returns empty array if no questions found
- **Usage**: Used by spec point session pages to load practice questions

## Answer Submission API Route (Nov 2024)
- **Endpoint**: `/api/answers/submit` - POST endpoint for submitting and validating student answers
- **File**: `app/api/answers/submit/route.ts`
- **Dependencies**: Uses `mathjs` library for symbolic math comparison
- **Request Body**:
  - `user_id` (string, required): UUID of the user from auth.users
  - `question_part_id` (string, required): UUID of the question part from learn_question_parts
  - `submitted_answer_latex` (string, required): Student's LaTeX answer
  - `time_spent_seconds` (number, optional): Time spent on the question
- **Validation Logic**:
  - Fetches acceptable answers from `learn_question_parts.acceptable_answers` (JSON array)
  - **Normalization** applied to both submitted and acceptable answers:
    - Removes all whitespace
    - Converts `\times` and `\cdot` to `*`
    - Removes curly braces around single characters (e.g., `x^{6}` → `x^6`)
    - Converts `\div` to `/`
    - Lowercase conversion for case-insensitive comparison
  - **Two-stage comparison**:
    1. String matching on normalized LaTeX
    2. Symbolic math comparison using mathjs for algebraic equivalence
  - **Mathjs conversion**: Converts LaTeX to mathjs format (`\frac{a}{b}` → `(a)/(b)`, `\sqrt{x}` → `sqrt(x)`, etc.)
- **Database Operations**:
  - Saves to `learn_user_answers` table with fields:
    - `submitted_answer_latex`: Raw LaTeX answer
    - `is_correct`: Boolean validation result
    - `marks_awarded`: Full marks if correct, 0 if incorrect
    - `attempt_number`: Increments with each retry
    - `time_spent_seconds`: Time tracking
  - Database trigger automatically updates `learn_user_progress`
- **Response Data**:
  - `correct` (boolean): Whether answer is correct
  - `correctAnswer` (string): First acceptable answer (for feedback)
  - `feedback` (string): User-friendly message
  - `marksAwarded` (number): Marks received
  - `attemptNumber` (number): Current attempt count
- **Error Handling**:
  - 400: Missing required fields
  - 404: Question part not found
  - 500: Database error or missing acceptable answers
  - Mathjs errors fall back to string comparison only
- **Usage**: Called from spec point session pages when students submit answers to practice questions

## PDF Viewer Component (Nov 2024)
- **Component**: `/components/PdfViewer.tsx` - Reusable PDF viewing component using react-pdf
- **Dependencies**: react-pdf library installed for PDF rendering
- **Props**:
  - `pdfUrl` (string, required): URL of the PDF to display
  - `onPageChange` (function, optional): Callback fired when page changes - receives page number
- **Features**:
  - **PDF Rendering**: Uses react-pdf's Document and Page components
  - **Navigation Controls**: Previous/Next buttons with proper disabled states
  - **Page Counter**: Displays "Page X of Y" format in center of controls
  - **Loading State**: Animated spinner with "Loading PDF..." message
  - **Error Handling**: Shows warning icon and error message if PDF fails to load
  - **Responsive Design**: Automatically adjusts to container width (max 800px)
  - **Text & Annotations**: Full PDF functionality with text selection enabled
- **Styling**:
  - White background (#ffffff)
  - Black border (2px solid)
  - Rounded corners (12px radius)
  - Light gray PDF viewing area (#f5f5f5)
  - Navigation bar at bottom with border separator
  - Button hover effects for better UX
- **Worker Configuration**: Uses CDN-hosted PDF.js worker from unpkg
- **Usage**: Designed for use in spec point session pages for displaying study materials
- **Integration in Spec Point Session Page** (Nov 2024):
  - PDF URL fetched from `learn_lessons` table based on spec point and lesson number
  - Falls back to default S3 URL if no database entry found
  - "Download PDF" button opens PDF in new tab
  - PDF viewing tracked in `learn_user_progress` table (sets `pdf_viewed = true`)
  - Progress tracking creates new record if none exists, updates existing record if already exists
  - Tracking occurs when user switches to PDF tab (tracked once per viewing session)

## Lessons API Route (Nov 2024)
- **Endpoint**: `/api/lessons/[lessonId]` - GET endpoint for fetching lesson data
- **File**: `app/api/lessons/[lessonId]/route.ts`
- **Authentication**: No authentication required (content is public)
- **Parameters**:
  - `lessonId` (string, required): UUID of the lesson from learn_lessons table
- **Response Data**:
  - `id`: Lesson UUID
  - `specPoint`: Spec point identifier (e.g., "7.2")
  - `lessonNumber`: Lesson number within the spec point
  - `lessonName`: Name of the lesson
  - `description`: Lesson description
  - `videoUrl`: S3 URL for the lesson video
  - `pdfNotesUrl`: S3 URL for the lesson PDF notes
  - `totalQuestions`: Count of all question parts across all questions for this lesson
  - `createdAt`: Timestamp of lesson creation
  - `updatedAt`: Timestamp of last update
- **Error Handling**:
  - 400: Missing lesson ID
  - 404: Lesson not found (PGRST116 error code)
  - 500: Database error or internal server error
- **Question Counting Logic**:
  - Queries `learn_questions` table to get all questions for the lesson
  - Counts total rows in `learn_question_parts` table for those questions
  - Continues gracefully if question count fails (returns 0)
- **Usage**: Used by spec point session pages to fetch complete lesson data including question counts

## Video Player Component (Nov 2024)
- **Component**: `/components/VideoPlayer.tsx` - Custom video player using react-player
- **Dependencies**: react-player library installed for video playback
- **Props**:
  - `videoUrl` (string, required): URL of the video to play (supports .mov, .mp4, and other formats)
  - `onProgress` (function, optional): Callback fired during playback - receives progress as decimal (0-1)
  - `onEnded` (function, optional): Callback fired when video ends
- **Features**:
  - **Video Playback**: Uses ReactPlayer component for reliable cross-format support
  - **Custom Controls**: Fully custom control bar with site-consistent styling
  - **Play/Pause**: Large, accessible play/pause toggle button
  - **Progress Bar**: Seekable progress bar with visual feedback (#B3F0F2 accent color)
  - **Volume Control**: Volume slider with mute/unmute button
  - **Time Display**: Current time / Total duration in MM:SS format
  - **Fullscreen**: Enter/exit fullscreen mode
  - **Auto-hide Controls**: Controls fade out after 3 seconds of inactivity during playback
  - **Loading State**: Animated spinner with "Loading video..." message
  - **Responsive Design**: Maintains 16:9 aspect ratio at all screen sizes
- **Styling**:
  - Black background (#000) for video container
  - Gradient control bar overlay (transparent to rgba(0,0,0,0.8))
  - Madimi One font for time display
  - #B3F0F2 accent color for progress bar, volume slider, and hover states
  - Rounded corners (12px radius) on container
  - Custom styled range input thumbs with white borders
- **Video Format Support**: Supports .mov, .mp4, .webm, and other formats via react-player
- **Controls Behavior**:
  - Show on mouse movement or hover
  - Hide after 3 seconds of inactivity when playing
  - Always visible when paused
- **Usage**: Designed for use in spec point session pages for lesson video playback
- **Integration in Spec Point Session Page** (Nov 2024):
  - Video URL fetched from `learn_lessons` table based on spec point and lesson number
  - Falls back to default S3 URL if no database entry found
  - Dynamically imported with `ssr: false` to prevent SSR issues with react-player
  - **Progress Tracking**: Video progress saved to `learn_user_progress.video_progress_seconds` every 10 seconds
  - **Completion Tracking**: When video ends, sets `learn_user_progress.video_watched = true`
  - Progress tracking creates new record if none exists, updates existing record if already exists
  - Tracking only occurs for logged-in users

## MathInput Component (Updated Nov 2024)
- **Component**: `/components/MathInput.tsx` - LaTeX math input component using MathQuill
- **Dependencies**: @edtr-io/mathquill installed for LaTeX editing
- **Props**:
  - `value` (string, required): Current LaTeX string value
  - `onChange` (function, required): Callback fired when LaTeX changes - receives latex string
  - `placeholder` (string, optional): Placeholder text for empty input (default: "Enter math expression...")
- **Features**:
  - **LaTeX Input**: Uses MathQuill WYSIWYG editor for math expressions
  - **Math Keyboard**: Grid of common math symbols and operators
  - **Symbol Insertion**: Click buttons to insert symbols at cursor position
  - **Client-Side Only**: Dynamically imports MathQuill to avoid SSR issues
  - **Direct Input**: Users can type directly into the input field or click keyboard buttons
- **Styling** (Updated Nov 2024):
  - **Input Container Wrapper**: Light gray background (#fafafa) with 2px solid black border and box-shadow for clear visual separation
  - **Input Field**:
    - White background (#ffffff) with 3px solid black border
    - Min-height: 70px, padding: 14px, font-size: 18px for prominence
    - Inset shadow to show it's an input area
    - Focus state: Cyan border (#B3F0F2) with glowing ring effect (box-shadow: 0 0 0 4px rgba(179, 240, 242, 0.3))
  - **Enhanced visual hierarchy**: Prominent wrapper container with bold bordered input field makes it clear where to type
- **Math Keyboard Buttons** (grid layout, 3-4 per row):
  - **Powers/Indices**: x², x³, xⁿ
  - **Roots**: √, ∛, ⁿ√
  - **Operations**: ±, ÷, ×, a/b
  - **Comparisons**: ≤, ≥, ≠
  - **Special**: ∞, π, α, β, θ
  - **Calculus**: Σ, ∫, lim
  - **Brackets**: ( ), [ ], { }
- **Responsive Design**:
  - Desktop: auto-fill grid (min 70px per button)
  - Tablet (≤768px): 4 buttons per row
  - Mobile (≤480px): 3 buttons per row
- **Usage**: Designed for math question input in spec point session pages
- **Implementation Notes** (Updated Nov 2024):
  - Uses `@ts-nocheck` to avoid TypeScript conflicts with MathQuill
  - **jQuery dependency**: Loads jQuery 3.6.0 from CDN before MathQuill (MathQuill requires jQuery 1.5.2+)
  - **MathQuill loaded from CDN** (jsdelivr v0.11.0) as script instead of npm module
  - **Script loading order**: jQuery → MathQuill → MathField initialization
  - **Synchronous loading**: Scripts load with `async: false` to ensure proper dependency order
  - **Polling mechanism**: Uses setInterval to check when libraries are available before proceeding
  - **Global objects**: Accesses jQuery and MathQuill from window object
  - **Click handler** added to ensure field focuses when clicked anywhere in the input area
  - **Simplified MathQuill config**: Basic handlers for edit events, auto-focus on initialization
  - **CSS pointer-events** properly configured to ensure field is clickable and interactive
  - **Textarea properly hidden** but accessible for keyboard input while maintaining field clickability
  - Focus management after button clicks
  - **Preview section removed** for cleaner, more focused input experience
  - **Deduplication**: Checks for existing script/CSS before loading to prevent duplicates
  - **Console logging**: Added logging for debugging load sequence

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

### Message-Based Limits Per Tier
- **All tiers have message limits per service** (defined in `lib/usage-tracking.ts`):
  - **Free Tier**:
    - **AskBo Chat**: 5 messages per month
    - **Interview Chat**: 5 messages per month
    - **Total**: 10 messages sent + 10 responses received per month
  - **Plus Tier**:
    - **AskBo Chat**: 30 messages per month
    - **Interview Chat**: 30 messages per month
    - **Total**: 60 messages sent + 60 responses received per month
  - **Max Tier**:
    - **Unlimited messages** (cost-based limits apply instead)

### Monthly Resets
- **Message counts reset at the start of each month** (based on `month_year` field)
- **Applies to all users** regardless of when they joined (only current month counts)
- Previous months' usage does not carry over

### Max Tier - Cost-Based Limits
- **Max tier users only**: $12.00 per month cost limit (defined in `lib/usage-tracking.ts`)
- **Important**: Limits are **COMBINED** for ALL services (AskBo, Interview prep, etc.) per user per month
  - Not separate limits per service
  - All AI interactions count toward the single monthly cost limit

### Implementation Details
- **Free and Plus users**:
  - Use `canSendMessage(userId, service)` to check message limits before request
  - Use `recordMessageUsage(userId, service)` to track message after response
  - No cost tracking for free/plus users
- **Max users**:
  - Use `canMakeRequest(userId, estimatedInputTokens, estimatedOutputTokens)` for cost checks
  - Use `recordUsage(userId, service, inputTokens, outputTokens)` for cost tracking
  - Unlimited messages as long as cost limit not exceeded

- **Bug Fixes Applied** (Nov 2024):
  1. **Comparison operator consistency**: Changed from `>` to `>=` in `canMakeRequest()` to match `hasExceededLimit()`
  2. **Database error handling**: On errors, system now assumes limit is reached (conservative approach) instead of allowing unlimited usage
  3. **Race condition protection**: Added `verifyUsageWithinLimit()` function to detect when concurrent requests cause limit breach
     - API endpoints should call this function AFTER recording usage
     - Logs warning when overage is detected with exact overage amount

- **Key Functions**:
  - `canSendMessage(userId, service)`: Check message limits for free and plus users
  - `recordMessageUsage(userId, service)`: Record message usage for free and plus users
  - `canMakeRequest()`: Pre-flight check before allowing AI requests (Max tier only)
  - `recordUsage()`: Records actual token usage after completion (Max tier only)
  - `verifyUsageWithinLimit()`: Post-recording verification to catch race conditions (Max tier only)
  - `getMonthlyUsage()`: Gets current month's total usage for a user (Max tier only)
  - `getMonthlyMessageCount(userId, service)`: Gets message count for free and plus users

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
