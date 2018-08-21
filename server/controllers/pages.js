const Page = require('../db/models/page'),
	  Post = require('../db/models/post'),
	  errorHandler = require('../db/error_handler');

module.exports.list = (req, res) => {
  Page.find().sort('name').exec((err, pages) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(pages);
  });
};

module.exports.read = (req, res) => {
  Post.find({ page: req.params.pageId }).then(post => {

  })
};

module.exports.readByName = (req, res) => {
  let name = new String();
  if (req.params.pageName) {
    name = req.params.pageName;
    name = name[0].toUpperCase() + name.substr(1, name.length);
  }
  Page.findOne({ name: name }).exec((err, pages) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    Post.find({ page: pages._id }).then(post => {
      res.json(post);
    }).catch(err => {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    })
  });
}

module.exports.create = (req, res) => {
  const page = new Page(req.body);

  Page.save((err, newpage) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(newpage);
  });
};

module.exports.update = (req, res) => {
  const page = req.page;

  page.name = req.body.name;

  Page.save((err, updatedpage) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(updatedpage);
  });
};

module.exports.delete = (req, res) => {
  const page = req.page;
  Page.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(page);
  });
};

module.exports.postsBypage = (req, res) => {
	console.log(req)
};


// Middleware to retrieve the page when an id is passed in the route
module.exports.pageById = function (req, res, next, id) {
  Page.findById(id).exec((err, page) => {
    if (err) {
      return next(err);
    } else if (!page) {
      return res.status(404).send({
        message: 'No page with that identifier has been found'
      });
    }
    req.page = page;
    next();
  });
};