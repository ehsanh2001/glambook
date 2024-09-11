const router = require("express").Router();
const businessController = require("../../controllers/businessController");

// Matches with "/api/business"
router
  .route("/")
  .get(businessController.getBusinesses)
  .post(businessController.createBusiness);

// Matches with "/api/business/:id"
router
  .route("/:id")
  .get(businessController.getBusinessById)
  .put(businessController.updateBusiness)
  .delete(businessController.deleteBusiness);

// Matches with "/api/business/type/:type"
router.route("/type/:type").get(businessController.getBusinessesByType);

module.exports = router;
