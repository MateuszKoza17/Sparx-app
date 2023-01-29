module.exports = function (req, res, next) {
  res.locals.brand = req.session.brand;
  next();
};
