import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.svg, drawn full bleed. iOS rounds the corners itself.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#faf7f1",
        }}
      >
        <svg width="180" height="180" viewBox="1 1 52 52" fill="none">
          <path
            d="M33 16H21C18.7909 16 17 17.7909 17 20V35C17 37.2091 18.7909 39 21 39H33"
            stroke="#101418"
            strokeWidth="2"
          />
          <path d="M33 16V28L39 22V16H33Z" fill="#F05A3B" />
          <circle cx="30" cy="28" r="2" fill="#2E6F62" />
        </svg>
      </div>
    ),
    size,
  );
}
