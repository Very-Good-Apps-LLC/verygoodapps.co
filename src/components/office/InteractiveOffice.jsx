import { useRef, useState } from 'react';
import Duck from './Duck';
import DrawingDialog from './DrawingDialog';
import { KeepTogether } from '../Text';

export default function InteractiveOffice() {
  const [evening, setEvening] = useState(false);
  const [lightingStatus, setLightingStatus] = useState('loading');
  const [drawingOpen, setDrawingOpen] = useState(false);
  const computer = useRef(null);

  return (
    <div className="office-scene">
      <figure>
        <div className="office-picture" data-evening={evening}>
          <img
            src="/images/office/day.webp"
            width="1536"
            height="1024"
            fetchPriority="high"
            alt={`An imagined miniature software studio with two workstations, plants, and ${evening ? 'warm lamplight at dusk' : 'warm afternoon light'}, built as a roofless dollhouse on a wooden base.`}
          />
          <img
            className="office-evening"
            src="/images/office/evening.webp"
            alt=""
            width="1536"
            height="1024"
            decoding="async"
            onLoad={() => setLightingStatus('ready')}
            onError={() => {
              setLightingStatus('failed');
              setEvening(false);
            }}
          />
          <Duck evening={evening} />
          {lightingStatus !== 'failed' &&
            ['left', 'right'].map((side) => (
              <button
                key={side}
                type="button"
                className={`office-lamp office-lamp-${side}`}
                role="switch"
                aria-label={`${side === 'left' ? 'Left' : 'Right'} desk lamp: evening light`}
                aria-describedby="office-curiosity"
                aria-checked={evening}
                disabled={lightingStatus !== 'ready'}
                onClick={() => setEvening((value) => !value)}
              >
                {side === 'left' && (
                  <span
                    className="office-object-label office-object-label-light"
                    aria-hidden="true"
                  >
                    <span>+</span> Light
                  </span>
                )}
              </button>
            ))}
          <button
            type="button"
            ref={computer}
            className="office-hotspot office-computer"
            aria-label="Draw on the computer"
            aria-haspopup="dialog"
            aria-describedby="office-curiosity"
            onClick={() => setDrawingOpen(true)}
          >
            <span className="office-object-label office-object-label-draw" aria-hidden="true">
              <span>+</span> Draw
            </span>
          </button>
        </div>
        <div className="office-invitation" id="office-curiosity">
          <strong>Explore the office.</strong>
        </div>
        <figcaption>
          <div>
            <span>
              <KeepTogether>FIG. 01</KeepTogether> · THE OFFICE,{' '}
              <KeepTogether>IN SPIRIT.</KeepTogether>
            </span>
            <p>
              An imagined office, <KeepTogether>in miniature.</KeepTogether>
            </p>
          </div>
        </figcaption>
      </figure>
      <DrawingDialog
        open={drawingOpen}
        triggerRef={computer}
        onClose={() => setDrawingOpen(false)}
      />
    </div>
  );
}
