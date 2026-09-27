import { spawn, exec, execFile, ChildProcessWithoutNullStreams, execFileSync } from "child_process"
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export default class Docker {

  private containers: Record<string, ChildProcessWithoutNullStreams> = {};

  public async getInstanceName(container_name: string) {
    if (!container_name)
      return "";

    let curIndex = 0;
    let noIndex = true;

    while (noIndex) {
      curIndex += 1;
      if (curIndex == 100)
        return null;
      let check_name = `${container_name}${curIndex.toString().padStart(2, "0")}`.replaceAll(" ", "_");
      try {
        const { stdout } = await execFileAsync("docker", [
          "inspect", check_name
        ]);
      } catch {
        noIndex = false;
        return `${container_name}${curIndex.toString().padStart(2, "0")}`.replaceAll(" ", "_");
      }
    }
  }

  // public createContainer({ gameId, name }: { gameId: string, name: string }) {
  public async createContainer(name: string) {
    if (!name) return;
    try {
      const { stdout: probeOut } = await execFileAsync("docker", [
        "inspect", name
      ]);
      if (probeOut)
        return;
    } catch {
      // pass (this is the expectation) 
    }

    return

    const { stdout } = await execFileAsync("docker", [
      "create", "--rm", "--name", "test", "interval-test",
    ]);
    const containerId = stdout.trim();
    console.log(`Created Container with ID: ${containerId}`);
    const proc = spawn("docker", ["start", "-a", containerId]);
    this.containers[containerId] = proc;

    proc.stdout.on("data", (chunk: Buffer) => {
      console.log(`message from container: ${chunk.toString().trimEnd()}`);
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      console.error(`container stderr: ${chunk.toString().trimEnd()}`);
    });
    proc.on("error", err => console.error("Failed to start docker:", err));
    proc.on("close", code => {
      console.log(`Container closed with code ${code}`);
      delete this.containers[containerId];
    });

    return { containerId, proc }
  }
}
