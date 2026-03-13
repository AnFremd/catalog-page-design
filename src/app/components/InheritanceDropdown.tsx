import svgPaths from "../../imports/svg-bxbz6tjkvj";

interface InheritanceDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onBreakLink: () => void;
  onViewUpdates: () => void;
  onResetChanges: () => void;
  autoUpdateEnabled: boolean;
  onToggleAutoUpdate: () => void;
  hasLocalChanges: boolean;
}

export function InheritanceDropdown({
  isOpen,
  onClose,
  position,
  onBreakLink,
  onViewUpdates,
  onResetChanges,
  autoUpdateEnabled,
  onToggleAutoUpdate,
  hasLocalChanges,
}: InheritanceDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div
          className="menu-block bg-white relative rounded-[12px]"
          data-name="Дроп родители-дети"
        >
          <div
            aria-hidden="true"
            className="absolute border border-[rgba(13,45,94,0.04)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_2px_8px_0px_rgba(22,34,51,0.04),0px_12px_24px_0px_rgba(22,34,51,0.06)]"
          />

          {/* Родительский каталог */}
          <div
            className="content-stretch flex gap-[8px] items-start p-[8px] relative rounded-[8px] shrink-0 w-full"
            data-name="menu items M"
          >
            <div
              className="content-stretch flex items-start relative shrink-0"
              data-name="left slot"
            >
              <div
                className="bg-[rgba(0,127,255,0.08)] content-stretch flex items-center justify-center overflow-clip relative rounded-[4px] shrink-0 size-[24px]"
                data-name="Logo26"
              >
                <div
                  className="content-stretch flex items-center justify-center relative shrink-0"
                  data-name="Component 1"
                >
                  <p className="font-['PT_Root_UI_VF:Medium',sans-serif] font-medium leading-[1.2] relative shrink-0 text-[#007fff] text-[12px] whitespace-nowrap">
                    AB
                  </p>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative"
              data-name="textList"
            >
              {/* Frame4 */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                {/* Frame1 */}
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div
                    className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative"
                    data-name="Component 1"
                  >
                    <p className="font-['PT_Root_UI_VF:Medium',sans-serif] font-medium leading-[1.2] relative shrink-0 text-[#222934] text-[14px] whitespace-nowrap">
                      Проктор и Гэмбл
                    </p>
                  </div>
                </div>
                <div
                  className="content-stretch flex items-center relative shrink-0 w-full"
                  data-name="Component 1"
                >
                  <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px relative text-[12px] text-[rgba(13,45,94,0.56)]">
                    ООО Юнилевер
                  </p>
                </div>
              </div>
            </div>
            <div className="opacity-0 relative shrink-0 size-[16px]" data-name="Right slot">
              <div
                className="absolute inset-0 overflow-clip"
                data-name="Icon/Gravity/arrow-up-right-from-square"
              >
                <div className="absolute inset-[9.38%]" data-name="Vector">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 13 13"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.pe076ef2}
                      fill="var(--fill-0, #0D2D5E)"
                      fillOpacity="0.56"
                      fillRule="evenodd"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative shrink-0 w-full" data-name="divider">
            <div className="content-stretch flex flex-col items-start py-[4px] relative w-full">
              <div className="h-px bg-[rgba(13,45,94,0.16)] relative shrink-0 w-full" />
            </div>
          </div>

          {/* Разорвать связь */}
          <div
            className="content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(13,45,94,0.04)]"
            data-name="menu items M"
            onClick={onBreakLink}
          >
            <div
              className="content-stretch flex items-center justify-center relative shrink-0"
              data-name="left slot"
            >
              <div
                className="overflow-clip relative shrink-0 size-[16px]"
                data-name="Icon/Gravity/link-slash"
              >
                <div className="absolute inset-[9.63%_9.62%_9.62%_9.62%]" data-name="Vector">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 12.9219 12.9209"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p37d4b780}
                      fill="var(--fill-0, #222934)"
                      fillRule="evenodd"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative"
              data-name="textList"
            >
              {/* Frame5 -> Frame2 */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div
                    className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative"
                    data-name="Component 1"
                  >
                    <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[14px]">
                      Разорвать связь
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Посмотреть обновления */}
          <div
            className="content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(13,45,94,0.04)]"
            data-name="menu items M"
            onClick={onViewUpdates}
          >
            <div
              className="content-stretch flex items-center justify-center relative shrink-0"
              data-name="left slot"
            >
              <div
                className="overflow-clip relative shrink-0 size-[16px]"
                data-name="Icon/Gravity/arrows-rotate-right"
              >
                <div className="absolute inset-[9.37%_9.66%_9.37%_9.68%]" data-name="Vector">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 12.905 13.0002"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p19dd0340}
                      fill="var(--fill-0, #222934)"
                      fillRule="evenodd"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative"
              data-name="textList"
            >
              {/* Frame6 -> Frame3 */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div
                    className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative"
                    data-name="Component 1"
                  >
                    <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[14px]">
                      Посмотреть обновления
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Обновлять автоматически */}
          <div
            className="content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[293px]"
            data-name="menu items M"
          >
            {/* LeftSlot — Icon/Gravity/arrows-rotate-right */}
            <div
              className="content-stretch flex items-center justify-center relative shrink-0"
              data-name="left slot"
            >
              <div
                className="overflow-clip relative shrink-0 size-[16px]"
                data-name="Icon/Gravity/arrows-rotate-right"
              >
                <div className="absolute inset-[9.37%_9.66%_9.37%_9.68%]" data-name="Vector">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 12.905 13.0002"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p19dd0340}
                      fill="var(--fill-0, #222934)"
                      fillRule="evenodd"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative"
              data-name="textList"
            >
              {/* Frame7 -> Frame8 */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div
                    className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative"
                    data-name="Component 1"
                  >
                    <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[14px]">
                      Обновлять автоматически
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Switch26 */}
            <div
              className={`content-stretch flex items-center pl-[2px] pr-[14px] py-[2px] relative rounded-[8px] shrink-0 cursor-pointer transition-colors ${
                autoUpdateEnabled ? "bg-[#007fff]" : "bg-[rgba(13,45,94,0.08)]"
              }`}
              data-name="Switch26"
              onClick={onToggleAutoUpdate}
            >
              <div
                className={`bg-white rounded-[100px] shrink-0 size-[12px] transition-transform ${
                  autoUpdateEnabled ? "translate-x-[14px]" : ""
                }`}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative shrink-0 w-full" data-name="divider">
            <div className="content-stretch flex flex-col items-start py-[4px] relative w-full">
              <div className="h-px bg-[rgba(13,45,94,0.16)] relative shrink-0 w-full" />
            </div>
          </div>

          {/* Сбросить изменения */}
          <div
            className={`content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[8px] shrink-0 w-full ${
              hasLocalChanges
                ? "cursor-pointer hover:bg-[rgba(13,45,94,0.04)]"
                : "opacity-50 cursor-not-allowed"
            }`}
            data-name="menu items M"
            onClick={hasLocalChanges ? onResetChanges : undefined}
          >
            <div
              className="content-stretch flex items-center justify-center relative shrink-0"
              data-name="left slot"
            >
              <div
                className="overflow-clip relative shrink-0 size-[16px]"
                data-name="Icon/Gravity/arrow-rotate-left"
              >
                <div className="absolute inset-[9.37%_9.38%_9.38%_9.66%]" data-name="Vector">
                  <svg
                    className="absolute block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 12.9532 13"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p3461eb00}
                      fill="var(--fill-0, #222934)"
                      fillRule="evenodd"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative"
              data-name="textList"
            >
              {/* Frame9 -> Frame10 */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div
                    className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative"
                    data-name="Component 1"
                  >
                    <p className="flex-[1_0_0] font-['PT_Root_UI_VF:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px relative text-[#222934] text-[14px]">
                      Сбросить изменения
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}