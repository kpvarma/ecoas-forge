import { useParams } from "react-router-dom";
import UserDetail from "@/components/users/UserDetail";
import { mockUsers } from "@/lib/mock/users"; // Import mock users

export default function UserShow() {
  const { id } = useParams();
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return <div className="p-4 text-center">User not found.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <UserDetail user={user} />
    </div>
  );
}
