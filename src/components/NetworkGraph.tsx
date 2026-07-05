import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceX, forceY } from 'd3';
import { CHARACTERS, CHARACTER_BY_ID } from '../data/characters';
import { INTERACTIONS } from '../data/interactions';
import { ALIGNMENT_COLORS, GROUP_OF_ALIGNMENT, useFilters } from '../context/FilterContext';
import { useElementSize } from '../hooks/useElementSize';
import PlaybackControls from './PlaybackControls';
import type { Character, Interaction } from '../types';

interface GraphNode {
  id: string;
  char: Character;
  degree: number;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  weight: number;
  nested: boolean;
  interactions: Interaction[];
}

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/** All books in which a character appears anywhere in the interaction ledger. */
const APPEARANCES: Record<string, number[]> = (() => {
  const map: Record<string, Set<number>> = {};
  for (const i of INTERACTIONS) {
    (map[i.source] ??= new Set()).add(i.book);
    (map[i.target] ??= new Set()).add(i.book);
  }
  return Object.fromEntries(
    Object.entries(map).map(([id, s]) => [id, [...s].sort((a, b) => a - b)]),
  );
})();

export default function NetworkGraph() {
  const { bookRange, enabledGroups, setSelection, highlight } = useFilters();
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const fgRef = useRef<any>(null);
  // Persist node objects across filter changes so the layout doesn't reset on every slider tick.
  const nodeCache = useRef<Map<string, GraphNode>>(new Map());

  const visible = useCallback(
    (id: string) => {
      const c = CHARACTER_BY_ID[id];
      return c ? enabledGroups[GROUP_OF_ALIGNMENT[c.alignment]] : false;
    },
    [enabledGroups],
  );

  const filteredInteractions = useMemo(
    () =>
      INTERACTIONS.filter(
        (i) =>
          i.book >= bookRange[0] &&
          i.book <= bookRange[1] &&
          visible(i.source) &&
          visible(i.target),
      ),
    [bookRange, visible],
  );

  const graphData = useMemo(() => {
    // Merge parallel interactions between the same pair into one weighted edge.
    const linkMap = new Map<string, GraphLink>();
    const degree = new Map<string, number>();

    for (const i of filteredInteractions) {
      const key = pairKey(i.source, i.target);
      const existing = linkMap.get(key);
      if (existing) {
        existing.weight += i.weight;
        existing.nested = existing.nested && i.nested_narrative;
        existing.interactions.push(i);
      } else {
        linkMap.set(key, {
          source: i.source,
          target: i.target,
          weight: i.weight,
          nested: i.nested_narrative,
          interactions: [i],
        });
      }
      degree.set(i.source, (degree.get(i.source) ?? 0) + i.weight);
      degree.set(i.target, (degree.get(i.target) ?? 0) + i.weight);
    }

    const nodes: GraphNode[] = CHARACTERS.filter((c) => degree.has(c.id)).map((c) => {
      let node = nodeCache.current.get(c.id);
      if (!node) {
        node = { id: c.id, char: c, degree: 0 };
        nodeCache.current.set(c.id, node);
      }
      node.degree = degree.get(c.id)!;
      return node;
    });

    return { nodes, links: [...linkMap.values()] };
  }, [filteredInteractions]);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge')?.strength(-140);
    // Gentle centering gravity: without it, disconnected mini-clusters repel
    // away from the main component forever, inflating the bounding box and
    // forcing the camera to zoom far out during playback.
    fg.d3Force('x', forceX(0).strength(0.08));
    fg.d3Force('y', forceY(0).strength(0.08));
    // Two camera fits per data change: an early one so the view tracks the
    // new cast immediately, and a late one after the layout has settled —
    // both complete within a single 1.9s playback step.
    const t1 = setTimeout(() => fgRef.current?.zoomToFit(400, 80), 350);
    const t2 = setTimeout(() => fgRef.current?.zoomToFit(400, 80), 1250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [graphData]);

  // Clicking a name in the Text reader flies the camera to that node.
  useEffect(() => {
    if (!highlight?.focus) return;
    const node = nodeCache.current.get(highlight.id);
    if (node && node.x !== undefined) {
      fgRef.current?.centerAt(node.x, node.y, 700);
    }
  }, [highlight]);

  // Re-fit when the canvas itself is resized (e.g. the reading panel is dragged).
  useEffect(() => {
    if (!width || !height) return;
    const t = setTimeout(() => fgRef.current?.zoomToFit(300, 80), 250);
    return () => clearTimeout(t);
  }, [width, height]);

  const nodeRadius = (n: GraphNode) => 3 + Math.sqrt(n.degree) * 1.35;

  const highlightId = highlight?.id ?? null;

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, scale: number) => {
    const n = node as GraphNode;
    const r = nodeRadius(n);
    const color = ALIGNMENT_COLORS[n.char.alignment];
    const dimmed = highlightId !== null && n.id !== highlightId;

    ctx.globalAlpha = dimmed ? 0.14 : 0.9;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Aggregate/collective nodes get a dashed halo ring.
    if (n.char.group_size > 1) {
      ctx.beginPath();
      ctx.setLineDash([2.5, 2]);
      ctx.arc(node.x, node.y, r + 2.5, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Spotlight rings for the character highlighted from the Text reader.
    if (n.id === highlightId) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 3.5, 0, 2 * Math.PI);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 7, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    if (scale > 0.9) {
      const fontSize = Math.max(3, 11.5 / scale);
      ctx.font = `600 ${fontSize}px 'Source Sans 3', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Dark halo behind the label so names stay legible over edges
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.lineWidth = Math.max(0.8, 3 / scale);
      ctx.lineJoin = 'round';
      ctx.strokeText(n.char.name, node.x, node.y + r + 2);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(n.char.name, node.x, node.y + r + 2);
    }
    ctx.globalAlpha = 1;
  }, [highlightId]);

  const hoverConnections = useMemo(() => {
    if (!hoverNode) return [];
    const freq = new Map<string, number>();
    for (const i of filteredInteractions) {
      const other =
        i.source === hoverNode.id ? i.target : i.target === hoverNode.id ? i.source : null;
      if (other) freq.set(other, (freq.get(other) ?? 0) + i.weight);
    }
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, w]) => ({ char: CHARACTER_BY_ID[id], w }));
  }, [hoverNode, filteredInteractions]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
    >
      {width > 0 && height > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={width}
          height={height}
          graphData={graphData}
          backgroundColor="#020617"
          nodeVal={(n: any) => nodeRadius(n as GraphNode) ** 2 / 4}
          nodeLabel={() => ''}
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius(node as GraphNode) + 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkWidth={(l: any) => 0.7 + Math.min((l as GraphLink).weight * 0.3, 7)}
          linkColor={(l: any) => {
            const link = l as GraphLink;
            if (highlightId) {
              const s = typeof link.source === 'object' ? link.source.id : link.source;
              const t = typeof link.target === 'object' ? link.target.id : link.target;
              if (s !== highlightId && t !== highlightId) return 'rgba(51, 65, 85, 0.12)';
              return link.nested ? '#b08f5c' : '#94a3b8';
            }
            return link.nested ? '#7c5f3f' : '#475569';
          }}
          linkLineDash={(l: any) => ((l as GraphLink).nested ? [4, 3] : null)}
          onNodeHover={(node: any) => setHoverNode((node as GraphNode) ?? null)}
          onNodeClick={(node: any) => setSelection({ kind: 'character', id: (node as GraphNode).id })}
          onLinkClick={(l: any) => {
            const link = l as GraphLink;
            const a = typeof link.source === 'object' ? link.source.id : link.source;
            const b = typeof link.target === 'object' ? link.target.id : link.target;
            setSelection({ kind: 'edge', a, b, interactions: link.interactions });
          }}
          cooldownTicks={120}
          d3AlphaDecay={0.035}
          d3VelocityDecay={0.35}
        />
      )}

      <PlaybackControls />

      {/* Legend (hidden when the view is too narrow to share the floor with the player) */}
      <div
        className="absolute bottom-3 left-3 bg-slate-900/85 border border-slate-700 rounded-lg px-3 py-2 text-[11px] space-y-1 pointer-events-none max-w-[220px]"
        style={{ display: width < 900 ? 'none' : undefined }}
      >
        <div className="text-slate-400 uppercase tracking-widest text-[9px] mb-1">Alignment</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {Object.entries(ALIGNMENT_COLORS).map(([a, c]) => (
            <span key={a} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              {a}
            </span>
          ))}
        </div>
        <div className="pt-1 border-t border-slate-700/60 text-slate-400 space-y-0.5">
          <div>◌ dashed ring = collective node</div>
          <div>┄ dashed edge = nested narration (Bks 9–12)</div>
          <div>size ∝ degree centrality · width ∝ frequency</div>
        </div>
      </div>

      {/* Hover lookup card */}
      {hoverNode && (
        <div
          className="absolute z-40 w-72 bg-slate-900/95 border border-slate-600 rounded-lg shadow-2xl p-3 pointer-events-none"
          style={{
            left: Math.min(mousePos.current.x + 14, Math.max(width - 300, 0)),
            top: Math.min(mousePos.current.y + 14, Math.max(height - 260, 0)),
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-base text-sepia-200">{hoverNode.char.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full border"
              style={{
                color: ALIGNMENT_COLORS[hoverNode.char.alignment],
                borderColor: ALIGNMENT_COLORS[hoverNode.char.alignment],
              }}
            >
              {hoverNode.char.type} · {hoverNode.char.alignment}
            </span>
          </div>
          {hoverNode.char.epithets.length > 0 && (
            <div className="italic text-xs text-sepia-400 mt-0.5">
              {hoverNode.char.epithets.join(' · ')}
            </div>
          )}
          <div className="text-xs text-slate-400 mt-1.5 space-y-0.5">
            {hoverNode.char.group_size > 1 && (
              <div>
                Collective node — <span className="text-slate-200">{hoverNode.char.group_size}</span>{' '}
                individuals
              </div>
            )}
            <div>
              Appears in <span className="text-slate-200">{APPEARANCES[hoverNode.id]?.length ?? 0}</span>{' '}
              book{(APPEARANCES[hoverNode.id]?.length ?? 0) === 1 ? '' : 's'}:{' '}
              <span className="text-slate-300">{APPEARANCES[hoverNode.id]?.join(', ')}</span>
            </div>
            <div>
              Degree centrality (current window):{' '}
              <span className="text-emerald-300">{hoverNode.degree}</span>
            </div>
          </div>
          {hoverConnections.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-slate-700">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                Connections (by frequency)
              </div>
              <ul className="text-xs space-y-0.5">
                {hoverConnections.slice(0, 6).map(({ char, w }) => (
                  <li key={char.id} className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: ALIGNMENT_COLORS[char.alignment] }}
                      />
                      {char.name}
                    </span>
                    <span className="text-slate-500 tabular-nums">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-1.5 text-[10px] text-slate-500">
            Click node for full card · click an edge for close reading
          </div>
        </div>
      )}
    </div>
  );
}
