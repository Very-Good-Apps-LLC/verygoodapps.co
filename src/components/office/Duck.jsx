import { useEffect, useId, useRef, useState } from 'react';

const asset = (name) => `/images/office/${name}.webp`;

export default function Duck({ evening }) {
  const clipId = useId();
  const [loaded, setLoaded] = useState({});
  const [failed, setFailed] = useState({});
  const [wobbling, setWobbling] = useState(false);
  const [greeting, setGreeting] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const ready = (name) => () => setLoaded((before) => ({ ...before, [name]: true }));
  const error = (name) => () => setFailed((before) => ({ ...before, [name]: true }));
  const duckReady =
    loaded.day && loaded.evening && loaded.duck && !failed.day && !failed.evening && !failed.duck;
  const greet = () => {
    if (wobbling) return;
    setWobbling(true);
    setGreeting('Hello from the duck.');
    timer.current = setTimeout(() => {
      setWobbling(false);
      setGreeting('');
    }, 1100);
  };

  return (
    <>
      <svg
        className="office-room-details"
        viewBox="0 0 1536 1024"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="742" y="112" width="67" height="65" rx="4" />
          </clipPath>
        </defs>
        <g style={{ visibility: duckReady ? 'visible' : 'hidden' }}>
          <g clipPath={`url(#${clipId})`}>
            <image
              href={asset('day-no-duck')}
              width="1536"
              height="1024"
              onLoad={ready('day')}
              onError={error('day')}
            />
            <image
              className="office-detail-evening"
              href={asset('evening-no-duck')}
              width="1536"
              height="1024"
              style={{ opacity: evening ? 1 : 0 }}
              onLoad={ready('evening')}
              onError={error('evening')}
            />
          </g>
          <g className={`office-duck-motion${wobbling ? ' is-wobbling' : ''}`}>
            <image
              className="office-duck-cutout"
              href={asset('duck')}
              x="742"
              y="110"
              width="68"
              height="62"
              onLoad={ready('duck')}
              onError={error('duck')}
            />
          </g>
        </g>
      </svg>
      {!failed.duck && !failed.day && !failed.evening && (
        <button
          type="button"
          className="office-hotspot office-duck"
          aria-label="Say hello to the little duck"
          aria-describedby="office-curiosity"
          aria-busy={wobbling}
          disabled={!duckReady}
          onClick={greet}
        >
          <span className="office-object-label office-object-label-hello" aria-hidden="true">
            <span>+</span> Hello
          </span>
        </button>
      )}
      <span className="office-sr" role="status">
        {greeting}
      </span>
      {wobbling && (
        <span className="office-duck-reduced-greeting" aria-hidden="true">
          Oh, hello.
        </span>
      )}
    </>
  );
}
