import type { Sprite } from './types';

/**
 * Pixel-art bitmaps for the hero universe (round 2 §3) and the direction cards.
 *
 * FORMAT — each sprite is `{ name, w, h, palette, frames }`:
 *   - `frames[i]` is an array of exactly `h` strings, each exactly `w` characters wide.
 *   - Every character is a key of `palette` (any CSS color) or `.` for a transparent pixel.
 *   - All frames of one sprite share `w`×`h`, so a crossfade between frames reads as a pose change.
 *   - Rendered 1 char → 1 `<rect>` by `components/ui/pixel-sprite.tsx` (crisp edges, `scale` prop),
 *     so there is no PNG to export: edit the rows below and the site picks it up.
 *
 * REPLACING WITH YOUR OWN ART — draw in any pixel editor (Aseprite, Piskel, Lospec), export as text /
 * read the pixels off the canvas, then paste the rows here keeping `w`/`h` and one char per color.
 * Rules of thumb that keep the set coherent: 1px outline (`o`, #1a1a1c), 3–5 flat colors per sprite,
 * no anti-aliasing, silhouettes that still read at 4× scale. Direction icons are 16×16 and use the
 * light `ink` as line color because they sit on the dark page.
 *
 * Shared palette keys (used where relevant):
 *   o outline · s skin · h hair · t shirt (dark teal) · a accent teal · l light teal · p trousers
 *   d dark grey · g grey · k keyboard · w white · m amber · i ink (light) · e eye · n nose
 */

const OUTLINE = '#1a1a1c';
const TEAL = '#5bc8c0';
const TEAL_LIGHT = '#9fe3dd';
const AMBER = '#f2a65a';
const INK = '#f2eee8';

/** Minh — 24×32, six poses: sit · stand-gaze · think · curious · work · research. */
const self: Sprite = {
  name: 'self',
  w: 24,
  h: 32,
  palette: {
    o: OUTLINE,
    s: '#e8c39e',
    h: '#1f1a17',
    t: '#2f3b3a',
    a: TEAL,
    p: '#23282c',
    d: '#3a3f44',
    g: '#8a8f94',
  },
  frames: [
    // 0 · sit — cross-legged on the floor, hands on knees.
    [
      '........................',
      '........................',
      '........................',
      '........................',
      '........................',
      '........................',
      '........oooooooo........',
      '.......ohhhhhhhho.......',
      '......ohhhhhhhhhho......',
      '......ohhhhhhhhhho......',
      '......ohhsssssshho......',
      '......ohssssssssho......',
      '......ossossssosso......',
      '......osssssssssso......',
      '.......ossssssssso......',
      '.........osssso.........',
      '....oooooossssoooooo....',
      '....otttttassattttto....',
      '....otttttttaattttto....',
      '....ottottttttttotto....',
      '....ottottttttttotto....',
      '....ottottttttttotto....',
      '....ossottttttttosso....',
      '....ossottttttttosso....',
      '...ooopppppppppppppooo..',
      '..oppppoppppppppoppppo..',
      '..opppppoppppppopppppo..',
      '..oddppppoppppoppppddo..',
      '..odddppppppppppppdddo..',
      '..odddppppppppppppdddo..',
      '..oooddppppppppppddooo..',
      '.....oooooooooooooo.....',
    ],
    // 1 · stand-gaze — standing, right hand shielding the eyes, looking far right.
    [
      '........oooooooo........',
      '.......ohhhhhhhho.......',
      '......ohhhhhhhhhho......',
      '......ohhhhhhhhhho......',
      '......ohhsssssshho......',
      '......ohsssssssshoooooo.',
      '......osssossssososssso.',
      '......ossssssssssosssso.',
      '.......ossssssssoossooo.',
      '.........osssso..osso...',
      '....oooooossssoooosso...',
      '....otttttassattttto....',
      '....otttttttaattttto....',
      '....otttttttttttttto....',
      '....ottottttttttoooo....',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ossottttttttto......',
      '....ossottttttttto......',
      '....oooottttttttto......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......opppoopppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '......odddo..odddo......',
      '......odddo..odddo......',
      '......ooooo..ooooo......',
    ],
    // 2 · think — left hand on the chin, eyes up, three accent dots drifting away.
    [
      '........oooooooo......a.',
      '.......ohhhhhhhho.......',
      '......ohhhhhhhhhho...a..',
      '......ohhhhhhhhhho......',
      '......ohhsssssshho.a....',
      '......ohsossssosho......',
      '......osssssssssso......',
      '....ooosssssssssso......',
      '....ossossssssssso......',
      '....osso.osssso.........',
      '....ossooossssoooooo....',
      '....otttttassattttto....',
      '....otttttttaattttto....',
      '....otttttttttttttto....',
      '....oooottttttttotto....',
      '.......ottttttttotto....',
      '.......ottttttttotto....',
      '.......ottttttttotto....',
      '.......ottttttttosso....',
      '.......ottttttttosso....',
      '.......ottttttttoooo....',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......opppoopppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '......odddo..odddo......',
      '......odddo..odddo......',
      '......ooooo..ooooo......',
    ],
    // 3 · curious — head leaning right, wide eyes, right arm pointing out of frame.
    [
      '.........oooooooo.......',
      '........ohhhhhhhho......',
      '.......ohhhhhhhhhho.....',
      '.......ohhhhhhhhhho.....',
      '.......ohhsssssshho.....',
      '.......ohssssssssho.....',
      '.......ossossssosso.....',
      '.......ossossssosso.....',
      '........osssssssso......',
      '.........osssso.........',
      '....oooooossssoooooo....',
      '....otttttassatttttooooo',
      '....otttttttaatttttttsso',
      '....ottttttttttttttttsso',
      '....ottottttttttoooooooo',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ossottttttttto......',
      '....ossottttttttto......',
      '....oooottttttttto......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......opppoopppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '......odddo..odddo......',
      '......odddo..odddo......',
      '......ooooo..ooooo......',
    ],
    // 4 · work — sitting, laptop on the lap (lid toward the viewer, teal glow on its edge), eyes down.
    [
      '........................',
      '........................',
      '........................',
      '........................',
      '........................',
      '........................',
      '........oooooooo........',
      '.......ohhhhhhhho.......',
      '......ohhhhhhhhhho......',
      '......ohhhhhhhhhho......',
      '......ohhsssssshho......',
      '......ohssssssssho......',
      '......osssssssssso......',
      '......ossossssosso......',
      '.......ossssssssso......',
      '.........osssso.........',
      '....oooooossssoooooo....',
      '....otttttassattttto....',
      '....ottoaaaaaaaaotto....',
      '....ottoggggggggotto....',
      '....ottoggggggggotto....',
      '....ottogggaagggotto....',
      '....ossogggaagggosso....',
      '....ossoggggggggosso....',
      '.....oooooooooooooo.....',
      '....oggggggggggggggo....',
      '..oppppoppppppppoppppo..',
      '..oddppppoppppoppppddo..',
      '..odddppppppppppppdddo..',
      '..odddppppppppppppdddo..',
      '..oooddppppppppppddooo..',
      '.....oooooooooooooo.....',
    ],
    // 5 · research — standing, magnifying glass raised in the right hand, eyes on the lens.
    [
      '........oooooooo........',
      '.......ohhhhhhhho.......',
      '......ohhhhhhhhhho..ooo.',
      '......ohhhhhhhhhho.oaaao',
      '......ohhsssssshho.oaaao',
      '......ohssssssssho.oaaao',
      '......osssossssoso..ooo.',
      '......osssssssssso.ooo..',
      '.......osssssssso.osso..',
      '.........osssso...osso..',
      '....oooooossssoooosso...',
      '....otttttassattttto....',
      '....otttttttaattttto....',
      '....otttttttttttttto....',
      '....ottottttttttoooo....',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ottottttttttto......',
      '....ossottttttttto......',
      '....ossottttttttto......',
      '....oooottttttttto......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......oppppppppo.......',
      '.......opppoopppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '.......oppo..oppo.......',
      '......odddo..odddo......',
      '......odddo..odddo......',
      '......ooooo..ooooo......',
    ],
  ],
};

/** Gạo the cat — 16×14, sitting, white with grey patches, tail curled in. */
const gao: Sprite = {
  name: 'gao',
  w: 16,
  h: 14,
  palette: { o: OUTLINE, w: '#f2f2f0', g: '#a9adb3', e: TEAL, n: '#e8a0a0' },
  frames: [
    [
      '.o.....o........',
      '.owo..owo.......',
      '.owwooowwo......',
      '.owwgggwwo......',
      '.owewwwewo......',
      '.owwwnwwwo......',
      '.owwowowwo......',
      '..owwwwwo.......',
      '.owwwwwwwwo.....',
      '.owwggwwwwo..oo.',
      '.owwggwwwwo.ogo.',
      '.owwwwwwwwoogo..',
      '.owwwwwwwwwggo..',
      '.oowwoowwooooo..',
    ],
  ],
};

/** MacBook Air — 24×16, open, facing the viewer, teal screen. */
const macbook: Sprite = {
  name: 'macbook',
  w: 24,
  h: 16,
  palette: { o: OUTLINE, d: '#2a2d31', a: TEAL, l: TEAL_LIGHT, g: '#b8bcc2', k: '#3a3f44' },
  frames: [
    [
      '....oooooooooooooooo....',
      '...oddddddddddddddddo...',
      '...odallaaaaaaaaaaado...',
      '...odalaaaaaaaaaaaado...',
      '...odaaaaaaaaaaaaaado...',
      '...odaaaaaaaaaaaaaado...',
      '...odaaaaaaaaaaaaaado...',
      '...odaaaaaaaaaaaaaado...',
      '...odaaaaaaaaaaaaaado...',
      '...oddddddddddddddddo...',
      '.oooooooooooooooooooooo.',
      '.ogkkkkkkkkkkkkkkkkkkgo.',
      '.oggggggggkkkkggggggggo.',
      '.oggggggggkkkkggggggggo.',
      '.oggggggggggggggggggggo.',
      '.oooooooooooooooooooooo.',
    ],
  ],
};

/** Osmo Pocket — 10×18, gimbal camera head on a slim handle with a tiny screen. */
const osmo: Sprite = {
  name: 'osmo',
  w: 10,
  h: 18,
  palette: { o: OUTLINE, d: '#2a2d31', g: '#6b7076', a: TEAL, l: TEAL_LIGHT },
  frames: [
    [
      '...oooo...',
      '.oddddddo.',
      '.odoooodo.',
      '.odolaodo.',
      '.odoaaodo.',
      '.odoooodo.',
      '.oddddddo.',
      '..oddddo..',
      '...oddo...',
      '..oddddo..',
      '..odaado..',
      '..odaado..',
      '..oddddo..',
      '..odgddo..',
      '..oddddo..',
      '..oddddo..',
      '..oddddo..',
      '..oooooo..',
    ],
  ],
};

/** Star — 5×5, two frames (bright · dim) for a slow twinkle. */
const star: Sprite = {
  name: 'star',
  w: 5,
  h: 5,
  palette: { a: TEAL, l: TEAL_LIGHT },
  frames: [
    ['..a..', '..a..', 'aalaa', '..a..', '..a..'],
    ['.....', '..a..', '.ala.', '..a..', '.....'],
  ],
};

/** Direction icons — 16×16, ink lines + teal + one amber accent, drawn for the dark page. */
const dirShieldNet: Sprite = {
  name: 'dir-shield-net',
  w: 16,
  h: 16,
  palette: { i: INK, t: TEAL, m: AMBER },
  frames: [
    [
      '....iiiiiiii....',
      '..ii........ii..',
      '.i............i.',
      '.i..t..t..t...i.',
      '.i.tmttmttmtt.i.',
      '.i..t..t..t...i.',
      '.i..t..t..t...i.',
      '.i.tmttmttmtt.i.',
      '.i..t..t..t...i.',
      '.i..t..t..t...i.',
      '..i.mttmttmt.i..',
      '..i.t..t..t..i..',
      '...ittttttttti..',
      '....i......i....',
      '.....ii..ii.....',
      '.......ii.......',
    ],
  ],
};

const dirFuzz: Sprite = {
  name: 'dir-fuzz',
  w: 16,
  h: 16,
  palette: { i: INK, t: TEAL, m: AMBER },
  frames: [
    [
      '................',
      '..m.....m.......',
      '.....m........m.',
      '..iiiiiiiiiiii..',
      '..i..........i..',
      '..i.tttt.tt..i..',
      '..i..........i..',
      '..i.ttttttmt.i..',
      '..i.tmttttt..i..',
      '..i.tttmtttt.i..',
      '..i..........i..',
      '..i.ttt......i..',
      '..iiiiiiiiiiii..',
      '................',
      '.m......m....m..',
      '....m......m....',
    ],
  ],
};

const dirAgent: Sprite = {
  name: 'dir-agent',
  w: 16,
  h: 16,
  palette: { i: INK, t: TEAL, m: AMBER },
  frames: [
    [
      '.......m........',
      '.......i........',
      '...iiiiiiiiii...',
      '...i........i...',
      '...i.tt..tt.i...',
      '.....i.tt..tt.im',
      'mm...i........i.',
      '...i.iiiiii.i...',
      '...i........i...',
      '...iiiiiiiiii...',
      '......i..i......',
      '..iiiiiiiiiiii..',
      '..i..........i..',
      '..i....tt....i..',
      '..i..........i..',
      '..iiiiiiiiiiii..',
    ],
  ],
};

const dirVerify: Sprite = {
  name: 'dir-verify',
  w: 16,
  h: 16,
  palette: { i: INK, t: TEAL, m: AMBER },
  frames: [
    [
      '.iiiiiiiiii.....',
      '.i........i.....',
      '.i.tttttt.i.....',
      '.i........i.....',
      '.i.tttt...i.....',
      '.i........i.....',
      '.i.ttttt..i.....',
      '.i.......iiiii..',
      '.i......i.....i.',
      '.i.....i.......i',
      '.iiiiiii.....m.i',
      '.......i....m..i',
      '.......i.m.m...i',
      '.......i..m....i',
      '........i.....i.',
      '.........iiiii..',
    ],
  ],
};

/** Frame order of `SPRITES.self`, for callers that want a named pose. */
export const SELF_POSES = ['sit', 'stand-gaze', 'think', 'curious', 'work', 'research'] as const;
export type SelfPose = (typeof SELF_POSES)[number];

export const SPRITES: Record<string, Sprite> = {
  self,
  gao,
  macbook,
  osmo,
  star,
  'dir-shield-net': dirShieldNet,
  'dir-fuzz': dirFuzz,
  'dir-agent': dirAgent,
  'dir-verify': dirVerify,
};
