import express from "express";
import {
  registerControllers,
  loginControllers,
  userControllers,
  refreshControllers,
  productControllers,
} from "../controllers";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";

const router = express.Router();

router.post("/register", registerControllers.register);
router.post("/login", loginControllers.login);
router.get("/getUser", auth, userControllers.getUser);
router.post("/refresh", refreshControllers.refresh);
router.post("/logout", auth, loginControllers.logout);

// For Products
router.post("/products", [auth, admin], productControllers.store);
router.put("/updateProduct/:id", [auth, admin], productControllers.update);
router.delete("/deleteProduct/:id", [auth, admin], productControllers.delete);
router.get("/getAllProducts", productControllers.getAllProducts);
router.get("/getSingleProduct/:id", productControllers.getSingleProduct);

export default router;
