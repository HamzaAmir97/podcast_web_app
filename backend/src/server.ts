import { createApp } from "./app";
import * as dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT || 4000);

const app = createApp();


app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${port}`);
});
