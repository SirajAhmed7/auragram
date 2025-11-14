import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SidebarLinks({ Icon, title, href }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "text-base lg:text-xl text-slate-800 flex items-center gap-4 p-2 w-full rounded-lg hover:bg-slate-100 transition-colors duration-300",
        pathname === href && "font-medium text-slate-950"
      )}
    >
      <Icon
        size={24}
        strokeWidth={pathname === href ? 2.5 : 2}
        className={pathname === href ? "text-cyan-700" : ""}
      />
      {title}
    </Link>
  );
}

export default SidebarLinks;
