import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex items-center justify-center h-40">
    <div className="flex flex-col items-center space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading ...</p>
    </div>
  </div>
);

export default Loading;
