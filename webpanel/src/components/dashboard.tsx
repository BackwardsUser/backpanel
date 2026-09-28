"use client";

import { useEffect, useMemo, useState } from "react";
import Create from "@/components/create";
import Container from "@/components/container";
import { type Container as ContainerData } from "@/lib/dummy";

// TODO: replace local state with calls to core (POST /create, POST /delete, GET /containers?scan)
export default function Dashboard() {
    const [containers, setContainers] = useState<ContainerData[]>([]);

    useEffect(() => {
        (async () => {
            const res = await fetch("http://localhost:3200/containers");
            if (!res.ok) {
                console.log("Failed to fetch containers from upstream");
                return;
            }

            const data = await res.json();
            setContainers(data);
        })();
    }, [])

    function create(containerInfo: ContainerData) {

        setContainers((prev) => [
            containerInfo,
            ...prev,
        ]);
        return null;
    }

    async function start(id: string) {
        const res = await fetch("http://localhost:3200/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id
            })
        });

        if (!res.ok) {
            console.log("Failed to start container upstream");
            return;
        }
        setState(id, "running");
    }

    async function stop(id: string) {
        const res = await fetch("http://localhost:3200/stop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id
            })
        });

        if (!res.ok) {
            console.log("Failed to stop container upstream");
            return;
        }
        setState(id, "exited");
    }

    function setState(id: string, state: ContainerData["State"]) {
        setContainers((prev) => prev.map((c) => (c.ID === id ? { ...c, State: state } : c)));
    }

    async function remove(id: string) {
        const res = await fetch("http://localhost:3200/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id
            })
        })

        if (!res.ok) {
            console.log("Failed to remove container upstream.");
            return;
        }
        setContainers((prev) => prev.filter((c) => c.ID !== id));
    }

    return (
        <div className="flex flex-col gap-6">
            <Create onCreate={create} />

            <section id="containers" className="flex flex-col gap-3">
                <h2 className="text-sm font-medium">
                    Containers <span className="text-foreground/60">({containers.length})</span>
                </h2>
                {containers.length === 0 ? (
                    <p className="text-sm text-foreground/60">No containers yet.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {containers.map((c) => (
                            <Container key={c.ID} container={c} onStart={start} onStop={stop} onDelete={remove} />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}
