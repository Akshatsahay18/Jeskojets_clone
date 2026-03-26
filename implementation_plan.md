# Project Blueprint: Jesko Jets Cinematic Experience

## Objective
Create a cinematic, luxury aviation website inspired by Jesko Jets using scroll-driven image sequences, premium overlays, and a final looping globe video. The implementation must use the existing assets in `public/` exactly as provided.

## Confirmed Asset Contract

- Hero animation frames: `public/sequence-1/`
- Plane morph animation frames: `public/sequence-2/`
- Globe video: `public/globe-loop.mp4`

Observed asset facts in this workspace:

- `public/sequence-1/` contains `120` JPEGs
- `public/sequence-2/` contains `120` JPEGs
- Frame naming format is `ezgif-frame-001.jpg` through `ezgif-frame-120.jpg`
- Globe video must be referenced with `src="/globe-loop.mp4"`

## 1. Tech Stack & Initialization

- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI animation: Framer Motion
- Smooth scroll: Lenis via `@studio-freight/lenis`
- Sequence rendering: HTML5 Canvas
- Video rendering: native HTML5 `video`

Bootstrap commands:

```bash
npx create-next-app@latest jesko-jets --typescript --tailwind --eslint
npm install framer-motion @studio-freight/lenis clsx tailwind-merge
```

## 2. Visual Identity

### Core Aesthetic
- Minimalist
- Premium
- Dark-mode luxury
- Cinematic and editorial

### Color
- Background: `#050505`
- Primary text: `#FFFFFF`
- Body copy: white at roughly `80%` opacity

### Typography
- Primary font: Geist Sans or Inter
- Headings: tighter tracking, bold but not bulky
- Subheaders and labels: uppercase with `tracking-[0.2em]`

### Layout Language
- Large negative space
- Fullscreen sticky sections
- Sparse interface chrome
- Layered dark gradients and subtle glass surfaces

## 3. Core Component Architecture

Recommended structure:

```text
/app
  layout.tsx
  page.tsx

/components
  SmoothScroll.tsx
  SequenceCanvas.tsx
  HeroCanvas.tsx
  PlaneMorph.tsx
  Globe.tsx
  Navbar.tsx
  FooterOverlay.tsx
  LoadingScreen.tsx

/hooks
  useImagePreloader.ts

/lib
  utils.ts

/public
  /sequence-1
  /sequence-2
  globe-loop.mp4

/styles
  globals.css
```

### A. `SmoothScroll.tsx`
Purpose: wrap the layout in a Lenis controller so scroll-linked canvas sections feel smooth and stable.

Requirements:

- Client component
- Initialize Lenis in `useEffect`
- Config:
  - `lerp: 0.1`
  - `smoothWheel: true`
- Use a `requestAnimationFrame` loop to call `lenis.raf(time)`
- Clean up RAF and destroy Lenis on unmount

Integration:

- Mount this provider in `app/layout.tsx`
- Ensure global CSS includes `html.lenis { height: auto; }`

### B. `useImagePreloader.ts`
Purpose: eliminate first-scroll flicker and support a controlled loading state.

Requirements:

- Iterate through both sequence directories
- Use the real frame contract:
  - folder: `/sequence-1` or `/sequence-2`
  - prefix: `ezgif-frame-`
  - digits: `3`
  - extension: `jpg`
  - start index: `1`
- Return:
  - `loadedCount`
  - `isReady`
  - optionally `imagesRef` for direct draw access

Suggested behavior:

- Preload all required frames per section, or at minimum the initial hero sequence plus a buffered subset of the second sequence
- Report percentage progress for a loading overlay
- Unlock page scroll only once the required preload threshold is complete

### C. `SequenceCanvas.tsx`
Purpose: reusable rendering engine for both the hero cloud sequence and the plane morph sequence.

Props:

- `directory`
- `frameCount`
- `scrollRange`
- optional overlay content
- optional class names

Rendering logic:

- Use Framer Motion `useScroll`
- Use `useTransform` to map scroll depth to an integer frame index
- Render to a high-DPI canvas
- Use `requestAnimationFrame` to keep drawing efficient
- Implement cover-style image fitting to fill the viewport without distortion

Expected internals:

- `canvasRef`
- `containerRef`
- `context`
- preloaded image cache
- frame subscription based on scroll progress

## 4. Section Breakdown

### Section 1: The Cloud Ascent
Source: `/public/sequence-1/`

Behavior:

- Sticky canvas section with total height `h-[400vh]`
- Scroll drives frame progression from first to last cloud frame
- The sequence should feel like a controlled ascent through atmosphere

Overlay requirements:

- Centered H1: `THE NEW STANDARD`
- Initial opacity: `1`
- Fade to `0` by roughly `20%` of hero scroll progress

Supporting UI:

- Floating bottom dock with dark glassmorphism styling
- Keep it minimal and premium, more like a luxury HUD than navigation clutter

### Section 2: Technical Precision
Source: `/public/sequence-2/`

Behavior:

- Sticky canvas section using the same rendering system
- The plane sequence should transition visually toward a more technical, blueprint-like read

Overlay behavior:

- Use a 2-column grid overlay
- Reveal technical spec content only once the wireframe or blueprint moment appears
- Suggested reveal trigger: around the latter third of the sequence or based on scroll progress threshold

Required specs to display:

- `Range: 7,500nm`
- `Speed: Mach 0.925`

Overlay tone:

- Precise
- Quiet
- Engineering-led
- Minimal text density

### Section 3: Global Reach
Source: `/public/globe-loop.mp4`

Behavior:

- Fullscreen footer section
- Video should autoplay, loop, remain muted, and play inline

Styling:

- Use `mix-blend-lighten` or `opacity-60` to integrate the globe with the black background
- Place a large H2 behind the globe with z-index layering

Required H2:

- `BEYOND BOUNDARIES`

Goal:

- The section should feel like a global network statement, not a generic video footer

## 5. Implementation Snippets

### Canvas Drawing Logic

```ts
const drawImage = (index: number) => {
  if (images[index]) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const img = images[index];
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;

    let width = canvas.width;
    let height = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      height = canvas.height;
      width = height * imgAspect;
      offsetX = (canvas.width - width) / 2;
    } else {
      width = canvas.width;
      height = width / imgAspect;
      offsetY = (canvas.height - height) / 2;
    }

    context.drawImage(img, offsetX, offsetY, width, height);
  }
};
```

### Layout Structure

```tsx
<main className="bg-[#050505] text-white">
  <Navbar />

  <section className="relative h-[400vh]">
    <HeroCanvas sequence="/sequence-1" />
  </section>

  <section className="relative h-[400vh]">
    <PlaneMorph sequence="/sequence-2" />
  </section>

  <footer className="relative h-screen overflow-hidden">
    <video
      src="/globe-loop.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />
    <FooterOverlay />
  </footer>
</main>
```

## 6. Loading State Strategy

Implement a proper loading experience before enabling scroll.

Requirements:

- Show a loading screen with percentage progress
- Percentage should be based on `loadedCount / totalFrames`
- Prevent user scroll until preload is complete or until the minimum safe threshold is met
- Fade the loading screen out once ready

Recommended behavior:

- Lock document scroll during preload
- Unlock only when hero sequence is fully safe to render without flicker
- Prefer a polished, minimal loader rather than a spinner-heavy default

## 7. Optimization Checklist

- Compress JPEG sequence frames aggressively where visual quality allows
- Target under `100kb` per frame where possible
- Set canvas dimensions using:
  - `canvas.width = window.innerWidth * window.devicePixelRatio`
  - `canvas.height = window.innerHeight * window.devicePixelRatio`
- Scale canvas drawing context for retina clarity
- Avoid React state updates on every scroll tick
- Keep image caches in refs
- Use RAF-driven drawing
- Clear canvas before each draw
- Do not rerender overlay UI unnecessarily

## 8. Implementation Rules For The Coding Agent

- Use Next.js 14 App Router, not Pages Router
- Write all components in TypeScript
- Use Tailwind for styling, not CSS modules
- Use Framer Motion only for overlay and UI animation, not for the frame playback itself
- Use canvas for both image sequences
- Use native `video` for the globe section
- Use the real `public/` asset names and paths exactly as they exist
- Do not rename frame files
- Keep the page one-screenflow, not multi-route

## 9. Recommended Execution Order

1. Set up the Next.js 14 project shell
2. Configure Tailwind theme tokens for dark luxury styling
3. Add `SmoothScroll.tsx` and mount it in `layout.tsx`
4. Build `useImagePreloader.ts`
5. Build the generic `SequenceCanvas.tsx`
6. Implement Hero section with centered title fade
7. Implement Plane Morph section with delayed technical-spec overlay
8. Implement Globe footer with behind-text layering
9. Add loading screen and scroll lock
10. Tune sizing, motion, and performance

## 10. Acceptance Criteria

- Hero section uses `/public/sequence-1/` on canvas
- Plane section uses `/public/sequence-2/` on canvas
- Globe footer uses `/public/globe-loop.mp4`
- Hero canvas section is sticky and spans `h-[400vh]`
- Hero H1 `THE NEW STANDARD` fades out by roughly 20% scroll
- Plane section reveals technical specs only when the blueprint state appears
- Footer shows `BEYOND BOUNDARIES` layered behind the globe
- Lenis smooth scrolling is active
- Canvas renders sharply on retina displays
- Initial scroll does not flicker due to preload
- A percentage loading screen exists before the experience starts

## 11. Direct Build Prompt

```md
Act as a senior creative developer and build a cinematic Jesko Jets-inspired landing page in Next.js 14 App Router with TypeScript, Tailwind CSS, Framer Motion, Lenis, HTML5 Canvas, and native HTML5 Video.

Use these assets exactly as they exist:
- `/public/sequence-1/` for the hero cloud animation
- `/public/sequence-2/` for the plane morph animation
- `/public/globe-loop.mp4` for the footer globe loop

Asset facts:
- Both frame sequences contain 120 JPEG images
- Frame naming format is `ezgif-frame-001.jpg` through `ezgif-frame-120.jpg`

Build these core pieces:
- `SmoothScroll.tsx` as the Lenis provider
- `useImagePreloader.ts` returning `loadedCount` and `isReady`
- `SequenceCanvas.tsx` as a reusable high-DPI canvas engine
- Hero section with centered `THE NEW STANDARD` fading out during the first 20% of scroll
- Plane morph section with a 2-column technical-spec overlay that appears when the blueprint moment begins
- Footer globe section using `video src="/globe-loop.mp4"` with `BEYOND BOUNDARIES` behind the globe
- Percentage loading screen that locks scroll until preload is ready

Visual direction:
- Background `#050505`
- White typography
- Geist Sans or Inter
- Tight heading tracking
- `tracking-[0.2em]` for subheaders
- Minimalist dark luxury styling

Performance rules:
- Use `requestAnimationFrame` for canvas drawing
- Use high-DPI canvas sizing
- Use Framer Motion `useScroll` and `useTransform` for frame mapping
- Keep image caches in refs
- Avoid rerendering on scroll
- Ensure no flicker on first interaction

Deliver a polished one-page experience with premium motion and production-quality TypeScript components.
```

## 12. Verification Checklist

- `npm run typecheck` passes
- Local dev server runs
- Hero frames resolve correctly from `sequence-1`
- Plane frames resolve correctly from `sequence-2`
- Globe video autoplays inline and loops
- Loading screen percentage advances correctly
- Scroll is locked during preload and unlocked after ready state
- Frame progression feels smooth and synchronized with scroll
- Overlay text remains readable on desktop and mobile
