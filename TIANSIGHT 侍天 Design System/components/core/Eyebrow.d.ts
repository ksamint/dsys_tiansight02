import * as React from "react";

/** Small-caps bronze kicker that opens every section: eyebrow → headline → substantiation → proof. */
export interface EyebrowProps {
  children?: React.ReactNode;
  tone?: "bronze" | "muted" | "inverse";
  as?: keyof JSX.IntrinsicElements;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;
