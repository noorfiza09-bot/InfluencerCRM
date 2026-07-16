import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InfluencerCRM — manage creator campaigns end-to-end";
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
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(99,102,241,0.35), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 40,
            fontWeight: 700,
            color: "#f5f5f5",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#6366f1",
              display: "flex",
            }}
          />
          InfluencerCRM
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#a1a1aa",
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          Manage creator relationships and campaign deliverables end-to-end
          for brand marketers running influencer campaigns.
        </div>
      </div>
    ),
    { ...size }
  );
}
