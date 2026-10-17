// A tiny stand-in for the Resend API, used only by the end-to-end tests.
//   POST /emails          records the request and answers like Resend (or fails, see /__mode)
//   GET  /__received      returns everything recorded so far
//   POST /__reset         clears the record and goes back to answering 200
//   POST /__mode          body {"status": 500} makes /emails answer with that status
import http from "node:http";

const PORT = Number(process.env.STUB_PORT || 4010);
let received = [];
let status = 200;

const readBody = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
  });

const send = (res, code, body) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/__received") return send(res, 200, received);
    if (req.method === "POST" && req.url === "/__reset") {
      received = [];
      status = 200;
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && req.url === "/__mode") {
      status = JSON.parse((await readBody(req)) || "{}").status ?? 200;
      return send(res, 200, { status });
    }
    if (req.method === "POST" && req.url === "/emails") {
      const body = JSON.parse((await readBody(req)) || "{}");
      received.push({ authorization: req.headers.authorization, body });
      return status === 200 ? send(res, 200, { id: "stub-id" }) : send(res, status, { message: "stub failure" });
    }
    send(res, 404, { error: "not found" });
  })
  .listen(PORT, "127.0.0.1", () => console.log(`resend stub on ${PORT}`));
