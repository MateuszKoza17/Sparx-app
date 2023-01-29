module.exports = function (req, res, next) {
  if (!req.session.brand) {
    res.redirect("/account/brand/signin");
  }

  next();
};
