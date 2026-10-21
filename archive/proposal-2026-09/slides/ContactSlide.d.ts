import * as React from "react";

/**
 * Closer on ink: 携手侍天，持续领先 + WeChat QR + the Latin tagline.
 */
export interface ContactSlideProps {
  title?: string;
  body?: string;
  cta?: string;
  /** path to the WeChat QR image; omitted renders a placeholder */
  qr?: string;
  tagline?: string;
  page?: number;
}
export function ContactSlide(props: ContactSlideProps): JSX.Element;
