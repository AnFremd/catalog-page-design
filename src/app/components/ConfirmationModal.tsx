import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-eqk9nrke6g";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Отмена",
  isDangerous = false,
}: ConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setIsSubmitting(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-busy={isSubmitting}
    >
      <div
        className="bg-white content-stretch flex flex-col gap-[24px] items-end p-6 md:p-[32px] relative rounded-[16px] shadow-[0px_2px_8px_0px_rgba(22,34,51,0.04),0px_12px_24px_0px_rgba(22,34,51,0.06)] w-[min(540px,calc(100vw-2rem))] max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center relative shrink-0 w-full">
              <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Bold',sans-serif] font-bold leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[20px]">
                {title}
              </p>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full">
              <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.4] min-h-px min-w-px relative text-[14px] text-[rgba(13,45,94,0.72)]">
                {description}
              </p>
            </div>
          </div>

          <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full">
            <div
              className={`content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[12px] relative rounded-[8px] shrink-0 ${!isSubmitting ? "bg-[rgba(13,45,94,0.04)] cursor-pointer hover:bg-[rgba(13,45,94,0.08)]" : "bg-[rgba(13,45,94,0.04)] cursor-not-allowed opacity-60"}`}
              onClick={!isSubmitting ? onClose : undefined}
            >
              <p className="font-['PT_Root_UI_VF:Bold',sans-serif] font-medium leading-[1.2] relative shrink-0 text-[14px] text-[rgba(13,45,94,0.72)] whitespace-nowrap">
                {cancelText}
              </p>
            </div>
            <div
              className={`content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[12px] relative rounded-[8px] shrink-0 min-w-[120px] ${isSubmitting ? "cursor-not-allowed opacity-90" : "cursor-pointer"} ${isDangerous ? "bg-[#ec3f39] hover:bg-[#d63832]" : "bg-[#007fff] hover:bg-[#006dd9]"}`}
              onClick={!isSubmitting ? handleConfirm : undefined}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-['PT_Root_UI_VF:Bold',sans-serif] font-medium text-[14px] text-white">
                    Подождите…
                  </span>
                </div>
              ) : (
                <p className="font-['PT_Root_UI_VF:Bold',sans-serif] font-medium leading-[1.2] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                  {confirmText}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="absolute content-stretch flex items-center justify-center p-[10px] right-0 top-0">
          <div
            className={`content-stretch flex items-center justify-between relative rounded-[8px] shrink-0 size-[32px] ${!isSubmitting ? "cursor-pointer hover:bg-[rgba(13,45,94,0.04)]" : "cursor-not-allowed opacity-50 pointer-events-none"}`}
            onClick={!isSubmitting ? onClose : undefined}
          >
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.51805 9.53742">
                <path clipRule="evenodd" d={svgPaths.p27cc0a00} fill="var(--fill-0, #0D2D5E)" fillOpacity="0.56" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
