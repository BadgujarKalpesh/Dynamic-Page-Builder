const Page = require('../models/Page');
const mongoose = require('mongoose');

// @desc    Get all pages
// @route   GET /api/pages
exports.getPages = async (req, res, next) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ success: true, count: pages.length, data: pages });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single page
// @route   GET /api/pages/:id
exports.getPage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }
    res.status(200).json({ success: true, data: page });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new page
// @route   POST /api/pages
exports.createPage = async (req, res, next) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update page
// @route   PUT /api/pages/:id
exports.updatePage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    // *** THIS IS THE NEW FEATURE LOGIC ***
    // Check if the table_name has changed.
    const oldTableName = page.table_name;
    const newTableName = req.body.table_name;

    if (oldTableName && newTableName && oldTableName !== newTableName) {
      // Rename the corresponding MongoDB collection.
      try {
        await mongoose.connection.db.collection(oldTableName).rename(newTableName);
        console.log(`Successfully renamed collection from ${oldTableName} to ${newTableName}`);
      } catch (renameErr) {
        // If the old collection doesn't exist, we can ignore the error.
        if (renameErr.codeName !== 'NamespaceNotFound') {
            console.error('Error renaming collection:', renameErr);
            return res.status(500).json({ success: false, error: 'Failed to rename database table.' });
        }
      }
    }

    // Now, update the page configuration document itself.
    const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({ success: true, data: updatedPage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete page
// @route   DELETE /api/pages/:id
exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    const collectionName = page.table_name;
    if (mongoose.connection.collections[collectionName]) {
      await mongoose.connection.collections[collectionName].drop();
    }
    
    await page.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
