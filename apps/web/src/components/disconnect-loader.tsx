export function DisconnectingLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary/60 rounded-full animate-pulse" />
        </div>

        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-primary/40 rounded-full" />
          </div>
        </div>

        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "4s", animationDirection: "reverse" }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-primary/30 rounded-full" />
          </div>
        </div>

        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "5s" }}>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-primary/20 rounded-full" />
          </div>
        </div>

        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: "3s" }}
          viewBox="0 0 96 96"
        >
          <circle cx="48" cy="48" r="36" fill="none" stroke="url(#gradient)" strokeWidth="0.5" opacity="0.3" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground/80">disconnecting</p>
        <div className="flex justify-center gap-1">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}

export function ConnectingLoader({ desc }: {
    desc?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 h-screen">
      <div className="relative w-40 h-32">
        <div
          className="absolute left-0 top-0 w-28 h-32 bg-card border border-border/50 rounded-lg overflow-hidden shadow-lg animate-float"
          style={{ animationDuration: "3s" }}
        >
          <div className="w-full h-6 bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border/30 flex items-center px-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] text-muted-foreground ml-2">dev-01.ts</span>
          </div>
          <div className="p-2 space-y-1 font-mono text-[9px] text-black dark:text-white">
            <div>function pair()</div>
            <div className="ml-2 animate-pulse">{"{"}</div>
            <div className="ml-4">const share = true</div>
            <div className="ml-2">{"}"}</div>
          </div>
        </div>

        <div
          className="absolute right-0 top-0 w-28 h-32 bg-card border border-border/50 rounded-lg overflow-hidden shadow-lg animate-float"
          style={{ animationDuration: "3s", animationDelay: "0.2s" }}
        >
          <div className="w-full h-6 bg-gradient-to-r from-accent/20 to-accent/10 border-b border-border/30 flex items-center px-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] text-muted-foreground ml-2">dev-02.ts</span>
          </div>
          <div className="p-2 space-y-1 font-mono text-[9px] text-black dark:text-white">
            <div>function code()</div>
            <div className="ml-2 animate-pulse">{"{"}</div>
            <div className="ml-4 text-primary">const review = true</div>
            <div className="ml-2">{"}"}</div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground/80">{ desc ?? "Connecting to PairCode"}</p>
        <div className="flex justify-center gap-1">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
