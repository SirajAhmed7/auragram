"use client";

import { logoutAction } from "@/lib/actions";
import { useUser } from "@/contexts/UserContext";

export default function LogoutButton({ children, className }) {
  const { logout } = useUser();

  const handleLogout = async () => {
    // Call the server action to clear the cookie and redirect
    // This will redirect before the user state is cleared, preventing errors
    await logoutAction();

    // Clear the user state in context
    logout();
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
