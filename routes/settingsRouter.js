import { Router } from "express";
import settingsController from "../middleware/settingsController.js";
import { checkAuthentication } from "../middleware/auth.js";

const settingsRouter = Router();

settingsRouter.get("/", checkAuthentication, settingsController.settingsView);
settingsRouter.post(
  "/save",
  checkAuthentication,
  settingsController.verifyAdmin,
  settingsController.updateUserConfig,
);

export { settingsRouter };
