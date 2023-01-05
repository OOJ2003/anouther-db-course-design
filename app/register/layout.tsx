import "@css/global.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className="flex text-center justify-center items-center bg-gradient-to-r from-sky-200 to-blue-200 ">
        {children}
      </body>
    </html>
  )
}
