import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Building, MapPin, Package } from "lucide-react";

// Mock users data with role details
const mockUsers: { [key: string]: any } = {
  "Jane Smith": {
    name: "Jane Smith",
    title: "Senior Quality Analyst",
    department: "Quality Assurance",
    email: "jane.smith@entegris.com",
    partNumbers: ["IPA-SG-99.9", "ACE-EG-99.5"],
    plantIds: ["PLT-001", "PLT-002"],
    imageUrl: "https://i.pravatar.cc/150?img=3", // Example image
  },
  "Mike Johnson": {
    name: "Mike Johnson",
    title: "QC Supervisor",
    department: "Quality Control",
    email: "mike.johnson@entegris.com",
    partNumbers: ["MET-AL-98.7", "ETH-GL-97.2"],
    plantIds: ["PLT-003"],
    imageUrl: "https://i.pravatar.cc/150?img=12", // Example image
  },
  "Sarah Davis": {
    name: "Sarah Davis",
    title: "Lab Manager",
    department: "Laboratory Services",
    email: "sarah.davis@entegris.com",
    partNumbers: ["HEX-AN-99.8", "TOL-UE-96.5"],
    plantIds: ["PLT-001", "PLT-004"],
    imageUrl: "https://i.pravatar.cc/150?img=6", // Example image
  },
  "Tom Wilson": {
    name: "Tom Wilson",
    title: "Quality Engineer",
    department: "Quality Engineering",
    email: "tom.wilson@entegris.com",
    partNumbers: ["XYL-EN-98.1", "BEN-ZE-99.3"],
    plantIds: ["PLT-002", "PLT-003"],
    imageUrl: "https://i.pravatar.cc/150?img=10", // Example image
  }
};

// Color mapping function based on first letter of name
const getColorByFirstLetter = (name: string): string => {
  const firstLetter = name.charAt(0).toUpperCase();
  const colorMap: { [key: string]: string } = {
    A: "bg-red-100 text-red-800 border-red-200",
    B: "bg-orange-100 text-orange-800 border-orange-200", 
    C: "bg-amber-100 text-amber-800 border-amber-200",
    D: "bg-yellow-100 text-yellow-800 border-yellow-200",
    E: "bg-lime-100 text-lime-800 border-lime-200",
    F: "bg-green-100 text-green-800 border-green-200",
    G: "bg-emerald-100 text-emerald-800 border-emerald-200",
    H: "bg-teal-100 text-teal-800 border-teal-200",
    I: "bg-cyan-100 text-cyan-800 border-cyan-200",
    J: "bg-sky-100 text-sky-800 border-sky-200",
    K: "bg-blue-100 text-blue-800 border-blue-200",
    L: "bg-indigo-100 text-indigo-800 border-indigo-200",
    M: "bg-violet-100 text-violet-800 border-violet-200",
    N: "bg-purple-100 text-purple-800 border-purple-200",
    O: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    P: "bg-pink-100 text-pink-800 border-pink-200",
    Q: "bg-rose-100 text-rose-800 border-rose-200",
    R: "bg-red-100 text-red-800 border-red-200",
    S: "bg-orange-100 text-orange-800 border-orange-200",
    T: "bg-amber-100 text-amber-800 border-amber-200",
    U: "bg-yellow-100 text-yellow-800 border-yellow-200",
    V: "bg-lime-100 text-lime-800 border-lime-200",
    W: "bg-green-100 text-green-800 border-green-200",
    X: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Y: "bg-teal-100 text-teal-800 border-teal-200",
    Z: "bg-cyan-100 text-cyan-800 border-cyan-200",
  };
  
  return colorMap[firstLetter] || "bg-secondary text-secondary-foreground border-border";
};

// Individual User Badge Component
export const OwnerBadge = ({ username, isGrouped = false, zIndex = 1 }: { username: string; isGrouped?: boolean; zIndex?: number }) => {
  const user = mockUsers[username];
  const colorClass = getColorByFirstLetter(username);

  if (!user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${colorClass}`}>
            <User className="h-3 w-3 mr-1" />
            Unassigned
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>No owner assigned</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const nameParts = user.name.split(" ");
  const firstLetter = nameParts[0] ? nameParts[0][0] : "";
  const lastLetter = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
  const initials = `${firstLetter}${lastLetter}`.toUpperCase();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:opacity-80 ${colorClass} ${isGrouped ? "" : "flex items-center"}`}
          style={isGrouped ? { zIndex: zIndex } : {}}
        >
          <Avatar className={isGrouped ? "h-6 w-6" : "h-4 w-4 mr-1"}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isGrouped ? "" : <span className="ml-1">{initials}</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.title}</p>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const MultipleOwnersDisplay = ({ owners }: { owners: string[] }) => {
  if (!owners || owners.length === 0) {
    return (
      <Badge variant="outline" className="text-xs">
        <User className="h-3 w-3 mr-1" />
        Unassigned
      </Badge>
    );
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {owners.map((owner, index) => (
        <OwnerBadge key={owner} username={owner} isGrouped={true} zIndex={owners.length - index} />
      ))}
    </div>
  );
};