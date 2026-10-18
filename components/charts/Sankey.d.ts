import * as React from "react";

/** 流转 · Sankey with gradient links, path isolation on hover/click, in/out ledger, stage headers and a visible 未分配 tail. Needs d3-sankey. */
export interface SankeyProps {
  nodes: Array<{ id: string; label?: string; tone?: string; group?: string }>;
  links: Array<{ source: string; target: string; value: number; tone?: string }>;
  height?: number;
  unit?: string;
  format?: (v: number) => string;
  nodeWidth?: number;
  nodePadding?: number;
  /** column alignment */
  align?: "justify" | "left" | "right" | "center";
  /** one header per column, left to right */
  stages?: string[];
  /** node group → tone; ungrouped nodes are gold */
  groupTone?: Record<string, string>;
  /** print each node's share of the first stage */
  showShare?: boolean;
  /** draw flow that leaves a node unaccounted as a 朱红 tail */
  showBalance?: boolean;
  /** hide labels on nodes thinner than this (px) unless focused */
  minLabelHeight?: number;
  linkOpacity?: number;
  /** order links by value within each node (fewer crossings) */
  sortLinks?: boolean;
  /** draw links in once on mount */
  reveal?: boolean;
  caption?: string;
  note?: string;
  scope?: string;
  grade?: "E1" | "E2" | "E3" | "E4";
}
export function Sankey(props: SankeyProps): JSX.Element;
