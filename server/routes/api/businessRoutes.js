const router = require("express").Router();
const businessController = require("../../controllers/businessController");
const jwtAuthMiddleware = require("../../utils/jwtAuthMiddleware");
// Matches with "/api/business"
router
  .route("/")
  .get(businessController.getBusinesses)
  .post(jwtAuthMiddleware, businessController.createOrUpdateBusiness);

// Matches with "/api/business/:id"
router
  .route("/:id")
  .post(jwtAuthMiddleware, businessController.getBusinessByOwnerId)
  .get(businessController.getBusinessById)
  .delete(jwtAuthMiddleware, businessController.deleteBusiness);

// Matches with "/api/business/type/:type"
router.route("/type/:type").get(businessController.getBusinessesByType);

module.exports = router;
