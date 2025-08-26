// src/app/page.tsx - Direct redirect that WILL work
export default function RootPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p>Redirecting...</p>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            console.log("🚀 Redirecting from root page");
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          `,
        }}
      />
    </div>
  );
}
