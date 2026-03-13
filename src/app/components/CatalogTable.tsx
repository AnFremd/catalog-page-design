import svgPaths from "../../imports/svg-woxmq9225x";

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  richText: string;
  hasImage: boolean;
  price: number;
  discount: number;
  /** id раздела, в котором показывается товар */
  sectionId: string;
}

export type ProductFieldKey = "name" | "description" | "richText";

export interface ProductOverrides {
  [productId: string]: Partial<Pick<ProductRow, "name" | "description" | "richText">>;
}

interface CatalogTableProps {
  products: ProductRow[];
  productOverrides: ProductOverrides;
  onProductFieldChange: (productId: string, field: ProductFieldKey, value: string) => void;
  isCatalogInherited: boolean;
}

const THREE_DOTS_PATH = svgPaths.p1bc46000;

// Reusable three-dots icon — фиксированный размер, без расползания
function TableMenuIcon({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center shrink-0 w-[24px] h-[24px]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 3.375 14.625"
        fill="none"
        className="block shrink-0"
      >
        <path
          d={THREE_DOTS_PATH}
          fill={color}
          stroke={color}
        />
      </svg>
    </div>
  );
}

// Иконка «три точки» для шапки таблицы — строго в ячейке 24×24
function HeaderMenuIcon() {
  return (
    <div className="flex items-center justify-center shrink-0 w-[24px] h-[24px] min-w-[24px]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 3.375 14.625"
        fill="none"
        className="block shrink-0"
      >
        <path
          d={THREE_DOTS_PATH}
          fill="#546881"
          stroke="#546881"
        />
      </svg>
    </div>
  );
}

function EditableCell({
  value,
  isOverridden,
  isInheritedCatalog,
  onChange,
  className = "",
  multiline = false,
}: {
  value: string;
  isOverridden: boolean;
  isInheritedCatalog: boolean;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  const bgClass =
    !isInheritedCatalog || isOverridden
      ? "bg-white"
      : "bg-[rgba(0,127,255,0.06)]";
  const borderClass = isOverridden ? "border-l-[3px] border-l-[#f5a623]" : "";

  return (
    <div
      className={`relative flex items-start min-h-[36px] w-full min-w-0 pl-[16px] pr-[8px] py-[8px] ${bgClass} ${borderClass} ${className}`}
    >
      {multiline ? (
        <textarea
          className="flex-1 min-w-0 w-full font-['PT_Root_UI:Regular',sans-serif] text-[14px] text-[#292932] bg-transparent border-0 resize-none outline-none focus:ring-0 leading-[18px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
        />
      ) : (
        <input
          type="text"
          className="flex-1 min-w-0 w-full font-['PT_Root_UI:Regular',sans-serif] text-[14px] text-[#292932] bg-transparent border-0 outline-none focus:ring-0 leading-[18px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function CatalogTable({
  products,
  productOverrides,
  onProductFieldChange,
  isCatalogInherited,
}: CatalogTableProps) {
  const col1W = "w-[36px] min-w-[36px]";
  const col2W = "w-[252px] min-w-[252px]";
  const col3W = "w-[252px] min-w-[252px]";
  const col4W = "w-[340px] min-w-[340px]";
  const col5W = "w-[106px] min-w-[106px]";
  const headerCellPad = "pl-[16px] pr-[8px] py-[8px]";
  const bodyCellPad = ""; // для редактируемых ячеек вертикальные отступы внутри EditableCell

  return (
    <div className="flex flex-col w-full overflow-auto">
      {/* Table Header */}
      <div
        className="flex h-[48px] shrink-0 sticky top-0 bg-white z-10 border-b border-[#ebeef2]"
        data-name="Header row"
      >
        <div
          className={`bg-[rgba(13,45,94,0.04)] flex items-center justify-center ${headerCellPad} shrink-0 ${col1W} border-r border-[#ebeef2]`}
          data-name="Header table"
        />
        <div
          className={`bg-[rgba(13,45,94,0.04)] flex items-center ${headerCellPad} relative shrink-0 ${col2W} border-r border-[#ebeef2]`}
        >
          <div className="flex h-full flex-1 min-w-0 items-center justify-between gap-2">
            <div className="flex gap-[8px] items-center min-w-0 flex-1">
              <div className="overflow-hidden shrink-0 size-[16px] flex items-center justify-center">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="block">
                  <path clipRule="evenodd" d={svgPaths.p1aafcf00} fill="#292932" fillRule="evenodd" />
                </svg>
              </div>
              <p className="leading-[18px] truncate font-['PT_Root_UI:Bold',sans-serif] text-[#292932] text-[14px]">Название</p>
            </div>
            <HeaderMenuIcon />
          </div>
        </div>
        <div
          className={`bg-[rgba(13,45,94,0.04)] flex items-center ${headerCellPad} relative shrink-0 ${col3W} border-r border-[#ebeef2]`}
        >
          <div className="flex h-full flex-1 min-w-0 items-center justify-between gap-2">
            <div className="flex gap-[8px] items-center min-w-0 flex-1">
              <div className="overflow-hidden shrink-0 size-[16px] flex items-center justify-center">
                <svg width="10" height="12" viewBox="0 0 10.5092 12" fill="none" className="block">
                  <path clipRule="evenodd" d={svgPaths.p5f4f000} fill="#292932" fillRule="evenodd" />
                </svg>
              </div>
              <p className="leading-[18px] truncate font-['PT_Root_UI:Bold',sans-serif] text-[#292932] text-[14px]">Описание</p>
            </div>
            <HeaderMenuIcon />
          </div>
        </div>
        <div
          className={`bg-[rgba(13,45,94,0.04)] flex items-center ${headerCellPad} relative shrink-0 ${col4W} border-r border-[#ebeef2]`}
        >
          <div className="flex h-full flex-1 min-w-0 items-center justify-between gap-2">
            <div className="flex gap-[8px] items-center min-w-0 flex-1">
              <div className="overflow-hidden shrink-0 size-[16px] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="block">
                  <path clipRule="evenodd" d={svgPaths.p20fcd80} fill="#292932" fillRule="evenodd" />
                </svg>
              </div>
              <p className="leading-[18px] truncate font-['PT_Root_UI:Bold',sans-serif] text-[#292932] text-[14px]">Характеристики</p>
            </div>
            <HeaderMenuIcon />
          </div>
        </div>
        <div
          className={`bg-[rgba(13,45,94,0.04)] flex items-center ${headerCellPad} relative shrink-0 ${col5W}`}
        >
          <div className="flex h-full flex-1 min-w-0 items-center justify-between gap-2">
            <div className="flex gap-[8px] items-center min-w-0 flex-1">
              <div className="overflow-hidden shrink-0 size-[16px] flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 13.0001 13" fill="none" className="block">
                  <path clipRule="evenodd" d={svgPaths.p9b0b200} fill="#292932" fillRule="evenodd" />
                </svg>
              </div>
              <p className="leading-[18px] truncate font-['PT_Root_UI:Bold',sans-serif] text-[#292932] text-[14px]">Фото</p>
            </div>
            <HeaderMenuIcon />
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col">
        {products.map((product) => {
          const overrides = productOverrides[product.id] ?? {};
          const name = overrides.name ?? product.name;
          const description = overrides.description ?? product.description;
          const richText = overrides.richText ?? product.richText;
          const nameOverridden = overrides.name !== undefined;
          const descriptionOverridden = overrides.description !== undefined;
          const richTextOverridden = overrides.richText !== undefined;

          return (
            <div
              key={product.id}
              className="flex min-h-[52px] shrink-0 hover:bg-[rgba(13,45,94,0.02)] border-b border-[#ebeef2]"
              data-name="Row"
            >
              <div className={`flex items-center justify-center ${bodyCellPad} shrink-0 ${col1W} border-r border-[#ebeef2]`}>
                <TableMenuIcon color="#B2BBC6" />
              </div>

              <div className={`flex items-stretch relative shrink-0 ${col2W} border-r border-[#ebeef2]`}>
                <EditableCell
                  value={name}
                  isOverridden={nameOverridden}
                  isInheritedCatalog={isCatalogInherited}
                  onChange={(v) => onProductFieldChange(product.id, "name", v)}
                />
              </div>

              <div className={`flex items-stretch relative shrink-0 ${col3W} border-r border-[#ebeef2]`}>
                <EditableCell
                  value={description}
                  isOverridden={descriptionOverridden}
                  isInheritedCatalog={isCatalogInherited}
                  onChange={(v) => onProductFieldChange(product.id, "description", v)}
                />
              </div>

              <div className={`flex items-stretch relative shrink-0 ${col4W} border-r border-[#ebeef2]`}>
                <EditableCell
                  value={richText}
                  isOverridden={richTextOverridden}
                  isInheritedCatalog={isCatalogInherited}
                  onChange={(v) => onProductFieldChange(product.id, "richText", v)}
                  multiline
                />
              </div>

              <div className={`flex items-center justify-center ${bodyCellPad} relative shrink-0 ${col5W}`}>
                {product.hasImage ? (
                  <div className="flex items-center justify-center shrink-0">
                    <div className="h-[36px] relative rounded-[4px] shrink-0 w-[42px]">
                      <div className="absolute bg-[#ebeef2] left-[14px] rounded-[4px] size-[28px] top-[4px]" />
                      <div className="absolute bg-[#b2bbc6] left-0 rounded-[4px] size-[36px] top-0" />
                    </div>
                  </div>
                ) : (
                  <span className="text-[12px] text-[rgba(37,52,71,0.56)]">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
