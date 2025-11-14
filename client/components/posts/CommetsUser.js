import { getTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function CommetsUser(user, createdAt) {
  return (
    <Link href={"/users/" + user.username} className="block">
      <div className="flex items-center gap-4 relative z-10">
        <Image
          src={user.avatar}
          alt={user.fullName}
          width={32}
          height={32}
          className="rounded-full"
        />
        <h2 className="text-base font-medium">{user.fullName}</h2>
        <p className="text-sm text-gray-500">{getTimeAgo(createdAt)}</p>
      </div>
    </Link>
  );
}

export default CommetsUser;
