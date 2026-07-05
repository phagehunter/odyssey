import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { LOCATIONS, LOCATION_BY_ID } from '../data/locations';
import { ITINERARIES } from '../data/itineraries';
import { useFilters } from '../context/FilterContext';
import type { ItineraryCharacter, LocationStatus } from '../types';

/** Path colour per itinerary character. */
export const ITINERARY_COLORS: Record<ItineraryCharacter, string> = {
  odysseus: '#fbbf24', // amber — the long way home
  telemachus: '#38bdf8', // sky — the Telemachy
  divine: '#a78bfa', // violet — Hermes & Athena
};

export const ITINERARY_LABELS: Record<ItineraryCharacter, string> = {
  odysseus: 'Odysseus',
  telemachus: 'Telemachus',
  divine: 'Hermes / Divine Messengers',
};

const STATUS_STYLE: Record<LocationStatus, { fill: string; dash?: string; label: string }> = {
  Historical: { fill: '#34d399', label: 'Historical / verifiable' },
  Contested: { fill: '#fbbf24', dash: '4 3', label: 'Contested identification' },
  Mythological: { fill: '#c084fc', dash: '2 3', label: 'Mythological / allegorical' },
};

export default function MapView() {
  const { bookRange, setSelection } = useFilters();
  const [from, to] = bookRange;
  const inRange = (book: number) => book >= from && book <= to;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[38.6, 15.5]}
        zoom={6}
        minZoom={4}
        maxZoom={11}
        className="w-full h-full"
        style={{ height: '100%' }}
      >
        {/* CartoDB Dark Matter — open tiles, no API key, GitHub Pages friendly */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />

        {/* ——— Itinerary paths ——— */}
        {ITINERARIES.map((seg) => {
          const o = LOCATION_BY_ID[seg.origin];
          const d = LOCATION_BY_ID[seg.destination];
          if (!o || !d) return null;
          const active = inRange(seg.book);
          const positions: LatLngExpression[] = [o.coordinates, d.coordinates];
          return (
            <Polyline
              key={`${seg.character}-${seg.segment}`}
              positions={positions}
              pathOptions={{
                color: ITINERARY_COLORS[seg.character],
                weight: active ? 3 : 1.5,
                opacity: active ? 0.9 : 0.15,
                dashArray: seg.inferred ? '7 7' : undefined,
              }}
              eventHandlers={{
                click: () => setSelection({ kind: 'segment', segment: seg }),
              }}
            >
              <Tooltip sticky>
                <span className="text-xs">
                  <b>{ITINERARY_LABELS[seg.character]}</b> — {o.name} → {d.name} (Book {seg.book})
                  {seg.inferred ? ' · speculative route' : ''}
                  <br />
                  <i>Click for close reading</i>
                </span>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* ——— Waypoint markers ——— */}
        {LOCATIONS.map((loc) => {
          const style = STATUS_STYLE[loc.status];
          const active = loc.books.some(inRange);
          return (
            <CircleMarker
              key={loc.id}
              center={loc.coordinates}
              radius={loc.id === 'ithaca' || loc.id === 'troy' ? 9 : 7}
              pathOptions={{
                fillColor: style.fill,
                fillOpacity: active ? 0.85 : 0.25,
                color: '#e2e8f0',
                weight: 1.2,
                opacity: active ? 0.9 : 0.3,
                dashArray: style.dash,
              }}
              eventHandlers={{
                click: () => setSelection({ kind: 'location', location: loc }),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <span className="text-xs font-semibold">{loc.name}</span>
              </Tooltip>
              <Popup maxWidth={300}>
                <div className="text-sm">
                  <div className="font-display text-base" style={{ color: style.fill }}>
                    {loc.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    {style.label}
                  </div>
                  <div className="text-xs text-slate-300 mb-1.5">
                    <b>Books:</b> {loc.books.join(', ')}
                  </div>
                  {loc.note && <div className="text-xs italic text-slate-400 mb-1.5">{loc.note}</div>}
                  <ul className="text-xs space-y-1">
                    {loc.events.map((e, idx) => (
                      <li key={idx}>
                        <span className="text-emerald-400 font-semibold">Bk {e.book}.</span>{' '}
                        {e.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* ——— Symbology legend ——— */}
      <div className="absolute bottom-4 left-3 z-[1000] bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-[11px] space-y-1.5 max-w-[240px]">
        <div className="text-slate-400 uppercase tracking-widest text-[9px]">Itineraries</div>
        {(Object.keys(ITINERARY_COLORS) as ItineraryCharacter[]).map((c) => (
          <div key={c} className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-6 h-0.5" style={{ background: ITINERARY_COLORS[c] }} />
            {ITINERARY_LABELS[c]}
          </div>
        ))}
        <div className="pt-1 border-t border-slate-700/60 text-slate-400 space-y-0.5">
          <div>— solid: explicit, plausible route</div>
          <div>┄ dashed: inferred / mythic-sea route</div>
        </div>
        <div className="pt-1 border-t border-slate-700/60 space-y-1">
          <div className="text-slate-400 uppercase tracking-widest text-[9px]">Waypoints</div>
          {(Object.entries(STATUS_STYLE) as [LocationStatus, (typeof STATUS_STYLE)[LocationStatus]][]).map(
            ([status, s]) => (
              <div key={status} className="flex items-center gap-2 text-slate-300">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300"
                  style={{ background: s.fill, borderStyle: s.dash ? 'dashed' : 'solid' }}
                />
                {s.label}
              </div>
            ),
          )}
        </div>
        <div className="pt-1 border-t border-slate-700/60 text-slate-500">
          Dimmed features fall outside the selected book window.
        </div>
      </div>
    </div>
  );
}
