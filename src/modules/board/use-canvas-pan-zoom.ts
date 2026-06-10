import { useCallback, useEffect, useRef, useState } from "react";

interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 4;
const clamp = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

function normDelta(e: WheelEvent): number {
  let d = e.deltaY;
  if (e.deltaMode === 1) d *= 16;
  else if (e.deltaMode === 2) d *= 100;
  return d;
}

interface PanZoomOptions {
  initial?: Partial<PanZoomState>;
}

/**
 * Self-contained pan/zoom motor.
 * - Wheel without modifier: pan (Figma-style 2-finger trackpad).
 * - Wheel + ctrl/meta: zoom toward cursor.
 * - Pointer drag on background (or space+drag anywhere): pan.
 * - Works over iframes via per-frame listener attachment.
 */
export function useCanvasPanZoom(options?: PanZoomOptions) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<PanZoomState>({
    x: options?.initial?.x ?? 0,
    y: options?.initial?.y ?? 0,
    scale: options?.initial?.scale ?? 1,
  });
  const stateRef = useRef<PanZoomState>(state);
  stateRef.current = state;

  const spaceDownRef = useRef(false);
  const dragRef = useRef<{ x: number; y: number; sx: number; sy: number } | null>(null);

  const apply = useCallback((next: PanZoomState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  /**
   * Zoom toward a board-local point (px, py) to `nextScale`.
   * Math mirrors cureplus board engine: px - (px - state.x) * k.
   */
  const zoomToLocal = useCallback((px: number, py: number, nextScale: number) => {
    const prev = stateRef.current;
    const next = clamp(nextScale);
    if (next === prev.scale) return;
    const k = next / prev.scale;
    apply({
      scale: next,
      x: px - (px - prev.x) * k,
      y: py - (py - prev.y) * k,
    });
  }, [apply]);

  /**
   * Zoom toward a page-coord (clientX, clientY). Converts to board-local.
   */
  const zoomAt = useCallback((clientX: number, clientY: number, nextScale: number) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    zoomToLocal(clientX - rect.left, clientY - rect.top, nextScale);
  }, [zoomToLocal]);

  const zoomBy = useCallback((factor: number) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    zoomToLocal(rect.width / 2, rect.height / 2, stateRef.current.scale * factor);
  }, [zoomToLocal]);

  const resetZoom = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    zoomToLocal(rect.width / 2, rect.height / 2, 1);
  }, [zoomToLocal]);

  const fit = useCallback((padding = 80) => {
    const board = boardRef.current;
    const world = worldRef.current;
    if (!board || !world) return;
    const positioned = world.querySelectorAll<HTMLElement>("[data-bounds]");
    if (positioned.length === 0) return;
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const el of positioned) {
      const l = el.offsetLeft;
      const t = el.offsetTop;
      const r = l + el.offsetWidth;
      const b = t + el.offsetHeight;
      if (l < left) left = l;
      if (t < top) top = t;
      if (r > right) right = r;
      if (b > bottom) bottom = b;
    }
    const w = right - left;
    const h = bottom - top;
    const rect = board.getBoundingClientRect();
    const scaleX = (rect.width - padding * 2) / w;
    const scaleY = (rect.height - padding * 2) / h;
    const scale = clamp(Math.min(scaleX, scaleY));
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const wx = left + w / 2;
    const wy = top + h / 2;
    apply({ scale, x: cx - wx * scale, y: cy - wy * scale });
  }, [apply]);

  // Pan by deltaX/deltaY (board-coord pixels).
  const panBy = useCallback((dx: number, dy: number) => {
    const prev = stateRef.current;
    apply({ ...prev, x: prev.x - dx, y: prev.y - dy });
  }, [apply]);

  // Stable handlers (read from refs, so listeners never need re-attach).
  // Pan delta stays in screen pixels — wheel deltaX/deltaY are already in
  // screen px for trackpads (deltaMode 0), regardless of iframe context.
  const handleWheel = useCallback((e: WheelEvent, clientX: number, clientY: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      const d = Math.max(-40, Math.min(40, normDelta(e)));
      zoomAt(clientX, clientY, stateRef.current.scale * Math.exp(-d * 0.016));
    } else {
      panBy(e.deltaX, e.deltaY);
    }
  }, [panBy, zoomAt]);

  useEffect(() => {
    const board = boardRef.current;
    const world = worldRef.current;
    if (!board || !world) return;

    const setCapturing = (on: boolean) => board.classList.toggle("is-capturing", on);

    const onBoardWheel = (e: WheelEvent) => {
      handleWheel(e, e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("button, a, input, iframe, [data-no-pan]");
      if (isInteractive && !spaceDownRef.current) return;
      board.setPointerCapture(e.pointerId);
      board.classList.add("is-grabbing");
      const s = stateRef.current;
      dragRef.current = { x: e.clientX, y: e.clientY, sx: s.x, sy: s.y };
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      apply({
        ...stateRef.current,
        x: d.sx + (e.clientX - d.x),
        y: d.sy + (e.clientY - d.y),
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (board.hasPointerCapture(e.pointerId)) board.releasePointerCapture(e.pointerId);
      board.classList.remove("is-grabbing");
      dragRef.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceDownRef.current = true;
        setCapturing(true);
      }
      if (e.ctrlKey || e.metaKey) setCapturing(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceDownRef.current = false;
      if (!spaceDownRef.current && !e.ctrlKey && !e.metaKey) setCapturing(false);
    };
    const onBlur = () => {
      spaceDownRef.current = false;
      setCapturing(false);
    };

    // Per-iframe handlers (translate iframe-local coords to page coords).
    const attached = new WeakSet<HTMLIFrameElement>();
    const attachIframe = (iframe: HTMLIFrameElement) => {
      if (attached.has(iframe)) return;
      const onIframeWheel = (e: WheelEvent) => {
        // Only intercept zoom (cmd/ctrl + wheel). Plain wheel scrolls iframe
        // natively, so user can scroll content inside a tile.
        if (!(e.ctrlKey || e.metaKey)) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = iframe.getBoundingClientRect();
        const ratioX = iframe.clientWidth ? rect.width / iframe.clientWidth : 1;
        const ratioY = iframe.clientHeight ? rect.height / iframe.clientHeight : 1;
        const cx = rect.left + e.clientX * ratioX;
        const cy = rect.top + e.clientY * ratioY;
        const d = Math.max(-40, Math.min(40, normDelta(e)));
        zoomAt(cx, cy, stateRef.current.scale * Math.exp(-d * 0.016));
      };
      const setup = () => {
        try {
          const win = iframe.contentWindow;
          if (!win) return;
          win.addEventListener("wheel", onIframeWheel, { passive: false, capture: true });
          win.addEventListener("keydown", onKeyDown, { capture: true });
          win.addEventListener("keyup", onKeyUp, { capture: true });
          attached.add(iframe);
        } catch {
          /* cross-origin — ignore */
        }
      };
      iframe.addEventListener("load", setup);
      setup();
    };
    world.querySelectorAll<HTMLIFrameElement>("iframe").forEach(attachIframe);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLIFrameElement) attachIframe(n);
          else if (n instanceof HTMLElement) {
            n.querySelectorAll<HTMLIFrameElement>("iframe").forEach(attachIframe);
          }
        });
      }
    });
    mo.observe(world, { childList: true, subtree: true });

    board.addEventListener("wheel", onBoardWheel, { passive: false });
    board.addEventListener("pointerdown", onPointerDown);
    board.addEventListener("pointermove", onPointerMove);
    board.addEventListener("pointerup", onPointerUp);
    board.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      board.removeEventListener("wheel", onBoardWheel);
      board.removeEventListener("pointerdown", onPointerDown);
      board.removeEventListener("pointermove", onPointerMove);
      board.removeEventListener("pointerup", onPointerUp);
      board.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      mo.disconnect();
    };
  }, [handleWheel, apply]);

  // Imperative setter for external view restores.
  const setView = useCallback((next: PanZoomState) => apply(next), [apply]);

  return { boardRef, worldRef, state, fit, zoomBy, resetZoom, setView };
}
