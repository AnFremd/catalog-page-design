import { useState, useRef, useMemo } from "react";
import { CatalogSidebar } from "./components/CatalogSidebar";
import { SectionTree } from "./components/SectionTree";
import { InheritanceDropdown } from "./components/InheritanceDropdown";
import { ResetChangesModal } from "./components/ResetChangesModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { CatalogTable } from "./components/CatalogTable";
import type { ProductOverrides, ProductFieldKey } from "./components/CatalogTable";
import { initialSections, initialProducts, ROOT_SECTION_ID } from "./data/catalogData";
import { Toaster } from "./components/ui/sonner";
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
}

function SectionHeaderTitle({ name, canEdit, onRename }: SectionHeaderTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed) onRename(trimmed);
    else setValue(name);
  };

  return (
    <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[rgba(13,45,94,0.08)]">
      {isEditing && canEdit ? (
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
      )}
    </div>
  );
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
    <div className="bg-[#f5f7fa] flex h-screen w-full overflow-hidden">
      <CatalogSidebar
        catalogs={catalogs}
        activeCatalogId={activeCatalogId}
        onSelectCatalog={setActiveCatalogId}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <div className="bg-white border-b border-[rgba(13,45,94,0.08)]">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full p-[12px_16px]">
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

            <div className="content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0 w-full mt-[8px]">
              <div className="h-full relative shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute border-[#007fff] border-b-2 border-solid inset-0 pointer-events-none"
                />
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex h-full items-center justify-center px-[8px] py-[12px] relative">
                    <div className="flex flex-col font-['PT_Root_UI_VF:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#222934] text-[14px] whitespace-nowrap">
                      <p className="leading-[16px]">Товары</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full relative shrink-0 cursor-pointer hover:bg-[rgba(13,45,94,0.04)] rounded-[8px]">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex h-full items-center justify-center px-[8px] py-[12px] relative">
                    <div className="flex flex-col font-['PT_Root_UI_VF:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(37,52,71,0.84)] whitespace-nowrap">
                      <p className="leading-[16px]">Настройки</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex h-[32px] items-center justify-center px-[8px] py-[12px] relative shrink-0 cursor-pointer hover:bg-[rgba(13,45,94,0.04)] rounded-[8px]">
                <div className="flex flex-col font-['PT_Root_UI_VF:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(37,52,71,0.84)] whitespace-nowrap">
                  <p className="leading-[16px]">Общий доступ</p>
                </div>
              </div>
              <div className="content-stretch flex items-center justify-center px-[8px] py-[12px] relative shrink-0 cursor-pointer hover:bg-[rgba(13,45,94,0.04)] rounded-[8px]">
                <div className="flex flex-col font-['PT_Root_UI_VF:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(37,52,71,0.84)] whitespace-nowrap">
                  <p className="leading-[16px]">Импорт и Экспорт</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white">
          <SectionTree
            sections={sectionsWithOverrides}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onSectionNameChange={handleSectionNameChange}
            onResetSectionName={handleSectionNameReset}
            isCatalogInherited={isCatalogInherited}
          />

          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            {/* Название раздела, в котором находимся — единственное место, где можно переименовывать раздел */}
            <SectionHeaderTitle
              name={sectionDisplayName}
              canEdit={isCatalogInherited && !!selectedSection}
              onRename={(newName) => selectedSection && handleSectionNameChange(selectedSection.id, newName)}
            />

            <div className="flex-1 overflow-auto">
              <CatalogTable
                products={productsForSection}
                productOverrides={productOverrides}
                onProductFieldChange={handleProductFieldChange}
                isCatalogInherited={isCatalogInherited}
              />
            </div>
          </div>
        </div>
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
