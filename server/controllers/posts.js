const cuid = require('cuid'),
      slug = require('limax'),
      sanitize = require('sanitize-html'),
      Post = require('../db/models/post'),
      Tag = require('../db/models/tag'),
      errorHandler = require('../db/error_handler');

module.exports.list = (req, res) => {
  const userId = req.query.tags;
  let query;
  if (userId) {
    query = Post.find({ user: userId });
  } else {
    query = Post.find();
  }
  query.populate('tags').sort('-updatedAt').exec((err, posts) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(posts);
  });
};

module.exports.read = (req, res) => {
  console.log(req.params.pageId)
  Post.find({ page: req.params.pageId }).then(posts => {
    console.log(posts)
    res.json(posts);
  }).catch(err => {
    res.json(err);
  });
};

// module.exports.create = (req, res) => {
//   console.log(req.body)
//   const post = new Post(req.body);
//   console.log(post)
//   post.user = req.user;

//   post.save((err, newPost) => {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     }
//     // Is this the best way?  Need to get the tag data into what gets returned
//     Post.findById(newPost._id).populate('tags').exec((err, newPostWithTags) => {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       }
//       res.json(newPostWithTags);
//     });
//   });
// };

module.exports.create = (req, res) => {
  console.log(req.body)
  Post.create(req.body)
  .then(post => {
    return Tag.findOneAndUpdate({ _id: req.params.id }, { name: post._id }, { new: true });
  })
  .then(tag => {
    res.json({ result: tag });
  })
  .catch(err => {
    res.json(err);
  });
}

module.exports.update = (req, res) => {
  const post = req.post;

  post.text = req.body.text;
  if (req.body.tags) {
    post.tags = req.body.tags;
  }

  post.save((err, updatedPost) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    // Is this the best way?  Need to get the tag data into what gets returned
    Post.findById(updatedPost._id).populate('tags').exec((err, updatedPostWithTags) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(updatedPostWithTags);
    });
  });
};

module.exports.delete = (req, res) => {
  const post = req.post;
  post.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(post);
  });
};

module.exports.tagsByPost = (req, res) => {
  const post = req.post;
  Tag.find({ _id: { $in: note.tags } }).populate('tags').sort('-updatedAt').exec((err, tags) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(tags);
  });
};

// Middleware to retrieve the tag when an id is passed in the route
module.exports.postById = function (req, res, next, id) {
  Post.findById(id).populate('tags').exec((err, post) => {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No note with that identifier has been found'
      });
    }
    req.post = post;
    next();
  });
};