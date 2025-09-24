import { MaistroImage } from '@/types';
import { cx } from 'class-variance-authority';
import { Check, RotateCw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Locale } from '../Businesses/types';
import { normalizeMaistroImages } from './utils';
import { Button, Flex } from '@maistro/ui';

type Props = {
  images: MaistroImage[];
  onRefresh?: () => void;
  loading?: boolean;
  locale?: Locale;
  selectedImages?: MaistroImage[]; // controlled (optional)
  onChange?: (images: MaistroImage[]) => void; // fires on select/clear/reorder/remove
  className?: string;
  showSelectedTray?: boolean; // default true
};

const dict = {
  es: {
    refresh: 'Actualizar Imagenes',
    selected: (n: number) => `${n} seleccionadas`,
    selectAll: 'Seleccionar todo',
    clear: 'Limpiar',
    loading: 'Cargando…',
    noUrl: 'Sin URL',
    selectedTray: 'Seleccionadas (arrastra para reordenar)',
    remove: 'Quitar',
    moveLeft: 'Mover a la izquierda',
    moveRight: 'Mover a la derecha',
  },
  en: {
    refresh: 'Refresh Images',
    selected: (n: number) => `${n} selected`,
    selectAll: 'Select all',
    clear: 'Clear',
    loading: 'Loading…',
    noUrl: 'No URL',
    selectedTray: 'Selected (drag to reorder)',
    remove: 'Remove',
    moveLeft: 'Move left',
    moveRight: 'Move right',
  },
} satisfies Record<Locale, any>;

const toAbsolute = (u?: string) => {
  if (!u) return '';
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
};
const reorder = <T,>(arr: T[], from: number, to: number) => {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export function ImageSelectorGrid({
  images,
  onRefresh,
  loading = false,
  locale = 'es',
  selectedImages,
  onChange,
  className,
  showSelectedTray = true,
}: Props) {
  const t = dict[locale];

  // READY only
  const ready = useMemo(() => images.filter((im) => im.Status === 'READY'), [images]);

  // Controlled / uncontrolled selection, preserving ORDER
  const [internal, setInternal] = useState<MaistroImage[]>(
    normalizeMaistroImages(selectedImages || []) as any
  );
  const selected = selectedImages ?? internal;

  const setSelected = (next: MaistroImage[]) => {
    if (selectedImages === undefined) setInternal(next);
    onChange?.(next);
  };

  const toggle = (im: MaistroImage) => {
    const isSelected = selected.find((i) => i.ImageId === im.ImageId);
    setSelected(isSelected ? selected.filter((i) => im.ImageId !== i.ImageId) : [...selected, im]);
  };

  const selectAll = () => {
    // keep current order and append any missing by grid order
    const gridOrder = ready;
    const missing = gridOrder.filter((u) => !selected.includes(u));
    setSelected([...selected, ...missing]);
  };

  const clear = () => setSelected([]);

  const removeAt = (i: number) => setSelected(selected.filter((_, idx) => idx !== i));
  const nudgeLeft = (i: number) => i > 0 && setSelected(reorder(selected, i, i - 1));
  const nudgeRight = (i: number) =>
    i < selected.length - 1 && setSelected(reorder(selected, i, i + 1));

  // DnD (HTML5) for Selected tray
  const dragFrom = useRef<number | null>(null);
  const onDragStart = (i: number) => (e: React.DragEvent) => {
    dragFrom.current = i;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const onDropAt = (toIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromIdx = dragFrom.current;
    dragFrom.current = null;
    if (fromIdx === null || fromIdx === toIdx) return;
    setSelected(reorder(selected, fromIdx, toIdx));
  };

  return (
    <div className={cx('rounded-2xl border border-neutral-200 bg-white p-4', className)}>
      {/* Toolbar */}

      <Flex gap="2" className="mb-5" align="center" wrap="wrap" justify="center">
        <Button
          onClick={onRefresh}
          disabled={!onRefresh || loading}
          variant="outline"
          className={cx(
            'inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-medium',
            loading ? 'opacity-60' : 'hover:bg-neutral-50'
          )}
        >
          <RotateCw className={cx('h-4 w-4', loading && 'animate-spin')} />
          {t.refresh}
        </Button>

        <Button variant="solid">{t.selected(selected.length)}</Button>
        <Button variant="soft" onClick={selectAll}>
          {t.selectAll}
        </Button>
        <Button variant="outline" onClick={clear}>
          {t.clear}
        </Button>
      </Flex>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {ready.map((image) => {
            const idx = selected.findIndex((i) => i.ImageId === image.ImageId) ?? -1;
            const isSel = idx >= 0;
            return (
              <div
                key={image.ImageId}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                onClick={() => toggle(image)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(image)}
                className={cx(
                  'relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl border transition',
                  isSel
                    ? 'border-fuchsia-500 ring-2 ring-fuchsia-500'
                    : 'border-neutral-200 hover:border-neutral-300'
                )}
              >
                {image.Urls.Low ? (
                  <img
                    src={toAbsolute(image.Urls.Low)}
                    alt="business"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-neutral-100 text-xs text-neutral-500">
                    {t.noUrl}
                  </div>
                )}

                {/* Overlay + check */}
                <div
                  className={cx(
                    'pointer-events-none absolute inset-0 bg-transparent transition',
                    isSel && 'bg-fuchsia-500/10'
                  )}
                />
                <div
                  className={cx(
                    'pointer-events-none absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-neutral-700 shadow ring-1 ring-neutral-200 transition',
                    isSel && 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white ring-0'
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>

                {/* Order badge */}
                {isSel && (
                  <div className="pointer-events-none absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/80 text-[11px] font-semibold text-white">
                    {idx + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected tray */}
      {showSelectedTray && selected.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-neutral-700">{t.selectedTray}</div>
          <div className="flex flex-wrap gap-3">
            {selected.map((image, i) => {
              return (
                <div
                  key={image.ImageId}
                  draggable
                  onDragStart={onDragStart(i)}
                  onDragOver={onDragOver}
                  onDrop={onDropAt(i)}
                  className="group relative flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 pr-8"
                  style={{ width: '100%', justifyContent: 'space-evenly' }}
                >
                  <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-neutral-100">
                    {image.Urls.Low ? (
                      <img
                        src={toAbsolute(image.Urls.Low)}
                        alt={`selected-${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-[10px] text-neutral-500">IMG</div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">{i + 1}</span>

                  {/* Nudge buttons */}
                  <div className="ml-1 flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={t.moveLeft}
                      onClick={() => nudgeLeft(i)}
                      className="rounded-md px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label={t.moveRight}
                      onClick={() => nudgeRight(i)}
                      className="rounded-md px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
                    >
                      →
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    aria-label={t.remove}
                    onClick={() => removeAt(i)}
                    className="absolute right-2 top-2 hidden rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white group-hover:block"
                  >
                    {t.remove}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageSelectorGrid;
