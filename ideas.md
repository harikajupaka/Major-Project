# Design Direction — Service Platform

## Approach 1: Editorial Ritual
**Very Brief Intro:** A warm, print-inspired service directory that treats everyday grooming as a small ritual. Cream paper, ink-black typography, deep jade accents, and tactile photography create a calm but premium browsing experience.

**Probability:** 0.07

## Approach 2: Quiet Grid
**Very Brief Intro:** A precise, gallery-like interface with cool white space, graphite text, and a restrained blue-gray palette. The visual language is calm and highly organized, prioritizing efficient scanning over decorative flourish.

**Probability:** 0.03

## Approach 3: Daylight Club
**Very Brief Intro:** A bright, optimistic service marketplace with soft citrus, sky blue, and coral accents. Oversized typography and energetic editorial photography make the experience feel social, fresh, and approachable.

**Probability:** 0.09

## Chosen Direction: Editorial Ritual

### Design Movement
Contemporary editorial minimalism with references to independent print magazines, boutique hospitality, and tactile wayfinding systems.

### Core Principles
1. **Ritual over transaction:** Services are framed as thoughtful moments of care, not generic inventory.
2. **Editorial rhythm:** Use sharp typographic contrast, asymmetric sections, and generous whitespace to make the page feel composed rather than templated.
3. **Tactile calm:** Pair warm paper tones, subtle grain, soft image crops, and restrained borders to create depth without visual noise.
4. **Useful drama:** Let the hero carry personality while keeping discovery actions obvious and accessible.

### Color Philosophy
The base is a warm parchment called **Ritual Cream**, chosen to soften the interface and make the experience feel human. **Ink Black** gives headings an editorial weight; **Jade Ink** is the ownable signature accent, connecting grooming, wellness, and quiet confidence. A small amount of **Papaya Clay** introduces energy for tags and interactive highlights without turning the interface playful or loud.

### Layout Paradigm
A magazine-like vertical narrative: a split hero with a text column and framed photography, a diagonal category rail, offset cards, and a service shelf that breaks out of a strict centered grid. Content should feel intentionally placed, with the visual eye moving from the hero to category choice to service discovery.

### Signature Elements
- A slim vertical eyebrow system with uppercase labels and tracking, used for section landmarks.
- Soft rectangular image frames with a narrow jade rule and small index labels.
- Oversized italic serif words that appear as quiet editorial annotations behind key sections.

### Interaction Philosophy
Interactions should feel like turning a page: focused, quick, and tactile. Buttons gain a slight lift and ink shift on hover, cards reveal a small service cue rather than a loud overlay, and filters update immediately with clear active states. Use keyboard-visible focus rings and keep all interactive elements understandable without relying on imagery.

### Animation
Entrance motion should be a short 180–240ms rise and fade with a slight stagger for cards. Image frames can drift by 2–4px on hover, while buttons use a 160ms transform and color transition. Avoid looping decorative motion. Respect `prefers-reduced-motion` by removing non-essential transforms and using opacity-only transitions.

### Typography System
- **Display:** `DM Serif Display`, used for the hero headline, large section titles, and italic editorial annotations.
- **Interface / body:** `Manrope`, used for navigation, labels, descriptions, prices, filters, and buttons.
- **Hierarchy:** Eyebrows at 11px uppercase with generous tracking; body copy at 15–17px; card titles at 20–24px; hero headline at clamp(3.5rem, 8vw, 7.5rem) with tight leading.

### Brand Essence
**Numa is a considered way to discover grooming and self-care services — for people who want the right ritual, not just the nearest listing.**

Personality adjectives: **considered, warm, quietly confident**.

### Brand Voice
Headlines sound like confident editorial invitations. CTAs are clear and active without sounding transactional. Microcopy is brief, precise, and human.

Example lines:
- “Find the care that fits your rhythm.”
- “Browse the rituals →”

### Wordmark & Logo
The mark is a simple jade arch intersected by a vertical ink line, suggesting a doorway into a service ritual. Pair it with a custom small-caps wordmark treatment for **NUMA**, with the arch used as the favicon and as a visual divider in the header.

### Signature Brand Color
**Jade Ink — `#147d73`**. A deep blue-green that reads as grounded and ownable on parchment, while still offering enough contrast for buttons, focus states, and navigation accents.

## Implementation Reminder
All new component and page files should preserve this visual direction: editorial serif display type, warm parchment surfaces, jade interaction accents, asymmetric composition, tactile imagery, and restrained motion. When choosing between two valid UI patterns, prefer the one that feels more like a composed service journal than a generic marketplace dashboard.

## Style Decisions

- Every route must include at least one visibly editorial composition: split layout, offset shelf, vertical rail, or oversized annotation.
- The Numa arch-and-vertical-line mark recurs as a jade divider/index device in section landmarks and image framing, not only in the header.
- Category and service imagery uses warm tactile photography, soft crops, narrow jade framing, and small index labels.
- Service discovery controls remain useful but should read as quiet journal wayfinding rather than a generic SaaS filter bar.
