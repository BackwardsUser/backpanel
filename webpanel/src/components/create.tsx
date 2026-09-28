"use client";

import { SubmitEvent, useState } from "react";
import { type Container as ContainerData } from "@/lib/dummy";

export default function Create({ onCreate }: { onCreate: (containerInfo: ContainerData) => string | null }) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function createContainer(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name.trim()) return;

        const res = await fetch("http://localhost:3200/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name
            })
        });

        if (!res.ok) {
            // report error;
            return;
        }

        const data = await res.json();

        if (!data.ID) {
            setError(data.message ?? "Something went wrong while creating the container");
            return;
        }

        const err = onCreate(data);
        setError(err);
        if (!err) setName("");
    }

    return (
        <form onSubmit={createContainer} className="flex flex-col gap-2 rounded-lg border border-foreground/15 p-4">
            <label htmlFor="name" className="text-sm font-medium">Create container</label>
            <div className="flex gap-2">
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Instance name"
                    className="flex-1 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
                />
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
                >
                    Create
                </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
    )
}
