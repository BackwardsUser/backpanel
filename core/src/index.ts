import { createServer } from "node:http";
import express from "express";
import Docker from "./docker";

const PORT = process.env.PORT ?? 3200

const app = express();
const server = createServer(app);

/* Docker */
const docker = new Docker();

/* Web Server */
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("Ok");
});

app.post('/create', async (req, res) => {
  console.log("Creating container...");

  const data = req.body;
  if (!data.name) {
    res.status(400).send("Missing Instance Name");
    return;
  }

  const instanceName = await docker.getInstanceName(data.name);
  if (!instanceName) {
    res.status(400).send("Could not create instance safename for the given displayname.");
    return;
  }

  const instanceData = {
    displayName: data.name,
    instanceName
  }

  console.log(instanceData);

  await docker.createContainer(instanceData.instanceName);
  res.status(201).send("Successfully Created Container.");
});

/* Websocket Server */

server.listen(PORT, async () => {
  console.log(`Server Core opened on port: ${PORT}`)
});