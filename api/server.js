import dotenv from "dotenv";
import app from "./index.js";
import notificationPoller from "./services/notificationPoller.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  notificationPoller();
});
