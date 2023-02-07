import path from "path";
import fs from "fs";

import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";

import App from "../src/App";
import axios from "axios";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  express.static(path.resolve(__dirname, "../", "dist"), { maxAge: "30d" })
);

app.use("/favicon.ico", express.static("public/favicon.ico"));

app.get("*", async (req, res) => {
  fs.readFile(
    path.resolve("./public/index.html"),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred");
      }

      const ssr = req.query.ssr === "1";
      const type = req.path.split("/")[1];
      const id = req.path.split("/")[2];
      let apiData;
      if (ssr) {
        try {
          let path = `https://swapi.dev/api/${type}`;
          if (id) {
            path = `${path}/${id}`;
          }
          const response = await axios.get(path);
          apiData = response.data;
        } catch (e) {}
      }
      const appData = ssr ? { data: apiData, type } : {};
      return res.send(
        data.replace(
          '<div id="root"></div>',
          `<div id="root">${ReactDOMServer.renderToString(
            ssr ? <App {...appData} /> : <App />
          )}</div>${
            ssr
              ? `<script>window.__INITIAL_DATA__ = ${JSON.stringify(
                  appData
                )};</script>`
              : ""
          }`
        )
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
