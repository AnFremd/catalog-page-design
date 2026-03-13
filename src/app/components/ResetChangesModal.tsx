import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-vsub7hkexn";

const CLOSE_ICON_VIEWBOX = "0 0 9.51805 9.53742";

interface ResetChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: { resetProducts: boolean; resetSectionNames: boolean }) => void;
  productCount: number;
  sectionCount: number;
}

export function ResetChangesModal({
  isOpen,
  onClose,
  onConfirm,
  productCount,
  sectionCount,
}: ResetChangesModalProps) {
  const [resetProducts, setResetProducts] = useState(false);
  const [resetSectionNames, setResetSectionNames] = useState(false);

  const hasProductChanges = productCount > 0;
  const hasSectionChanges = sectionCount > 0;
  const hasAnyChanges = hasProductChanges || hasSectionChanges;

  useEffect(() => {
    if (isOpen) {
      if (hasProductChanges && !hasSectionChanges) {
        setResetProducts(true);
        setResetSectionNames(false);
      } else if (!hasProductChanges && hasSectionChanges) {
        setResetProducts(false);
        setResetSectionNames(true);
      } else {
        setResetProducts(false);
        setResetSectionNames(false);
      }
    }
  }, [isOpen, hasProductChanges, hasSectionChanges]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onlyProducts = hasProductChanges && !hasSectionChanges;
  const onlySections = hasSectionChanges && !hasProductChanges;

  const handleConfirm = () => {
    if (!hasAnyChanges) return;
    if (onlyProducts) {
      onConfirm({ resetProducts: true, resetSectionNames: false });
      return;
    }
    if (onlySections) {
      onConfirm({ resetProducts: false, resetSectionNames: true });
      return;
    }
    if (!resetProducts && !resetSectionNames) return;
    onConfirm({ resetProducts, resetSectionNames });
  };

  const hasSelection = onlyProducts || onlySections || resetProducts || resetSectionNames;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div
        className="bg-white content-stretch flex flex-col gap-6 items-end p-6 md:p-8 relative rounded-[16px] w-[min(520px,calc(100vw-2rem))] max-h-[90dvh] overflow-y-auto shadow-[0px_2px_8px_0px_rgba(22,34,51,0.04),0px_12px_24px_0px_rgba(22,34,51,0.06)]"
        data-name="Сброс локальных изменений"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок + кнопка закрытия */}
        <div className="content-stretch flex items-start relative shrink-0 w-full">
          <h2
            id="reset-modal-title"
            className="flex-[1_0_0] font-['PT Root UI VF:Bold',sans-serif] font-bold leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[20px]"
          >
            Сброс локальных изменений
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 flex items-center justify-center w-8 h-8 p-2.5 rounded-[8px] hover:bg-[rgba(13,45,94,0.04)]"
            aria-label="Закрыть"
          >
            <svg
              width="16"
              height="16"
              viewBox={CLOSE_ICON_VIEWBOX}
              fill="none"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={svgPaths.p27cc0a00}
                fill="#0D2D5E"
                fillOpacity="0.56"
              />
            </svg>
          </button>
        </div>

        {!hasAnyChanges ? (
          <div className="content-stretch flex items-center relative shrink-0 w-full py-2">
            <p className="font-['PT Root UI VF:Regular',sans-serif] text-sm text-[rgba(13,45,94,0.28)]">
              Нет изменений для сброса.
            </p>
          </div>
        ) : (
          <>
            <div className="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full -mb-2">
              {/* Чекбокс 1: Товары */}
              {hasProductChanges && (
                <div className="flex gap-2 items-start w-full">
                  {!onlyProducts && (
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-[4px] border border-[rgba(13,45,94,0.16)] p-0.5 flex items-center justify-center cursor-pointer ${resetProducts ? "bg-[#0D2D5E]" : "bg-white"}`}
                      onClick={() => setResetProducts(!resetProducts)}
                      role="checkbox"
                      aria-checked={resetProducts}
                      aria-label="Сбросить изменения в товарах"
                    >
                      {resetProducts && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="flex-1 min-w-0 min-h-0">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-['PT Root UI VF:Bold',sans-serif] font-bold text-[16px] leading-[1.2] text-[#222934]">
                        Товары
                      </span>
                      <span className="font-['PT Root UI VF:Bold',sans-serif] font-bold text-[16px] leading-[1.2] text-[rgba(13,45,94,0.28)]">
                        {productCount}
                      </span>
                    </div>
                    <p className="font-['PT Root UI VF:Regular',sans-serif] font-normal text-[14px] leading-[1.2] text-[rgba(37,52,71,0.84)]">
                      Сброс цен, описаний и других переопределенных свойств
                    </p>
                  </div>
                </div>
              )}

              {/* Чекбокс 2: Названия разделов */}
              {hasSectionChanges && (
                <div className="flex gap-2 items-start w-full">
                  {!onlySections && (
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-[4px] border border-[rgba(13,45,94,0.16)] p-0.5 flex items-center justify-center cursor-pointer ${resetSectionNames ? "bg-[#0D2D5E]" : "bg-white"}`}
                      onClick={() => setResetSectionNames(!resetSectionNames)}
                      role="checkbox"
                      aria-checked={resetSectionNames}
                      aria-label="Сбросить названия разделов"
                    >
                      {resetSectionNames && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="flex-1 min-w-0 min-h-0">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-['PT Root UI VF:Bold',sans-serif] font-bold text-[16px] leading-[1.2] text-[#222934]">
                        Названия разделов
                      </span>
                      <span className="font-['PT Root UI VF:Bold',sans-serif] font-bold text-[16px] leading-[1.2] text-[rgba(13,45,94,0.28)]">
                        {sectionCount}
                      </span>
                    </div>
                    <p className="font-['PT Root UI VF:Regular',sans-serif] font-normal text-[14px] leading-[1.2] text-[rgba(37,52,71,0.84)]">
                      Восстановление исходных имен
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Алерт */}
            <div className="bg-[rgba(13,45,94,0.04)] rounded-[10px] p-3 w-full flex gap-2 items-start shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 12.9861 11.8167"
                fill="none"
                className="flex-shrink-0 mt-0.5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d={svgPaths.p348dfd00}
                  fill="#253447"
                  fillOpacity="0.84"
                />
              </svg>
              <p className="flex-1 font-['PT Root UI VF:Regular',sans-serif] font-normal text-[14px] leading-[1.2] text-[rgba(37,52,71,0.84)] m-0">
                Локальные правки в каталоге будут заменены версией поставщика от 04.03.2026.
              </p>
            </div>

            {/* Кнопка */}
            <div className="flex justify-end w-full">
              <button
                type="button"
                disabled={!hasSelection}
                onClick={hasSelection ? handleConfirm : undefined}
                className={
                  hasSelection
                    ? "h-8 px-3 rounded-[8px] flex items-center justify-center gap-2 font-['PT Root UI VF:Bold',sans-serif] font-medium text-[14px] leading-[1.2] bg-[#0D2D5E] text-white cursor-pointer hover:opacity-90 whitespace-nowrap"
                    : "h-8 px-3 rounded-[8px] flex items-center justify-center gap-2 font-['PT Root UI VF:Bold',sans-serif] font-medium text-[14px] leading-[1.2] bg-[rgba(13,45,94,0.04)] text-[rgba(13,45,94,0.28)] cursor-not-allowed whitespace-nowrap"
                }
              >
                Подтвердить сброс
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
