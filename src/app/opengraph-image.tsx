import { ImageResponse } from "next/og";

export const alt = "The Beach by Madras Square, Uthandi, Chennai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          color: "#EDF0EA",
          background:
            "linear-gradient(180deg, #25446F 0%, #F7A15A 46%, #17405A 46%, #0C2A3E 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 150,
            width: 110,
            height: 110,
            borderRadius: 999,
            background: "#FFC46B",
          }}
        />
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>The Beach</div>
        <div style={{ fontSize: 40, marginTop: 14 }}>by Madras Square, Uthandi, Chennai</div>
      </div>
    ),
    size,
  );
}
