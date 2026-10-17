import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Relora. Remember the details that win client relationships. Now on the App Store.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "src/app/fonts");
  const [fraunces, inter] = await Promise.all([
    readFile(join(fontDir, "Fraunces72pt-SemiBold.ttf")),
    readFile(join(fontDir, "Inter-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#faf7f1",
          color: "#101418",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 44, lineHeight: 1 }}>
            Relora
          </div>
          <div
            style={{
              width: 72,
              height: 6,
              marginTop: 28,
              background: "#f05a3b",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: 72,
            lineHeight: 1.1,
            letterSpacing: -1,
            maxWidth: 960,
          }}
        >
          Remember the details that win client relationships.
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 30, color: "#5b626a" }}>
          Now on the App Store. iPhone. Free for 7 days.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
    },
  );
}
