import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  },
  "Mike Johnson": {
    name: "Mike Johnson", 
    title: "QC Supervisor",
    department: "Quality Control",
    email: "mike.johnson@entegris.com",
    partNumbers: ["MET-AL-98.7", "ETH-GL-97.2"],
    plantIds: ["PLT-003"],
  },
  "Sarah Davis": {
    name: "Sarah Davis",
    title: "Lab Manager",
    department: "Laboratory Services", 
    email: "sarah.davis@entegris.com",
    partNumbers: ["HEX-AN-99.8", "TOL-UE-96.5"],
    plantIds: ["PLT-001", "PLT-004"],
  },
  "Tom Wilson": {
    name: "Tom Wilson",
    title: "Quality Engineer",
    department: "Quality Engineering",
    email: "tom.wilson@entegris.com",
    partNumbers: ["XYL-EN-98.1", "BEN-ZE-99.3"],
    plantIds: ["PLT-002", "PLT-003"],
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
export const OwnerBadge = ({ username }: { username: string }) => {
  const user = mockUsers[username];
  const colorClass = getColorByFirstLetter(username);
  
  if (!user) {
    return (
      <Badge variant="outline" className={`text-xs ${colorClass}`}>
        <User className="h-3 w-3 mr-1" />
        {username}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="outline" className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}>
          <User className="h-3 w-3 mr-1" />
          {username}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.title}</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{user.department}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            
            {user.partNumbers && user.partNumbers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Part Numbers:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {user.partNumbers.map((partNumber: string) => (
                    <Badge key={partNumber} variant="secondary" className="text-xs">
                      {partNumber}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {user.plantIds && user.plantIds.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Plant IDs:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {user.plantIds.map((plantId: string) => (
                    <Badge key={plantId} variant="secondary" className="text-xs">
                      {plantId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Multiple Users Display Component
export const MultipleOwnersDisplay = ({ owners }: { owners: string[] }) => {
  if (!owners || owners.length === 0) {
    return <span className="text-xs text-muted-foreground">Unassigned</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {owners.map((owner, index) => (
        <OwnerBadge key={index} username={owner} />
      ))}
    </div>
  );
};