require("dotenv").config();

const connectToMongo = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 8000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
  process.exit(1);
}

(async () => {
  await connectToMongo(); // connect first, then accept requests
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();
