import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-[0.3fr_1fr_0.3fr] min-h-screen">
        <aside>
          <Sidebar />
        </aside>
        <main className="min-h-screen pt-20 px-5 pb-5">{children}</main>
        <aside></aside>
      </div>
    </div>
  );
}
