import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return <Button variant="destructive" onClick={handleLogout}>Logout</Button>;
}