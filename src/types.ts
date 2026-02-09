export type AssetClass = "Macro" | "Equities" | "Credit";

export interface Instrument {
  ticker: string;
  price: number;
  assetClass: AssetClass;
}
