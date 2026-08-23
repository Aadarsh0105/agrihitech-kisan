const router = require("express").Router();
const controller = require("./adminAccount.controller");
const { verifyToken, isAdmin } = require("../../middleware/isAdmin");

router.get("/", verifyToken, isAdmin, controller.list);
router.get("/:id", verifyToken, isAdmin, controller.getOne);

module.exports = router;
