import { ImageResponse } from "next/og";

export const alt = "engtype — IELTS & TOEFL writing practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// English text on purpose: the default OG font has no Cyrillic glyphs
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0b0b", color: "#ededed", padding: 80 }}>
        <div style={{ fontSize: 40, display: "flex" }}>
          eng<span style={{ fontStyle: "italic" }}>type</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>Writing practice for IELTS and TOEFL</div>
          <div style={{ fontSize: 32, color: "#8c8c88" }}>Criterion-by-criterion feedback · A1–C2 · estimated scores</div>
        </div>
      </div>
    ),
    size,
  );
}
