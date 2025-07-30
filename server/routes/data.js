const express = require('express');
const {
  getData,
  getDatum,
  createData,
  updateData,
  deleteData
} = require('../controllers/dataController');

const router = express.Router();


// Routes for regular data CRUD
router.route('/:tableName').get(getData).post(createData);
router.route('/:tableName/:id').get(getDatum).put(updateData).delete(deleteData);

module.exports = router;
