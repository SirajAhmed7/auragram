"use client";

import { Bookmark, Heart, Home, UserStar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SidebarLinks from "./SidebarLinks";

function Sidebar() {
  return (
    <nav className="bg-white border-r border-r-slate-200 h-screen sticky top-0 left-0 pt-20 px-4 py-5 flex flex-col justify-between">
      <div className="space-y-1.5">
        <SidebarLinks Icon={Home} title="Home" href="/" />
        <SidebarLinks Icon={UserStar} title="Friends" href="/friends" />
        <SidebarLinks Icon={Bookmark} title="Saved" href="/user/saved" />
        <SidebarLinks
          Icon={Heart}
          title="Notificatoins"
          href="/user/notifications"
        />
      </div>

      <Link href={"/user"} className="flex items-center gap-4 p-2">
        <Image
          src="/images/default-avatar.jpg"
          alt="User"
          width={36}
          height={36}
          className="border border-slate-50 rounded-full"
        />
        <p className="text-xl font-semibold">Alice Cooper</p>
      </Link>
    </nav>
  );
}

export default Sidebar;
