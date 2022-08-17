const express = require("express");
const authController = require("./../controllers/authControllers");
const userController = require("./../controllers/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.put("/cartadd", userController.cartadd);
router.put("/cartqty", userController.cartQty);
router.put("/cartdel", userController.cartDel);
router.put("/cartempty", userController.cartempty);
// Protect all routes after this middleware
router.use(authController.protect);

router.patch(
  "/updatePassword",

  authController.updatePassword
);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
