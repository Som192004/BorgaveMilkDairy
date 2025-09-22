import express from "express";
import {
  login,
  logoutAdmin,
  addAdmin,
  getAdmin,
  refreshAccessToken
} from "../controllers/adminController.js";
import { authenticateAdmin, authorizeRoleAdmin } from "../middlewares/auth.js";

const adminRouter = express.Router();

//!This is done
adminRouter.post("/addAdmin", addAdmin);

//!This is done
adminRouter.post("/login", login);
adminRouter.post("/refresh-token" , refreshAccessToken)
//!This is done
adminRouter.post(
  "/logout",
  authenticateAdmin,
  authorizeRoleAdmin(["Admin"]),
  logoutAdmin
);

adminRouter.get(
  "/get-admin",
  authenticateAdmin,
  authorizeRoleAdmin(["Admin"]),
  getAdmin
);

export default adminRouter;
