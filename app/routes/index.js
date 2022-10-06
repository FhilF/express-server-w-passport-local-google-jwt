const { Router } = require("express");

const testAuthRoutes = require("./test.routes");
const googleAuthRoutes = require("./auth/googleAuth.routes");
const localAuthRoutes = require("./auth/localAuth.routes");
const globalRoutes = require("./global.routes");

const router = Router();

router.use("/test", testAuthRoutes);
router.use("/auth", localAuthRoutes);
router.use("/auth", googleAuthRoutes);

router.use("/", globalRoutes);

module.exports = router;
