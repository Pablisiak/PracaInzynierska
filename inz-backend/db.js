const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "[T@{JD.B;NP77y:}SB-t@h4CR9N9{Zd9pm}oeNfB";

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "woda",
  password: "zaq1@WSX",
  port: 5432,
});

function generateRandomCode(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

const generateToken = (konto) => {
  const payload = {
    id: konto.id,
    email: konto.email,
    czy_admin: konto.czy_admin,
    id_klienta: konto.id_klienta,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      status: "error",
      info: "Brak tokenu w nagłówkach",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, secretKey, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        status: "error",
        info: "Niepoprawny token",
      });
    }

    req.konto = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.konto || !req.konto.czy_admin) {
    return res.status(403).json({
      status: "error",
      info: "Brak uprawnień administratora",
    });
  }
  next();
};

const checkUserPermission = (req, res, idToCheck) => {
  if (parseInt(idToCheck, 10) !== req.konto.id_klienta) {
    res.status(400).json({
      status: "bad",
      info: "Złe id klienta",
    });
    return false;
  }
  return true;
};

const login = (request, response) => {
  const { login, haslo } = request.body;
  pool.query(
    "SELECT * FROM konta WHERE login=$1",
    [login],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rows.length === 0) {
        return response
          .status(400)
          .json({ status: "bad", info: "Nieprawidłowy login lub hasło" });
      }
      const konto = results.rows[0];
      bcrypt.compare(haslo, konto.haslo, (error, isMatch) => {
        if (error) {
          return response.status(500).json({
            status: "error",
            info: "Błąd podczas porównywania hasła",
          });
        }
        if (!isMatch) {
          return response.status(400).json({
            status: "bad",
            info: "Nieprawidłowy login lub hasło",
          });
        }

        pool.query(
          "SELECT imie,nazwisko FROM klienci WHERE id=$1",
          [konto.id_klienta],
          (error, profil) => {
            if (error) {
              return response.status(500).json({
                status: "error",
                info: "Błąd zapytania do bazy danych przy pobieraniu profilu",
              });
            }
            const klient = profil.rows[0];

            const token = generateToken(konto);
            response.status(200).json({
              status: "ok",
              info: "Zalogowano pomyślnie",
              token: token,
              id: konto.id,
              email: konto.email,
              czy_admin: konto.czy_admin,
              id_klienta: konto.id_klienta,
              imie: klient.imie,
              nazwisko: klient.nazwisko,
            });
          }
        );
      });
    }
  );
};

const register = (request, response) => {
  const { id, kod, email, login, haslo } = request.body;

  pool.query(
    "SELECT kod FROM klienci WHERE kod=$1 AND id=$2",
    [kod, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rows.length === 0) {
        return response.status(400).json({
          status: "bad",
          info: "Taki kod nie istnieje lub nie pasuje do użytkownika",
        });
      }

      pool.query(
        "SELECT * FROM konta WHERE id_klienta=$1",
        [id],
        (error, results) => {
          if (error) {
            return response.status(500).json({
              status: "error",
              info: "Błąd zapytania do bazy danych lub problem z połączeniem",
            });
          }
          if (results.rows.length > 0) {
            return response.status(400).json({
              status: "bad",
              info: "Ten klient ma już konto",
            });
          }

          bcrypt.hash(haslo, 10, (error, zahaszowaneHaslo) => {
            if (error) {
              return response.status(500).json({
                status: "error",
                info: "Błąd podczas haszowania hasła",
              });
            }

            pool.query(
              "INSERT INTO konta (login, haslo, email, czy_admin, id_klienta) VALUES ($1, $2, $3, $4, $5) RETURNING *",
              [login, zahaszowaneHaslo, email, 0, id],
              (error, results) => {
                if (error) {
                  return response.status(500).json({
                    status: "error",
                    info: "Błąd podczas tworzenia konta",
                  });
                }
                response.status(201).json({
                  status: "ok",
                  info: "Konto zostało założone",
                  konto: results.rows[0],
                });
              }
            );
          });
        }
      );
    }
  );
};

const sprawdzfaktury = (request, response) => {
  const { id } = request.body;
  if (!checkUserPermission(request, response, id)) {
    return;
  }
  pool.query(
    "SELECT * FROM faktury WHERE id_klienta=$1 ORDER BY id DESC",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rows.length === 0) {
        return response
          .status(400)
          .json({ status: "bad", info: "Brak faktur lub nieprawidłowe id" });
      }
      response.status(200).json(results.rows);
    }
  );
};

const wszystkiefaktury = (request, response) => {
  pool.query("SELECT * FROM faktury ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak faktur lub nieprawidłowe id" });
    }
    response.status(200).json(results.rows);
  });
};

const dodajfakture = (request, response) => {
  const { id_klienta, zuzycie, kwota, data_wystawienia } = request.body;
  pool.query(
    "INSERT INTO faktury (id_klienta, zuzycie, kwota, status_oplacenia, data_wystawienia) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [id_klienta, zuzycie, kwota, 0, data_wystawienia],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      const faktura = results.rows[0];
      response.status(200).json({
        status: "ok",
        info: "Faktura została dodana",
        faktura: {
          id: faktura.id,
          id_klienta: faktura.id_klienta,
          zuzycie: faktura.zuzycie,
          kwota: faktura.kwota,
          status_oplacenia: faktura.status_oplacenia,
          data_wystawienia: faktura.data_wystawienia,
        },
      });
    }
  );
};

const fakturazaplacona = (request, response) => {
  const { id } = request.body;
  pool.query(
    "UPDATE faktury SET status_oplacenia=NOT status_oplacenia WHERE id=$1 RETURNING status_oplacenia",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono faktury o podanym identyfikatorze",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Zmieniono status opłacenia faktury",
        nowy_status: results.rows[0].status_oplacenia,
      });
    }
  );
};

const sprawdzzgloszenia = (request, response) => {
  pool.query("SELECT * FROM zgloszenia ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak zgłoszeń" });
    }
    response.status(200).json(results.rows);
  });
};

const sprawdzzgloszeniauzytkownika = (request, response) => {
  const { id } = request.body;
  if (!checkUserPermission(request, response, id)) {
    return;
  }
  pool.query(
    "SELECT * FROM zgloszenia WHERE id_klienta=$1 ORDER BY id DESC",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rows.length === 0) {
        return response
          .status(400)
          .json({ status: "bad", info: "Brak zgłoszeń lub nieprawidłowe id" });
      }
      response.status(200).json(results.rows);
    }
  );
};

const dodajzgloszenie = (request, response) => {
  const { id_klienta, stan } = request.body;
  if (!checkUserPermission(request, response, id_klienta)) {
    return;
  }
  pool.query(
    "INSERT INTO zgloszenia (id_klienta, stan, status) VALUES ($1, $2, $3) RETURNING *",
    [id_klienta, stan, 0],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Zgłoszenie zostało dodane",
      });
    }
  );
};

const odpowiedznazgloszenie = (request, response) => {
  const { id, odpowiedz } = request.body;
  pool.query(
    "UPDATE zgloszenia SET status=true, odpowiedz=$1 WHERE id=$2",
    [odpowiedz, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono zgłoszenia o podanym identyfikatorze",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Odpowiedziano na zgłoszenie",
      });
    }
  );
};

const sprawdzawarie = (request, response) => {
  pool.query("SELECT * FROM awarie ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak zgłoszonych awarii" });
    }
    response.status(200).json(results.rows);
  });
};

const sprawdzawarieuzytkownika = (request, response) => {
  const { id } = request.body;
  if (!checkUserPermission(request, response, id)) {
    return;
  }
  pool.query(
    "SELECT * FROM awarie WHERE id_klienta=$1 ORDER BY id DESC",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rows.length === 0) {
        return response.status(400).json({
          status: "bad",
          info: "Brak zgłoszeń awarii lub nieprawidłowe id",
        });
      }
      response.status(200).json(results.rows);
    }
  );
};

const dodajawarie = (request, response) => {
  const { id_klienta, komentarz } = request.body;
  if (!checkUserPermission(request, response, id_klienta)) {
    return;
  }
  pool.query(
    "INSERT INTO awarie (id_klienta, komentarz, status) VALUES ($1, $2, $3) RETURNING *",
    [id_klienta, komentarz, 0],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Zgłoszenie awarii zostało dodane",
      });
    }
  );
};

const odpowiedznaawarie = (request, response) => {
  const { id, odpowiedz } = request.body;
  pool.query(
    "UPDATE awarie SET status=true, odpowiedz=$1 WHERE id=$2",
    [odpowiedz, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono zgłoszenia awarii o podanym identyfikatorze",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Odpowiedziano na zgłoszenie awarii",
      });
    }
  );
};

const ogloszenia = (request, response) => {
  pool.query("SELECT * FROM ogloszenia ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak ogłoszeń" });
    }
    response.status(200).json(results.rows);
  });
};

const dodajogloszenie = (request, response) => {
  const { tytul, opis } = request.body;
  pool.query(
    "INSERT INTO ogloszenia (tytul, opis) VALUES ($1, $2) RETURNING *",
    [tytul, opis],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Ogłoszenie zostało dodane",
      });
    }
  );
};

const edytujogloszenie = (request, response) => {
  const { id, tytul, opis } = request.body;
  pool.query(
    "UPDATE ogloszenia SET tytul=$1, opis=$2 WHERE id=$3",
    [tytul, opis, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono ogłoszenia o podanym identyfikatorze",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Edytowano ogłoszenie",
      });
    }
  );
};

const stanlicznika = (request, response) => {
  pool.query("SELECT * FROM status ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak informacji" });
    }
    response.status(200).json(results.rows);
  });
};

const zmienstanlicznika = (request, response) => {
  pool.query(
    "UPDATE status SET stan_licznika=NOT stan_licznika RETURNING stan_licznika",
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono pola stan_licznika w bazie danych",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Zmieniono status możliwości wpisania stanu licznika",
        nowy_status: results.rows[0].stan_licznika,
      });
    }
  );
};

const daneklienta = (request, response) => {
  const { id } = request.body;
  if (!checkUserPermission(request, response, id)) {
    return;
  }
  pool.query("SELECT * FROM klienci WHERE id=$1", [id], (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response.status(400).json({
        status: "bad",
        info: "Brak użytkownika o takim identyfikatorze",
      });
    }
    response.status(200).json(results.rows);
  });
};

const zmiendaneklienta = (request, response) => {
  const { id, imie, nazwisko, kod } = request.body;
  pool.query(
    "UPDATE klienci SET imie=$1, nazwisko=$2, kod=$3 WHERE id=$4",
    [imie, nazwisko, kod, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      if (results.rowCount === 0) {
        return response.status(404).json({
          status: "bad",
          info: "Nie znaleziono użytkownika o podanym identyfikatorze",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Zmieniono dane klienta",
      });
    }
  );
};

const dodajklienta = (request, response) => {
  const { imie, nazwisko } = request.body;
  const kod = generateRandomCode(16);
  pool.query(
    "INSERT INTO klienci (imie, nazwisko, kod) VALUES ($1, $2, $3) RETURNING *",
    [imie, nazwisko, kod],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          status: "error",
          info: "Błąd zapytania do bazy danych lub problem z połączeniem",
        });
      }
      response.status(200).json({
        status: "ok",
        info: "Klient został dodany",
        id: results.rows[0].id,
        kod: results.rows[0].kod,
      });
    }
  );
};

const klienci = (request, response) => {
  pool.query("SELECT * FROM klienci ORDER BY id DESC", (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    if (results.rows.length === 0) {
      return response
        .status(400)
        .json({ status: "bad", info: "Brak klientów" });
    }
    response.status(200).json(results.rows);
  });
};

const usunogloszenie = (request, response) => {
  const { id } = request.body;
  pool.query("DELETE FROM ogloszenia WHERE id=$1", [id], (error, results) => {
    if (error) {
      return response.status(500).json({
        status: "error",
        info: "Błąd zapytania do bazy danych lub problem z połączeniem",
      });
    }
    response.status(200).json("ok");
  });
};

module.exports = {
  login,
  register,
  sprawdzfaktury,
  dodajfakture,
  fakturazaplacona,
  sprawdzzgloszenia,
  sprawdzzgloszeniauzytkownika,
  dodajzgloszenie,
  odpowiedznazgloszenie,
  sprawdzawarie,
  sprawdzawarieuzytkownika,
  dodajawarie,
  odpowiedznaawarie,
  ogloszenia,
  dodajogloszenie,
  edytujogloszenie,
  stanlicznika,
  zmienstanlicznika,
  daneklienta,
  zmiendaneklienta,
  verifyToken,
  dodajklienta,
  klienci,
  wszystkiefaktury,
  usunogloszenie,
  verifyAdmin,
};
