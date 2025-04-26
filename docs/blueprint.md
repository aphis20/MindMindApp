# **App Name**: MindBridge

## Core Features:

- Emotion Detection and Display: Detect user's emotion via camera/microphone input or manual selection and display it.
- Emotion-Based Q&A: Allow users to ask questions and respond in empathy threads using text, voice notes, or links to journal entries.
- AI Moderation Tool: AI moderation tool to rephrase toxic or harmful content silently, suggesting a better way to express the same thought.

## Style Guidelines:

- Emotion-reactive themes, such as Yellow-Gold for Joy, Indigo for Sadness, Slate-Grey for Grief, and Aqua for Hope.
- Minimal, white background to promote a sense of calm and openness.
- Accent: Lavender (#E6E6FA) for a sense of healing and tranquility, used in interactive elements.
- Human, soft icons, avoiding gamified badges to promote a non-competitive environment.
- Subtle animations, like slow pulse effects and mood waves, to create a soothing atmosphere.
- Clean and minimalist design inspired by Quora, but with a focus on vulnerability and emotional safety, avoiding a social feed look.

## Original User Request:
🧠 INSTRUCTION PROMPT TO AI DESIGNER/DEVELOPER:
You're an expert product designer and full-stack AI developer. You are building MindBridge — a safe, AI-powered emotional support network where people are matched and engaged based on real-time emotional data, not followers or likes. The UI must be inspired by Quora, but redesigned for human vulnerability, emotional safety, and non-performative sharing. This is NOT a social feed — it's a healing space.

💻 App Purpose:
Create a web-based platform where users can:

Detect and share their mood/emotion (via camera, voice, or wearable)

Join emotion-matched communities (called Circles)

Ask and answer emotion-based questions anonymously or personally

Journaling and self-reflection tools integrated

Empathy threads in place of likes or clout

Profiles show healing progress, not followers

🔧 TECH & FUNCTIONAL GUIDE
🔹 1. Onboarding & Emotion Detection
Goal: User is detected or selects their emotional state.

Instruction:

Use camera (face emotion), microphone (voice tone), or manual selection

Display result as:

“You’re feeling: Anxious + Overwhelmed 😔”

Show 3 primary call-to-actions:

“Join a Circle”

“Ask a Support Question”

“Write a Journal Entry”

Tech:
Use OpenAI Whisper or Affectiva, fallback to emoji/mood picker.

🔹 2. Home Layout (Post-detection)
Structure:

Hero Box: Detected Emotion + Suggestions

Circles You Might Like: Based on emotion history

Recent Q&A Threads in your emotion category

Personal Journal Streak Stats

Visual Vibe:
Minimal, white background, soft emotion-linked color palettes
(e.g. Blue for sadness, Gold for pride, Lavender for healing)

🔹 3. Ask a Question (Emotion-Based Q&A)
Form Fields:

Emotion Tag (auto-filled from detection)

Question or Prompt

Add: journal entry / image / voice (optional)

Post anonymously toggle ✅

On submit: Show empathy guidelines (no toxic behavior)

🔹 4. Empathy Threads (Answering a Question)
Each answer supports:

Text

Voice Note

Journaling Link

Reaction Options:

💜 “This helped me”

🥲 “I feel this”

🤝 “Let’s talk” (private support chat invite)

🔹 5. Circles (Emotion-Based Rooms)
Each Circle should:

Be auto-generated from shared emotional tags (e.g. “Lonely + Reflective”)

Contain:

Group threads

Voice spaces (like Twitter Spaces but emotion-nudged)

Journaling wall (public or anonymous)

🔹 6. Profiles (Progress, Not Popularity)
Design profiles to show:

Emotions most reflected in (heatmap)

Questions asked or answered

People you’ve supported

Quotes or reflections you’ve posted

No follower count, no likes, no "top user"

🔹 7. AI Moderation Layer
Guide:

Every message is sent through sentiment filter

Toxic or harmful content is flagged silently

AI auto-suggests rephrasing if it detects:

Aggression

Gaslighting

Dismissive tone

🎨 DESIGN SYSTEM
Typography: Calming, rounded fonts (e.g. Inter, DM Sans)

Colors: Emotion-reactive themes

Joy = Yellow-Gold

Sadness = Indigo

Grief = Slate-Grey

Hope = Aqua

Icons: Human, soft. Avoid gamified badges

Animations: Slow pulse effects, mood waves, typewriter journaling

⚙️ BACKEND ARCHITECTURE GUIDE

Feature	Stack
Emotion AI	OpenAI Whisper, Affectiva, Deepgram
Realtime Chat	Socket.io + Redis
Q&A/Journal DB	PostgreSQL for threads + MongoDB for notes
Auth	Clerk/Auth.js with anonymous support
Moderation	Perspective API + GPT
Hosting	Vercel (frontend), Render or Railway (API)
🤝 USER ROLES

Role	Permissions
Visitor	Browse public questions, read
Seeker	Post questions, journal, join circles
Responder	Answer questions, voice or text
Guide	Host rooms, moderate discussions
Admin	Approve guides, manage spaces
🧪 SUGGESTED TEST PROMPTS FOR QA
User uploads tired voice: detect as Anxious + Drained

User posts: “I feel stuck after a breakup” → directed to “Grieving + Reflective” Circle

User asks: “How do I stop self-sabotaging?” → AI suggests journaling prompt and displays related questions

🧠 MISSION REMINDER FOR DESIGN
MindBridge is a digital sanctuary — not just another social app.
It honors emotions, protects vulnerability, and gives people space to heal and help others — in real time, authentically, and without judgment.
  