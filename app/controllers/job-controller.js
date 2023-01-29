const JobOffer = require("../db/models/jobOffer/jobOffer.js");

class JobController {
  async showAllJobOffers(req, res) {
    const { q } = req.query;
    const jobs = await JobOffer.find({
      title: { $regex: q || "", $options: "i" },
    }).populate("brand");

    res.render("pages/jobs", {
      jobs,
    });
  }

  async showCurrentJobOffer(req, res) {
    const { jobBrandSlug, jobID } = req.params;
    const currentJobOffer = await JobOffer.findOne({
      _id: jobID,
      brandSlug: jobBrandSlug,
    });

    res.render("pages/job", {
      currentJobOffer,
    });
  }
}

module.exports = new JobController();
