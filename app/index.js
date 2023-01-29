const app = require("./app.js");
const { port } = require("./config.js");

app.listen(port, () => {
  console.log(`Server is litening on port::${port}\n
  Use one of two examples in your browser:\n
  localhost:${port} or 127.0.0.1:${port}`);
});
