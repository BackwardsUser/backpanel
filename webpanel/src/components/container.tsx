import type { Container as ContainerData } from "@/lib/dummy";

const stateColors: Record<ContainerData["State"], string> = {
    running: "bg-green-500",
    created: "bg-blue-500",
    paused: "bg-yellow-500",
    restarting: "bg-yellow-500",
    exited: "bg-gray-400",
    dead: "bg-red-500",
};

export default function Container({ container, onStart, onStop, onDelete }: { container: ContainerData; onStart: (id: string) => void; onStop: (id: string) => void; onDelete: (id: string) => void }) {
    const c = container;

    return (
        <li className="flex flex-col gap-3 rounded-lg border border-foreground/15 p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stateColors[c.State]}`} title={c.State} />
                    <span className="font-mono font-semibold">{c.Names}</span>
                    <span className="text-xs uppercase text-foreground/60">{c.State}</span>
                </div>
                <div className="flex gap-2">
                {c.State === "running" ? (
                    <button
                        onClick={() => onStop(c.ID)}
                        title="Stop container"
                        className="rounded-md border border-yellow-500/40 px-3 py-1 text-xs text-yellow-500 hover:bg-yellow-500/10"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={() => onStart(c.ID)}
                        title="Start container"
                        className="rounded-md border border-green-500/40 px-3 py-1 text-xs text-green-500 hover:bg-green-500/10"
                    >
                        Start
                    </button>
                )}
                <button
                    onClick={() => onDelete(c.ID)}
                    disabled={c.State === "running"}
                    title={c.State === "running" ? "Stop the container before deleting" : "Delete container"}
                    className="rounded-md border border-red-500/40 px-3 py-1 text-xs text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                    Delete
                </button>
                </div>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
                <dt className="text-foreground/60">ID</dt>
                <dd className="font-mono" title={c.ID}>{c.ID.slice(0, 12)}</dd>
                <dt className="text-foreground/60">Image</dt>
                <dd className="font-mono">{c.Image}</dd>
                <dt className="text-foreground/60">Status</dt>
                <dd>{c.Status}</dd>
                <dt className="text-foreground/60">Created</dt>
                <dd title={c.CreatedAt}>{c.RunningFor}</dd>
                <dt className="text-foreground/60">Ports</dt>
                <dd className="font-mono">{c.Ports || "—"}</dd>
                <dt className="text-foreground/60">Size</dt>
                <dd>{c.Size}</dd>
            </dl>
        </li>
    )
}
