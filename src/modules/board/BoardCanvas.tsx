import { useEffect, useRef, useState } from "react";

import type { BoardManifest, BoardScreen } from "./board-screens";
import { boardManifest } from "./board-screens";
import { useCanvasPanZoom } from "./use-canvas-pan-zoom";

import "./board-canvas.css";

interface BoardCanvasProps {
  manifest?: BoardManifest;
}

interface TileProps {
  screen: BoardScreen;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Pre-mount margin in pixels around viewport (intersection rootMargin).
const PREMOUNT_MARGIN = "400px";

// Persisted view state key. Bump version when state shape changes.
const VIEW_STORAGE_KEY = "cp-board-view-v1";

interface PersistedView {
  x: number;
  y: number;
  scale: number;
}

function readPersistedView(): PersistedView | null {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedView;
    if (
      typeof parsed.x !== "number" ||
      typeof parsed.y !== "number" ||
      typeof parsed.scale !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writePersistedView(view: PersistedView) {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(view));
  } catch {
    /* quota or disabled — ignore */
  }
}

/**
 * Single tile. Mounts iframe the first time it intersects the viewport and
 * keeps it mounted indefinitely — pans back never trigger a re-render or
 * re-fetch. Trade-off: memory grows as the user explores; reload to reset.
 */
function Tile({ screen, x, y, width, height }: TileProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const label = screen.step ? `${screen.step}. ${screen.title}` : screen.title;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: PREMOUNT_MARGIN, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="cp-board__tile"
      data-bounds
      style={{ left: x, top: y, width }}
    >
      <div className="cp-board__tile-label">{label}</div>
      {hasBeenVisible ? (
        <iframe
          title={label}
          src={`/#preview/${screen.slug}`}
          width={width}
          height={height}
          className="cp-board__iframe"
          loading="lazy"
        />
      ) : (
        <div
          className="cp-board__iframe cp-board__placeholder"
          style={{ width, height }}
          aria-hidden="true"
        >
          <span className="cp-board__placeholder-label">{label}</span>
        </div>
      )}
    </div>
  );
}

/**
 * BoardCanvas — pan/zoom design board.
 *
 * - Tiles render real screens via iframes pointing to `/#preview/{slug}`.
 * - Each tile is sticky-mounted: once visible, it stays mounted, so panning
 *   back is instant with no re-render.
 * - Pan/zoom state is persisted to localStorage so reloads keep view.
 * - On first ever load (no saved state), defaults to fit-all.
 */
export function BoardCanvas({ manifest = boardManifest }: BoardCanvasProps) {
  const persisted = useRef<PersistedView | null>(readPersistedView());
  const { boardRef, worldRef, state, fit, zoomBy, resetZoom, setView } = useCanvasPanZoom({
    initial: persisted.current ?? undefined,
  });

  const { tile, sections } = manifest;

  // First mount: if no persisted view, run fit() once layout settles.
  useEffect(() => {
    if (persisted.current) return;
    const id = window.setTimeout(() => fit(), 200);
    return () => window.clearTimeout(id);
  }, [fit]);

  // Persist view (debounced) on every change.
  useEffect(() => {
    const id = window.setTimeout(() => {
      writePersistedView({ x: state.x, y: state.y, scale: state.scale });
    }, 200);
    return () => window.clearTimeout(id);
  }, [state.x, state.y, state.scale]);

  return (
    <div ref={boardRef} className="cp-board" data-theme="dark">
      <div
        ref={worldRef}
        className="cp-board__world"
        style={{
          transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
        }}
      >
        {sections.map((section) => (
          <div key={section.title}>
            <div
              className="cp-board__section-label"
              style={{ left: section.x, top: section.y - 32 }}
            >
              {section.title}
            </div>
            {section.screens.map((screen, i) => (
              <Tile
                key={screen.slug}
                screen={screen}
                x={section.x + i * (tile.width + tile.gap)}
                y={section.y + 40}
                width={tile.width}
                height={tile.height}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="cp-board__hint">
        arraste para mover · ⌘/ctrl + scroll para zoom · espaço + arraste para pan
      </div>

      <div className="cp-board__chrome" data-no-pan>
        <button onClick={() => zoomBy(1 / 1.2)} aria-label="Diminuir zoom">
          −
        </button>
        <button onClick={resetZoom} className="cp-board__chrome-zoom">
          {Math.round(state.scale * 100)}%
        </button>
        <button onClick={() => zoomBy(1.2)} aria-label="Aumentar zoom">
          +
        </button>
        <span className="cp-board__chrome-sep" />
        <button onClick={() => fit()} aria-label="Enquadrar">
          ⤢
        </button>
        <button
          onClick={() => {
            try {
              localStorage.removeItem(VIEW_STORAGE_KEY);
            } catch {
              /* ignore */
            }
            setView({ x: 0, y: 0, scale: 1 });
            window.setTimeout(() => fit(), 50);
          }}
          aria-label="Reset view"
          title="Limpar view salva"
        >
          ⟲
        </button>
      </div>
    </div>
  );
}
