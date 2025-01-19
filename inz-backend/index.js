const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./db");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((error, request, response, next) => {
  console.error(error.message);
  response.status(500).json({ status: "error" });
});

app.get("/", (request, response) => {
  response.status(200).json({ status: "ok" });
});

app.post("/login", db.login);
app.post("/register", db.register);
app.post("/sprawdzfaktury", db.verifyToken, db.sprawdzfaktury);
app.get(
  "/wszystkiefaktury",
  db.verifyToken,
  db.verifyAdmin,
  db.wszystkiefaktury
);
app.post("/dodajfakture", db.verifyToken, db.verifyAdmin, db.dodajfakture);
app.put(
  "/fakturazaplacona",
  db.verifyToken,
  db.verifyAdmin,
  db.fakturazaplacona
);
app.get(
  "/sprawdzzgloszenia",
  db.verifyToken,
  db.verifyAdmin,
  db.sprawdzzgloszenia
);
app.post(
  "/sprawdzzgloszeniauzytkownika",
  db.verifyToken,
  db.sprawdzzgloszeniauzytkownika
);
app.post("/dodajzgloszenie", db.verifyToken, db.dodajzgloszenie);
app.put(
  "/odpowiedznazgloszenie",
  db.verifyToken,
  db.verifyAdmin,
  db.odpowiedznazgloszenie
);
app.get("/sprawdzawarie", db.verifyToken, db.verifyAdmin, db.sprawdzawarie);
app.post(
  "/sprawdzawarieuzytkownika",
  db.verifyToken,
  db.sprawdzawarieuzytkownika
);
app.post("/dodajawarie", db.verifyToken, db.dodajawarie);
app.put(
  "/odpowiedznaawarie",
  db.verifyToken,
  db.verifyAdmin,
  db.odpowiedznaawarie
);
app.get("/ogloszenia", db.verifyToken, db.ogloszenia);
app.post(
  "/dodajogloszenie",
  db.verifyToken,
  db.verifyAdmin,
  db.dodajogloszenie
);
app.put(
  "/edytujogloszenie",
  db.verifyToken,
  db.verifyAdmin,
  db.edytujogloszenie
);
app.post("/usunogloszenie", db.verifyToken, db.verifyAdmin, db.usunogloszenie);
app.get("/stanlicznika", db.verifyToken, db.stanlicznika);
app.post(
  "/zmienstanlicznika",
  db.verifyToken,
  db.verifyAdmin,
  db.zmienstanlicznika
);
app.get("/daneklienta", db.verifyToken, db.daneklienta);
app.put(
  "/zmiendaneklienta",
  db.verifyToken,
  db.verifyAdmin,
  db.zmiendaneklienta
);
app.post("/dodajklienta", db.verifyToken, db.verifyAdmin, db.dodajklienta);
app.get("/klienci", db.verifyToken, db.verifyAdmin, db.klienci);

app.use((request, response) => {
  response.status(404).json({ status: "404" });
});

app.listen(port, () => {
  console.log(`Serwer backendowy jest uruchomiony na porcie ${port}.`);
});

//module.exports = app; - POTRZEBNE DO TESTÓW!
