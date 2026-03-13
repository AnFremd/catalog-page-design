import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import { CatalogSidebar } from "./components/CatalogSidebar";
import { SectionTree } from "./components/SectionTree";
import { InheritanceDropdown } from "./components/InheritanceDropdown";
import { ResetChangesModal } from "./components/ResetChangesModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { CatalogTable } from "./components/CatalogTable";
import type { ProductOverrides, ProductFieldKey } from "./components/CatalogTable";
import { initialSections, initialProducts, ROOT_SECTION_ID } from "./data/catalogData";
import { Toaster } from "./components/ui/sonner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./components/ui/drawer";
import { toast } from "sonner";
import svgPaths from "../imports/svg-woxmq9225x";

interface Catalog {
  id: string;
  name: string;
  badge?: number | "new";
  isPinned?: boolean;
  isInherited?: boolean;
  parentCatalog?: string;
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface SectionHeaderTitleProps {
  name: string;
  canEdit: boolean;
  onRename: (newName: string) => void;
  embedded?: boolean;
}

function SectionHeaderTitle({ name, canEdit, onRename, embedded = false }: SectionHeaderTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed) onRename(trimmed);
    else setValue(name);
  };

  const content =
    isEditing && canEdit ? (
      <input
          className="flex-1 min-w-0 font-['PT_Root_UI_VF:Medium',sans-serif] text-[14px] text-[#222934] bg-white border border-[rgba(13,45,94,0.2)] rounded-[6px] px-[8px] py-[4px] outline-none focus:border-[#007fff]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              e.preventDefault();
            }
            if (e.key === "Escape") {
              setValue(name);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`font-['PT_Root_UI_VF:Medium',sans-serif] text-[14px] text-[#222934] truncate ${
            canEdit ? "cursor-text" : "cursor-default"
          }`}
          onDoubleClick={() => {
            if (!canEdit) return;
            setValue(name);
            setIsEditing(true);
          }}
          title={name}
        >
          {name}
        </span>
    );
  return embedded ? <>{content}</> : <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[rgba(13,45,94,0.08)]">{content}</div>;
}

export default function App() {
  const [catalogs] = useState<Catalog[]>([
    { id: "auto-enthusiasts", name: "Автотовары для настоящих автолюбителей", badge: 9, isPinned: true },
    { id: "pets", name: "Товары для животных", badge: 9, isPinned: true },
    { id: "loaders", name: "Грузоподъемники", badge: "new" },
    { id: "proctor-gamble", name: "Проктор энд Гэмбл", isInherited: true, parentCatalog: "ООО Юнилевер" },
    { id: "acer-monitors", name: "Мониторы Acer" },
    { id: "launch", name: "LAUNCH" },
    { id: "bosch-drills", name: "Дрели Bosch" },
    { id: "danone-equipment", name: "Заправочное оборудование Danone" },
    { id: "fishing-gear", name: "Рыболовные снасти" },
    { id: "art-supplies", name: "Художественные принадлежности" },
    { id: "metals", name: "Металлы прокатные третий сорт локальная фасовка" },
    { id: "air-conditioners", name: "Кондиционеры" },
    { id: "doors-windows", name: "Двери и окна" },
    { id: "tables-chairs", name: "Столы и стулья" },
    { id: "mice", name: "Мыши компьютерные" },
  ]);

  const [activeCatalogId, setActiveCatalogId] = useState("proctor-gamble");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    onConfirm: () => {},
  });

  const [sectionNameOverrides, setSectionNameOverrides] = useState<Record<string, string>>({});
  const [productOverrides, setProductOverrides] = useState<ProductOverrides>({});
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(ROOT_SECTION_ID);
  const [isResetting, setIsResetting] = useState(false);

  const [isCatalogSidebarCollapsed, setIsCatalogSidebarCollapsed] = useState(false);
  const [isSectionTreeCollapsed, setIsSectionTreeCollapsed] = useState(false);
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const globeButtonRef = useRef<HTMLDivElement>(null);

  const activeCatalog = catalogs.find((c) => c.id === activeCatalogId);
  const isCatalogInherited = activeCatalog?.isInherited ?? false;

  const sectionsWithOverrides = useMemo(
    () =>
      initialSections.map((s) => ({
        ...s,
        overriddenName: sectionNameOverrides[s.id] ?? undefined,
      })),
    [sectionNameOverrides]
  );

  const modifiedSectionsCount = useMemo(
    () => Object.keys(sectionNameOverrides).length,
    [sectionNameOverrides]
  );

  const modifiedProductsCount = useMemo(() => {
    return Object.keys(productOverrides).filter(
      (id) => productOverrides[id] && Object.keys(productOverrides[id]).length > 0
    ).length;
  }, [productOverrides]);

  const hasLocalChanges = modifiedProductsCount > 0 || modifiedSectionsCount > 0;

  const selectedSection = useMemo(
    () => sectionsWithOverrides.find((s) => s.id === selectedSectionId) ?? sectionsWithOverrides.find((s) => s.id === ROOT_SECTION_ID),
    [sectionsWithOverrides, selectedSectionId]
  );
  const sectionDisplayName = selectedSection ? (selectedSection.overriddenName ?? selectedSection.inheritedName) : "Корневой раздел";

  const productsForSection = useMemo(() => {
    if (!selectedSectionId) return initialProducts;
    return initialProducts.filter((p) => p.sectionId === selectedSectionId);
  }, [selectedSectionId]);

  const handleSectionNameChange = (sectionId: string, newName: string) => {
    const section = initialSections.find((s) => s.id === sectionId);
    if (!section) return;
    setSectionNameOverrides((prev) => {
      const next = { ...prev };
      if (newName.trim() === section.inheritedName) {
        delete next[sectionId];
        return next;
      }
      next[sectionId] = newName.trim();
      return next;
    });
  };

  const handleSectionNameReset = (sectionId: string) => {
    setSectionNameOverrides((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    if (isMobile) setIsSectionDrawerOpen(false);
  };

  const handleProductFieldChange = (productId: string, field: ProductFieldKey, value: string) => {
    const product = initialProducts.find((p) => p.id === productId);
    if (!product) return;
    const inheritedValue = product[field];
    setProductOverrides((prev) => {
      const next = { ...prev };
      const current = next[productId] ?? {};
      if (value === inheritedValue) {
        const { [field]: _, ...rest } = current;
        if (Object.keys(rest).length === 0) {
          delete next[productId];
        } else {
          next[productId] = rest;
        }
      } else {
        next[productId] = { ...current, [field]: value };
      }
      return next;
    });
  };

  const handleGlobeClick = () => {
    if (globeButtonRef.current) {
      const rect = globeButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left - 250,
      });
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleBreakLink = () => {
    setDropdownOpen(false);
    setConfirmationState({
      isOpen: true,
      title: "Разорвать связь с каталогом поставщика?",
      description:
        "После разрыва связи каталог станет полностью локальным. Вы больше не сможете получать обновления от поставщика. Все текущие товары останутся в вашем каталоге.",
      confirmText: "Разорвать связь",
      isDangerous: true,
      onConfirm: () => {
        setConfirmationState((s) => ({ ...s, isOpen: false }));
      },
    });
  };

  const handleViewUpdates = () => {
    setDropdownOpen(false);
    setConfirmationState({
      isOpen: true,
      title: "Доступны обновления каталога",
      description:
        "Поставщик обновил каталог 04.03.2026. Найдено 23 новых товара, 12 измененных товаров и 3 удаленных товара. Хотите применить обновления?",
      confirmText: "Применить обновления",
      onConfirm: () => {
        setConfirmationState((s) => ({ ...s, isOpen: false }));
      },
    });
  };

  const handleResetChanges = () => {
    setDropdownOpen(false);
    setResetModalOpen(true);
  };

  const handleResetConfirm = async (options: { resetProducts: boolean; resetSectionNames: boolean }) => {
    setResetModalOpen(false);

    const productsToReset = options.resetProducts ? modifiedProductsCount : 0;
    const sectionsToReset = options.resetSectionNames ? modifiedSectionsCount : 0;
    if (productsToReset === 0 && sectionsToReset === 0) return;

    setIsResetting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));

      const partialFailure =
        options.resetProducts && options.resetSectionNames && productsToReset > 0 && sectionsToReset > 0;

      if (options.resetProducts) {
        setProductOverrides({});
      }
      if (options.resetSectionNames) {
        setSectionNameOverrides({});
      }

      if (partialFailure) {
        toast.custom(
          (t) => (
            <div className="catalog-toast catalog-toast--error">
              <div className="catalog-toast__row">
                <div className="catalog-toast__content">
                  <span className="catalog-toast__icon" aria-hidden>✕</span>
                  <span className="catalog-toast__text">
                    <span className="catalog-toast__line">Сброс изменений не завершён</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="catalog-toast__close"
                  aria-label="Закрыть уведомление"
                  onClick={() => toast.dismiss(t.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ),
          { duration: 6000 }
        );
      } else if (productsToReset > 0 || sectionsToReset > 0) {
        const deletedCount = 5;
        toast.custom(
          (t) => (
            <div className="catalog-toast catalog-toast--success">
              <div className="catalog-toast__row">
                <div className="catalog-toast__content">
                  <span className="catalog-toast__icon" aria-hidden>i</span>
                  <span className="catalog-toast__text">
                    <span className="catalog-toast__line">Локальные изменения в каталоге сброшены</span>
                    {deletedCount > 0 && (
                      <span className="catalog-toast__line">Удалено товаров: {deletedCount} (отсутствуют в источнике)</span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  className="catalog-toast__close"
                  aria-label="Закрыть уведомление"
                  onClick={() => toast.dismiss(t.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ),
          { duration: 6000 }
        );
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-[#f6f7f9] flex h-dvh max-h-screen w-full overflow-hidden touch-pan-y" data-name="Каталог. Товары">
      {isMobile && !isCatalogSidebarCollapsed && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          aria-label="Закрыть список каталогов"
          onClick={() => setIsCatalogSidebarCollapsed(true)}
        />
      )}
      <CatalogSidebar
        catalogs={catalogs}
        activeCatalogId={activeCatalogId}
        onSelectCatalog={(id) => {
          setActiveCatalogId(id);
          if (isMobile) setIsCatalogSidebarCollapsed(true);
        }}
        collapsed={isCatalogSidebarCollapsed}
        onToggleCollapsed={() => setIsCatalogSidebarCollapsed((prev) => !prev)}
        isMobile={isMobile}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0 min-h-0">
        <div className="bg-white border-b border-[rgba(13,45,94,0.08)]">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full gap-[8px] px-3 pt-3 pb-3 md:pl-[12px] md:pr-[16px] md:pt-[12px] md:pb-[12px]">
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between pl-[8px] relative w-full">
                  <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div className="flex flex-col font-['PT_Root_UI:Bold',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#292932] text-[20px] text-ellipsis whitespace-nowrap">
                        <p className="leading-[28px]">{activeCatalog?.name}</p>
                      </div>
                      {activeCatalog?.isInherited && (
                        <div
                          ref={globeButtonRef}
                          className="bg-[rgba(0,127,255,0.08)] content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0 size-[24px] cursor-pointer hover:bg-[rgba(0,127,255,0.12)]"
                          onClick={handleGlobeClick}
                        >
                          <div className="overflow-clip relative shrink-0 size-[14px]">
                            <svg
                              className="absolute block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 12.25 12.25"
                            >
                              <path
                                clipRule="evenodd"
                                d={svgPaths.pe294fc0}
                                fill="var(--fill-0, #007FFF)"
                                fillRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0">
                    <div className="content-stretch flex items-center justify-center px-[12px] py-[4px] relative rounded-[8px] shrink-0 size-[32px] cursor-pointer hover:bg-[rgba(13,45,94,0.04)]">
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <svg
                          className="absolute block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 12.999 14.5"
                        >
                          <path
                            clipRule="evenodd"
                            d={svgPaths.p245e3b80}
                            fill="var(--fill-0, #909DAD)"
                            fillRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav
              role="tablist"
              aria-label="Разделы каталога"
              className="flex gap-[8px] h-[32px] w-full shrink-0 items-center overflow-x-auto overflow-y-hidden flex-nowrap py-1 -mx-1 px-1 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              data-name="Tabs line"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="relative h-full shrink-0">
                <span aria-hidden className="absolute inset-0 border-b-2 border-[#007fff] border-solid pointer-events-none" />
                <div className="flex h-full flex-row items-center justify-center">
                  <div className="flex h-full items-center justify-center px-[8px] py-[12px]">
                    <span className="font-['PT_Root_UI_VF',sans-serif] text-[14px] font-medium leading-4 text-[#222934] whitespace-nowrap">
                      Товары
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                role="tab"
                className="flex shrink-0 items-center font-['PT_Root_UI_VF',sans-serif] text-[14px] font-semibold leading-4 text-[rgba(37,52,71,0.84)] hover:text-[#222934] transition-colors px-[8px] py-[12px] whitespace-nowrap"
              >
                Настройки
              </button>
              <button
                type="button"
                role="tab"
                className="flex shrink-0 items-center font-['PT_Root_UI_VF',sans-serif] text-[14px] font-semibold leading-4 text-[rgba(37,52,71,0.84)] hover:text-[#222934] transition-colors px-[8px] py-[12px] whitespace-nowrap"
              >
                Общий доступ
              </button>
              <button
                type="button"
                role="tab"
                className="flex shrink-0 items-center font-['PT_Root_UI_VF',sans-serif] text-[14px] font-semibold leading-4 text-[rgba(37,52,71,0.84)] hover:text-[#222934] transition-colors px-[8px] py-[12px] whitespace-nowrap"
              >
                Импорт и экспорт
              </button>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white flex-col md:flex-row min-h-0">
          {!isSectionTreeCollapsed && !isMobile && (
            <SectionTree
              sections={sectionsWithOverrides}
              selectedSectionId={selectedSectionId}
              onSelectSection={handleSelectSection}
              onSectionNameChange={handleSectionNameChange}
              onResetSectionName={handleSectionNameReset}
              isCatalogInherited={isCatalogInherited}
              className="max-h-[40vh] md:max-h-none border-b md:border-b-0 border-[rgba(13,45,94,0.08)]"
            />
          )}
          <div className="flex flex-1 flex-col overflow-hidden min-w-0 min-h-0">
            <div className="flex-1 overflow-auto overflow-x-auto min-h-0">
              <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2 md:px-[16px] md:py-[10px] border-b border-[rgba(13,45,94,0.08)] bg-white">
                <button
                  type="button"
                  className="flex shrink-0 items-center justify-center min-h-[44px] min-w-[44px] w-11 h-11 rounded-[8px] hover:bg-[rgba(13,45,94,0.04)] active:bg-[rgba(13,45,94,0.08)] text-[rgba(13,45,94,0.56)] touch-manipulation"
                  aria-label={isMobile ? "Выбрать раздел" : isSectionTreeCollapsed ? "Показать дерево разделов" : "Свернуть дерево разделов"}
                  onClick={() => (isMobile ? setIsSectionDrawerOpen(true) : setIsSectionTreeCollapsed((prev) => !prev))}
                >
                  {isMobile ? (
                    <ChevronDown className="size-5 shrink-0" aria-hidden />
                  ) : isSectionTreeCollapsed ? (
                    <ChevronRight className="size-5 shrink-0" aria-hidden />
                  ) : (
                    <ChevronLeft className="size-5 shrink-0" aria-hidden />
                  )}
                </button>
                {isMobile ? (
                  <button
                    type="button"
                    className="flex flex-1 min-w-0 items-center text-left touch-manipulation min-h-[44px]"
                    onClick={() => setIsSectionDrawerOpen(true)}
                  >
                    <span className="font-['PT_Root_UI_VF:Medium',sans-serif] text-[14px] text-[#222934] truncate">
                      {sectionDisplayName}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-1 min-w-0 items-center justify-between">
                    <SectionHeaderTitle
                      name={sectionDisplayName}
                      canEdit={isCatalogInherited && !!selectedSection}
                      onRename={(newName) => selectedSection && handleSectionNameChange(selectedSection.id, newName)}
                      embedded
                    />
                  </div>
                )}
              </div>
              <CatalogTable
                products={productsForSection}
                productOverrides={productOverrides}
                onProductFieldChange={handleProductFieldChange}
                isCatalogInherited={isCatalogInherited}
              />
            </div>
          </div>
        </div>

        {/* На мобильных: выбор раздела в drawer — не нужно скроллить вверх */}
        <Drawer open={isSectionDrawerOpen} onOpenChange={setIsSectionDrawerOpen}>
          <DrawerContent direction="bottom" className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="border-b border-[rgba(13,45,94,0.08)]">
              <DrawerTitle className="font-['PT_Root_UI_VF:Medium',sans-serif] text-[14px] text-[#222934]">
                Выберите раздел
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-auto flex-1 min-h-0 px-2 pb-4">
              <SectionTree
                sections={sectionsWithOverrides}
                selectedSectionId={selectedSectionId}
                onSelectSection={handleSelectSection}
                onSectionNameChange={handleSectionNameChange}
                onResetSectionName={handleSectionNameReset}
                isCatalogInherited={isCatalogInherited}
                className="border-0"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {activeCatalog?.isInherited && (
        <InheritanceDropdown
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          position={dropdownPosition}
          onBreakLink={handleBreakLink}
          onViewUpdates={handleViewUpdates}
          onResetChanges={handleResetChanges}
          autoUpdateEnabled={autoUpdateEnabled}
          onToggleAutoUpdate={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
          hasLocalChanges={hasLocalChanges}
        />
      )}

      <ResetChangesModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        productCount={modifiedProductsCount}
        sectionCount={modifiedSectionsCount}
      />

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState((s) => ({ ...s, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
        isDangerous={confirmationState.isDangerous}
      />

      {/* Блокирующий лоадер во время сброса изменений */}
      {isResetting && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
          aria-label="Сбрасываем изменения"
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-[#007fff]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="font-['PT_Root_UI_VF:Medium',sans-serif] text-[14px] text-[#222934]">
              Сбрасываем изменения…
            </p>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
}
