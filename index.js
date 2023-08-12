require("dotenv").config();
const PORT = process.env.PORT || 5000; // 5000 is static dynamic-if someone is given environmental level port get that otherwise 5000

const app = require("./app");

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
}); //start server
