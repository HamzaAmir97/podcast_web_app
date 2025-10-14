import { createApp } from "./app";
import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 4000;


createApp().listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
