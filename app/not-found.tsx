import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>404 - Page Not Found</title>
      </head>
      <body
        style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              margin: "0 0 1rem 0",
              color: "#000",
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: "0 0 1rem 0",
              color: "#000",
            }}
          >
            Page Not Found
          </h2>
          <p
            style={{
              margin: "0 0 2rem 0",
              color: "#666",
            }}
          >
            The page you are looking for does not exist.
          </p>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "0.375rem",
              fontWeight: "500",
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </body>
    </html>
  );
}
