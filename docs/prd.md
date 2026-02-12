# PRD: Slime Time Web App (V1 Prototype)
Date: 2026-02-12

## 1. Overview
A kid-friendly slime simulator web app that runs smoothly on iPad and feels satisfying to touch. Users create a slime using presets, colours, and add-ins, then play with it using touch gestures. They can save favourites to a gallery and export a screenshot.

## 2. Problem statement
Kids enjoy slime for tactile and sensory play, but real slime is messy, time-consuming, and not always allowed. A digital version provides a clean, safe, repeatable experience.

## 3. Goals
- Deliver a satisfying touch-driven slime play experience
- Support simple creation customisation that feels expressive
- Provide persistent gallery saves on device
- Provide screenshot export for sharing or keeping
- Work offline after first load

## 4. Non-goals
- Monetisation: ads, IAP, subscriptions
- Accounts and cloud sync
- Complex simulation of real material mixing
- Social network features

## 5. Users and use cases
Primary user: child playing on iPad

Use cases:
- Quickly open and start playing with a slime
- Create a new slime with favourite colour and decorations
- Save a slime to the gallery
- Load a saved slime and play again
- Export an image of a slime

## 6. Key experience principles
- Instant gratification: play within 2 taps
- No failure states: every combination looks good
- Big touch targets and minimal reading
- Calm by default, with sound toggle and low stimulation mode

## 7. User journeys
### Journey A: First time play
1. User opens app
2. Taps Play
3. Touches slime, hears sound, sees dent
4. Drag to smear, release to recover

Success:
- User understands interaction immediately
- No stutter or confusing UI

### Journey B: Create and save
1. User opens Create
2. Chooses slime type
3. Picks two colours and blend amount
4. Adds decorations and adjusts density
5. Saves slime with auto name or custom name
6. Sees slime in gallery

Success:
- Save takes less than 1 second
- Saved slime matches what they made

### Journey C: Export screenshot
1. User taps camera icon
2. Sees preview
3. Saves or shares

Success:
- Image is crisp and includes the slime clearly
- Works on iPad Safari reliably

## 8. Functional requirements
### 8.1 Play mode
- Fullscreen slime scene
- Gestures:
  - Press dent
  - Drag trail
  - Release recovery
- Reset button returns slime to calm state
- Sound toggle
- Low stimulation mode reduces audio intensity

### 8.2 Create mode
- Slime type selector (5 presets)
- Colour A picker
- Colour B picker
- Blend slider
- Add-ins list with search or category tabs
- Density slider

### 8.3 Gallery
- Grid of saved slimes with thumbnails
- Tap to load slime
- Long press or edit mode to delete

### 8.4 Export
- Create screenshot of current slime
- Share via share sheet where available
- Fallback download if share is not supported

### 8.5 Offline support
- After first successful load, app opens and functions offline
- Saved slimes available offline

## 9. Content requirements
### Slime types
- Milky, Clear, Metallic, Jiggly, Crunchy
- Each has distinct look and motion parameters

### Add-ins
- 20 to 40 items for V1
- Visual-only behaviours:
  - Floaty
  - Sinky
  - Static
- Categories:
  - Glitter
  - Beads
  - Jelly
  - Sprinkles
  - Charms

## 10. Data requirements
- All user data stored locally
- Save structure must include a seed for deterministic placement of add-ins
- Thumbnails stored as compressed images

## 11. Privacy and safety
- No tracking
- No ads
- No accounts
- No external sharing beyond explicit user export

## 12. Performance requirements
- Target 60 fps during active play on modern iPad
- No long main thread blocks during interaction
- Texture budgets:
  - Touch imprint texture: 512 or 1024
  - Keep total GPU memory moderate
- Idle optimisation:
  - Reduce to 30 fps when idle

## 13. Accessibility
- Large buttons
- High contrast icons
- Optional reduced motion mode if feasible

## 14. Acceptance criteria
- User can play, create, save, load, and export without errors
- Saved slimes persist after refresh
- Works offline after initial load
- No noticeable input lag during press and drag
