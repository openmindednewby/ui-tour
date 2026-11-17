import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useTour } from '../context/TourContext';
import { backdropStyle, mutedStyle, panelStyle, titleStyle } from './panelStyles';
import { groupTours, PickerGroup } from './PickerGroup';
import { TourButton } from './TourButton';

function toggled(set: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

/** Tour list grouped by category; opens from `openPicker()` or F2, focus lands on the first tour. */
export function TourPicker(): ReactElement | null {
  const { pickerOpen, closePicker, tours, theme, labels } = useTour();
  const groups = useMemo(() => groupTours(tours), [tours]);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set(groups.slice(0, 1).map((group) => group.category)));
  const firstRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (pickerOpen) firstRef.current?.focus();
  }, [pickerOpen]);
  if (!pickerOpen || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-tour-overlay=""
      data-testid="tour-picker-backdrop"
      style={backdropStyle(theme)}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePicker();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={labels.pickerTitle} data-testid="tour-picker" style={panelStyle(theme)}>
        <h2 style={titleStyle(theme)}>{labels.pickerTitle}</h2>
        <p style={mutedStyle(theme)}>{labels.pickerIntro}</p>
        {groups.map((group, index) => (
          <PickerGroup
            key={group.category}
            group={group}
            expanded={expanded.has(group.category)}
            onToggle={() => setExpanded(toggled(expanded, group.category))}
            firstButtonRef={index === 0 ? firstRef : undefined}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <TourButton label={labels.close} onPress={closePicker} theme={theme} testID="tour-picker-close" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
