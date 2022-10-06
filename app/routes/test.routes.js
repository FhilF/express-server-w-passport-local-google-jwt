const { Router } = require("express"),
  router = Router(),
  { authMiddleware } = require("../middlewares");

router.get("/", (req, res, next) => {
  res.send("Welcome");
});

router.get(
  "/user",
  [authMiddleware.checkAuthentication, authMiddleware.jwtAuth],
  (req, res, next) => {
    if (req.user) res.send("Welcome");
    else
      return res.status(401).json({
        error: "User not authenticated",
      });
  }
);

module.exports = router;
