import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeaderRight from "./HeaderRight";

function Header() {
  return (
    <header className="bg-white px-4 py-2.5 grid grid-cols-3 items-center border-b border-b-slate-200 fixed top-0 left-0 right-0 z-50">
      <Link href="/" className="justify-self-start">
        <Image
          src="/images/logo-text.svg"
          alt="Auragram Logo"
          width={160}
          height={36}
        />
      </Link>

      <div className="relative overflow-visible">
        <Search
          size={24}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search..."
          className="text-base border border-slate-200 bg-slate-100 text-slate-700 placeholder-slate-400 w-full rounded-full py-1.5 pl-14 pr-4"
        />
      </div>

      <HeaderRight />
    </header>
  );
}

export default Header;
