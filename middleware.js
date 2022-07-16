const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/reviews");

const { campGroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (campground && !campground.author.equals(req.user._id)) {
    req.flash("error", "Yoy do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campGroundSchema.validate(req.body);
  if (error) {
    msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (review && !review.author.equals(req.user._id)) {
    req.flash("error", "Yoy do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
