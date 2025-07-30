const express = require('express');
const {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} = require('../controllers/pageController');

const router = express.Router();

router.route('/').get(getPages).post(createPage);

router.route('/:id').get(getPage).put(updatePage).delete(deletePage);

module.exports = router;
