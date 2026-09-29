import { createServer } from "node:http";
import express from "express";
import Docker from "./docker";
import cors from "cors";

const PORT = process.env.PORT ?? 3200

const app = express();
const server = createServer(app);

/* Docker */
const docker = new Docker();

/* Web Server */
app.use(cors())
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("ok");
});

app.post('/create', async (req, res) => {
  console.log("Creating container...");

  const data = req.body;
  if (!data.name) {
    res.status(400).json({ message: "Missing Instance Name" });
    return;
  }

  const instanceName = await docker.getInstanceName(data.name);
  if (!instanceName) {
    res.status(400).json({ message: "Could not create instance safename for the given displayname." });
    return;
  }

  const instanceData = {
    displayName: data.name,
    instanceName
  }

  const ret = await docker.createContainer(instanceData.instanceName);
  if (!ret || !ret.containerId) {
    res.status(500).json({ message: "Failed to create instance. Try again later." });
    return;
  }

  const info = await docker.getContainerInfo(ret.containerId);
  if (!info) {
    res.status(201).json({ message: "Failed to fetch container information" });
    return;
  }

  if ((info as any[]).length > 1) {
    res.status(500).json({ message: "Failed to fetch container information" });
    console.error(`${ret.containerId} returned multiple containers:\n`, info);
    return;
  }

  res.status(201).json(info[0]);
});

app.post('/start', async (req, res) => {
  const data = req.body;
  if (!data.id) {
    res.status(400).json({ message: "Missing Instance ID" });
    return;
  }

  const instanceExists = docker.containerExistsById(data.id);
  if (!instanceExists) {
    res.status(404).json({ message: "No such instance exists with the given ID" });
    return;
  }

  if (await docker.startContainer(data.id))
    res.status(200).json({ message: "Started Container" })
  else
    res.status(200).json({ message: "Failed to start Container." });
})

app.post('/stop', async (req, res) => {
  const data = req.body;
  if (!data.id) {
    res.status(400).json({ message: "Missing Instance ID" });
    return;
  }

  const instanceExists = docker.containerExistsById(data.id);
  if (!instanceExists) {
    res.status(404).json({ message: "No such instance exists with the given ID" });
    return;
  }

  if (await docker.stopContainer(data.id))
    res.status(200).json({ message: "Stopped Container" })
  else
    res.status(200).json({ message: "Failed to stop Container." });
})

app.post('/delete', (req, res) => {
  const data = req.body;
  if (!data.id) {
    res.status(400).json({ message: "Missing Instance ID" });
    return;
  }

  const instanceExists = docker.containerExistsById(data.id);
  if (!instanceExists) {
    res.status(404).json({ message: "No such instance exists with the given ID" });
    return;
  }

  if (docker.rmContainer(data.id))
    res.status(200).json({ message: "Instance Deleted" })
  else
    res.status(500).json({ message: "Failed to delete instance" });
});

app.get('/containers', async (req, res) => {
  if (false && req.query["scan"] === undefined) {
    // Cache is super tempermental and will take more work to maintain then to just make shell calls.
    console.log("Sending Cached Containers")
    res.json(docker.getCachedContainers());
  } else {
    console.log("Rescanning Containers")
    res.json(await docker.scanContainers());
  }
})

/* Websocket Server */
// for later.

server.listen(PORT, async () => {
  console.log(`Server Core opened on port: ${PORT}`)
});