import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top left, rgba(174,34,52,0.24), transparent 34%), linear-gradient(135deg, #fff9f3 0%, #f8f4ee 45%, #f2ece6 100%)",
          color: "#1f2937",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: "36px",
            border: "1px solid rgba(31,41,55,0.08)",
            background: "rgba(255,255,255,0.78)",
            padding: "48px",
            boxShadow: "0 32px 90px rgba(15,23,42,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ae2234",
            }}
          >
            SecureUploads.ca
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                maxWidth: "840px",
              }}
            >
              Private, one-time file sharing without the extra friction.
            </div>
            <div
              style={{
                maxWidth: "860px",
                fontSize: 28,
                lineHeight: 1.4,
                color: "#4b5563",
              }}
            >
              Upload a file, add an optional password, choose an expiry, and
              send a clean temporary download link.
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            {["One-time links", "Optional password", "No account required"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 22px",
                    borderRadius: "999px",
                    border: "1px solid rgba(31,41,55,0.12)",
                    background: "rgba(255,255,255,0.82)",
                    fontSize: 22,
                    color: "#111827",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    size
  );
}
