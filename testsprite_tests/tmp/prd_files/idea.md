# Visual Life Execution System - Complete Architecture

## Executive Summary

A SaaS platform that transforms human effort into evolving visual art. Users create multi-domain life visions that progressively colorize from grayscale through real action, supported by AI coaching, adaptive daily loops, and narrative-driven introspection.

---

## 1. SYSTEM ARCHITECTURE

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  Vision Editor | Board Selector | Pixel Renderer | Timeline │
│  Night Journal | Task Validator | Animation Engine | Share  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                         API GATEWAY                          │
│         Authentication | Rate Limiting | Routing            │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                        │
│  Domain Service | Goal Engine | Pixel State | Timeline      │
│  Reminder Service | Privacy Manager | Asset Storage          │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        AI LAYER                              │
│  Goal Decomposer | Domain Coach | Reflection Interpreter    │
│  Story Generator | Design Suggester | Task Adjuster         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     BACKGROUND JOBS                          │
│  Reminder Scheduler | Board Generator | Pixel Computer       │
│  Timeline Stitcher | Wrap Generator                          │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  PostgreSQL | Redis | S3/Object Storage | Vector DB         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DETAILED USER FLOWS

### 2.1 Onboarding Flow

**Goal:** Transform abstract life vision into structured, actionable domains.

```
Step 1: Welcome & Philosophy
- Explain: "Your effort becomes art"
- Show example journey transformations
- Set expectations: daily commitment, no guilt

Step 2: Life Vision Definition
- Free-form text: "Describe your ideal life 1 year from now"
- AI extracts themes and suggests domains
- User confirms/edits domains (e.g., Career, Health, Finance, Learning)

Step 3: Domain Image Collection
- For each domain:
  - User uploads 1-5 inspirational images
  - AI suggests image searches if needed
  - Images represent the "completed" vision

Step 4: Design Board Preview
- AI generates 5-7 master board designs
- Show: grid, collage, cinematic, minimalist, symmetric, chaos-to-order
- User selects favorite (can change later)
- Generate: annual, quarterly, monthly, weekly variants

Step 5: Goal Decomposition & Approval
- AI breaks each domain into:
  - 3-5 major milestones (quarterly)
  - Concrete TODOs for first month
- Presents review screen:
  - "Career: Land senior role → Update resume (Week 1)"
  - User can discuss, edit, refine via chat
  - AI coaches as domain expert
- User approves initial plan

Step 6: First Week Setup
- Allocate pixel budgets per domain
- Generate Week 1 board (fully grayscale)
- Set bedtime reminder preference
- Launch dashboard
```

---

### 2.2 Daily Loop (THE CORE EXPERIENCE)

**Flow Overview:**
```
                      ┌──────────────────┐
                      │ Bedtime Reminder │
                      └────────┬─────────┘
                               ↓
                      ┌──────────────────┐
                      │   Night Journal  │
                      └────────┬─────────┘
                               ↓
                      ┌──────────────────┐
                      │  AI Reflection   │
                      └────┬──────────┬──┘
                           ↓          ↓
              ┌─────────────────┐  ┌─────────────────┐
              │  Pixel Update   │  │  Next Day Tasks │
              └────────┬────────┘  └────────┬────────┘
                       ↓                    ↓
              ┌─────────────────┐  ┌─────────────────┐
              │ Weekly Board    │  │  Morning        │
              │ Update          │  │  Validation     │
              └─────────────────┘  └─────────────────┘
```

#### NIGHT: Bedtime Journal (8-11 PM, user-configured)

**Trigger:** Push notification → "Reflect on your day"

**Interface:**
```
┌────────────────────────────────────────────┐
│  How was today?                            │
│  ┌──────────────────────────────────────┐ │
│  │ [Free-form text area]                │ │
│  │                                      │ │
│  │ Suggested prompts:                   │ │
│  │ • What did you complete?             │ │
│  │ • What challenged you?               │ │
│  │ • How do you feel about tomorrow?    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Today's Tasks:                            │
│  ☑ Morning workout (Health)               │
│  ☑ Finish project proposal (Career)       │
│  ☐ Read 30 pages (Learning)               │
│                                            │
│  [Confirm Completions] [Save Journal]     │
└────────────────────────────────────────────┘
```

**Backend Flow:**
1. User submits journal entry
2. AI Reflection Service:
   - Extracts completed tasks
   - Detects emotional state (frustrated, motivated, tired)
   - Identifies blockers or momentum
   - Calculates effort contribution per domain
3. Pixel Update Engine:
   - Distributes pixels to weekly board
   - Colorizes specific regions (domain-mapped)
   - Saves daily snapshot
4. Next-Day Task Generator:
   - Adjusts tomorrow's plan based on:
     - Completion rate
     - Energy level
     - Expressed challenges
   - Generates validated task list

---

#### MORNING: Task Validation (6-9 AM, user-configured)

**Trigger:** Gentle notification → "Your day is ready"

**Interface:**
```
┌────────────────────────────────────────────┐
│  Good morning! Based on yesterday:         │
│                                            │
│  💪 Health Domain:                         │
│  → Morning yoga (20 min)                   │
│  [Accept] [Adjust] [Skip today]           │
│                                            │
│  💼 Career Domain:                         │
│  → Send follow-up emails                   │
│  → Review interview prep notes             │
│  [Accept] [Reorder] [Discuss]             │
│                                            │
│  📚 Learning Domain:                       │
│  → Continue reading Chapter 3              │
│  [Postpone to weekend]                     │
│                                            │
│  [Start My Day]                            │
└────────────────────────────────────────────┘
```

**User Actions:**
- **Accept:** Tasks locked for the day
- **Adjust:** Opens chat with AI coach
  - "Can we make workout 15 min instead?"
  - "Add: call recruiter at 2 PM"
- **Skip/Postpone:** No penalty, redistributes effort
- **Discuss:** AI provides context or motivation

**Backend Flow:**
1. Fetch AI-generated task recommendations
2. User edits stored in `daily_task_state` table
3. Finalized tasks trigger:
   - Calendar sync (optional)
   - Reminder scheduling
   - Pixel budget allocation

---

### 2.3 Goal Change Flow (CRITICAL: NO RESET)

**Scenario:** User decides to switch from "Run marathon" to "Build strength"

**Interface:**
```
┌────────────────────────────────────────────┐
│  Edit Health Domain Goal                   │
│                                            │
│  Old Goal: Train for marathon              │
│  Progress: 42% complete (locked)           │
│                                            │
│  New Goal:                                 │
│  ┌──────────────────────────────────────┐ │
│  │ Build functional strength             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  What changed?                             │
│  ┌──────────────────────────────────────┐ │
│  │ Knee injury made running unsafe.      │ │
│  │ Want to focus on bodyweight training. │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Preview Transition] [Confirm Change]     │
└────────────────────────────────────────────┘
```

**Backend Flow:**

**Flow Overview:**
```
                    ┌─────────────────┐
                    │   Active Goal   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ User Edits Goal │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Goal Mutation   │
                    │ Engine          │
                    └────┬──────────┬─┘
                         ↓          ↓
          ┌─────────────────┐  ┌─────────────────┐
          │ Archive Old Goal│  │ Initialize New  │
          │                 │  │ Goal            │
          └────────┬────────┘  └────────┬────────┘
                   └──────────┬─────────┘
                              ↓
                    ┌─────────────────┐
                    │ Vision Board    │
                    │ Update          │
                    └─────────────────┘
```

**Detailed Steps:**
1. Goal Mutation Engine triggers:
   - Archive old goal: `goal_id_old` → `status: archived`
   - Lock completed pixels: `pixel_history` → `immutable: true`
   - Create new goal: `goal_id_new` → `status: active`
2. Vision Board Adapter:
   - Visually section off old progress (faded/labeled)
   - Initialize new grayscale area for new goal
   - Regenerate layout to accommodate change
3. AI Story Generator:
   - Creates transition narrative:
     > "Your marathon journey taught you resilience. Those 42% of pixels represent 8 weeks of discipline. Now, strength training begins—your canvas adapts, but your effort stays."
4. Timeline Update:
   - Old goal visible in historical Journey View
   - New goal starts fresh in current boards

**Result:** No data loss, no guilt, visual continuity.

---

### 2.4 Weekly Wrap Generation (Automated)

**Trigger:** Every Sunday 11 PM (or user-configured)

**Flow Overview:**
```
    ┌──────────────┐
    │Weekly Boards │────────────────┐
    └──────────────┘                │
    ┌──────────────┐                │
    │Monthly Boards│────────────────┤
    └──────────────┘                │
    ┌──────────────┐                │
    │Quarterly     │                │
    │Boards        │────────────────┤
    └──────────────┘                │
    ┌──────────────┐                │
    │Half Year     │                │
    │Boards        │────────────────┤
    └──────────────┘                │
    ┌──────────────┐                │
    │Annual Board  │────────────────┼───┐
    └──────────────┘                │   │
    ┌──────────────┐                │   │
    │Daily Journals│─────────┐      │   │
    └──────────────┘         │      │   │
                             ↓      │   │
                    ┌────────────────┐   │
                    │ Narrative      │   │
                    │ Layer          │───┤
                    └────────┬───────┘   │
                             │           │
                             └───────────┼───┐
                                         │   │
                                         ↓   ↓
                                ┌────────────────┐
                                │ Timeline Engine│
                                └────────┬───────┘
                                         ↓
                                ┌────────────────┐
                                │ Journey View   │
                                └────────────────┘
```

**Backend Flow:**
1. Timeline Stitcher Service:
   - Aggregates 7 daily journals
   - Collects pixel progression (grayscale → color)
   - Extracts key moments, challenges, wins
2. AI Story Generator:
   - Writes 3-5 sentence narrative:
     > "This week, you pushed through resistance. Career pixels lit up as you finished 3 proposals. Health stayed steady with 5 workouts. Learning slowed—but you acknowledged it without judgment. 67% of pixels earned. Your board glows brighter."
3. Animation Engine:
   - Creates 10-second video:
     - Week starts grayscale
     - Daily progress animates in
     - Final colored board holds
   - Overlays narrative text
4. Storage:
   - Save to `weekly_wraps` table
   - Make shareable (optional)

**Frontend:**
- Push notification: "Your week in pixels"
- Opens Journey View with animated wrap
- Options: Share, Download, Reflect

---

## 3. DATA MODELS

### Core Tables

#### `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    bedtime_reminder TIME DEFAULT '22:00:00',
    morning_reminder TIME DEFAULT '07:00:00',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `domains`
```sql
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Career', 'Health', etc.
    description TEXT,
    color_hex VARCHAR(7), -- For pixel mapping
    sort_order INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `domain_images`
```sql
CREATE TABLE domain_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- S3/CDN URL
    sort_order INT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

#### `goals`
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, archived, completed
    start_date DATE NOT NULL,
    target_date DATE,
    archived_at TIMESTAMP,
    archive_reason TEXT,
    parent_goal_id UUID REFERENCES goals(id), -- For goal transitions
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `milestones`
```sql
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE,
    completed_at TIMESTAMP,
    sort_order INT
);
```

#### `todos`
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, completed, skipped
    approved_at TIMESTAMP,
    completed_at TIMESTAMP,
    effort_weight DECIMAL(3,2) DEFAULT 1.0, -- For pixel calculation
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `daily_journals`
```sql
CREATE TABLE daily_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    journal_date DATE NOT NULL,
    entry_text TEXT,
    emotional_state VARCHAR(50), -- extracted by AI
    energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
    ai_reflection TEXT, -- AI-generated insights
    submitted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, journal_date)
);
```

#### `journal_task_completions`
```sql
CREATE TABLE journal_task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID REFERENCES daily_journals(id) ON DELETE CASCADE,
    todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT true,
    notes TEXT
);
```

#### `vision_boards`
```sql
CREATE TABLE vision_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    board_type VARCHAR(20) NOT NULL, -- annual, quarterly, monthly, weekly
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    design_style VARCHAR(50), -- grid, collage, cinematic, etc.
    layout_metadata JSONB, -- Image positions, sizes, mappings
    base_image_url TEXT, -- Grayscale master board
    current_image_url TEXT, -- Progressively colored board
    total_pixels INT,
    colored_pixels INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);
```

#### `pixel_history`
```sql
CREATE TABLE pixel_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vision_board_id UUID REFERENCES vision_boards(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES daily_journals(id) ON DELETE CASCADE,
    pixels_earned INT NOT NULL,
    pixel_coordinates JSONB, -- [[x1,y1], [x2,y2], ...]
    earned_at TIMESTAMP DEFAULT NOW(),
    immutable BOOLEAN DEFAULT false -- Locked if goal archived
);
```

#### `board_designs`
```sql
CREATE TABLE board_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    design_name VARCHAR(100),
    design_style VARCHAR(50),
    layout_algorithm VARCHAR(50), -- e.g., 'grid_balanced', 'collage_organic'
    preview_url TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `timeline_snapshots`
```sql
CREATE TABLE timeline_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    snapshot_type VARCHAR(20), -- daily, weekly, monthly, quarterly
    board_image_url TEXT,
    narrative_text TEXT, -- AI-generated story
    animation_url TEXT, -- Video file
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `reminders`
```sql
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50), -- bedtime_journal, morning_validation
    scheduled_time TIME NOT NULL,
    last_sent TIMESTAMP,
    enabled BOOLEAN DEFAULT true
);
```

---

## 4. FRONTEND ARCHITECTURE

### Tech Stack Recommendation
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS
- **State Management:** Zustand + React Query
- **Canvas/Graphics:** Konva.js or Fabric.js with WebGL
- **Animations:** Framer Motion
- **Form Validation:** Zod

### Key Components

#### `VisionEditor.tsx`
- Domain creation/editing
- Image upload (drag-drop, URL, AI search)
- Domain color picker
- Real-time preview

#### `BoardDesignSelector.tsx`
- Gallery of generated designs
- Interactive preview (zoom, pan)
- Style filters: grid, collage, cinematic, etc.
- "Regenerate designs" button

#### `PixelCanvas.tsx`
- Renders vision board with progressive coloring
- Handles pixel state updates (grayscale → color)
- Exports wallpaper (mobile: 1170x2532, desktop: 1920x1080)
- Lazy loading for performance

#### `NightJournal.tsx`
- Clean, distraction-free text editor
- Task completion checklist
- Emotional state selector (optional)
- Submit → immediate pixel feedback animation

#### `MorningTaskValidator.tsx`
- Task cards per domain
- Accept/Adjust/Skip actions
- Inline chat with AI coach
- "Start My Day" → locks tasks

#### `TimelineExplorer.tsx`
- Horizontal scroll through weeks/months/quarters
- Click snapshot → animated expansion
- Overlay journals, milestones, narratives
- Export journey video

#### `JourneyAnimator.tsx`
- Compiles timeline snapshots
- Animates grayscale → color transitions
- Adds text overlays (reflections, milestones)
- Renders to video (WebCodecs API or server-side FFmpeg)

---

## 5. BACKEND ARCHITECTURE

### Tech Stack Recommendation

#### Option A: Node.js + TypeScript (Recommended)
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js with TypeScript
- **API Pattern:** tRPC (type-safe) or REST with OpenAPI
- **ORM:** Drizzle ORM or Prisma
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Queue:** BullMQ
- **Storage:** AWS S3 / Cloudflare R2
- **Auth:** JWT + OAuth2
- **Image Processing:** Sharp, ImageMagick

#### Option B: Java Spring Boot (Alternative)
- **Runtime:** Java 21 LTS
- **Framework:** Spring Boot 3.2
- **Components:** Spring Web, Spring Data JPA, Spring Security
- **Database:** PostgreSQL 16 + Hibernate
- **Cache:** Redis with Spring Cache
- **Queue:** RabbitMQ or Redis Streams
- **Scheduler:** Spring Batch + Quartz
- **Storage:** AWS SDK for S3

#### Shared Infrastructure
- **Database:** PostgreSQL 16 (primary data)
- **Cache:** Redis 7 (sessions, rate limiting, queue)
- **Object Storage:** S3-compatible (images, videos)
- **AI Services:** Anthropic Claude API, OpenAI GPT-4
- **CDN:** CloudFront or Cloudflare
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack or Datadog

### Core Services

#### `DomainService`
- CRUD for domains
- Image upload orchestration
- Domain-to-pixel mapping

#### `GoalEngine`
- Goal lifecycle management
- Milestone/TODO decomposition (AI-assisted)
- Goal mutation logic (archive old, init new)
- Approval workflow

#### `PixelStateEngine`
- Calculates daily pixel earnings
- Maps pixels to vision board coordinates
- Enforces immutability for archived goals
- Spills unused pixels to next period

#### `ReflectionInterpreter` (AI Service)
- Parses journal entries
- Extracts task completions, emotional state
- Generates daily insights
- Adjusts next-day tasks

#### `BoardGeneratorService`
- Design algorithm selection
- Image layout computation (aspect ratios, balance)
- Grayscale master generation
- Metadata storage for animation

#### `ReminderScheduler`
- Cron jobs for bedtime/morning reminders
- Push notification integration (FCM, APNs)
- Respects user timezone and preferences

#### `TimelineStitcher`
- Aggregates daily/weekly/monthly snapshots
- Generates wrap narratives
- Triggers animation rendering

---

## 6. AI LAYER IMPLEMENTATION

### Primary AI Functions

#### 1. Goal Decomposition
**Input:** User's goal text (e.g., "Get promoted to senior engineer")
**Process:**
```
Prompt to Claude:
"Act as a career mentor. Break this goal into:
- 3-5 quarterly milestones
- 10-15 concrete monthly TODOs
- Consider: skill gaps, networking, deliverables
- Be specific and actionable"
```
**Output:**
```json
{
  "milestones": [
    "Q1: Complete advanced system design course",
    "Q2: Lead major project visible to leadership",
    "Q3: Present at company tech talk",
    "Q4: Formal promotion discussion"
  ],
  "todos": [
    "Week 1: Enroll in system design course",
    "Week 2: Schedule 1-on-1 with manager to discuss promotion path",
    ...
  ]
}
```

#### 2. Domain Coaching
**Input:** User question during TODO approval (e.g., "Is this workout plan realistic?")
**Process:**
```
Prompt to Claude:
"You are a certified fitness coach. User wants to:
- Goal: Lose 15 lbs in 3 months
- Proposed: 5x/week 60-min HIIT workouts
Assess: feasibility, injury risk, better alternatives"
```
**Output:** Conversational guidance, adjusted recommendations

#### 3. Reflection Interpretation
**Input:** Journal entry text
**Process:**
```
Prompt to Claude:
"Analyze this journal entry:
- Extract completed tasks
- Identify emotional tone (1-5 scale)
- Detect blockers or momentum
- Suggest next-day adjustments
Keep response structured JSON"
```
**Output:**
```json
{
  "completed_tasks": ["Morning workout", "Project proposal"],
  "emotional_state": "motivated",
  "energy_level": 4,
  "insights": "User overcame resistance to start workout. Momentum building.",
  "next_day_adjustments": {
    "increase_difficulty": false,
    "reduce_load": false,
    "maintain": true
  }
}
```

#### 4. Story Generation
**Input:** Weekly snapshots (journals, pixels, completions)
**Process:**
```
Prompt to Claude:
"Write a 4-sentence weekly wrap:
- Tone: reflective, empowering, non-judgmental
- Highlight: effort, challenges, growth
- Data: 67% completion, 3 domains active, 1 goal paused"
```
**Output:**
```
"This week, you showed up even when motivation waned. Career pixels blazed 
as you shipped two features ahead of schedule. Health took a pause—your body 
needed rest, and you listened. 67% of your canvas now glows with color."
```

---

## 7. BACKGROUND JOBS

### Job Queue Architecture (BullMQ)

#### Job 1: `SendBedtimeReminder`
- **Schedule:** User-configured time (e.g., 10 PM daily)
- **Logic:**
  - Fetch users with `bedtime_reminder` matching current hour
  - Filter: timezone-adjusted
  - Send push notification
  - Log: `last_sent` timestamp

#### Job 2: `SendMorningValidation`
- **Schedule:** User-configured time (e.g., 7 AM daily)
- **Logic:**
  - Fetch yesterday's journal + AI-generated tasks
  - Send notification with deep link to task validator
  - If no journal yesterday → gentle nudge (no guilt)

#### Job 3: `GenerateWeeklyBoard`
- **Schedule:** Every Monday 12 AM
- **Logic:**
  - For each active user:
    - Fetch approved TODOs for the week
    - Calculate pixel budget per domain
    - Generate grayscale weekly board (if design changed)
    - Store in `vision_boards`

#### Job 4: `ComputePixelSpill`
- **Schedule:** End of each period (weekly, monthly, etc.)
- **Logic:**
  - Check: unearned pixels in period
  - Redistribute to next period (optional feature)
  - Update `vision_boards.total_pixels`

#### Job 5: `StitchTimeline`
- **Schedule:** End of month, quarter, half-year, year
- **Logic:**
  - Aggregate all snapshots for period
  - Call `TimelineStitcher` service
  - Generate narrative + animation
  - Store in `timeline_snapshots`

#### Job 6: `GenerateWeeklyWrap`
- **Schedule:** Sunday 11 PM
- **Logic:**
  - Fetch 7 daily journals
  - Extract pixel progression
  - Call AI Story Generator
  - Render animation (FFmpeg or WebCodecs)
  - Send notification: "Your week in pixels"

---

## 8. REMINDER & DAILY LOOP LOGIC

### Bedtime Reminder Flow

```
1. Cron Job Triggers (e.g., 10 PM)
   ↓
2. Query: SELECT * FROM users WHERE bedtime_reminder = '22:00:00' 
          AND timezone-adjusted time = NOW()
   ↓
3. For each user:
   - Check: journal submitted today?
   - If NO → Send push: "Reflect on your day"
   - If YES → Skip (already journaled)
   ↓
4. User clicks notification
   ↓
5. Opens NightJournal.tsx
   ↓
6. User writes + confirms tasks
   ↓
7. Submit → POST /api/journals
   ↓
8. Backend:
   - Store journal in daily_journals
   - Trigger AIReflection Service
   - Update pixel_history
   - Color weekly board
   - Generate next-day tasks
   ↓
9. Response: Show animated pixel update
```

---

### Morning Validation Flow

```
1. Cron Job Triggers (e.g., 7 AM)
   ↓
2. Query: Fetch users + AI-generated tasks
   ↓
3. Send push: "Your day is ready"
   ↓
4. User clicks notification
   ↓
5. Opens MorningTaskValidator.tsx
   ↓
6. Displays AI-generated tasks per domain
   ↓
7. User actions:
   - Accept → Store as finalized
   - Adjust → Opens chat with AI coach
   - Skip → Mark as postponed (no penalty)
   ↓
8. "Start My Day" button → POST /api/tasks/finalize
   ↓
9. Backend:
   - Lock tasks for the day
   - Update todos.status = 'approved'
   - Schedule mid-day reminder (optional)
   ↓
10. User proceeds with day
```

---

## 9. DESIGN PRINCIPLES & UX PHILOSOPHY

### Core Principles

1. **Effort Becomes Art**
   - Every action contributes to visual beauty
   - Progress is tangible and rewarding

2. **No Guilt, No Streaks**
   - Skipped days don't break progress
   - Pixels never disappear
   - System adapts to user energy

3. **Psychologically Time-Aware**
   - Respects bedtime/wake cycles
   - Gentle reminders, never aggressive
   - Encourages rest as part of progress

4. **Narrative-Driven**
   - AI tells your story back to you
   - Reflections create meaning
   - Journey > metrics

5. **Adaptive Without Erasing**
   - Goals change, progress stays
   - Visual continuity through transitions
   - Historical context preserved

---

## 10. TECHNICAL IMPLEMENTATION ROADMAP

### Phase 1: MVP (8-10 weeks)
**Core Features:**
- User auth + onboarding
- Domain creation + image upload
- Single design style (grid)
- Goal decomposition (AI)
- Daily journal + pixel update
- Weekly board generation
- Basic timeline view

**Tech Stack:**
- Frontend: Next.js + Tailwind
- Backend: NestJS + PostgreSQL
- AI: Claude API
- Storage: AWS S3
- Jobs: BullMQ

---

### Phase 2: Visual & Narrative (4-6 weeks)
**Add:**
- Multiple design styles (5-7 layouts)
- Design selector with previews
- Morning task validator
- Weekly wrap generation (text + animation)
- Goal mutation without reset
- Domain-specific AI coaching

---

### Phase 3: Timeline & Polish (4-6 weeks)
**Add:**
- Journey View with full animation
- Monthly/quarterly/annual wraps
- Shareable story exports
- Advanced pixel logic (spill, bonus)
- Mobile wallpaper export
- Push notification system

---

### Phase 4: Scale & Advanced (Ongoing)
**Add:**
- Social features (optional sharing)
- Community goal templates
- Advanced analytics (effort trends)
- AI-suggested design improvements
- Multi-language support
- Premium features (custom coaching, priority AI)

---

## 11. KEY TECHNICAL CHALLENGES & SOLUTIONS

### Challenge 1: Pixel-to-Image Mapping
**Problem:** How to map abstract "pixels" to actual image coordinates?

**Solution:**
- Divide master board into grid (e.g., 100x100 virtual pixels)
- Map each domain to specific regions during design generation
- Store mapping in `vision_boards.layout_metadata`:
```json
{
  "domains": {
    "career": {"x": 0, "y": 0, "width": 50, "height": 50, "pixels": [...]},
    "health": {"x": 50, "y": 0, "width": 50, "height": 50, "pixels": [...]}
  }
}
```
- On pixel earn → color specific coordinates
- Use Canvas API to progressively render

---

### Challenge 2: Design Generation at Scale
**Problem:** Generating 5-7 layouts per user is computationally expensive.

**Solution:**
- Pre-compute layout templates (grid, collage, etc.)
- Use image composition algorithms (aspect ratio balancing)
- Cache grayscale masters (regenerate only on goal change)
- Offload to background jobs
- Consider: Cloudflare Workers for edge rendering

---

### Challenge 3: Animation Performance
**Problem:** Animating thousands of pixels smoothly.

**Solution:**
- Use WebGL shaders for color transitions
- Pre-render animation frames on server (FFmpeg)
- Progressive loading: show static first, animate on interaction
- Optimize: only animate visible viewport
- Cache rendered videos (CDN)

---

### Challenge 4: AI Response Consistency
**Problem:** AI-generated tasks/stories must be reliable.

**Solution:**
- Use structured JSON output mode (Claude API)
- Implement fallback prompts
- Validate AI responses with schema checks
- Store successful prompts for reuse
- Human review for onboarding (first week)

---

## 12. PRIVACY & SECURITY CONSIDERATIONS

- **Data Encryption:** Encrypt journals at rest (PostgreSQL encryption)
- **Image Privacy:** S3 with signed URLs (no public access)
- **Sharing Controls:** User opts into sharing wraps (default: private)
- **AI Data:** Do not train on user data (Claude API terms)
- **GDPR Compliance:** Full data export + deletion
- **Auth:** OAuth2 (Google, Apple) + 2FA

---

## 13. MONETIZATION STRATEGY

### Free Tier
- 3 domains max
- 1 design style
- Weekly wraps only
- Basic AI coaching

### Pro Tier ($9.99/month)
- Unlimited domains
- All design styles
- Daily/weekly/monthly/quarterly wraps
- Advanced AI coaching (domain-specific)
- Priority support
- Export HD wallpapers

### Lifetime Tier ($199 one-time)
- All Pro features
- Early access to new features
- Custom design requests

---

## 14. SUCCESS METRICS

### User Engagement
- Daily active users (DAU)
- Journal submission rate (target: >70%)
- Morning validation rate (target: >60%)
- Average domains per user (target: 4-5)

### Product Quality
- Pixel earn rate (effort → visual feedback loop)
- Goal completion rate
- Goal change frequency (measures adaptability)
- Wrap share rate (virality)

---

## 15. PRACTICAL IMPLEMENTATION CHECKPOINTS

### Philosophy
Build incrementally with each checkpoint delivering a working, deployable MVP that forms the foundation for the next. Each checkpoint should be testable by real users and provide immediate value.

---

### CHECKPOINT 0: Foundation Setup (Week 1)
**Goal:** Establish development environment and core infrastructure.

**Deliverables:**
- [ ] Project scaffolding (Next.js 15 + TypeScript frontend, Express.js + TypeScript backend)
- [ ] PostgreSQL database setup with connection pooling
- [ ] Redis instance for caching and queues
- [ ] Docker Compose configuration for local development
- [ ] Basic CI/CD pipeline (GitHub Actions or similar)
- [ ] Environment configuration management (.env files, secrets)
- [ ] Database migration system (Drizzle migrations or Prisma)
- [ ] API health check endpoint
- [ ] Basic logging infrastructure (structured JSON logs)

**Acceptance Criteria:**
- All services start locally with `docker-compose up`
- Health check returns 200 OK
- Database migrations run successfully
- Environment variables load correctly

**Next Checkpoint Dependency:** None (foundation for all future work)

---

### CHECKPOINT 1: Authentication & User Management (Week 2)
**Goal:** Users can sign up, log in, and manage their accounts.

**Deliverables:**
- [ ] User registration (email + password)
- [ ] User login with JWT tokens (access + refresh)
- [ ] JWT validation middleware
- [ ] Password hashing (bcrypt)
- [ ] User profile table (`users` schema)
- [ ] Protected API routes
- [ ] Frontend auth pages (signup, login, protected routes)
- [ ] Token refresh flow
- [ ] Basic error handling

**Database Tables:**
- `users` (id, email, password_hash, name, timezone, created_at, updated_at)

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me` (protected)
- `PUT /auth/profile` (protected)

**Frontend Components:**
- `SignUpPage.tsx`
- `LoginPage.tsx`
- `ProtectedRoute.tsx`
- `UserProfile.tsx`

**Acceptance Criteria:**
- User can register with email/password
- User can log in and receive JWT tokens
- Protected routes require valid token
- Token refresh works before expiration
- User can update profile (name, timezone)

**Next Checkpoint Dependency:** None (standalone auth system)

---

### CHECKPOINT 2: Domain Management MVP (Week 3)
**Goal:** Users can create and manage life domains with images.

**Deliverables:**
- [ ] Domain CRUD operations (create, read, update, delete)
- [ ] Domain image upload (presigned S3 URLs or direct upload)
- [ ] Image storage in S3/Cloudflare R2
- [ ] Basic domain color assignment
- [ ] Frontend domain editor interface
- [ ] Image upload UI (drag-drop or file picker)
- [ ] Domain list view

**Database Tables:**
- `domains` (id, user_id, name, description, color_hex, sort_order, created_at)
- `domain_images` (id, domain_id, image_url, sort_order, uploaded_at)

**API Endpoints:**
- `POST /domains` (protected)
- `GET /domains` (protected, returns user's domains)
- `PUT /domains/:id` (protected)
- `DELETE /domains/:id` (protected)
- `POST /domains/:id/images` (protected, returns presigned URL or uploads directly)
- `DELETE /domains/:id/images/:imageId` (protected)

**Frontend Components:**
- `DomainEditor.tsx` (create/edit domain form)
- `DomainList.tsx` (list of user domains)
- `ImageUploader.tsx` (image upload component)
- `DomainCard.tsx` (individual domain display)

**Acceptance Criteria:**
- User can create 3-5 domains (e.g., Career, Health, Finance)
- Each domain can have 1-5 images uploaded
- Images are stored in S3 and accessible via URLs
- User can edit domain name/description
- User can delete domains (with cascade to images)
- Domain list displays with images

**Next Checkpoint Dependency:** Checkpoint 1 (requires authentication)

---

### CHECKPOINT 3: Goal Creation & Basic Tracking (Week 4)
**Goal:** Users can create goals for domains and track them manually.

**Deliverables:**
- [ ] Goal CRUD operations
- [ ] Goal-to-domain relationship
- [ ] Simple goal status (active, completed, archived)
- [ ] Goal list view per domain
- [ ] Basic goal creation form
- [ ] Manual goal completion toggle

**Database Tables:**
- `goals` (id, domain_id, title, description, status, start_date, target_date, created_at)

**API Endpoints:**
- `POST /goals` (protected)
- `GET /goals?domain_id=:id` (protected)
- `PUT /goals/:id` (protected)
- `POST /goals/:id/complete` (protected)
- `POST /goals/:id/archive` (protected)

**Frontend Components:**
- `GoalCreator.tsx` (goal creation form)
- `GoalList.tsx` (list of goals per domain)
- `GoalCard.tsx` (individual goal display)

**Acceptance Criteria:**
- User can create goals for each domain
- Goals display in domain view
- User can mark goals as complete
- User can archive goals (status change, no deletion)
- Goal list filters by domain

**Next Checkpoint Dependency:** Checkpoint 2 (requires domains)

---

### CHECKPOINT 4: Daily Journal & Simple Pixel System (Week 5-6)
**Goal:** Users can write daily journals and earn basic pixels that show as visual progress.

**Deliverables:**
- [ ] Journal submission (one per day per user)
- [ ] Simple pixel calculation (fixed daily amount, split by domain)
- [ ] Basic pixel tracking in database
- [ ] Journal entry form
- [ ] Simple progress visualization (percentage bars or basic chart)
- [ ] Journal history view

**Database Tables:**
- `daily_journals` (id, user_id, journal_date, entry_text, submitted_at)
- `pixel_history` (id, user_id, domain_id, journal_id, pixels_earned, earned_at) — simplified

**Pixel Logic (Simplified):**
```
Base pixels per day = 100
Split equally across all active domains
Example: 4 domains → 25 pixels per domain per journal entry
```

**API Endpoints:**
- `POST /journals` (protected, one per day)
- `GET /journals/:date` (protected)
- `GET /journals?start=:start&end=:end` (protected)
- `GET /pixels/summary` (protected, returns domain → total pixels)

**Frontend Components:**
- `JournalEditor.tsx` (daily journal form)
- `JournalHistory.tsx` (list of past journals)
- `ProgressSummary.tsx` (pixel totals per domain, simple bars)

**Acceptance Criteria:**
- User can submit one journal per day
- Journal submission automatically awards pixels
- Pixels are distributed equally across active domains
- User can view journal history (last 30 days)
- Simple progress view shows pixel totals per domain
- Cannot submit multiple journals for same day

**Next Checkpoint Dependency:** Checkpoint 3 (requires goals/domains)

---

### CHECKPOINT 5: Vision Board MVP - Static Grid (Week 7-8)
**Goal:** Display a simple vision board (grid layout) that shows grayscale domain images.

**Deliverables:**
- [ ] Board generation service (grid layout only)
- [ ] Static grayscale board image generation
- [ ] Board storage in database
- [ ] Frontend board display component
- [ ] Basic grid layout algorithm (equal-sized cells)

**Database Tables:**
- `vision_boards` (id, user_id, board_type: 'weekly', period_start, period_end, base_image_url, created_at)
- Update `vision_boards.layout_metadata` (JSONB: grid layout info)

**Board Generation Logic:**
```
1. Fetch all domain images for user
2. Generate grid: 2x2, 3x2, or 3x3 (based on domain count)
3. Compose images into single board (equal cells)
4. Convert to grayscale
5. Store in S3, save URL in database
```

**API Endpoints:**
- `POST /boards/generate` (protected, creates weekly board)
- `GET /boards/current` (protected, returns current board)
- `GET /boards/:id/image` (protected, returns board image URL)

**Frontend Components:**
- `VisionBoard.tsx` (displays board image)
- `BoardGenerator.tsx` (trigger board generation)

**Acceptance Criteria:**
- System can generate a grayscale grid board from domain images
- Board displays on frontend (simple image viewer)
- Board is stored in S3 and database
- User can regenerate board (replaces old one)

**Next Checkpoint Dependency:** Checkpoint 2 (requires domain images)

---

### CHECKPOINT 6: Progressive Coloring - Pixel to Board Mapping (Week 9-10)
**Goal:** Pixels earned colorize specific regions of the vision board.

**Deliverables:**
- [ ] Pixel-to-board coordinate mapping system
- [ ] Progressive coloring logic (grayscale → color by domain region)
- [ ] Updated board image generation (merge pixels onto base)
- [ ] Frontend displays updated colored board
- [ ] Daily pixel update triggers board refresh

**Pixel Mapping Logic:**
```
1. Divide board into virtual grid (e.g., 100x100 pixels)
2. Assign domain regions:
   - 2 domains: 50x100 each (left/right split)
   - 3 domains: 33x100 each (vertical split)
   - 4 domains: 50x50 each (2x2 grid)
3. Each pixel earned = color 1 virtual pixel in domain region
4. Store pixel coordinates in pixel_history
```

**Database Updates:**
- `pixel_history.pixel_coordinates` (JSONB: array of [x, y] pairs)
- `vision_boards.current_image_url` (updated colored board)
- `vision_boards.colored_pixels` (count)

**API Endpoints:**
- `POST /pixels/apply` (protected, internal - called after journal submission)
- `GET /boards/:id/colored` (protected, returns colored board image)

**Frontend Components:**
- `ColoredVisionBoard.tsx` (shows progressive coloring)
- Update `JournalEditor.tsx` to trigger pixel application

**Acceptance Criteria:**
- Journal submission triggers pixel calculation
- Pixels map to board coordinates by domain
- Board image updates to show colored regions
- Frontend displays colored board (updates after journal)
- Pixel history stores coordinates

**Next Checkpoint Dependency:** Checkpoint 4 (pixels) + Checkpoint 5 (boards)

---

### CHECKPOINT 7: AI Integration - Goal Decomposition (Week 11-12)
**Goal:** AI helps break goals into actionable milestones and todos.

**Deliverables:**
- [ ] Claude API integration (or OpenAI fallback)
- [ ] Goal decomposition prompt and response parsing
- [ ] Milestone and todo creation from AI response
- [ ] Frontend AI goal breakdown interface
- [ ] Manual todo editing

**Database Tables:**
- `milestones` (id, goal_id, title, target_date, completed_at, sort_order)
- `todos` (id, milestone_id, goal_id, domain_id, title, description, scheduled_date, status, created_at)

**AI Integration:**
```
Input: Goal title, description, domain, target date
Prompt: "Break this [domain] goal into 3-5 milestones and 10-15 concrete todos"
Output: JSON with milestones and todos
Validate: Ensure todos map to milestones
Store: Create records in database
```

**API Endpoints:**
- `POST /goals/:id/decompose` (protected, calls AI, returns breakdown)
- `POST /goals/:id/approve-breakdown` (protected, saves AI-generated todos)
- `GET /todos?goal_id=:id` (protected)
- `PUT /todos/:id` (protected, manual edits)

**Frontend Components:**
- `GoalDecomposer.tsx` (AI breakdown interface)
- `MilestoneList.tsx` (displays milestones and todos)
- `TodoEditor.tsx` (edit todos manually)

**Acceptance Criteria:**
- User can request AI goal breakdown
- AI returns structured milestones and todos
- User can approve or edit AI suggestions
- Todos display under milestones
- Manual todo creation works independently

**Next Checkpoint Dependency:** Checkpoint 3 (requires goals)

---

### CHECKPOINT 8: Journal with Task Completion (Week 13)
**Goal:** Users can mark todos as complete in their journal entries.

**Deliverables:**
- [ ] Link todos to journal entries
- [ ] Task completion tracking in journal
- [ ] Pixel calculation based on completed todos (not just journal submission)
- [ ] Journal form with task checklist
- [ ] Completed task summary in journal view

**Database Tables:**
- `journal_task_completions` (id, journal_id, todo_id, completed, notes)

**Pixel Logic Update:**
```
Base pixels = 100 per day
Completed todos contribute to pixels:
- If 80%+ todos completed → full 100 pixels
- If 50-79% completed → 75 pixels
- If <50% completed → 50 pixels
Still split by domain based on todo domain distribution
```

**API Endpoints:**
- Update `POST /journals` (accepts completed_todos array)
- `GET /todos/today` (protected, returns today's scheduled todos)

**Frontend Components:**
- Update `JournalEditor.tsx` (add task checklist)
- `TodayTasks.tsx` (list of today's todos)

**Acceptance Criteria:**
- Journal form shows today's scheduled todos
- User can check off completed todos in journal
- Pixel calculation reflects todo completion rate
- Journal history shows which todos were completed
- Uncompleted todos roll forward (no penalty)

**Next Checkpoint Dependency:** Checkpoint 7 (requires todos) + Checkpoint 4 (journals)

---

### CHECKPOINT 9: Weekly Board Generation & Timeline View (Week 14-15)
**Goal:** System automatically generates weekly boards and users can view their timeline.

**Deliverables:**
- [ ] Background job for weekly board generation (BullMQ or similar)
- [ ] Weekly board creation on Monday (or user's week start)
- [ ] Timeline view showing weekly boards
- [ ] Progress comparison (week over week)

**Background Job:**
```
Schedule: Every Monday 12 AM (timezone-aware)
Logic:
1. For each active user:
   a. Fetch current week's todos
   b. Generate or update weekly board
   c. Reset pixel counters for new week
```

**Database Updates:**
- `vision_boards.board_type = 'weekly'` with period dates
- Ensure board generation is idempotent

**API Endpoints:**
- `GET /boards/weekly?start=:date&end=:date` (protected)
- `GET /timeline?weeks=:count` (protected, returns weekly snapshots)

**Frontend Components:**
- `WeeklyTimeline.tsx` (horizontal scroll through weeks)
- `WeekBoardCard.tsx` (individual week display)
- Update `VisionBoard.tsx` to handle weekly boards

**Acceptance Criteria:**
- Weekly boards generate automatically on Monday
- User can view timeline of weekly boards (last 4-8 weeks)
- Each week shows colored progress
- Timeline is scrollable and responsive

**Next Checkpoint Dependency:** Checkpoint 6 (colored boards)

---

### CHECKPOINT 10: AI Reflection & Story Generation (Week 16-17)
**Goal:** AI analyzes journal entries and generates weekly narrative wraps.

**Deliverables:**
- [ ] AI reflection service (analyzes journal entries)
- [ ] Emotion/energy extraction from journal text
- [ ] Weekly wrap generation (narrative summary)
- [ ] Wrap storage and display
- [ ] Frontend wrap viewer

**AI Services:**
```
Reflection Analysis (per journal):
- Input: Journal entry text
- Output: emotional_state, energy_level, insights (2-3 sentences)

Weekly Wrap (Sunday evening):
- Input: 7 days of journals, pixel progress
- Output: 4-5 sentence narrative about the week
```

**Database Tables:**
- Update `daily_journals` (emotional_state, energy_level, ai_reflection)
- `timeline_snapshots` (id, user_id, snapshot_date, snapshot_type: 'weekly', narrative_text, board_image_url, created_at)

**API Endpoints:**
- `POST /ai/reflect` (protected, internal - called after journal submission)
- `POST /wraps/weekly` (protected, generates weekly wrap)
- `GET /wraps/weekly/:date` (protected)

**Frontend Components:**
- `WeeklyWrap.tsx` (displays narrative + board)
- `JournalInsights.tsx` (shows AI reflection per journal)

**Acceptance Criteria:**
- Journal submission triggers AI reflection
- Reflection extracts emotion/energy
- Weekly wrap generates automatically on Sunday
- Wrap includes narrative and visual board
- User can view past wraps

**Next Checkpoint Dependency:** Checkpoint 8 (journals with tasks) + Checkpoint 9 (weekly boards)

---

### CHECKPOINT 11: Morning Task Validator (Week 18)
**Goal:** Users receive morning tasks based on yesterday's journal and can adjust them.

**Deliverables:**
- [ ] Next-day task generation based on journal completion
- [ ] Task adjustment interface (accept/reorder/skip)
- [ ] AI coaching chat (optional enhancement)
- [ ] "Start My Day" button (locks tasks)

**Task Generation Logic:**
```
Input: Yesterday's journal, completion rate, upcoming milestones
Output: Suggested tasks for today
- If high completion → maintain or add 1-2 tasks
- If low completion → reduce task count, focus on priorities
- Reorder by deadline proximity
```

**Database Updates:**
- `todos.status = 'pending'` (AI-generated, not yet approved)
- `todos.approved_at` (timestamp when user accepts)
- `todos.scheduled_date` (date when todo should be done)

**API Endpoints:**
- `GET /tasks/tomorrow` (protected, AI-generated suggestions)
- `POST /tasks/validate` (protected, user accepts/adjusts)
- `PUT /tasks/:id/reorder` (protected)
- `POST /tasks/:id/skip` (protected, no penalty)

**Frontend Components:**
- `MorningValidator.tsx` (task approval interface)
- `TaskCard.tsx` (individual task with actions)
- `AICoachChat.tsx` (optional: discuss task adjustments)

**Acceptance Criteria:**
- System generates tomorrow's tasks after journal submission
- User sees tasks in morning (or on demand)
- User can accept, reorder, or skip tasks
- Approved tasks appear in next journal's checklist
- Skipped tasks roll forward (no penalty)

**Next Checkpoint Dependency:** Checkpoint 8 (task completion tracking)

---

### CHECKPOINT 12: Goal Mutation Without Reset (Week 19-20)
**Goal:** Users can change goals without losing progress (pixels remain locked).

**Deliverables:**
- [ ] Goal mutation workflow (archive old, create new)
- [ ] Pixel immutability for archived goals
- [ ] Transition narrative generation (AI)
- [ ] Frontend goal mutation interface
- [ ] Historical goal view

**Mutation Logic:**
```
1. User initiates goal change
2. Archive old goal: status = 'archived', archive_reason = user text
3. Lock old goal's pixels: pixel_history.immutable = true
4. Create new goal: parent_goal_id = old_goal_id
5. AI generates transition narrative
6. Board adapts (old region fades, new region added)
```

**Database Updates:**
- `goals.parent_goal_id` (for tracking transitions)
- `pixel_history.immutable` (prevents deletion/modification)

**API Endpoints:**
- `POST /goals/:id/mutate` (protected, goal change workflow)
- `GET /goals/:id/history` (protected, shows transition chain)

**Frontend Components:**
- `GoalMutator.tsx` (goal change form)
- `GoalHistory.tsx` (shows archived goals and transitions)

**Acceptance Criteria:**
- User can change a goal's title/description
- Old goal archives with reason
- Old pixels remain visible (locked, immutable)
- New goal starts fresh in board
- Transition narrative explains the change

**Next Checkpoint Dependency:** Checkpoint 7 (goals with todos)

---

### CHECKPOINT 13: Multiple Design Styles & Board Selector (Week 21-22)
**Goal:** Users can choose from multiple board layout styles.

**Deliverables:**
- [ ] Design style algorithms (grid, collage, cinematic, minimalist)
- [ ] Design preview generation
- [ ] Design selection interface
- [ ] Board regeneration with new design

**Design Styles:**
```
1. Grid: Equal-sized cells (already implemented)
2. Collage: Random placement with overlap
3. Cinematic: Wide aspect, focus on 2-3 dominant images
4. Minimalist: Lots of negative space, small images
5. Symmetric: Mirror layouts
```

**Database Tables:**
- `board_designs` (id, user_id, design_name, design_style, preview_url, is_active)

**API Endpoints:**
- `POST /boards/generate-designs` (protected, creates 3-5 design options)
- `POST /boards/select-design` (protected, sets active design)
- `GET /boards/designs` (protected, returns user's design options)

**Frontend Components:**
- `DesignSelector.tsx` (gallery of design options)
- `DesignPreview.tsx` (preview individual design)

**Acceptance Criteria:**
- System generates 3-5 design options
- User can preview each design
- User can select active design
- Board regenerates with new design
- Old boards retain their design (historical)

**Next Checkpoint Dependency:** Checkpoint 5 (board generation)

---

### CHECKPOINT 14: Reminder System & Notifications (Week 23)
**Goal:** Automated reminders for journal and task validation.

**Deliverables:**
- [ ] Reminder scheduling (bedtime journal, morning tasks)
- [ ] Timezone-aware reminder delivery
- [ ] Push notification integration (or email fallback)
- [ ] User reminder preferences

**Background Jobs:**
```
Bedtime Reminder (user-configured, e.g., 10 PM):
- Check if journal submitted today
- If not → send reminder
- Idempotent (once per day)

Morning Validation (user-configured, e.g., 7 AM):
- Check if tasks generated for today
- Send notification with task count
```

**Database Tables:**
- `reminders` (id, user_id, reminder_type, scheduled_time, last_sent, enabled)

**API Endpoints:**
- `PUT /preferences/reminders` (protected, update reminder times)
- `GET /reminders/status` (protected, check reminder delivery)

**Frontend Components:**
- `ReminderSettings.tsx` (configure reminder times)

**Acceptance Criteria:**
- Reminders send at configured times (timezone-aware)
- Bedtime reminder only if journal not submitted
- Morning reminder includes task count
- User can disable/enable reminders
- Reminders are idempotent (no duplicates)

**Next Checkpoint Dependency:** Checkpoint 4 (journals) + Checkpoint 11 (task validator)

---

### CHECKPOINT 15: Weekly Wrap Animation (Week 24-25)
**Goal:** Weekly wraps include animated video showing pixel progression.

**Deliverables:**
- [ ] Animation frame generation (grayscale → color progression)
- [ ] Video rendering (FFmpeg or Canvas API)
- [ ] Wrap video storage (S3)
- [ ] Frontend wrap video player

**Animation Logic:**
```
1. Start with grayscale board
2. For each day (Mon-Sun):
   a. Apply pixels earned that day
   b. Generate frame (colored board at end of day)
3. Create video: 10-15 seconds, smooth transitions
4. Overlay narrative text (optional)
```

**Database Updates:**
- `timeline_snapshots.animation_url` (S3 video URL)

**API Endpoints:**
- `GET /wraps/weekly/:date/video` (protected, returns video URL)

**Frontend Components:**
- `WrapVideoPlayer.tsx` (plays weekly wrap animation)

**Acceptance Criteria:**
- Weekly wrap includes animated video
- Video shows pixel progression day-by-day
- Video is 10-15 seconds, smooth playback
- Video plays in frontend player
- Video stored in S3 (CDN-delivered)

**Next Checkpoint Dependency:** Checkpoint 10 (weekly wraps) + Checkpoint 6 (colored boards)

---

### CHECKPOINT 16: Journey View & Export (Week 26-27)
**Goal:** Users can view their entire journey and export wallpapers/videos.

**Deliverables:**
- [ ] Full journey timeline view (months/quarters)
- [ ] Board export (wallpaper resolutions)
- [ ] Journey video export (full period)
- [ ] Shareable link generation (optional)

**Export Formats:**
```
Wallpaper:
- Mobile: 1170x2532 (iPhone)
- Desktop: 1920x1080, 2560x1440
- Current board state (colored)

Journey Video:
- All weekly wraps stitched together
- Optional: monthly/quarterly wraps
- Duration: 30-60 seconds
```

**API Endpoints:**
- `GET /journey?start=:start&end=:end` (protected, returns journey data)
- `GET /boards/:id/export?resolution=:res` (protected, returns image URL)
- `POST /journey/export-video?start=:start&end=:end` (protected, generates video)

**Frontend Components:**
- `JourneyView.tsx` (full timeline explorer)
- `ExportDialog.tsx` (wallpaper/video export options)

**Acceptance Criteria:**
- User can view journey (last 3-6 months)
- User can export current board as wallpaper (multiple resolutions)
- User can export journey video (custom date range)
- Exports are downloadable (S3 signed URLs)
- Journey view is scrollable and responsive

**Next Checkpoint Dependency:** Checkpoint 15 (wrap animations)

---

## 16. CHECKPOINT ROADMAP SUMMARY

### Phase 1: Core Foundation (Checkpoints 0-4)
**Duration:** 5-6 weeks  
**Outcome:** Users can create domains, goals, submit journals, and see basic pixel progress.

### Phase 2: Visual Progress (Checkpoints 5-6)
**Duration:** 4 weeks  
**Outcome:** Vision boards display and progressively colorize with pixel progress.

### Phase 3: Intelligence Layer (Checkpoints 7-8, 10-11)
**Duration:** 6 weeks  
**Outcome:** AI helps with goal breakdown, journal reflection, and task planning.

### Phase 4: Timeline & Stories (Checkpoints 9, 15-16)
**Duration:** 6 weeks  
**Outcome:** Weekly boards, wraps, animations, and journey view.

### Phase 5: Polish & Advanced (Checkpoints 12-14)
**Duration:** 6 weeks  
**Outcome:** Goal mutation, design variety, reminders, and export features.

**Total MVP Timeline:** 27 weeks (~6.5 months)

---

## 17. POST-MVP ENHANCEMENTS

After Checkpoint 16, consider:
- Social sharing (optional public wraps)
- Mobile app (React Native)
- Advanced analytics (effort trends, goal success rates)
- Community goal templates
- Multi-language support
- Premium features (unlimited domains, priority AI, custom designs)