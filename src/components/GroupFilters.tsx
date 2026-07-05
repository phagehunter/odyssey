import { GROUP_LABELS, useFilters } from '../context/FilterContext';
import type { GroupKey } from '../types';

const GROUP_DOT: Record<GroupKey, string> = {
  loyalists: 'bg-emerald-400',
  suitors: 'bg-amber-400',
  divine: 'bg-violet-400',
  external: 'bg-sky-400',
};

/** Checkbox toggles isolating cultural/ontological groups across all views. */
export default function GroupFilters() {
  const { enabledGroups, toggleGroup } = useFilters();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {(Object.keys(GROUP_LABELS) as GroupKey[]).map((g) => (
        <label
          key={g}
          className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none hover:text-slate-100"
        >
          <input
            type="checkbox"
            checked={enabledGroups[g]}
            onChange={() => toggleGroup(g)}
            className="accent-emerald-500 w-3.5 h-3.5"
          />
          <span className={`inline-block w-2 h-2 rounded-full ${GROUP_DOT[g]}`} />
          {GROUP_LABELS[g]}
        </label>
      ))}
    </div>
  );
}
