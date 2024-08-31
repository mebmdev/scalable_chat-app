import Redis from "ioredis";
import { Server } from "socket.io";

const pub = new Redis({
  host: "",
  port: 0,
  username: "",
  password: "",
});
const sub = new Redis({
  host: "",
  port: 0,
  username: "",
  password: "",
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Socket service initializing...");

    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("initializing socket listners...");

    io.on("connect", (socket) => {
      console.log("New Socket connected: ", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message recieved: ", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("server message: ", message);
        
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
