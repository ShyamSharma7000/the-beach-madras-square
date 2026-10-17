import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A1C2A",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          borderRadius: 7,
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 999, background: "#FFC46B", marginBottom: 10 }} />
        <div
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 11, background: "#17405A" }}
        />
      </div>
    ),
    size,
  );
}
