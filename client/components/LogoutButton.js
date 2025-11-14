"use client";

import { logoutAction } from "@/lib/actions";
import { useUser } from "@/contexts/UserContext";

export default function LogoutButton({ children, className }) {
  const { logout } = useUser();

  const handleLogout = async () => {
    // Clear the user state in context
    logout();
    // Call the server action to clear the cookie and redirect
    await logoutAction();
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
