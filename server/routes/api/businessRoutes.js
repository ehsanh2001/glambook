const router = require("express").Router();
const businessController = require("../../controllers/businessController");

// Matches with "/api/business"
router
  .route("/")
  .get(businessController.getAllBusinesses)
  .post(businessController.createBusiness);

// Matches with "/api/business/:id"
router
  .route("/:id")
  .get(businessController.getBusinessById)
  .put(businessController.updateBusiness)
  .delete(businessController.deleteBusiness);

module.exports = router;
