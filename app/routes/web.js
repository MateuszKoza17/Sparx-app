const express = require("express");
const router = new express.Router();
const JobController = require("../controllers/job-controller.js");
const UserController = require("../controllers/user-controller.js");
const BrandController = require("../controllers/brand-controller.js");
const PageController = require("../controllers/page-controller.js");

// Pages
router.get("/", PageController.renderHomePage);
router.get("/about", PageController.renderAboutPage);
router.get("/search", PageController.renderSearchPage);
router.get("/app/getStarted", PageController.renderGetStartedPage);
router.get("/faq", PageController.renderFQS);
router.get("/sparx/newsletter", PageController.renderSparxNewsletterPage);
router.post("/sparx/newsletter", PageController.sendNewsletter);

// Brand
router.get("/search/brands/all", BrandController.showAllBrands);
router.get("/brands/csv", BrandController.generateCSVBrands);
router.get("/brand/:brandID", BrandController.showCurrentBrand);

router.get("/account/brand/signup", BrandController.renderSignUpBrandForm);
router.post("/account/brand/signup", BrandController.signUpBrand);
router.get("/account/brand/signin", BrandController.rendersignInBrandForm);
router.post("/account/brand/signin", BrandController.signInBrand);
router.get("/account/brand/dashboard", BrandController.renderBrandDashboard);
router.get(
  "/account/brand/dashboard/settings",
  BrandController.renderBrandDashboardSettings
);
router.get(
  "/account/brand/dashboard/settings/edit",
  require("../middleware/is_authenticated-middleware.js"),
  BrandController.renderBrandDashboardSettingsEditForm
);
router.post(
  "/account/brand/dashboard/settings/edit",
  BrandController.saveBrandChanges
);
router.get("/account/brand/dashboard/signout", BrandController.signOutBrand);
router.get(
  "/account/brand/dashboard/delete",
  BrandController.deleteBrandAccount
);

// Job
router.get("/jobs", JobController.showAllJobOffers);
router.get("/job/:jobBrandSlug/:jobID", JobController.showCurrentJobOffer);
router.get(
  "/account/brand/dashboard/jobs",
  BrandController.renderBrandDashboardJobOfferForm
);
router.post(
  "/account/brand/dashboard/jobs",
  BrandController.publishNewBrandJobOffer
);
router.get(
  "/account/brand/dashboard/jobs/delete",
  BrandController.deleteJobOffer
);

// User
router.get("/search/users/all", UserController.showAllUsers);
router.get("/users/csv", UserController.generateCSVUsers);
router.get("/user/:userEmail", UserController.showCurrentUser);

router.get("/account/user/signup", UserController.renderSignUpUserForm);
router.post("/account/user/signup", UserController.signUpUser);

router.get("/account/user/signin", UserController.renderSignInUserForm);
router.post("/account/user/signin", UserController.signInUser);
router.get("/account/user/dashboard", UserController.renderUserDashboard);
router.get("/account/user/dashboard/rating", UserController.renderRatingForm);
router.post("/account/user/dashboard/rating", UserController.publishRating);
router.get(
  "/account/user/dashboard/rating/delete",
  UserController.deleteUserRating
);

router.get(
  "/account/user/dashboard/settings",
  UserController.renderUserDashboardSettings
);
router.get(
  "/account/user/dashboard/settings/edit",
  UserController.renderUserDashboardSettingsEditForm
);
router.post(
  "/account/user/dashboard/settings/edit",
  UserController.saveUserChanges
);

router.get("/account/user/dashboard/signout", UserController.signOutUser);
router.get("/account/user/dashboard/delete", UserController.deleteUserAccount);

// 404
router.get("*", PageController.renderNotFound);

module.exports = router;
