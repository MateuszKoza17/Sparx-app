const User = require("../db/models/user/user.js");
const Rating = require("../db/models/rating/rating.js");
const { Parser } = require("json2csv");

class UserController {
  async showAllUsers(req, res) {
    const { q } = req.query;
    const users = await User.find({
      firstName: { $regex: q || "", $options: "i" },
    });
    res.render("pages/userPages/searchUsers", {
      users,
    });
  }

  async showCurrentUser(req, res) {
    const { userEmail } = req.params;
    const currentUser = await User.findOne({
      email: userEmail,
    });

    res.render("pages/userPages/user", {
      currentUser,
    });
  }

  renderSignUpUserForm(req, res) {
    res.render("pages/forms/userSignUp");
  }

  async signUpUser(req, res) {
    try {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        country: req.body.country,
      });

      await newUser.save();
      res.redirect("/");
    } catch (e) {
      res.render("pages/forms/userSignUp", {
        errors: e.errors,
        reqBodyData: req.body,
      });
    }
  }

  renderSignInUserForm(req, res) {
    res.render("pages/forms/userSignIn");
  }

  async signInUser(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const isPasswordCorrect = user.isValidPswd(req.body.password);

      if (!user) {
        throw new Error("Email is incorrect");
      }

      if (!isPasswordCorrect) {
        throw new Error("Password is incorrect");
      }

      req.session.user = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        country: user.country,
        city: user.city,
        userDescription: user.userDescription,
        userJob: user.userJob,
        technologySkills: user.technologySkills,
        websiteLink: user.websiteLink,
        githubLink: user.githubLink,
        date: user.date,
      };

      res.redirect("/account/user/dashboard");
    } catch (e) {
      res.render("pages/forms/userSignIn", {
        reqBodyData: req.body,
        errors: true,
      });
    }
  }

  renderUserDashboard(req, res) {
    res.render("pages/userPages/userDashboard", {
      user: req.session.user,
    });
  }

  renderUserDashboardSettings(req, res) {
    res.render("pages/userPages/userDashboardSettings");
  }

  renderUserDashboardSettingsEditForm(req, res) {
    res.render("pages/forms/userDashboardSettingsFormEdit", {
      reqBodyData: req.session.user,
    });
  }

  async saveUserChanges(req, res) {
    const user = await User.findById(req.session.user._id);
    user.email = req.body.email;
    user.technologySkills = req.body.technologySkills;
    user.githubLink = req.body.githubLink;
    user.websiteLink = req.body.websiteLink;
    user.userDescription = req.body.userDescription;

    if (req.body.password) {
      user.password = req.body.password;
    }

    try {
      await user.save();
      req.session.user.email = user.email;
      req.session.user.technologySkills = user.technologySkills;
      req.session.user.githubLink = user.githubLink;
      req.session.user.websiteLink = user.websiteLink;
      req.session.user.userDescription = user.userDescription;
      res.redirect("/account/user/dashboard/settings");
    } catch (e) {
      res.render("pages/forms/userDashboardSettingsFormEdit", {
        errors: e.errors,
        form: req.body,
      });
    }
  }

  signOutUser(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  async deleteUserAccount(req, res) {
    try {
      await User.deleteOne({ _id: req.session.user._id });
      req.session.destroy();
      res.redirect("/");
    } catch (e) {}
  }

  async renderRatingForm(req, res) {
    const currentRating = await Rating.find({
      user: req.session.user._id,
    });

    res.render("pages/forms/ratingUserForm", {
      user: req.session.user,
      currentRating,
    });
  }

  async publishRating(req, res) {
    try {
      const newRating = new Rating({
        user: req.session.user._id,
        ratingDescription: req.body.rateDescription,
        ratingLevel: req.body.rateLevel,
      });

      await newRating.save();
      res.redirect("/account/user/dashboard");
    } catch (e) {
      res.render("pages/forms/ratingUserForm", {
        errors: e.errors,
        reqBodyData: req.body,
        user: req.session.user,
      });
    }
  }

  async deleteUserRating(req, res) {
    try {
      await Rating.deleteOne({ user: req.session.user._id });

      res.redirect("/account/user/dashboard");
    } catch (e) {}
  }

  async generateCSVUsers(req, res) {
    const fields = [
      {
        label: "FirstName",
        value: "firstName",
      },
      {
        label: "LastName",
        value: "lastName",
      },
      {
        label: "Country",
        value: "country",
      },
    ];
    const data = await User.find();
    const fileName = "users.csv";
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);

    res.header("Content-type", "text/csv");
    res.attachment(fileName);
    res.send(csv);
  }
}

module.exports = new UserController();
