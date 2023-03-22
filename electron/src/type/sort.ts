export type SortType = "label" | "createTime";
export type OrderType = "ASC" | "DESC";

export interface Sort {
  type: SortType;
  order: OrderType;
}
