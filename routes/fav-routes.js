const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const favoritesControllers = require('../controllers/favorite-controllers');

const router = express.Router();

router.use(checkAuth);

router.get('/:id', favoritesControllers.getFavoriteById);

router.get('/user/:uid', favoritesControllers.getFavoritesByUserId);

router.post('/', favoritesControllers.addFavorite);

router.delete('/:id', favoritesControllers.deleteFavorite);

module.exports = router;
