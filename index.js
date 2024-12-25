const express = require("express");
const cors = require("cors");
const { obtenerJoyas, obtenerJoyasFiltros, prepararHATEOAS } = require("./consultas.js");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3001, console.log("¡Servidor encendido!"));

app.get("/joyas", async (req, res) => {
  const inventario = await obtenerJoyas(req.query);
  const HATEOAS = await prepararHATEOAS(inventario)
 
  res.json(HATEOAS);
});


app.get('/joyas/filtros', async (req, res) => {
    const queryStrings = req.query
    const inventario = await obtenerJoyasFiltros(queryStrings)
    res.json(inventario)
   })