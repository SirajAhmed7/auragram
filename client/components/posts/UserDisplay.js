import Image from "next/image";
import Link from "next/link";

function UserDisplay({ user }) {
  if (!user) return null;

  return (
    <Link href={"/users/" + user.username} className="block">
      <div className="flex items-center gap-4 relative z-10">
        <Image
          src={user.avatar || "/images/default-avatar.jpg"}
          alt={user.fullName}
          width={32}
          height={32}
          className="rounded-full"
        />
        <h2 className="text-base font-medium">{user.fullName}</h2>
      </div>
    </Link>
  );
}

export default UserDisplay;
