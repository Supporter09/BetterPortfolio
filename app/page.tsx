import { ColdOpenScene } from '@/components/scenes/cold-open';
import { OpeningScene } from '@/components/scenes/opening';
import { OriginScene } from '@/components/scenes/origin';
import { LogScene } from '@/components/scenes/log';
import { PyvuldsScene } from '@/components/scenes/pyvulds';
import { NextSceneScene } from '@/components/scenes/next-scene';
import { ReelScene } from '@/components/scenes/reel';
import { FieldNotesScene } from '@/components/scenes/field-notes';
import { CreditsScene } from '@/components/scenes/credits';
import { ClosingScene } from '@/components/scenes/closing';

/** "/" — the film: 10 scenes in `SCENES` order (00 cold-open … 09 closing; round 2 §5). */
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ColdOpenScene />
      <OpeningScene />
      <OriginScene />
      <LogScene />
      <PyvuldsScene />
      <NextSceneScene />
      <ReelScene />
      <FieldNotesScene />
      <CreditsScene />
      <ClosingScene />
    </main>
  );
}
