const Rating = require("../db/models/rating/rating.js");
const nodemailer = require("nodemailer");
const emails = [];

class PageController {
  async renderHomePage(req, res) {
    const ratings = await Rating.find({}).populate("user");

    res.render("pages/home", {
      ratings,
    });
  }

  renderAboutPage(req, res) {
    res.render("pages/about");
  }

  renderSupportPage(req, res) {
    res.render("pages/support");
  }

  renderSearchPage(req, res) {
    res.render("pages/search");
  }

  renderGetStartedPage(req, res) {
    res.render("pages/getStarted");
  }

  renderFQS(req, res) {
    res.render("pages/faq");
  }

  renderSparxNewsletterPage(req, res) {
    res.render("pages/newsletter");
  }

  async sendNewsletter(req, res) {
    const { email } = req.body;
    emails.push(email);

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const info = await transporter.sendMail({
      from: "Sparx. Team <sparx@dev.com>",
      to: email,
      subject: "Sparx Newsletter",
      text: `Hello ${email}, thanks for submmiting our newsletter!`,
      html: `<b>Hello ${email}</b>, thanks for submmiting our newsletter!`,
    });

    res.render("pages/newsletterThanks", {
      mailLink: nodemailer.getTestMessageUrl(info),
    });
  }

  renderNotFound(req, res) {
    res.render("errors/404");
  }
}

module.exports = new PageController();
