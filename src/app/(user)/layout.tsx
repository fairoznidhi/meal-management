export default function UserLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div>
            <h1 className="text-center text-5xl">User Layout</h1>
            <div>{children}</div>
        </div>
    )
  }