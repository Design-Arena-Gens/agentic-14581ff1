export const metadata = {
  title: 'PUMP TRACKER - Get Hyped!',
  description: 'Track your workouts and crush your goals!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
