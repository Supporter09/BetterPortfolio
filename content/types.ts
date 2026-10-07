export type ClaimStatus = 'verified' | 'reported' | 'planned';
export type WorkStatus = 'pre-production' | 'in-production' | 'released';
export type SceneId = 'cold-open' | 'opening' | 'origin' | 'log' | 'pyvulds' | 'next-scene' | 'reel' | 'field-notes' | 'credits' | 'closing';
export type Tone = 'teal' | 'amber' | 'neutral';

export interface SceneMeta { id: SceneId; number: string; slate: string; title: string; grade: 'neutral' | 'teal' | 'amber' | 'mixed'; }
export interface Metric { value: string; numeric?: number; decimals?: number; suffix?: string; prefix?: string; label: string; scope: string; claim: ClaimStatus; odometer?: boolean; }
export interface MediaRef { kind: 'placeholder' | 'image' | 'video'; src?: string; poster?: string; alt: string; label: string; tone: Tone; aspect: string; }
export interface LinkItem { label: string; href: string; kind: 'engineering' | 'film'; external: boolean; placeholder?: boolean; }
export interface Contribution { text: string; media?: MediaRef; }
export interface Experience { id: string; kind: 'education' | 'work' | 'field' | 'research' | 'award'; org: string; orgShort: string; role: string; location: string; start: string; end?: string; status?: WorkStatus; summary: string; contributions: Contribution[]; stack?: string[]; metric?: Metric; href?: string; }
export interface PipelineStage { id: string; label: string; detail: string; optional?: boolean; }
export interface CaseStudy { problem: string; constraints: string[]; design: string[]; contribution: string[]; evidence: string[]; limitations: string[]; next: string[]; }
export interface ResearchEntry { slug: string; title: string; subtitle: string; kicker: string; summary: string; status: WorkStatus; featured: boolean; startedAt: string; takes: number; areas: string[]; pipeline: PipelineStage[]; metrics: Metric[]; findings?: { before: number; after: number; scope: string }; limitations: string[]; caseStudy: CaseStudy; media: MediaRef; }
export interface WorkEntry { slug: string; title: string; org: string; role: string; period: string; status?: WorkStatus; award?: string; summary: string; points: string[]; stack: string[]; metric?: Metric; caseStudy?: CaseStudy; media: MediaRef; }
export interface ArchiveEntry { title: string; role: string; year: string; summary: string; href?: string; }
export interface FilmEntry { id: string; frame: string; title: string; city: string; country: string; year: string; runtime?: string; url: string; placeholder: boolean; media: MediaRef; note?: string; }
export interface Credit { role: string; name: string; detail?: string; claim: ClaimStatus; evidence?: MediaRef; }
/** `summary` is a ≤ 4-word tag rendered under the title; `sprite` is a key of `SPRITES` (content/sprites.ts), a 16×16 icon. */
export interface DirectionCard { title: string; summary: string; status: 'pre-production'; sprite: string; }
/**
 * Pixel-art bitmap (content/sprites.ts). `frames[i]` is `h` rows of `w` chars; each char is a key
 * of `palette` (a CSS color) or `.` for transparent. All frames of one sprite share `w`×`h`.
 */
export interface Sprite { name: string; w: number; h: number; palette: Record<string, string>; frames: string[][]; }
