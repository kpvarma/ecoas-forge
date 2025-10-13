import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = {
  key: string;
  label: React.ReactNode;
  value: number;
  icon?: React.ReactNode;
};

type Props = {
  title: string;
  titleIcon?: React.ReactNode;
  items: Item[];
  className?: string;
  // CSS class to control the left border color (e.g. 'border-l-primary')
  borderClass?: string;
  // If true, render a compact version with smaller fonts and tighter spacing
  compact?: boolean;
};

export const BreakdownCard: React.FC<Props> = ({ title, titleIcon, items, className, borderClass, compact = false }) => {
  const leftBorder = borderClass ? `border-l-4 ${borderClass}` : "border-l-4 border-l-muted";
  const contentSpacing = compact ? "space-y-3" : "space-y-5";
  const labelClass = compact ? "text-xs" : "text-sm";
  const valueClass = compact ? "text-sm font-medium" : "text-lg font-medium";

  return (
    <Card className={`enterprise-card ${leftBorder} ${className ?? ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium">
          {titleIcon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentSpacing}>
        {items.map((it) => (
          <div key={it.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {it.icon}
              <span className={`${labelClass} capitalize text-muted-foreground truncate`}>{it.label}</span>
            </div>
            <span className={valueClass}>{it.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BreakdownCard;
