---
name: Playful Chess Studio
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3e4942'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7a72'
  outline-variant: '#bdcac0'
  surface-tint: '#006c4a'
  primary: '#006b49'
  on-primary: '#ffffff'
  primary-container: '#16865e'
  on-primary-container: '#fefffb'
  inverse-primary: '#77d9ab'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#0059c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#2372e5'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f6c6'
  primary-fixed-dim: '#77d9ab'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005237'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
  canvas-cream: '#FFF9ED'
  surface-card: '#FFFFFF'
  surface-warm: '#FBF8F1'
  board-light: '#F5E6CE'
  board-dark: '#B58A65'
  mint-soft: '#E2F6EA'
  mint-vibrant: '#16865E'
  amber-soft: '#FEF3C7'
  amber-vibrant: '#F59E0B'
  sky-soft: '#EFF6FF'
  sky-vibrant: '#3B82F6'
  coral-soft: '#FEE2E2'
  coral-vibrant: '#F87171'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  chess-move-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system reimagines the chess learning journey for young minds (ages 7 to 13), transforming a traditionally austere, clinical desktop interface into an inviting, warm, and gamified digital playground. The primary aesthetic merges **tactile/soft-surfaced UI** with a warm **story-driven editorial tone**, replacing dense tabular grids and overwhelming analytical widgets with a clean "one-decision-at-a-time" layout.

The visual mood evokes the comfort of a sunlit study room: creamy vanilla backdrops, friendly rounded corners, squishy tactile buttons, and distinctive mentor color codes (the Wise Owl tutor, the Magic Storybook, and the Friendly Robot engine). Feedback is strictly growth-oriented and emotionally safe—mistakes are framed as playful curiosity ("Try again!"), achievements shine with warm amber stars, and victories celebrate tactical exploration over sterile math.

## Colors

The palette abandons cold institutional slates in favor of a comforting, warm foundation inspired by creamy storybook parchment.

- **Foundational Canvas**: `canvas-cream` (`#FFF9ED`) sets a soft, glare-free background that reduces visual fatigue for young eyes during extended play. `surface-card` (`#FFFFFF`) serves as elevated, tactile cards.
- **Action & Positive Feedback (The Green Sprout)**: `primary_color_hex` (`#16865E`) paired with `mint-soft` (`#E2F6EA`) highlights master theoretical moves, primary action buttons ("Próximo lance", "Jogar"), and completed milestones.
- **The Wise Owl & Curiosity (Warm Amber)**: `secondary_color_hex` (`#F59E0B`) and `amber-soft` (`#FEF3C7`) are reserved for hints, the Owl Tutor's pedagogical guidance, and gamified star rewards.
- **The Friendly Robot & Tactical Insights (Sky Blue)**: `tertiary_color_hex` (`#3B82F6`) and `sky-soft` (`#EFF6FF`) present computer analysis and explorer discoveries in an approachable, unintimidating voice.
- **Supportive Correction (Cozy Coral)**: `coral-vibrant` (`#F87171`) and `coral-soft` (`#FEE2E2`) provide safe, encouraging cues when a move deviates from the plan, steering clear of punishing dark-red alerts.
- **Physical Chess Board**: `board-light` (`#F5E6CE`) and `board-dark` (`#B58A65`) recreate the warm tactile feel of handcrafted wooden blocks.

## Typography

The type system adopts **Plus Jakarta Sans** across all levels. Its balanced geometric construction, wide apertures, and friendly rounded terminals ensure immediate legibility for children while remaining modern and crisp.

- **Reading Flow**: Generous line heights (`lineHeight: 26px` on `body-lg`) give stories and tactical advice room to breathe.
- **Chess Notation & Numbers**: Instead of cold, technical monospaced fonts, chess moves and step markers rely on `chess-move-num` with a heavy weight (`800`) and tabular alignment, making moves like **1. e4!** or **Cf3** feel tactile and prominent.
- **Accessibility**: Micro-typography smaller than 11px is strictly avoided. Key pedagogical instructions use `body-lg` so young readers can digest moves without straining.

## Layout & Spacing

The layout is built around the **Focused Stage** philosophy: the chessboard occupies the central hero spot, while interactive mentors frame the sides, strictly avoiding dense, multi-tiered tabs.

- **Visual Pacing**: Spacing follows a comfortable 6px/12px/20px/28px/40px rhythm, ensuring elements are not crammed together like adult chess software.
- **Desktop Grid**: A 12-column adaptive layout where the chessboard takes 7 columns on the left and the active mentor card occupies 5 columns on the right. Controls and hints sit anchored along the bottom in an uninterrupted tactile dock.
- **Mobile & Tablet Reflow**: The board scales dynamically with fixed aspect-ratio margins (`margin: 1.5rem`). Mentor dialogues shift below the board in single, swipeable task cards so that the student never has to scroll while examining the pieces.

## Elevation & Depth

Visual hierarchy uses **warm tactile layering and cozy ambient drop-shadows**, moving away from flat, clinical lines or harsh borders:

- **Level 0 (Parchment Canvas)**: The base warm background (`#FFF9ED`) with zero elevation.
- **Level 1 (Playful Card Surface)**: Pure white cards (`#FFFFFF`) with a subtle tinted shadow (`0 4px 16px rgba(181, 138, 101, 0.08)`) and an ultra-soft border (`1.5px solid rgba(22, 134, 94, 0.08)`).
- **Level 2 (Tactile Floating Controls & Active Mentors)**: Elevated widgets, current action buttons, and active Owl/Book cards use a dimensional shadow (`0 8px 24px rgba(22, 134, 94, 0.12)`) and a bottom border lip of `3px` to give buttons a physical, clickable feel.
- **Level 3 (Reward Popovers & Level Stars)**: Celebration dialogs receive a gentle golden ambient blur (`0 16px 36px rgba(245, 158, 11, 0.20)`), creating a magical feeling of achievement.

## Shapes

The interface embraces organic, friendly curves that feel safe, touch-friendly, and toy-like without feeling babyish:

- **Standard Containers & Cards**: Use 16px to 20px radii (`rounded-lg` to `rounded-xl`), creating comfortable, cushion-like panels.
- **Chess Board Edge**: Framed with a 20px rounded outer border, mimicking a smooth wooden tabletop.
- **Action Buttons & Badges**: Feature pill-like rounds or 12px pill shapes (`rounded-md`), making them look inviting and easy to tap on touchscreens or trackpads.
- **Progress Trackers & Pills**: Fully rounded pill shapes (`9999px`) for progress bars, hint levels, and chapter pills.

## Components

### 1. Tactile Action Buttons
- **Primary ("Avançar ▶", "Treinar Agora")**: Vibrant Emerald background (`#16865E`), white text, 48px height, 14px rounded corners, with a subtle 3px inset bottom shadow that depresses slightly on `:active` for a delightful tactile sensation.
- **Secondary / Hint Button ("💡 Ver Dica")**: Warm Amber background (`#FEF3C7`), text in dark amber (`#92400E`), bordered with `#FCD34D`. Progressive click states dynamically update labels from *Pergunta* → *Peça Crítica* → *Solução*.
- **Ghost / Back Button ("◀ Voltar")**: Warm background tint (`#FFF9ED`), slate border, friendly arrow iconography.

### 2. The Three Mentor Cards
- **🦉 Do Tutor (Owl Mentor)**: Card styled with `#FFFBEB` background, 2px border in `#FDE68A`, an expressive Owl avatar, and large, friendly instructional text ("O que o seu Bispo está querendo proteger?").
- **📖 Do Livro (Storybook Master)**: Card styled with `#F0FDF4` background, gentle mint border (`#BBF7D0`), featuring classic narrative quotes framed like fairytales of historical masters.
- **🤖 Do Robozinho (Tactical Engine)**: Card styled with `#EFF6FF` background, sky-blue border (`#BFDBFE`), translating raw Stockfish evaluations into conversational cues ("O robô viu que a Torre está muito livre!").

### 3. Chessboard & Piece Interaction
- High-contrast wooden tiles (`#F5E6CE` and `#B58A65`).
- Selection indicators use soft, glowing green rings around legal destination squares instead of cryptic red dots.
- Coordinate labels (`a–h`, `1–8`) are displayed in bold, readable 13px numbers with soft contrast along the edges.

### 4. Interactive Feedback Banners
- **Acerto (Correct Move)**: Slide-in pill in `#E2F6EA` with emerald checkmark and sound chime cue.
- **Alerta Construtivo (Try Again)**: Soft coral banner (`#FEE2E2`) with encouraging copy ("Quase lá! Essa peça tem outro plano. Vamos tentar de novo?"), with zero negative penalty sounds.

### 5. Gamification Bar & Stars
- Progress bar displayed as a smooth candy-pill slider (`#16865E` fill on `#E2E8F0` track).
- Star milestones (`⭐`) that pop with scale micro-animations when moves from a chapter are mastered.