export const metadata = {
  title: "Dev Jobs Board",
  description: "Live LinkedIn developer job listings — Software / Fullstack / Backend, SF & Dhaka",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
