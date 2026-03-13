import { useEffect, useRef, useState } from "react";
import { ROOT_SECTION_ID } from "../data/catalogData";
import svgPaths from "../../imports/svg-woxmq9225x";

export interface Section {
  id: string;
  parentId: string | null;
  inheritedName: string;
  overriddenName?: string | null;
}

interface SectionTreeProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onSectionNameChange: (sectionId: string, newName: string) => void;
  onResetSectionName: (sectionId: string) => void;
  isCatalogInherited?: boolean;
}

interface SectionMenuState {
  sectionId: string;
  top: number;
  left: number;
  isOverridden: boolean;
}

function buildTree(sections: Section[], parentId: string | null): Section[] {
  return sections
    .filter((s) => s.parentId === parentId)
    .sort((a, b) =>
      a.id === ROOT_SECTION_ID ? -1 : b.id === ROOT_SECTION_ID ? 1 : a.inheritedName.localeCompare(b.inheritedName)
    );
}

function SectionRow({
  section,
  sections,
  depth,
  selectedSectionId,
  onSelectSection,
  onSectionNameChange,
  onResetSectionName,
  menuState,
  setMenuState,
  isInherited,
}: {
  section: Section;
  sections: Section[];
  depth: number;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onSectionNameChange: (sectionId: string, newName: string) => void;
  onResetSectionName: (sectionId: string) => void;
  menuState: SectionMenuState | null;
  setMenuState: (state: SectionMenuState | null) => void;
  isInherited: boolean;
}) {
  const displayName = section.overriddenName ?? section.inheritedName;
  const isOverridden = section.overriddenName != null && section.overriddenName !== section.inheritedName;
  const children = buildTree(sections, section.id);
  const menuOpen = menuState?.sectionId === section.id;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex items-center gap-[6px] py-[6px] px-[8px] rounded-[8px] cursor-pointer min-h-[32px] group ${
          selectedSectionId === section.id ? "bg-[rgba(13,45,94,0.08)]" : "hover:bg-[rgba(13,45,94,0.04)]"
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelectSection(section.id)}
      >
        {isOverridden && (
          <div className="shrink-0 w-[3px] h-4 rounded-full bg-[#f5a623]" title="Название изменено" />
        )}
        <span
          className="flex-1 min-w-0 font-['PT_Root_UI:Regular',sans-serif] text-[14px] text-[#222934] truncate"
          title={displayName}
        >
          {displayName}
        </span>

        {isInherited && (
          <div className="relative ml-[4px]" onClick={(e) => e.stopPropagation()}>
            <button
              ref={buttonRef}
              className="flex items-center justify-center w-[24px] h-[24px] rounded-[8px] hover:bg-[rgba(13,45,94,0.04)]"
              aria-label="Открыть меню раздела"
              onClick={() => {
                if (menuOpen) {
                  setMenuState(null);
                  return;
                }
                const rect = buttonRef.current?.getBoundingClientRect();
                const width = 300;
                if (rect) {
                  setMenuState({
                    sectionId: section.id,
                    top: rect.bottom + 4,
                    left: rect.right - width,
                    isOverridden,
                  });
                } else {
                  setMenuState({
                    sectionId: section.id,
                    top: 0,
                    left: 0,
                    isOverridden,
                  });
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 3.375 14.625"
                fill="none"
                className="block shrink-0"
              >
                <path
                  d={svgPaths.p1bc46000}
                  fill="rgba(13,45,94,0.56)"
                  stroke="rgba(13,45,94,0.56)"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {children.map((child) => (
        <SectionRow
          key={child.id}
          section={child}
          sections={sections}
          depth={depth + 1}
          selectedSectionId={selectedSectionId}
          onSelectSection={onSelectSection}
          onSectionNameChange={onSectionNameChange}
          onResetSectionName={onResetSectionName}
          menuState={menuState}
          setMenuState={setMenuState}
          isInherited={isInherited}
        />
      ))}
    </div>
  );
}

export function SectionTree({
  sections,
  selectedSectionId,
  onSelectSection,
  onSectionNameChange,
  onResetSectionName,
  isCatalogInherited = true,
}: SectionTreeProps) {
  const roots = buildTree(sections, null);
  const [menuState, setMenuState] = useState<SectionMenuState | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setMenuState(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuState(null);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white flex flex-col h-full shrink-0 w-[260px] border-r border-[rgba(13,45,94,0.08)]"
      data-name="Section tree"
    >
      <div
        className="flex-1 overflow-auto py-[8px] px-[4px]"
        onScroll={() => setMenuState(null)}
      >
        {roots.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            sections={sections}
            depth={0}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onSectionNameChange={onSectionNameChange}
            onResetSectionName={onResetSectionName}
            menuState={menuState}
            setMenuState={setMenuState}
            isInherited={isCatalogInherited}
          />
        ))}
      </div>
      {menuState && (
        <div
          className="fixed z-50"
          style={{ top: menuState.top, left: menuState.left }}
        >
          <div className="menu-block bg-white rounded-[12px] shadow-[0px_2px_8px_0px_rgba(22,34,51,0.04),0px_12px_24px_0px_rgba(22,34,51,0.06)] border border-[rgba(13,45,94,0.08)]">
            <button
              className="w-full text-left px-[12px] py-[8px] text-[14px] text-[rgba(13,45,94,0.40)] cursor-not-allowed"
              type="button"
            >
              Создать копию
            </button>
            <button
              className={`w-full text-left px-[12px] py-[8px] text-[14px] ${
                menuState.isOverridden
                  ? "text-[#222934] hover:bg-[rgba(13,45,94,0.04)] cursor-pointer"
                  : "text-[rgba(13,45,94,0.40)] cursor-not-allowed"
              }`}
              type="button"
              disabled={!menuState.isOverridden}
              onClick={() => {
                if (!menuState.isOverridden) return;
                onResetSectionName(menuState.sectionId);
                setMenuState(null);
              }}
            >
              Сбросить название
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
