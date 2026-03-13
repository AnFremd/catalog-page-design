import { ChevronLeft, ChevronRight } from "lucide-react";
import svgPaths from "../../imports/svg-woxmq9225x";

interface Catalog {
  id: string;
  name: string;
  badge?: number | "new";
  isPinned?: boolean;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase() || "??";
}

interface CatalogSidebarProps {
  catalogs: Catalog[];
  activeCatalogId: string;
  onSelectCatalog: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  isMobile?: boolean;
}

export function CatalogSidebar({ catalogs, activeCatalogId, onSelectCatalog, collapsed = false, onToggleCollapsed, isMobile = false }: CatalogSidebarProps) {
  const isOverlay = isMobile && !collapsed;
  return (
    <div
      className={`bg-white flex flex-col h-screen shrink-0 border-r border-[rgba(13,45,94,0.08)] transition-[width,transform] duration-200 ${
        isOverlay
          ? "fixed left-0 top-0 z-40 h-full w-[min(304px,85vw)] shadow-xl md:relative md:shadow-none"
          : collapsed
            ? "w-14 md:w-[56px]"
            : "w-[304px]"
      }`}
      data-name="Sidebar"
    >
      <div className="h-[48px] relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] relative size-full min-w-0">
            {onToggleCollapsed && (
              <button
                type="button"
                className="flex shrink-0 items-center justify-center min-h-[44px] min-w-[44px] w-11 h-11 rounded-[8px] hover:bg-[rgba(13,45,94,0.04)] active:bg-[rgba(13,45,94,0.08)] text-[rgba(13,45,94,0.56)] touch-manipulation"
                aria-label={collapsed ? "Развернуть список каталогов" : "Свернуть список каталогов"}
                onClick={onToggleCollapsed}
              >
                {collapsed ? (
                  <ChevronRight className="size-5 shrink-0" aria-hidden />
                ) : (
                  <ChevronLeft className="size-5 shrink-0" aria-hidden />
                )}
              </button>
            )}
            {!collapsed && (
              <>
                <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative min-w-0">
                  <div className="flex flex-[1_0_0] flex-col font-['PT_Root_UI_VF:Bold',sans-serif] font-bold justify-center leading-[0] min-h-[20px] min-w-px overflow-hidden relative text-[#222934] text-[16px] text-ellipsis">
                    <p className="leading-[20px]">Каталоги</p>
                  </div>
                </div>
                <div className="-translate-x-1/2 absolute bg-[rgba(13,45,94,0.08)] bottom-0 h-px left-1/2 w-[272px]" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full overflow-auto">
        <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
          <div className={`content-stretch flex flex-col items-center pt-[8px] relative size-full ${collapsed ? "px-[8px]" : "px-[8px]"}`}>
            {catalogs.map((catalog) => (
              <div
                key={catalog.id}
                className={`relative rounded-[12px] shrink-0 w-full ${activeCatalogId === catalog.id ? "bg-[rgba(13,45,94,0.08)]" : ""}`}
                data-name="items"
              >
                <div className="flex flex-row items-center size-full">
                  <div
                    className="content-stretch flex items-center relative w-full cursor-pointer hover:bg-[rgba(13,45,94,0.04)] rounded-[12px] justify-center"
                    style={{ padding: collapsed ? "8px" : "8px" }}
                    onClick={() => onSelectCatalog(catalog.id)}
                    title={collapsed ? catalog.name : undefined}
                  >
                    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative justify-center">
                      <div className="bg-[rgba(0,127,255,0.16)] content-stretch flex gap-[10px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[32px]">
                        <p className="font-['PT_Root_UI:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#007fff] text-[16px] text-center whitespace-nowrap">
                          {getInitials(catalog.name)}
                        </p>
                      </div>
                      {!collapsed && (
                        <>
                          <div className="flex flex-[1_0_0] flex-col font-['PT_Root_UI_VF:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[14px] text-[rgba(37,52,71,0.84)] text-ellipsis min-w-0">
                            <p className="leading-[16px]">{catalog.name}</p>
                          </div>
                          {(catalog.badge || catalog.isPinned) && (
                            <div className="flex gap-[8px] items-center shrink-0">
                              {typeof catalog.badge === "number" && (
                                <div className="bg-[#ec3f39] content-stretch flex gap-[4px] h-[16px] items-center justify-center min-w-[16px] overflow-clip px-[4px] py-[2px] relative rounded-[16px] shrink-0">
                                  <p className="font-['PT_Root_UI_VF:Bold',sans-serif] font-semibold leading-[14px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
                                    {catalog.badge}
                                  </p>
                                </div>
                              )}
                              {catalog.badge === "new" && (
                                <div className="bg-[#3caa3c] content-stretch flex gap-[4px] h-[16px] items-center justify-center min-w-[16px] overflow-clip px-[4px] py-[2px] relative rounded-[16px] shrink-0">
                                  <p className="font-['PT_Root_UI_VF:Bold',sans-serif] font-semibold leading-[14px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
                                    new
                                  </p>
                                </div>
                              )}
                              {catalog.isPinned && (
                                <div className="overflow-clip relative shrink-0 size-[16px]">
                                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 15.75">
                                    <path clipRule="evenodd" d="M7.3125 0C7.81777 0 8.22917 0.411395 8.22917 0.916667V1.09836C9.41019 1.27003 10.3125 2.28267 10.3125 3.5V7.01172L12.2135 9.98633C12.5911 10.5676 12.1731 11.3333 11.4792 11.3333H7.3125V14.8333C7.3125 15.3386 6.90111 15.75 6.39583 15.75C5.89056 15.75 5.47917 15.3386 5.47917 14.8333V11.3333H1.3125C0.618608 11.3333 0.200602 10.5676 0.578141 9.98633L2.47917 7.01172V3.5C2.47917 2.28267 3.38148 1.27003 4.5625 1.09836V0.916667C4.5625 0.411395 4.97389 0 5.47917 0H7.3125Z" fill="rgba(13, 45, 94, 0.56)" fillRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          )}
                          {activeCatalogId === catalog.id && catalog.id === "proctor-gamble" && (
                            <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0 size-[24px]" data-name="Buttons/General">
                              <div className="flex items-center justify-center shrink-0 size-[24px]" data-name="Icon/Gravity/ellipsis-vertical">
                                <svg width="14" height="14" viewBox="0 0 3.375 14.625" fill="none" className="block shrink-0">
                                  <path d={svgPaths.p1bc46000} fill="rgba(13,45,94,0.56)" stroke="rgba(13,45,94,0.56)" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}