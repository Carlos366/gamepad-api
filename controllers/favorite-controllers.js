const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Favorite = require('../models/favorite');
const User = require('../models/user');

const getFavoriteById = async (req, res, next) => {
  const favoriteId = req.params.id;

  let favorite;
  try {
    favorite = await Favorite.findOne({
      id_game: favoriteId,
      creator: req.userData.userId,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a favorite.',
      500
    );
    return next(error);
  }

  if (!favorite) {
    const error = new HttpError(
      'Could not find a favorite for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ favorite: favorite.toObject({ getters: true }) });
};

const getFavoritesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithFavorites;
  try {
    userWithFavorites = await User.findById(userId).populate('favorites');
  } catch (err) {
    const error = new HttpError(
      'Fetching favorites failed, please try again later',
      500
    );
    return next(error);
  }

  // if (!favorites || favorites.length === 0) {
  if (!userWithFavorites || userWithFavorites.favorites.length === 0) {
    return next(
      new HttpError('Could not find favorites for the provided user id.', 404)
    );
  }

  res.json({
    favorites: userWithFavorites.favorites.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const addFavorite = async (req, res, next) => {
  const { id_game, background_image, parent_platforms, name } = req.body;

  const addedFav = new Favorite({
    id_game,
    background_image,
    parent_platforms,
    name,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating favorite failed, please try again',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await addedFav.save({ session: sess });
    user.favorites.push(addedFav);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Adding Favorite failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ favorite: addedFav });
};

const deleteFavorite = async (req, res, next) => {
  const favId = req.params.id;

  let favorite;
  try {
    favorite = await Favorite.findOne({
      id_game: favId,
      creator: req.userData.userId,
    }).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete favorite.',
      500
    );
    return next(error);
  }

  if (!favorite) {
    const error = new HttpError('Could not find favorite for this id.', 404);
    return next(error);
  }

  if (favorite.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this favorite.',
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await favorite.remove({ session: sess });
    favorite.creator.favorites.pull(favorite);
    await favorite.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete favorite.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted favorite with success.' });
};

exports.getFavoriteById = getFavoriteById;
exports.getFavoritesByUserId = getFavoritesByUserId;
exports.addFavorite = addFavorite;
exports.deleteFavorite = deleteFavorite;
