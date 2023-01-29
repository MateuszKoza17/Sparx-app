const Brand = require("../db/models/brand/brand.js");
const JobOffer = require("../db/models/jobOffer/jobOffer.js");
const { Parser } = require("json2csv");

class BrandController {
  async showAllBrands(req, res) {
    const { q } = req.query;
    const brands = await Brand.find({
      name: { $regex: q || "", $options: "i" },
    });

    res.render("pages/brandPages/searchBrands", {
      brands,
    });
  }

  async showCurrentBrand(req, res) {
    const { brandID } = req.params;
    const currentBrand = await Brand.findOne({
      _id: brandID,
    });

    res.render("pages/brandPages/brand", {
      currentBrand,
    });
  }

  renderSignUpBrandForm(req, res) {
    res.render("pages/forms/brandSignUp");
  }

  async signUpBrand(req, res) {
    try {
      const newBrand = new Brand({
        name: req.body.name,
        slug: req.body.slug,
        ceo: req.body.ceo,
        email: req.body.email,
        password: req.body.password,
        employeesCount: req.body.employeesCount,
        country: req.body.country,
      });

      await newBrand.save();
      res.redirect("/");
    } catch (e) {
      res.render("pages/forms/brandSignUp", {
        errors: e.errors,
        reqBodyData: req.body,
      });
    }
  }

  rendersignInBrandForm(req, res) {
    res.render("pages/forms/brandSignIn");
  }

  async signInBrand(req, res) {
    try {
      const brand = await Brand.findOne({ email: req.body.email });
      const isPasswordCorrect = brand.isValidPswd(req.body.password);

      if (!brand) {
        throw new Error("Email is incorrect");
      }

      if (!isPasswordCorrect) {
        throw new Error("Password is incorrect");
      }

      req.session.brand = {
        _id: brand._id,
        name: brand.name,
        slug: brand.slug,
        ceo: brand.ceo,
        email: brand.email,
        employeesCount: brand.employeesCount,
        phoneNumber: brand.phoneNumber,
        country: brand.country,
        city: brand.city,
        brandDescription: brand.brandDescription,
        technologyStack: brand.technologyStack,
        date: brand.date,
      };

      res.redirect("/account/brand/dashboard");
    } catch (e) {
      res.render("pages/forms/brandSignIn", {
        reqBodyData: req.body,
        errors: true,
      });
    }
  }

  renderBrandDashboard(req, res) {
    res.render("pages/brandPages/brandDashboard", {
      brand: req.session.brand,
    });
  }

  renderBrandDashboardSettings(req, res) {
    res.render("pages/brandPages/brandDashboardSettings");
  }

  renderBrandDashboardSettingsEditForm(req, res) {
    res.render("pages/forms/brandDashboardSettingsFormEdit", {
      reqBodyData: req.session.brand,
    });
  }

  async saveBrandChanges(req, res) {
    const brand = await Brand.findById(req.session.brand._id);
    brand.email = req.body.email;
    brand.name = req.body.name;
    brand.slug = req.body.slug;
    brand.ceo = req.body.ceo;
    brand.brandDescription = req.body.brandDescription;
    brand.technologyStack = req.body.technologyStack;
    brand.phoneNumber = req.body.phoneNumber;
    brand.city = req.body.city;

    if (req.body.password) {
      brand.password = req.body.password;
    }

    try {
      await brand.save();
      req.session.brand.email = brand.email;
      req.session.brand.name = brand.name;
      req.session.brand.slug = brand.slug;
      req.session.brand.ceo = brand.ceo;
      req.session.brand.brandDescription = brand.brandDescription;
      req.session.brand.technologyStack = brand.technologyStack;
      req.session.brand.phoneNumber = brand.phoneNumber;
      req.session.brand.city = brand.city;
      res.redirect("/account/brand/dashboard/settings");
    } catch (e) {
      res.render("pages/forms/brandDashboardSettingsFormEdit", {
        errors: e.errors,
        form: req.body,
      });
    }
  }

  signOutBrand(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  async deleteBrandAccount(req, res) {
    try {
      await Brand.deleteOne({ _id: req.session.brand._id });
      req.session.destroy();
      res.redirect("/");
    } catch (e) {}
  }

  async renderBrandDashboardJobOfferForm(req, res) {
    const brandJobs = await JobOffer.find({ brand: req.session.brand._id });
    res.render("pages/brandPages/brandDashboardJobs", {
      brandJobs,
    });
  }

  async publishNewBrandJobOffer(req, res) {
    try {
      const newJobOffer = new JobOffer({
        title: req.body.title,
        city: req.body.city,
        brandSlug: req.body.brandSlug,
        brand: req.session.brand._id,
        techStack: req.body.techStack,
        description: req.body.description,
        price: req.body.price,
        seniority: req.body.seniority,
        employmentType: req.body.employmentType,
      });

      await newJobOffer.save();
      res.redirect("/account/brand/dashboard/jobs");
    } catch (e) {
      res.render("pages/brandPages/brandDashboardJobs", {
        errors: e.errors,
        reqBodyData: req.body,
      });
    }
  }

  async deleteJobOffer(req, res) {
    try {
      await JobOffer.deleteOne({ brand: req.session.brand._id });
      res.redirect("/account/brand/dashboard");
    } catch (e) {}
  }

  async generateCSVBrands(req, res) {
    const fields = [
      {
        label: "BrandName",
        value: "name",
      },
      {
        label: "URL",
        value: "slug",
      },
      {
        label: "CEO",
        value: "ceo",
      },
      {
        label: "EmployeesCount",
        value: "employeesCount",
      },
      {
        label: "Country",
        value: "country",
      },
    ];
    const data = await Brand.find();
    const fileName = "brands.csv";
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);

    res.header("Content-type", "text/csv");
    res.attachment(fileName);
    res.send(csv);
  }
}

module.exports = new BrandController();
