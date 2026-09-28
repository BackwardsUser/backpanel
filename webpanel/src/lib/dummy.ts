// Placeholder data until the webpanel is wired up to core.
// Shape mirrors core/types/docker.ts (`docker ps --format '{{json .}}'`).

export type Container = {
  ID: string;
  Names: string;
  Image: string;
  State: "created" | "running" | "paused" | "restarting" | "exited" | "dead";
  Status: string;
  CreatedAt: string;
  RunningFor: string;
  Ports: string;
  Size: string;
};
