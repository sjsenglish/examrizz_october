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

## Arena Page Structure (Updated Nov 2025)
- The arena page is located at `/competition` (legacy route name)
- Completely redesigned as "AI Buddy Arena" featuring AI evaluation tools
- Features 8 AI-powered evaluation tools:
  - Essay Grader (Beta)
  - Answer Checker (Available)
  - Mock Interview (Coming Soon)
  - Study Planner (Available)
  - Weakness Analyzer (Beta)
  - Concept Explainer (Available)
  - Exam Predictor (Coming Soon)
  - Peer Comparison (Coming Soon)
- Uses card-based grid layout with filtering by status
- Follows site design patterns: Figtree font, #00CED1 accent color, #F8F8F5 background
- Arena icon in LandingHub now links to `/competition` page
- Page includes interactive tool cards with status badges and feature lists