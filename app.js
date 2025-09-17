const express = require("express");
const dotenv = require("dotenv");
const https = require("https");

const personalRoutes = require("./router/Personal");
const unidadesRoutes = require("./router/Unidades");
const UsuarioRoutes = require("./router/Usuario");

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

unidadesRoutes(app);
personalRoutes(app);
UsuarioRoutes(app);

if (require.main === module) {
  const PORT = process.env.PORT || 3025;
  app.listen(PORT, () => {
    console.log('servidor corriendo en el puerto:', PORT);
  });
}

module.exports = app;
