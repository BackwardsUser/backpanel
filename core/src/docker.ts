import { spawn, execFile, ChildProcessWithoutNullStreams } from "child_process"
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export default class Docker {
  // container_id: string, container_safename: string
  /**
   * Depreciated
   */
  private containers: Record<string, string> = {};

  /**
   * Simple helper to check if a container with given name already exists
   * @param name The name of the container to search for
   * @returns (true/false) if exists
   */
  public async containerExistsByName(name: string) {
    try {
      const { stdout } = await execFileAsync("docker", [
        "ps", "-a", "--filter", `name=^/${name}$`, "--format", "{{.Names}}",
      ]);
      if (stdout.trim()) return true;
    } catch (err: unknown) {
      const stderr =
        typeof err === "object" && err !== null && "stderr" in err
          ? String(err.stderr)
          : "";
      if (/no such (object|container)/i.test(stderr)) return false;
      throw err;
    }
  }

  /**
   * Simple helper to check if a container with given id already exists
   * @param id The id of the container to search for
   * @returns (true/false) if exists
   */
  public async containerExistsById(id: string) {
    if (this.containers[id])
      return true;
    try {
      const { stdout } = await execFileAsync("docker", [
        "ps", "-a", "--filter", `id=^/${id}$`, "--format", "{{.Names}}",
      ]);
      if (stdout.trim()) return;
    } catch (err: unknown) {
      const stderr =
        typeof err === "object" && err !== null && "stderr" in err
          ? String(err.stderr)
          : "";
      if (/no such (object|container)/i.test(stderr)) return false;
      throw err;
    }
  }

  /**
   * Can this be optimized?  
   * Creates a safename based on a given display name.  
   *   
   * From 0 to 99, increments by 1 until it finds an available variant of the display name:  
   * \<container_name>##  
   * i.e: MY_INSTANCE04 (using same naming convention as AMP)
   * @param container_name requested display name
   * @returns docker safename
   */
  public async getInstanceName(displayName: string) {
    if (!displayName)
      return "";

    let curIndex = 0;
    let noIndex = true;

    while (noIndex) {
      curIndex += 1;
      if (curIndex == 100)
        return null;
      let checkName = `${displayName}${curIndex.toString().padStart(2, "0")}`.replaceAll(" ", "_").toUpperCase();
      const containerExists = await this.containerExistsByName(checkName);
      if (!containerExists) {
        noIndex = false;
        return checkName;
      }
    }
  }

  /**
   * Method used to create a container for a given game (id) with the given name.
   * Produces it's own ID and safe name (appends an index to the end of the requested name)
   * @param displayName The name of the container
   * @param gameId (UNUSED) ID of the game the container is to be made for (used to get instance info)
   * @returns \{ containerId, ChildProcess }
   */
  public async createContainer(safeName: string) {
    if (!safeName) return;

    const { stdout } = await execFileAsync("docker", [
      "create", "--name", safeName, "interval-test",
    ]);
    const containerId = stdout.trim();
    console.log(`Created Container with ID: ${containerId}`);
    this.containers[containerId] = safeName;
    return { containerId, safeName }
  }

  public async startContainer(containerId: string) {
    try {
      spawn("docker", ["start", "-a", containerId])
      return containerId;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public async stopContainer(containerId: string) {
    try {
      spawn("docker", ["stop", containerId])
      return containerId;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public rmContainer(containerId: string) {
    try {
      spawn("docker", ["rm", containerId])
      this.containers[containerId] && delete this.containers[containerId]
      return containerId;
    } catch {
      return null;
    }
  }

  private containerInfoJson(info: string) {
    return info.trim()
      .split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .map(line => ({
        ID: line.ID,
        CreatedAt: line.CreatedAt,
        Image: line.Image,
        Names: line.Names,
        Platform: line.Platform,
        Ports: line.Ports,
        Status: line.Status,
        RunningFor: line.RunningFor,
        Size: line.Size,
        State: line.State
      }));
  }

  public async getContainerInfo(id: string) {
    console.log(id);
    const { stdout } = await execFileAsync("docker", [
      "ps", "-a", "--filter", `id=${id}`, "--no-trunc", "--format", "{{json .}}"
    ]);

    const containers = this.containerInfoJson(stdout);

    return containers;
  }

  public async scanContainers() {
    const { stdout } = await execFileAsync("docker", [
      "ps", "-a", "--no-trunc", "--format", "{{json .}}"
    ]);

    return this.containerInfoJson(stdout);
  }

  /**
   * Depreciated
   */
  public getCachedContainers() {
    return this.containers
  }
}
