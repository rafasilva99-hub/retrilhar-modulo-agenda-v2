export type VirtualWindow = {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly beforeHeight: number;
  readonly afterHeight: number;
};

export type VirtualWindowConfig = {
  readonly itemCount: number;
  readonly itemHeight: number;
  readonly viewportHeight: number;
  readonly scrollTop: number;
  readonly overscan: number;
};

export function getVirtualWindow({
  itemCount,
  itemHeight,
  viewportHeight,
  scrollTop,
  overscan,
}: VirtualWindowConfig): VirtualWindow {
  const safeItemCount = Math.max(0, itemCount);
  const safeItemHeight = Math.max(1, itemHeight);
  const safeViewportHeight = Math.max(1, viewportHeight);
  const safeScrollTop = Math.max(0, scrollTop);
  const safeOverscan = Math.max(0, overscan);

  const firstVisibleIndex = Math.floor(safeScrollTop / safeItemHeight);
  const visibleItems = Math.ceil(safeViewportHeight / safeItemHeight);
  const startIndex = Math.max(0, firstVisibleIndex - safeOverscan);
  const endIndex = Math.min(safeItemCount, firstVisibleIndex + visibleItems + safeOverscan);

  return {
    startIndex,
    endIndex,
    beforeHeight: startIndex * safeItemHeight,
    afterHeight: (safeItemCount - endIndex) * safeItemHeight,
  };
}
