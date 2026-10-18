import * as React from "react";

/** 元模式 · small multiples: one panel per value of an extra dimension, shared scale. Draws through chartKit (d3 v7 on window). */
export interface FacetGridProps {
  panels: Array<{ key?: string; title: string; meta?: string; [k: string]: any }>;
  columns?: number;
  gap?: number;
  /** draw one facet; ctx.width is the facet width, ctx.max any shared scale max */
  render: (panel: any, ctx: { width: number; height: number; max?: number; index: number }) => React.ReactNode;
  caption?: string;
  note?: string;
  scope?: string;
  panelHeight?: number;
  /** shared scale maximum passed to every facet */
  max?: number;
  rowLabel?: string;
}
export function FacetGrid(props: FacetGridProps): JSX.Element;
