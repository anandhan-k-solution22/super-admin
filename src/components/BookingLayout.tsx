import Sidebar from "./_components/dynamicSidebar";

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
         <div className="flex h-screen max-h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3 h-screen max-h-screen">
          {children}
        </main>
      </div>
    )
}
