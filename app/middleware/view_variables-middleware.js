module.exports = function (req, res, next) {
  res.locals.errors = null;
  res.locals.reqBodyData = {};
  res.locals.query = req.query;
  next();
};
