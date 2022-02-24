const express = require("express");
const app = express();
const port = process.env.PORT || 3131;

const download = require("./download");
const cors = require("cors");

app.use(cors());
app.use(express.static(__dirname));

let statuss = "Apagado";

app.get("/", (req, res) => {
  res.status(200).json({ status: statuss });
});

// app.use((req, res, next) => {
//   const host = req.get("host");
//   console.log(host);
// });

app.get("/download", (req, res) => {
  const hosti = req.get("host");
  console.log(hosti);

  download(hosti);

  res.status(200).json({ status: "starting" });
});

app.get("/ping", (req, res) => {
  (async () => {
    statuss = "Encendido";
    res.status(200).json({ data: "No dormiras" });
  })();
});

setInterval(() => {
  statuss = "Apagado";
}, 900000);

app.listen(port, () => console.log(`app listening on port ${port}!`));
