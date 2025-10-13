// Lightweight helpers for status formatting and mapping used by dashboard and requests
export const statusLabel = (key: string) => {
  switch (key) {
    case "queued":
      return "Queued";
    case "in_progress":
      return "In Progress";
    case "failed":
      return "Failed";
    case "completed":
      return "Completed";
    default:
      return key;
  }
};

export const statusColorClass = (key: string) => {
  switch (key) {
    case "queued":
      return "text-muted-foreground";
    case "in_progress":
      return "text-warning";
    case "failed":
      return "text-destructive";
    case "completed":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};
