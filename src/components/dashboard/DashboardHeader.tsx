import React from "react";

type Props = {
  title?: string;
  subtitle?: string;
};

export const DashboardHeader: React.FC<Props> = ({
  title = "Dashboard",
  subtitle = "Welcome back! Here's an overview of your eCoA operations.",
}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
