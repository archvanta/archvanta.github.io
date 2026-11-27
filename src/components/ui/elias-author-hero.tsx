/**
 * Adapted for ARCHVANTA from the 21st.dev "Elias" author hero: motion comes from framer-motion (the same API as
 * motion/react), the two arrow icons are inline, the stylesheet lives in elias-author-hero.css because the site's
 * Content-Security-Policy blocks inline <style>, the navbar and splash are optional, Persian names are not split
 * into letters (that would break their joining), and the remaining fixed English labels are props.
 *
 * Elias: an editorial author hero. A giant outlined name, a cut-out portrait, a hardcover book carousel, a letter
 * to tomorrow that writes itself, an ink splash intro and an ink-spotlight cursor.
 *
 * Content lives in props (see EliasProps); the demo supplies the original author, books and letter.
 *
 * Dependencies: motion (motion/react), lucide-react
 * Fonts: the design uses Inter (900), Figtree (300-600) and IBM Plex Mono (400); load them in the host page, the
 * component falls back to the system sans stack until they are available.
 *
 * Usage: <Elias name={{ first: 'Ada', last: 'Lovelace' }} intro={{ roles: ['Author'], headline: ['Hello'], description: '...' }} />
 */

import { createContext, Fragment, useCallback, useContext, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { PointerEvent as ReactPointerEvent, SVGProps } from 'react'
import { animate, AnimatePresence, domAnimation, LazyMotion, m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { MotionStyle, Transition } from 'framer-motion'
import './elias-author-hero.css'

type IconProps = SVGProps< SVGSVGElement >
const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M5 12h14M12 5l7 7-7 7' />
  </svg>
)
const ArrowUpRightIcon = (props: IconProps) => (
  <svg viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M7 7h10v10M7 17 17 7' />
  </svg>
)

// Joins the truthy class names; the block's classes are passed through untouched
const cn = (...classes: Array< string | false | null | undefined >) => classes.filter(Boolean).join(' ')

/* ------------------------------ Props ------------------------------ */

export interface EliasNavItem {
  /** Visible label of the link */
  label: string
  /** Link target */
  href: string
  /** Marks the current page (renders aria-current="page" and the accent colour) */
  active?: boolean
}

export interface EliasBook {
  /** Small label under the book, e.g. "The Latest Book" */
  label: string
  /** Book title, printed on the spine and used for the accessible name */
  title: string
  /** The cover title, broken by hand into lines */
  coverLines: string[]
  /** Topics listed next to the label */
  topics: string[]
  /** Which built-in pastel cover illustration to draw */
  art: 'sunrise' | 'lamp' | 'path' | 'days'
  /** Cover paper, cover type and spine colours (any CSS colour) */
  colors: { cover: string; type: string; spine: string }
  /** Eyebrow of the first page, e.g. "Chapter one" */
  chapter: string
  /** Title of the first chapter */
  chapterTitle: string
  /** Opening text shown on the first page when the book is open */
  text: string
  /** Where this book's link goes; falls back to bookCard.href */
  href?: string
}

export interface EliasLetter {
  /** Small heading on the sheet and accessible name of the letter */
  eyebrow: string
  /** Greeting line, e.g. "Dear tomorrow," */
  greeting: string
  /** Label of the stamp that presses when a letter is finished */
  stamp: string
  /** Word printed in the postmark, above the date */
  postmark: string
  /** The monogram pressed into the wax seal */
  seal: string
  /** Caption shown with the sealed envelope */
  sealing: string
  /** The promises typed out one after another */
  messages: string[]
  /** Word before the letter counter, e.g. "Letter" (renders "Letter 01 / 04") */
  counter: string
}

export interface EliasSocialLink {
  /** Visible label */
  label: string
  /** Link target, opens in a new tab */
  href: string
}

export interface EliasMotion {
  /** When each part starts revealing, in seconds after the splash opens */
  delays: { nav: number; first: number; last: number; portrait: number; book: number; pad: number; intro: number; socials: number }
  /** Gap between one letter of the name rising and the next, in seconds */
  letterStagger: number
  /** How far each layer drifts as the cursor crosses the hero, in px */
  depth: { portrait: number; first: number; last: number }
  /** The self-writing letter, in seconds */
  letter: { perCharacter: number; pauseAfterPunctuation: number; beforeSeal: number; press: number; sealHold: number }
  /** How far the book turns toward the cursor, in degrees */
  bookTilt: number
  /** How far the cover swings open on hover, in degrees */
  bookOpen: number
  /** How long each book rests before the next slides in, in seconds */
  bookCycle: number
  /** The ink spotlight: radius in px and the delay before it opens, in seconds */
  spotlight: { radius: number; readyAfter: number }
  /** The custom cursor sizes in px and the label shown over the book */
  cursor: { dot: number; ring: number; disc: number; readLabel: string }
}

export interface EliasSplash {
  /** When the outlines start tracing, in seconds */
  drawAt: number
  /** How long an outline takes to trace, in seconds */
  drawDuration: number
  /** When the light sweeps in to fill the letters, in seconds */
  floodAt: number
  /** How long the sweep takes, in seconds */
  floodDuration: number
  /** When the ink page opens onto the hero, in seconds */
  openAt: number
  /** How long the opening takes, in seconds */
  openDuration: number
  /** The longest the splash waits for the display font, in seconds */
  fontTimeout: number
}

export interface EliasLabels {
  /** Accessible name of the navbar */
  nav: string
  /** Accessible name of the social links list */
  socials: string
  /** Prefix of the book link's accessible name, e.g. "Read about" */
  readAbout: string
  /** Locale used for the postmark date */
  dateLocale: string
}

const DEFAULT_LABELS: EliasLabels = { nav: 'Main', socials: 'Social links', readAbout: 'Read about', dateLocale: 'en-US' }

type Overrides< T > = { [K in keyof T]?: T[K] extends object ? Partial< T[K] > : T[K] }

export interface EliasProps {
  /** Wordmark in the navbar and where it links. Default: empty */
  brand?: { name: string; href: string }
  /** Navbar links: the first group sits left of the wordmark, the second to its right. Default: none */
  navLinks?: { left: EliasNavItem[]; right: EliasNavItem[] }
  /** The navbar's call-to-action button. Default: not shown */
  navCta?: { label: string; href: string }
  /** The status note at the navbar's left edge (label and detail). Default: empty */
  navStatus?: { label: string; detail: string }
  /** The two giant name lines: the first in the accent colour, the second in ink. Default: empty */
  name?: { first: string; last: string }
  /** Roles, the hand-broken headline lines and the description under them. Default: empty */
  intro?: { roles: string[]; headline: string[]; description: string }
  /** The cut-out portrait (transparent, cropped at the waist); omit to render without one */
  portrait?: { src: string; alt: string; width: number; height: number }
  /** Books shown one at a time in the book card; omit to hide the card. Default: none */
  books?: EliasBook[]
  /** Link and labels shared by the book card. Default: empty */
  bookCard?: { href: string; open: string; close: string; folio: string }
  /** The self-writing letter to tomorrow; omit to hide it */
  letter?: EliasLetter
  /** Social links at the bottom. Default: none */
  socialLinks?: EliasSocialLink[]
  /** Overrides for the motion dials (delays, depth, timings). Default: the original design values */
  motion?: Overrides< EliasMotion >
  /** Overrides for the opening splash timings. Default: the original design values */
  splash?: Partial< EliasSplash >
  /** Forces reduced motion on or off; by default the visitor's prefers-reduced-motion setting is used */
  reducedMotion?: boolean
  /** Plays the ink splash before the entrance. Default: true */
  showSplash?: boolean
  /** Fixed labels the original wrote in English. Default: the English originals */
  labels?: Partial< EliasLabels >
  /** Extra classes for the outer wrapper */
  className?: string
}

/* ----------------------------- Defaults ----------------------------- */

// One long, soft ease-out shared by every reveal, so the pieces feel like one sequence
const EASE = [0.16, 1, 0.3, 1] as const

const DEFAULT_MOTION: EliasMotion = {
  delays: { nav: 0, first: 0.1, last: 0.25, portrait: 0.4, book: 0.6, pad: 0.7, intro: 0.8, socials: 1.15 },
  letterStagger: 0.055,
  depth: { portrait: 14, first: 6, last: 9 },
  letter: { perCharacter: 0.075, pauseAfterPunctuation: 0.36, beforeSeal: 1.4, press: 0.8, sealHold: 4.8 },
  bookTilt: 14,
  bookOpen: 34,
  bookCycle: 3,
  spotlight: { radius: 145, readyAfter: 2.1 },
  cursor: { dot: 10, ring: 44, disc: 72, readLabel: 'Click' }
}

const DEFAULT_SPLASH: EliasSplash = {
  drawAt: 0.1,
  drawDuration: 0.75,
  floodAt: 0.7,
  floodDuration: 0.65,
  openAt: 1.4,
  openDuration: 0.85,
  fontTimeout: 1.2
}

// When the cursor effects run: a mouse or trackpad, and the wide composition where the layers line up exactly
const MEDIA = {
  finePointer: '(hover: hover) and (pointer: fine)',
  composition: '(min-width: 1024px) and (min-aspect-ratio: 5/4)',
  reducedMotion: '(prefers-reduced-motion: reduce)'
}

interface EliasContextValue {
  BRAND: { name: string; href: string }
  NAV_LINKS: { left: EliasNavItem[]; right: EliasNavItem[] }
  NAV_CTA: { label: string; href: string } | undefined
  NAV_STATUS: { label: string; detail: string }
  NAME: { first: string; last: string }
  INTRO: { roles: string[]; headline: string[]; description: string }
  IMAGES: { portrait: { src: string; alt: string; width: number; height: number } | undefined }
  BOOKS: EliasBook[]
  BOOK_CARD: { href: string; open: string; close: string; folio: string }
  LETTER: EliasLetter
  SOCIAL_LINKS: EliasSocialLink[]
  MOTION: EliasMotion
  SPLASH: EliasSplash
  REDUCED: boolean | undefined
  SHOW_SPLASH: boolean
  LABELS: EliasLabels
}

const EMPTY_LETTER: EliasLetter = { eyebrow: '', greeting: '', stamp: '', postmark: '', seal: '', sealing: '', messages: [], counter: '' }

const EliasContext = createContext< EliasContextValue | null >(null)

const useElias = () => {
  const value = useContext(EliasContext)

  if (!value) throw new Error('Elias parts must render inside <Elias>')

  return value
}

// The visitor's reduced-motion setting, unless the reducedMotion prop forces it
const useReduce = () => {
  const { REDUCED } = useElias()
  const system = useReducedMotion()

  return REDUCED ?? system
}

/* ----------------------------- Parts ----------------------------- */


/**
 * Whether the hero's entrance may play. The splash holds it back and flips it the moment it opens onto the hero;
 * every entrance delay counts from that moment
 */
const IntroContext = createContext(true)

const useIntroStarted = () => useContext(IntroContext)

// Whether the hero is on screen in a visible tab; the self-running loops (letter, books) hold while it isn't
const OnScreenContext = createContext(true)

const useHeroOnScreen = () => useContext(OnScreenContext)


// Whether a media query matches, kept in sync as the window or device changes; false on the server
const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)

      list.addEventListener('change', onChange)

      return () => list.removeEventListener('change', onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}




/**
 * One reveal's timing: the shared ease from its delay, or instant when the visitor asks for reduced motion, so
 * the hero simply appears in its final state
 */
const reveal = (reduceMotion: boolean | null, delay: number, duration = 1): Transition => {
  return reduceMotion ? { duration: 0 } : { delay, duration, ease: EASE }
}


/**
 * The ink filters, applied in CSS by id. ea-ink-duotone maps the portrait's brightness from ink through a warm
 * dark grey (so the coat keeps its texture) and the accent orange to the page colour. ea-ink-outline keeps
 * only a 2px band inside each letter's silhouette.
 */
const AuthorInkFilters = (props: SVGProps< SVGSVGElement >) => {
  return (
    <svg width='0' height='0' aria-hidden focusable='false' className='absolute' {...props}>
      <filter id='ea-ink-duotone' colorInterpolationFilters='sRGB'>
        <feColorMatrix
          type='matrix'
          values='0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0'
        />
        <feComponentTransfer>
          <feFuncR type='table' tableValues='0.090 0.25 1 0.965' />
          <feFuncG type='table' tableValues='0.078 0.215 0.282 0.957' />
          <feFuncB type='table' tableValues='0.071 0.195 0.161 0.941' />
        </feComponentTransfer>
      </filter>

      {/* Built from the silhouette, not a stroke, so overlapping shapes inside a letter never draw extra lines */}
      <filter id='ea-ink-outline'>
        <feMorphology in='SourceAlpha' operator='erode' radius='2' result='inside' />
        <feComposite in='SourceGraphic' in2='inside' operator='out' />
      </filter>
    </svg>
  )
}



// Cover art for Small Days, Long Life: a calendar of small days in sky blue, with one day marked in coral
const AuthorCoverDays = (props: SVGProps< SVGSVGElement >) => {
  // Five days across, four weeks down; the marked day sits in the third week
  const days = Array.from({ length: 20 }, (_, index) => ({
    x: 20 + (index % 5) * 15,
    y: 84 + Math.floor(index / 5) * 11,
    marked: index === 12
  }))

  return (
    <svg viewBox='0 0 100 139' preserveAspectRatio='xMidYMid slice' aria-hidden {...props}>
      <rect width='100' height='139' fill='#d3e6f1' />
      {days.map(day => (
        <circle
          key={`${day.x}-${day.y}`}
          cx={day.x}
          cy={day.y}
          r={day.marked ? 5 : 3.4}
          fill={day.marked ? '#ff9f80' : '#a3c8de'}
        />
      ))}
    </svg>
  )
}



// Cover art for Deep Work, Light Life: a stack of books under the warm round glow of a desk lamp, in sage
const AuthorCoverLamp = (props: SVGProps< SVGSVGElement >) => {
  return (
    <svg viewBox='0 0 100 139' preserveAspectRatio='xMidYMid slice' aria-hidden {...props}>
      <rect width='100' height='139' fill='#d3e3d2' />
      <circle cx='70' cy='86' r='30' fill='#e6efdf' />
      <circle cx='70' cy='86' r='14' fill='#f6efd9' />
      <rect x='12' y='112' width='56' height='10' rx='1.5' fill='#8fb59a' />
      <rect x='18' y='102' width='46' height='10' rx='1.5' fill='#a9c8b1' />
      <rect x='14' y='92' width='40' height='10' rx='1.5' fill='#f2e9d6' />
      <rect x='0' y='122' width='100' height='17' fill='#bcd4bd' />
    </svg>
  )
}



// Cover art for Notes on Being Here: a winding walking path with footsteps along it and a pale moon, in lavender
const AuthorCoverPath = (props: SVGProps< SVGSVGElement >) => {
  return (
    <svg viewBox='0 0 100 139' preserveAspectRatio='xMidYMid slice' aria-hidden {...props}>
      <rect width='100' height='139' fill='#e2daf0' />
      <circle cx='84' cy='30' r='7' fill='#f6f1fb' />
      <path
        d='M92 139c-10-14-34-14-30-28s24-12 14-26-46-6-50-18'
        fill='none'
        stroke='#b4a6d8'
        strokeWidth='8'
        strokeLinecap='round'
      />
      <g fill='#f6f1fb'>
        <circle cx='79' cy='128' r='1.6' />
        <circle cx='65' cy='116' r='1.6' />
        <circle cx='73' cy='100' r='1.6' />
        <circle cx='60' cy='88' r='1.6' />
        <circle cx='42' cy='82' r='1.6' />
      </g>
    </svg>
  )
}



// Cover art for A More Intentional Life: a soft peach sun rising over a ruled horizon
const AuthorCoverSunrise = (props: SVGProps< SVGSVGElement >) => {
  return (
    <svg viewBox='0 0 100 139' preserveAspectRatio='xMidYMid slice' aria-hidden {...props}>
      <rect width='100' height='139' fill='#f8dccb' />
      <circle cx='50' cy='96' r='38' fill='#fbe7da' />
      <path d='M20 96a30 30 0 0 1 60 0Z' fill='#ff9f80' />
      <rect y='96' width='100' height='43' fill='#f3c7ae' />
      <rect x='14' y='104' width='72' height='2.4' rx='1.2' fill='#eab295' />
      <rect x='24' y='112' width='52' height='2.4' rx='1.2' fill='#eab295' />
      <rect x='34' y='120' width='32' height='2.4' rx='1.2' fill='#eab295' />
    </svg>
  )
}



type InkButtonProps = {
  label: string
  icon?: 'right' | 'up-right'
  href?: string
  disabled?: boolean
  onClick?: () => void
  className?: string
}

/**
 * The hero's one button style: an outlined pill with an orange disc. On hover ink floods the pill outward from the
 * disc, the label turns to the page colour, and the arrow leaves its disc as a fresh one slides in.
 */
const InkButton = ({ label, icon = 'right', href, disabled = false, onClick, className }: InkButtonProps) => {
  // Vars
  const Arrow = icon === 'up-right' ? ArrowUpRightIcon : ArrowRightIcon
  const classes = cn('ea-cta', icon === 'up-right' && 'ea-cta-diagonal', className)

  const content = (
    <>
      <span className='ea-cta-label'>{label}</span>
      <span aria-hidden className='ea-cta-mark'>
        <Arrow className='ea-cta-arrow ea-cta-arrow-out' strokeWidth={2} />
        <Arrow className='ea-cta-arrow ea-cta-arrow-in' strokeWidth={2} />
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button type='button' className={classes} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}








type MaskedWordProps = {
  text: string
  delay: number

  // Which edge of its mask each letter enters from
  from: 'below' | 'above'

  // Last letter first when reversed, so a line can be set from the right
  reverse?: boolean
}

/**
 * Splitting a word into letters drops the font's kerning between them, so each pair's kerning is measured once
 * the font has loaded and given back as a margin; the settled word then matches the unsplit one exactly
 */
const measureKerning = (element: HTMLElement, text: string) => {
  const context = document.createElement('canvas').getContext('2d')

  if (!context) return []

  const style = getComputedStyle(element)

  // Measured as drawn: an uppercased name kerns its capitals, not the lowercase letters in the config
  const shown = style.textTransform === 'uppercase' ? text.toUpperCase() : text

  context.font = `${style.fontWeight} 100px ${style.fontFamily}`

  const width = (value: string) => context.measureText(value).width

  return [...shown].map((letter, index) => {
    const next = shown[index + 1]

    return next ? (width(letter + next) - width(letter) - width(next)) / 100 : 0
  })
}

const MaskedWord = ({ text, delay, from, reverse = false }: MaskedWordProps) => {
  // Context
  const { MOTION } = useElias()

  // States
  const [kerning, setKerning] = useState< number[] >([])

  // Refs
  const wordRef = useRef< HTMLSpanElement >(null)

  // Hooks
  const reduceMotion = useReduce()
  const started = useIntroStarted()

  // Vars
  // Arabic-script words (Persian) join their letters, so they rise as one piece instead of letter by letter
  const joined = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)
  const letters = joined ? [text] : [...text]
  const offset = from === 'below' ? '105%' : '-105%'

  useEffect(() => {
    let active = true

    document.fonts.ready.then(() => {
      if (active && wordRef.current && !joined) setKerning(measureKerning(wordRef.current, text))
    })

    return () => {
      active = false
    }
  }, [text, joined])

  return (
    <span ref={wordRef} aria-hidden className='inline-block whitespace-nowrap'>
      {letters.map((letter, index) => {
        const order = reverse ? letters.length - 1 - index : index

        return (
          <span
            key={`${letter}-${index}`}
            className='ea-letter-mask inline-block'
            style={kerning[index] ? { marginRight: `${kerning[index]}em` } : undefined}
          >
            <m.span
              className='inline-block'
              initial={{ transform: `translateY(${offset})` }}
              animate={started ? { transform: 'translateY(0%)' } : undefined}
              transition={reveal(reduceMotion, delay + order * MOTION.letterStagger, 1.05)}
            >
              {letter}
            </m.span>
          </span>
        )
      })}
    </span>
  )
}






type CursorMode = 'dot' | 'link' | 'read'

// The ring trails the dot a little, so the pair reads as ink and the light it throws
const TRAIL_SPRING = { stiffness: 420, damping: 34, mass: 0.5 }

const modeFor = (target: EventTarget | null): CursorMode => {
  if (!(target instanceof Element)) return 'dot'
  if (target.closest('.ea-book-frame')) return 'read'
  if (target.closest('a, button')) return 'link'

  return 'dot'
}

/**
 * The hero's cursor: an orange ink dot rimmed in the page colour, so it shows on orange, ink and cream alike.
 * Over a link it opens into a thin orange ring; over the book it becomes a solid disc that reads "Click".
 */
const InkCursor = () => {
  // States
  const [mode, setMode] = useState< CursorMode >('dot')

  // Refs
  const rootRef = useRef< HTMLDivElement >(null)
  const modeRef = useRef< CursorMode >('dot')

  // Hooks
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const visible = useMotionValue(0)
  const trailX = useSpring(x, TRAIL_SPRING)
  const trailY = useSpring(y, TRAIL_SPRING)

  // Vars
  const { MOTION } = useElias()
  const { dot, ring, disc, readLabel } = MOTION.cursor

  useEffect(() => {
    const hero = rootRef.current?.parentElement

    if (!hero) return

    // Positioned within the hero, which is the cursor's containing block
    const handleMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      const next = modeFor(event.target)

      x.set(event.clientX - rect.left)
      y.set(event.clientY - rect.top)
      visible.set(1)

      if (next !== modeRef.current) {
        modeRef.current = next
        setMode(next)
      }
    }

    const handleLeave = () => visible.set(0)

    hero.addEventListener('pointermove', handleMove, { passive: true })
    hero.addEventListener('pointerleave', handleLeave)

    return () => {
      hero.removeEventListener('pointermove', handleMove)
      hero.removeEventListener('pointerleave', handleLeave)
    }
  }, [x, y, visible])

  return (
    <div ref={rootRef} aria-hidden className='pointer-events-none absolute inset-0 z-[60] overflow-hidden'>
      {/* The ring and the disc share the trailing position; only one is ever open */}
      <m.div className='absolute top-0 left-0' style={{ x: trailX, y: trailY, opacity: visible }}>
        <m.div
          className='border-ea-accent absolute rounded-full border-[1.5px]'
          style={{ width: ring, height: ring, left: -ring / 2, top: -ring / 2 }}
          initial={{ transform: 'scale(0.2)', opacity: 0 }}
          animate={mode === 'link' ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.2)', opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        />
        <m.div
          className='bg-ea-accent text-ea-page absolute grid place-items-center rounded-full text-[11px] font-medium tracking-[0.18em] uppercase'
          style={{ width: disc, height: disc, left: -disc / 2, top: -disc / 2 }}
          initial={{ transform: 'scale(0)', opacity: 0 }}
          animate={mode === 'read' ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0)', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {readLabel}
        </m.div>
      </m.div>

      <m.div className='absolute top-0 left-0' style={{ x, y, opacity: visible }}>
        <m.div
          className='bg-ea-accent ring-ea-page absolute rounded-full ring-2'
          style={{ width: dot, height: dot, left: -dot / 2, top: -dot / 2 }}
          animate={{ transform: mode === 'dot' ? 'scale(1)' : mode === 'link' ? 'scale(0.5)' : 'scale(0)' }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </m.div>
    </div>
  )
}






// A slow-in, slow-out curve for the moves that travel across the screen: the light's sweep and the opening
const SWEEP_EASE = [0.76, 0, 0.24, 1] as const

// The light's radius at the start and end of its flood, drawn as a scale of the start circle so it runs on transforms
const FLOOD = { fromRadius: 70, toRadius: 760 }

type InkSplashProps = { onOpen: () => void }

/**
 * The opening scene on a page of ink. The name is drawn in outline as if on a proof, a circle of light
 * sweeps in and floods the letters solid, then the light opens from the centre into a hole onto the hero.
 */
const InkSplash = ({ onOpen }: InkSplashProps) => {
  // Context
  const { INTRO, NAME, SPLASH } = useElias()

  // States
  const [tracing, setTracing] = useState(false)
  const [done, setDone] = useState(false)

  // Refs
  const openedRef = useRef(false)

  // Hooks
  const clipId = useId()
  const hole = useMotionValue(0)
  const holeEdge = useTransform(hole, value => value - 1)
  const maskImage = useMotionTemplate`radial-gradient(circle ${hole}px at 50% 50%, transparent ${holeEdge}px, #000 ${hole}px)`

  const wipeId = useId()

  const open = useCallback(() => {
    if (openedRef.current) return

    openedRef.current = true
    onOpen()

    // Grows until the hole passes the screen's corners
    const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 24

    animate(hole, radius, { duration: SPLASH.openDuration, ease: SWEEP_EASE }).then(() => setDone(true))
  }, [hole, onOpen])

  // Waits for the display font so the outlines trace the real letters, but never longer than fontTimeout
  useEffect(() => {
    let active = true
    const timeout = new Promise(resolve => window.setTimeout(resolve, SPLASH.fontTimeout * 1000))

    Promise.race([document.fonts.ready, timeout]).then(() => {
      if (active) setTracing(true)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!tracing) return

    const timer = window.setTimeout(open, SPLASH.openAt * 1000)

    return () => window.clearTimeout(timer)
  }, [tracing, open])

  // Holds the page still while the splash covers it, and lets any key skip straight to the opening
  useEffect(() => {
    if (done) return

    const root = document.documentElement
    const previous = root.style.overflow

    root.style.overflow = 'hidden'
    window.addEventListener('keydown', open)

    return () => {
      root.style.overflow = previous
      window.removeEventListener('keydown', open)
    }
  }, [done, open])

  if (done) return null

  return (
    <m.div
      aria-hidden
      className='ea-splash bg-ea-ink fixed top-0 left-0 z-50 flex h-svh w-full flex-col'
      style={{ maskImage, WebkitMaskImage: maskImage }}
      onPointerDown={open}
    >
      <div className='ea-wrap flex h-19 shrink-0 items-center'>
        <m.p
          className='text-ea-page/70 flex gap-[0.6em] text-[11px] font-medium tracking-[0.2em] uppercase'
          initial={{ opacity: 0 }}
          animate={tracing ? { opacity: 1 } : undefined}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {INTRO.roles.map((role, index) => (
            <Fragment key={role}>
              {index > 0 && <span className='text-ea-accent'>/</span>}
              <span>{role}</span>
            </Fragment>
          ))}
        </m.p>
      </div>

      {/* Centred in the whole screen, not under the label row, so the name sits at the true middle */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
        {/* The view box hugs the letters (S top to O bottom) with equal margins above and below */}
        <svg viewBox='0 23 1000 414' className='ea-splash-name font-ea-display font-black'>
          <defs>
            <clipPath id={wipeId}>
              {/* The pen: a wipe that crosses the name left to right, leaving the outlines behind it */}
              <m.rect
                x={0}
                y={0}
                width={1000}
                height={440}
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={tracing ? { scaleX: 1 } : undefined}
                transition={{ delay: SPLASH.drawAt, duration: SPLASH.drawDuration, ease: EASE }}
              />
            </clipPath>
            <clipPath id={clipId}>
              {/* The light: it slides in from the left, widening until it has flooded every letter */}
              <m.circle
                cx={0}
                cy={230}
                r={FLOOD.fromRadius}
                initial={{ x: -260, scale: 1 }}
                animate={tracing ? { x: 500, scale: FLOOD.toRadius / FLOOD.fromRadius } : undefined}
                transition={{ delay: SPLASH.floodAt, duration: SPLASH.floodDuration, ease: SWEEP_EASE }}
              />
            </clipPath>
          </defs>

          {/* Outlines come from the letters' silhouettes, so overlapping shapes inside a letter never show */}
          <g clipPath={`url(#${wipeId})`} filter='url(#ea-ink-outline)' textAnchor='middle'>
            <text x={500} y={255} fontSize={300} letterSpacing='0.02em' fill='var(--color-ea-accent)'>
              {NAME.first.toUpperCase()}
            </text>
            <text x={500} y={424} fontSize={196} letterSpacing='0.02em' fill='var(--color-ea-page)'>
              {NAME.last.toUpperCase()}
            </text>
          </g>

          <g clipPath={`url(#${clipId})`} textAnchor='middle'>
            <text x={500} y={255} fontSize={300} letterSpacing='0.02em' fill='var(--color-ea-accent)'>
              {NAME.first.toUpperCase()}
            </text>
            <text x={500} y={424} fontSize={196} letterSpacing='0.02em' fill='var(--color-ea-page)'>
              {NAME.last.toUpperCase()}
            </text>
          </g>
        </svg>
      </div>
    </m.div>
  )
}







type NavLinkProps = { label: string; href: string; active?: boolean; step: number }

// The wordmark arrives first; each link follows by its distance from it, so the bar opens outward from the centre
const NavLink = ({ label, href, active = false, step }: NavLinkProps) => {
  // Hooks
  const { MOTION } = useElias()
  const reduceMotion = useReduce()
  const started = useIntroStarted()

  return (
    <m.li
      initial={{ opacity: 0, transform: 'translateY(8px)' }}
      animate={started ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
      transition={reveal(reduceMotion, MOTION.delays.nav + 0.15 + step * 0.08, 0.8)}
    >
      <a
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'ea-nav-link inline-flex min-h-10 items-center gap-2 font-medium uppercase',
          active ? 'text-ea-accent' : 'text-ea-ink'
        )}
      >
        {/* The label rolls up on hover to reveal a fresh copy of itself from below */}
        <span className='ea-roll'>
          <span>{label}</span>
          <span aria-hidden>{label}</span>
        </span>
      </a>
    </m.li>
  )
}

const HeroNavbar = () => {
  // Hooks
  const { BRAND, LABELS, MOTION, NAV_CTA, NAV_LINKS, NAV_STATUS } = useElias()
  const reduceMotion = useReduce()
  const started = useIntroStarted()

  // Vars
  const { left, right } = NAV_LINKS

  return (
    <header className='ea-wrap'>
      <nav aria-label={LABELS.nav} className='ea-nav'>
        <a
          href={BRAND.href}
          className='ea-nav-logo font-ea-display text-ea-accent overflow-y-clip leading-none font-black tracking-[-0.045em] uppercase'
        >
          <m.span
            className='block'
            initial={{ transform: 'translateY(105%)' }}
            animate={started ? { transform: 'translateY(0%)' } : undefined}
            transition={reveal(reduceMotion, MOTION.delays.nav, 0.9)}
          >
            {BRAND.name}
          </m.span>
        </a>

        <m.p
          className='ea-nav-status'
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : undefined}
          transition={reveal(reduceMotion, MOTION.delays.nav + 0.5, 0.8)}
        >
          <span aria-hidden className='ea-nav-status-dot' />
          {NAV_STATUS.label}
          <span aria-hidden className='text-ea-accent'>
            ·
          </span>
          <span className='text-ea-ink'>{NAV_STATUS.detail}</span>
        </m.p>

        <ul className='ea-nav-left'>
          {left.map((link, index) => (
            <NavLink key={link.label} {...link} step={left.length - 1 - index} />
          ))}
        </ul>

        <ul className='ea-nav-right'>
          {right.map((link, index) => (
            <NavLink key={link.label} {...link} step={index} />
          ))}
        </ul>

        <m.div
          className='ea-nav-cta'
          initial={{ opacity: 0, transform: 'translateY(8px)' }}
          animate={started ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
          transition={reveal(reduceMotion, MOTION.delays.nav + 0.15 + right.length * 0.08, 0.8)}
        >
          {NAV_CTA && <InkButton label={NAV_CTA.label} href={NAV_CTA.href} icon='up-right' />}
        </m.div>
      </nav>
    </header>
  )
}








/**
 * Each line is wiped in from the top as it settles, like a line being written onto the page. The wipe ends
 * past the line's edges so descenders and tracking are never cut once it has finished
 */
const WRITTEN = {
  hidden: { opacity: 0, transform: 'translateY(0.45em)', clipPath: 'inset(0% 0% 100% 0%)' },
  shown: { opacity: 1, transform: 'translateY(0em)', clipPath: 'inset(-20% -5% -35% -5%)' }
}

const AuthorIntro = () => {
  // Hooks
  const { INTRO, MOTION } = useElias()
  const reduceMotion = useReduce()
  const started = useIntroStarted()

  // Vars
  const start = MOTION.delays.intro

  return (
    <div className='ea-intro'>
      <m.p
        className='ea-intro-roles text-ea-ink font-medium uppercase'
        initial={WRITTEN.hidden}
        animate={started ? WRITTEN.shown : undefined}
        transition={reveal(reduceMotion, start, 0.9)}
      >
        {INTRO.roles.map((role, index) => (
          <Fragment key={role}>
            {index > 0 && (
              <span aria-hidden className='text-ea-accent'>
                /
              </span>
            )}
            <span>{role}</span>
          </Fragment>
        ))}
      </m.p>

      <p className='ea-intro-headline text-ea-ink font-medium'>
        {INTRO.headline.map((line, index) => (
          <m.span
            key={line}
            className='block'
            initial={WRITTEN.hidden}
            animate={started ? WRITTEN.shown : undefined}
            transition={reveal(reduceMotion, start + 0.1 + index * 0.09, 1)}
          >
            {line}
          </m.span>
        ))}
      </p>

      {/* The rule is drawn left to right with a pen-stroke ease once the heading has landed */}
      <m.hr
        className='ea-intro-rule bg-ea-accent origin-left border-0'
        initial={{ transform: 'scaleX(0)' }}
        animate={started ? { transform: 'scaleX(1)' } : undefined}
        transition={reveal(reduceMotion, start + 0.45, 0.9)}
      />

      <m.p
        className='ea-intro-description text-ea-muted font-light'
        initial={{ opacity: 0, transform: 'translateY(10px)' }}
        animate={started ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
        transition={reveal(reduceMotion, start + 0.55, 0.9)}
      >
        {INTRO.description}
      </m.p>
    </div>
  )
}








const SocialLinks = () => {
  // Hooks
  const { LABELS, MOTION, SOCIAL_LINKS } = useElias()
  const reduceMotion = useReduce()
  const started = useIntroStarted()

  // Vars
  const enter = (step: number) => reveal(reduceMotion, MOTION.delays.socials + step * 0.07, 0.8)

  return (
    <ul
      aria-label={LABELS.socials}
      className='ea-socials text-ea-ink flex items-center gap-2.5 text-[14px] lg:gap-2 lg:text-[13px]'
    >
      {SOCIAL_LINKS.map((link, index) => (
        <Fragment key={link.label}>
          {index > 0 && (
            <m.li
              aria-hidden
              className='text-ea-accent'
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 1 } : undefined}
              transition={enter(index * 2 - 1)}
            >
              /
            </m.li>
          )}
          <m.li
            initial={{ opacity: 0, transform: 'translateY(8px)' }}
            animate={started ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
            transition={enter(index * 2)}
          >
            <a href={link.href} target='_blank' rel='noopener noreferrer' className='ea-link inline-flex min-h-10 items-center'>
              {link.label}
            </a>
          </m.li>
        </Fragment>
      ))}
    </ul>
  )
}








type Stage = 'typing' | 'pressing' | 'sealing'


// Tomorrow's date as the postmark shows it, read when the envelope is drawn
const tomorrowLabel = (locale = 'en-US') => {
  const date = new Date()

  date.setDate(date.getDate() + 1)

  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

const pad = (value: number) => String(value).padStart(2, '0')

type EnvelopeProps = { date: string }

/**
 * The envelope from the back, built in code, and the sealing in four beats: the letter slides down into the
 * pocket, the flap swings shut over it, the orange wax seal is pressed, and the postmark for the day it opens
 * is stamped on the bottom fold
 */
const Envelope = ({ date }: EnvelopeProps) => {
  // Hooks
  const { LETTER } = useElias()
  const reduceMotion = useReduce()

  // Vars
  const timing = (delay: number, duration: number) =>
    reduceMotion ? { duration: 0 } : { delay, duration, ease: EASE }

  return (
    <span aria-hidden className='ea-envelope'>
      {/* The letter, behind the folds and in front of the envelope's back, so it disappears into the pocket */}
      <m.span
        className='ea-envelope-letter'
        initial={{ transform: 'translateY(-78%)' }}
        animate={{ transform: 'translateY(6%)' }}
        transition={timing(0.2, 1.05)}
      />
      <span className='ea-envelope-side ea-envelope-left' />
      <span className='ea-envelope-side ea-envelope-right' />
      <span className='ea-envelope-bottom' />
      <m.span
        className='ea-envelope-flap'
        initial={{ transform: 'rotateX(180deg)', opacity: 0 }}
        animate={{ transform: 'rotateX(0deg)', opacity: 1 }}
        transition={timing(1.2, 0.95)}
      >
        <span className='ea-envelope-flap-shape' />
      </m.span>
      <m.span
        className='ea-wax-seal font-ea-display'
        initial={{ transform: 'scale(2.2)', opacity: 0 }}
        animate={{ transform: 'scale(1)', opacity: 1 }}
        transition={timing(2.25, 0.55)}
      >
        {LETTER.seal}
      </m.span>
      <m.span
        className='ea-postmark'
        initial={{ transform: 'scale(1.7) rotate(-34deg)', opacity: 0 }}
        animate={{ transform: 'scale(1) rotate(-12deg)', opacity: 1 }}
        transition={timing(2.75, 0.55)}
      >
        <span>{LETTER.postmark}</span>
        <span className='ea-postmark-date'>{date}</span>
      </m.span>
    </span>
  )
}

/**
 * A letter to tomorrow that writes itself. Each promise is typed onto the sheet like a typewriter, the stamp
 * presses once it is finished, and the letter is packed into an envelope, sealed and postmarked for tomorrow;
 * then a fresh sheet arrives with the next promise. Under reduced motion the first letter simply rests, written.
 */
const TomorrowLetter = () => {
  // Context
  const { LABELS, LETTER, MOTION } = useElias()

  // States
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [stage, setStage] = useState< Stage >('typing')

  // Refs
  const waitedRef = useRef({ step: '', ms: 0 })

  // Hooks
  const reduceMotion = useReduce()
  const started = useIntroStarted()
  const onScreen = useHeroOnScreen()

  // Vars
  const timing = MOTION.letter
  const message = LETTER.messages[index] ?? ''
  const shown = reduceMotion ? message : message.slice(0, typed)
  const finished = shown.length === message.length
  const swap = reduceMotion ? { duration: 0 } : { duration: 0.75, ease: EASE }

  /**
   * One step of the loop at a time: the next character, the press, the sealing, then the next letter. Off screen
   * or in a hidden tab it holds, and waitedRef keeps how long the step had waited so it picks up with the rest
   */
  useEffect(() => {
    if (!started || reduceMotion || !onScreen) return

    let delay: number
    let step: () => void

    if (stage === 'typing' && typed < message.length) {
      const previous = message[typed - 1] ?? ''

      delay = timing.perCharacter + (/[,.]/.test(previous) ? timing.pauseAfterPunctuation : 0)
      step = () => setTyped(count => count + 1)
    } else if (stage === 'typing') {
      delay = timing.beforeSeal
      step = () => setStage('pressing')
    } else if (stage === 'pressing') {
      delay = timing.press
      step = () => setStage('sealing')
    } else {
      delay = timing.sealHold

      step = () => {
        setIndex(current => (current + 1) % LETTER.messages.length)
        setTyped(0)
        setStage('typing')
      }
    }

    const key = `${index}:${stage}:${typed}`
    const waited = waitedRef.current.step === key ? waitedRef.current.ms : 0
    const begun = performance.now() - waited
    const timer = window.setTimeout(step, Math.max(0, delay * 1000 - waited))

    return () => {
      waitedRef.current = { step: key, ms: performance.now() - begun }
      window.clearTimeout(timer)
    }
  }, [started, reduceMotion, onScreen, index, stage, typed, message, timing])

  return (
    <m.section
      aria-label={LETTER.eyebrow}
      className='ea-pad'
      initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
      animate={started ? { clipPath: 'inset(-10% -10% 0% -10%)' } : undefined}
      transition={reveal(reduceMotion, MOTION.delays.pad, 1.15)}
    >
      {/* Screen readers get the letter once, as text, instead of every typed character */}
      <p className='sr-only'>{`${LETTER.greeting} ${LETTER.messages[0]}`}</p>

      <div aria-hidden className='ea-pad-inner'>
        <AnimatePresence mode='wait' initial={false}>
          {stage !== 'sealing' ? (
            <m.div
              key={`sheet-${index}`}
              className='ea-letter-sheet'
              initial={{ opacity: 0, transform: 'translateY(28px) rotate(-1.4deg)' }}
              animate={{ opacity: 1, transform: 'translateY(0px) rotate(-1.4deg)' }}
              exit={{ opacity: 0, transform: 'translateY(40px) scale(0.94) rotate(-1.4deg)' }}
              transition={swap}
            >
              <p className='ea-letter-eyebrow'>{LETTER.eyebrow}</p>
              <span className={cn('ea-letter-stamp', finished && 'is-ready', stage === 'pressing' && 'is-pressed')}>
                {LETTER.stamp}
              </span>
              <p className='ea-letter-greeting'>{LETTER.greeting}</p>
              <p className='ea-letter-field ea-letter-read'>
                {shown}
                {stage === 'typing' && !reduceMotion && <span className='ea-letter-caret' />}
              </p>
              <p className='ea-letter-meta'>
                {LETTER.counter} {pad(index + 1)} / {pad(LETTER.messages.length)}
              </p>
            </m.div>
          ) : (
            <m.div
              key={`envelope-${index}`}
              className='ea-letter-envelope-view'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: '70%', rotate: 8 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.6, 0, 0.35, 1] }}
            >
              <p className='ea-letter-eyebrow'>
                {LETTER.sealing} · {tomorrowLabel(LABELS.dateLocale)}
              </p>
              <Envelope date={tomorrowLabel(LABELS.dateLocale)} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.section>
  )
}









// Each book's pastel cover illustration, by the art name its entry in BOOKS gives
const COVER_ART = { sunrise: AuthorCoverSunrise, lamp: AuthorCoverLamp, path: AuthorCoverPath, days: AuthorCoverDays }

const TURN_SPRING = { stiffness: 160, damping: 20, mass: 0.7 }

// Opening is slower and heavier than the hover turn, like a real cover swinging over
const OPEN_SPRING = { stiffness: 90, damping: 17, mass: 0.9 }

// How the book rests: turned a little so its orange spine shows, tipped back slightly as if standing on a shelf
const REST = { rotateY: -24, rotateX: 6 }

/**
 * The author's books, one at a time, each built in code as a real hardcover: cover, spine, page edges and back.
 * It turns toward a mouse and its cover lifts on hover. A click opens it where it stands: it turns to face the
 * reader, the cover swings over to the chapter and the first page shows its opening. A second click closes it,
 * and the book slides away as the next one arrives, round and round.
 */
const FeaturedBook = () => {
  // Context
  const { BOOK_CARD, BOOKS, LABELS, MOTION, NAME } = useElias()

  // States
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Set once the first swap happens: from then on a book arrives by sliding in, without the page-load entrance
  const [cycled, setCycled] = useState(false)

  // While the pointer is over the card the slideshow holds on the current book
  const [hovered, setHovered] = useState(false)

  // Refs
  const swapRef = useRef< number | null >(null)
  const shownRef = useRef< { index: number; ms: number } | null >(null)

  // Hooks
  const reduceMotion = useReduce()
  const started = useIntroStarted()
  const onScreen = useHeroOnScreen()
  const finePointer = useMediaQuery(MEDIA.finePointer)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const peek = useMotionValue(0)
  const openness = useMotionValue(0)
  const springX = useSpring(pointerX, TURN_SPRING)
  const springY = useSpring(pointerY, TURN_SPRING)
  const springPeek = useSpring(peek, TURN_SPRING)
  const springOpen = useSpring(openness, OPEN_SPRING)

  // Closed, the book rests at an angle and follows the cursor; open, it faces forward with only a slight sway
  const rotateY = useTransform(
    [springX, springOpen],
    ([x = 0, o = 0]: number[]) => (REST.rotateY + x * MOTION.bookTilt) * (1 - o) + x * 3 * o
  )

  const rotateX = useTransform(
    [springY, springOpen],
    ([y = 0, o = 0]: number[]) => (REST.rotateX - y * MOTION.bookTilt * 0.5) * (1 - o) - y * 2 * o
  )

  // Slides over by half its width as it opens, so the two-page spread sits centred in the card
  const shiftX = useTransform(springOpen, value => `${value * 50}%`)
  const scale = useTransform(springOpen, value => 1 + value * 0.2)
  const shadowScale = useTransform(springOpen, value => 1 + value * 1.1)

  const coverRotate = useTransform(
    [springPeek, springOpen],
    ([p = 0, o = 0]: number[]) => -Math.max(p * MOTION.bookOpen, o * 178)
  )

  // Vars
  const turnActive = finePointer && !reduceMotion
  const { delays } = MOTION
  const book = BOOKS[index] ?? BOOKS[0]!
  const CoverArt = COVER_ART[book.art as keyof typeof COVER_ART]

  // The cover's colours, handed to the book's CSS so one set of styles draws every cover
  const coverStyle = {
    rotateY,
    rotateX,
    x: shiftX,
    scale,
    '--ea-cover': book.colors.cover,
    '--ea-cover-type': book.colors.type,
    '--ea-spine': book.colors.spine
  } as MotionStyle

  const closeBook = () => {
    setOpen(false)
    openness.set(0)
  }

  // Escape closes the open book without moving on; the pending swap is cancelled if the card goes away
  useEffect(() => {
    if (!open) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBook()
    }

    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)
  })

  useEffect(() => {
    return () => {
      if (swapRef.current) window.clearTimeout(swapRef.current)
    }
  }, [])

  // Closed: opens the book. Open: closes it, and once the cover has shut the next book takes its place
  const handleClick = () => {
    peek.set(0)

    if (!open) {
      setOpen(true)

      if (reduceMotion) springOpen.jump(1)

      openness.set(1)

      return
    }

    closeBook()

    if (reduceMotion) springOpen.jump(0)

    swapRef.current = window.setTimeout(
      () => {
        setCycled(true)
        setIndex(current => (current + 1) % BOOKS.length)
      },
      reduceMotion ? 0 : 650
    )
  }

  /**
   * The books slide on by themselves, one every few seconds, unless the card is hovered or a book is open. Off
   * screen or in a hidden tab the wait holds, and shownRef keeps how long the book had been shown
   */
  useEffect(() => {
    if (!started || hovered || open || reduceMotion || !onScreen) return

    const shown = shownRef.current?.index === index ? shownRef.current.ms : 0
    const begun = performance.now() - shown

    const timer = window.setTimeout(
      () => {
        setCycled(true)
        setIndex(current => (current + 1) % BOOKS.length)
      },
      Math.max(0, MOTION.bookCycle * 1000 - shown)
    )

    return () => {
      shownRef.current = { index, ms: performance.now() - begun }
      window.clearTimeout(timer)
    }
  }, [started, hovered, open, reduceMotion, onScreen, index])

  // A hover or an open book starts the next wait from the beginning
  useEffect(() => {
    shownRef.current = null
  }, [hovered, open])

  const handlePointerEnter = () => {
    setHovered(true)

    if (turnActive && !open) peek.set(1)
  }

  const handlePointerMove = (event: ReactPointerEvent< HTMLButtonElement >) => {
    if (!turnActive) return

    const rect = event.currentTarget.getBoundingClientRect()

    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }

  const handlePointerLeave = () => {
    setHovered(false)
    pointerX.set(0)
    pointerY.set(0)
    peek.set(0)
  }

  return (
    <figure className='ea-book'>
      <m.button
        type='button'
        aria-expanded={open}
        className='ea-book-frame block w-full overflow-hidden'
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={started ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={reveal(reduceMotion, delays.book, 1.05)}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {/* Named by hidden text rather than aria-label: the cover's visible words are decorative and hidden from AT */}
        <span className='sr-only'>{`${open ? BOOK_CARD.close : BOOK_CARD.open} ${book.title}`}</span>
        <span aria-hidden className='ea-book-stage'>
          <m.span className='ea-book-shadow' style={{ scaleX: shadowScale }} />

          {/* A carousel: the book glides out to the left while the next glides in from the right, side by side */}
          <AnimatePresence initial={false}>
            <m.span
              key={index}
              className='ea-book-slot'
              initial={{ transform: 'translateX(100%)' }}
              animate={{ transform: 'translateX(0%)' }}
              exit={{ transform: 'translateX(-100%)' }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            >
              <m.span
                className='ea-book-3d'
                style={coverStyle}
                initial={cycled ? false : { y: '18%', opacity: 0 }}
                animate={started ? { y: '0%', opacity: 1 } : undefined}
                transition={reveal(reduceMotion, delays.book + 0.35, 1.1)}
              >
                <span className='ea-book-back' />
                <span className='ea-book-edge' />
                <span className='ea-book-spine'>
                  <span>{book.title}</span>
                </span>
                <span className='ea-book-page'>
                  <span className='ea-book-page-text'>{book.text}</span>
                  <span className='ea-book-folio'>{BOOK_CARD.folio}</span>
                </span>
                {/* The hinge holds the cover at the book's front face; the cover inside it swings over */}
                <span className='ea-book-hinge'>
                  <m.span className='ea-book-cover' style={{ rotateY: coverRotate }}>
                    <span className='ea-book-cover-front'>
                      <CoverArt className='ea-book-art' />
                      <span className='ea-book-title font-ea-display'>
                        {book.coverLines.map(line => (
                          <span key={line} className='block'>
                            {line}
                          </span>
                        ))}
                      </span>
                      <span className='ea-book-byline'>
                        <span>{`${NAME.first} ${NAME.last}`.trim()}</span>
                      </span>
                    </span>
                    {/* The inside of the cover, facing the reader once it has swung over: the chapter's opening */}
                    <span className='ea-book-cover-inside'>
                      <span className='ea-book-page-chapter'>{book.chapter}</span>
                      <span className='ea-book-inside-title font-ea-display'>{book.chapterTitle}</span>
                    </span>
                  </m.span>
                </span>
              </m.span>
            </m.span>
          </AnimatePresence>
        </span>
      </m.button>
      <p className='sr-only' aria-live='polite'>
        {open ? `${book.title}. ${book.chapter}: ${book.chapterTitle}. ${book.text}` : ''}
      </p>

      <figcaption className='ea-book-caption flex items-center gap-3'>
        <m.span
          className='ea-book-label text-ea-ink mr-auto text-[15px] font-medium whitespace-nowrap'
          initial={{ opacity: 0, transform: 'translateX(-12px)' }}
          animate={started ? { opacity: 1, transform: 'translateX(0px)' } : undefined}
          transition={reveal(reduceMotion, delays.book + 0.45, 0.8)}
        >
          <m.span
            key={index}
            className='block'
            initial={{ opacity: 0, transform: 'translateY(6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
          >
            {book.label}
          </m.span>
        </m.span>
        <m.span
          className='ea-book-topics text-ea-muted text-[13px] whitespace-nowrap'
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : undefined}
          transition={reveal(reduceMotion, delays.book + 0.6, 0.8)}
        >
          <m.span
            key={index}
            className='block'
            initial={{ opacity: 0, transform: 'translateY(6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
          >
            {book.topics.map((topic, position) => (
              <Fragment key={topic}>
                {position > 0 && (
                  <span aria-hidden className='text-ea-accent'>
                    {' / '}
                  </span>
                )}
                {topic}
              </Fragment>
            ))}
          </m.span>
        </m.span>
        <m.a
          href={book.href ?? BOOK_CARD.href}
          aria-label={`${LABELS.readAbout} ${book.title}`}
          className='ea-book-arrow relative shrink-0 rounded-full after:absolute after:-inset-2'
          initial={{ transform: 'scale(0) rotate(-90deg)' }}
          animate={started ? { transform: 'scale(1) rotate(0deg)' } : undefined}
          transition={reveal(reduceMotion, delays.book + 0.7, 0.7)}
        >
          {/* The same tilted arrow disc as the CONTACT button, swapping its arrow when the book is hovered */}
          <span className='ea-cta-mark ea-cta-diagonal'>
            <ArrowUpRightIcon aria-hidden className='ea-cta-arrow ea-cta-arrow-out' strokeWidth={2} />
            <ArrowUpRightIcon aria-hidden className='ea-cta-arrow ea-cta-arrow-in' strokeWidth={2} />
          </span>
        </m.a>
      </figcaption>
    </figure>
  )
}









// Slow and heavy, so the layers ease after the cursor instead of tracking it
const DEPTH_SPRING = { stiffness: 50, damping: 18, mass: 0.9 }

// Quick but soft, so the spotlight glides with the cursor rather than snapping to it
const SPOT_SPRING = { stiffness: 380, damping: 36, mass: 0.6 }

/**
 * Painted back to front: the giant name, the book and the letter to tomorrow, then the portrait. With a mouse, the portrait and
 * the name drift apart for depth, and an ink spotlight follows the cursor: inside it the name and portrait are
 * swapped for outlined type and an ink-and-orange duotone, like a light passed over a printer's proof.
 */
const HeroSection = () => {
  // Context
  const { BOOKS, BRAND, IMAGES, LETTER: letter, MOTION, NAME, NAV_CTA, NAV_LINKS, REDUCED, SHOW_SPLASH } = useElias()
  const hasNav = Boolean(BRAND.name || NAV_CTA || NAV_LINKS.left.length || NAV_LINKS.right.length)

  // States
  const [opened, setOpened] = useState(false)
  const [spotReady, setSpotReady] = useState(false)
  const [onScreen, setOnScreen] = useState(true)

  // Refs
  const sectionRef = useRef< HTMLElement >(null)
  const canvasRef = useRef< HTMLDivElement >(null)
  const spotOpenRef = useRef(false)

  // Hooks
  const reduceMotion = useReduce()
  const finePointer = useMediaQuery(MEDIA.finePointer)
  const composition = useMediaQuery(MEDIA.composition)
  const mediaReduced = useMediaQuery(MEDIA.reducedMotion)
  const prefersReduced = REDUCED ?? mediaReduced
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const depthX = useSpring(pointerX, DEPTH_SPRING)
  const depthY = useSpring(pointerY, DEPTH_SPRING)
  const firstX = useTransform(depthX, value => value * -MOTION.depth.first)
  const firstY = useTransform(depthY, value => value * -MOTION.depth.first * 0.4)
  const lastX = useTransform(depthX, value => value * -MOTION.depth.last)
  const lastY = useTransform(depthY, value => value * -MOTION.depth.last * 0.3)

  // The portrait moves sideways only, so its cut-off bottom edge never lifts off the hero's bottom edge
  const portraitX = useTransform(depthX, value => value * MOTION.depth.portrait)

  // The spotlight's centre and radius, in px within the composition, handed to the CSS masks as variables
  const spotX = useMotionValue(0)
  const spotY = useMotionValue(0)
  const spotRadius = useMotionValue(0)
  const spotCentreX = useSpring(spotX, SPOT_SPRING)
  const spotCentreY = useSpring(spotY, SPOT_SPRING)
  const spotXVar = useMotionTemplate`${spotCentreX}px`
  const spotYVar = useMotionTemplate`${spotCentreY}px`
  const spotRadiusVar = useMotionTemplate`${spotRadius}px`

  // Vars
  const { delays, spotlight } = MOTION
  const depthActive = finePointer && !reduceMotion
  const spotActive = depthActive && composition && spotReady

  // The entrance waits for the splash to open, or plays at once when the visitor asks for reduced motion
  const started = opened || prefersReduced || !SHOW_SPLASH

  // The custom cursor replaces the system one only with a mouse, and never under reduced motion
  const cursorActive = finePointer && !prefersReduced

  // CSS variables the layer masks read; Motion writes them without re-rendering, though its types omit them
  const spotStyle = { '--ea-spot-x': spotXVar, '--ea-spot-y': spotYVar, '--ea-spot-r': spotRadiusVar } as MotionStyle

  useEffect(() => {
    if (!started) return

    const timer = window.setTimeout(() => setSpotReady(true), spotlight.readyAfter * 1000)

    return () => window.clearTimeout(timer)
  }, [started, spotlight.readyAfter])

  // Tracks whether any of the hero is on screen while the tab is visible
  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    let visible = true

    const update = () => setOnScreen(visible && !document.hidden)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      update()
    })

    observer.observe(section)
    document.addEventListener('visibilitychange', update)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const handleSplashOpen = useCallback(() => setOpened(true), [])

  const handlePointerMove = (event: ReactPointerEvent< HTMLElement >) => {
    if (!depthActive) return

    pointerX.set((event.clientX / window.innerWidth) * 2 - 1)
    pointerY.set((event.clientY / window.innerHeight) * 2 - 1)

    if (!spotActive || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (!spotOpenRef.current) {
      spotOpenRef.current = true

      // Fully closed, it is placed under the cursor first so it opens there instead of gliding over
      if (spotRadius.get() < 1) {
        spotCentreX.jump(x)
        spotCentreY.jump(y)
      }

      animate(spotRadius, spotlight.radius, { duration: 0.6, ease: EASE })
    }

    spotX.set(x)
    spotY.set(y)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
    spotOpenRef.current = false
    animate(spotRadius, 0, { duration: 0.45, ease: EASE })
  }

  return (
    <section
      ref={sectionRef}
      id='top'
      aria-label={`${NAME.first} ${NAME.last}`}
      className={cn('ea-hero bg-ea-page text-ea-ink font-ea-sans relative', !hasNav && 'ea-hero--bare', cursorActive && 'ea-has-cursor')}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <AuthorInkFilters />
      {cursorActive && <InkCursor />}
      {SHOW_SPLASH && !prefersReduced && <InkSplash onOpen={handleSplashOpen} />}

      <IntroContext.Provider value={started}>
        {hasNav && <HeroNavbar />}

        <div className='ea-wrap ea-stage'>
          <m.div ref={canvasRef} className='ea-canvas' style={spotStyle}>
            <div className='ea-figure'>
              <div className='ea-layer ea-layer-name ea-layer-base'>
                <h1 className='ea-name font-ea-display font-black uppercase'>
                  <span className='sr-only'>{`${NAME.first} ${NAME.last}`}</span>

                  {/* ELIAS is set letter by letter from below; MONROE drops in from above, right to left */}
                  <m.span className='ea-name-first text-ea-accent' style={{ x: firstX, y: firstY }}>
                    <MaskedWord text={NAME.first} delay={delays.first} from='below' />
                  </m.span>
                  <m.span className='ea-name-last text-ea-ink' style={{ x: lastX, y: lastY }}>
                    <MaskedWord text={NAME.last} delay={delays.last} from='above' reverse />
                  </m.span>
                </h1>
              </div>

              {spotActive && (
                <div aria-hidden className='ea-layer ea-layer-name ea-layer-ink'>
                  <div className='ea-name font-ea-display font-black uppercase'>
                    <m.span className='ea-name-first ea-ink-first' style={{ x: firstX, y: firstY }}>
                      {NAME.first}
                    </m.span>
                    <m.span className='ea-name-last ea-ink-last' style={{ x: lastX, y: lastY }}>
                      {NAME.last}
                    </m.span>
                  </div>
                </div>
              )}

              <div className='ea-layer ea-layer-portrait ea-layer-base'>
                {/**
                 * Revealed from its bottom edge upward while settling from a slight scale anchored there. It stays fully
                 * opaque throughout, so the name never shows through it while it arrives
                 */}
                {IMAGES.portrait && (
                <m.img
                  src={IMAGES.portrait.src}
                  alt={IMAGES.portrait.alt}
                  width={IMAGES.portrait.width}
                  height={IMAGES.portrait.height}
                  fetchPriority='high'
                  decoding='async'
                  className='ea-portrait origin-bottom'
                  style={{ x: portraitX }}
                  initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 }}
                  animate={started ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 } : undefined}
                  transition={reveal(reduceMotion, delays.portrait, 1.3)}
                />
                )}
              </div>

              {spotActive && IMAGES.portrait && (
                <div aria-hidden className='ea-layer ea-layer-portrait ea-layer-ink'>
                  <m.img
                    src={IMAGES.portrait.src}
                    alt=''
                    width={IMAGES.portrait.width}
                    height={IMAGES.portrait.height}
                    decoding='async'
                    className='ea-portrait ea-ink-portrait'
                    style={{ x: portraitX }}
                  />
                </div>
              )}
            </div>

            <AuthorIntro />
            <OnScreenContext.Provider value={onScreen}>
              {letter.messages.length > 0 && <TomorrowLetter />}
              {BOOKS.length > 0 && <FeaturedBook />}
            </OnScreenContext.Provider>
            <SocialLinks />
          </m.div>
        </div>
      </IntroContext.Provider>
    </section>
  )
}


/* ----------------------------- Root ----------------------------- */

// Fills its container even inside a centring flex/grid host (the hero is a size container, so it has no intrinsic width)
const FILL = { width: '100%' } as const


const Elias = ({
  brand = { name: '', href: '#' },
  navLinks = { left: [], right: [] },
  navCta,
  navStatus = { label: '', detail: '' },
  name = { first: '', last: '' },
  intro = { roles: [], headline: [], description: '' },
  portrait,
  books = [],
  bookCard = { href: '#', open: 'Open', close: 'Close and show the next book', folio: '1' },
  letter,
  socialLinks = [],
  motion,
  splash,
  reducedMotion,
  showSplash = true,
  labels,
  className
}: EliasProps) => {
  const value: EliasContextValue = {
    BRAND: brand,
    NAV_LINKS: navLinks,
    NAV_CTA: navCta,
    NAV_STATUS: navStatus,
    NAME: name,
    INTRO: intro,
    IMAGES: { portrait },
    BOOKS: books,
    BOOK_CARD: bookCard,
    LETTER: letter ?? EMPTY_LETTER,
    SOCIAL_LINKS: socialLinks,
    MOTION: {
      ...DEFAULT_MOTION,
      ...motion,
      delays: { ...DEFAULT_MOTION.delays, ...motion?.delays },
      depth: { ...DEFAULT_MOTION.depth, ...motion?.depth },
      letter: { ...DEFAULT_MOTION.letter, ...motion?.letter },
      spotlight: { ...DEFAULT_MOTION.spotlight, ...motion?.spotlight },
      cursor: { ...DEFAULT_MOTION.cursor, ...motion?.cursor }
    },
    SPLASH: { ...DEFAULT_SPLASH, ...splash },
    REDUCED: reducedMotion,
    SHOW_SPLASH: showSplash,
    LABELS: { ...DEFAULT_LABELS, ...labels }
  }

  return (
    <EliasContext.Provider value={value}>
      <LazyMotion features={domAnimation}>
        <div data-slot='elias' className={cn('bg-ea-page', className)} style={FILL}>
          <HeroSection />
        </div>
      </LazyMotion>
    </EliasContext.Provider>
  )
}

export { Elias }
export default Elias


