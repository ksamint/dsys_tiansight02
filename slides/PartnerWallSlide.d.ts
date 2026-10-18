import * as React from "react";

/**
 * Partner grid + one testimonial. Names are set in type until real logo artwork exists.
 */
export interface PartnerWallSlideProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** verbatim brand names — never invent partners */
  partners?: string[];
  /** once real marks exist, pass these instead and they replace the type */
  logos?: Array<{ name: string; src: string }>;
  quote?: { text: string; by: string; role?: string };
  page?: number;
}
export function PartnerWallSlide(props: PartnerWallSlideProps): JSX.Element;
