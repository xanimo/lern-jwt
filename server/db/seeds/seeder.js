const seeder = require('mongoose-seed'),
      config = require('../../config');

const data = [
  {
    model: 'Post',
    documents: [
      {
        page: '507f191e810c19729de860ea',
        title: 'Test Title',
        content: 'Test Content',
        slug: 'test-slug',
        cuid: '930jf09f3092902'
      }
    ]
  },
  {
    model: 'Tag',
    documents: [
      {
        name: 'tag1'
      },
      {
        name: 'tag2'
      },
      {
        _id: '507f191e810c19729de860ea',
        name: 'tag3'
      }
    ]
  },
  {
    model: 'Page',
    documents: [
      {
        _id: '507f191e810c19729de860ea',
        name: 'About'
      },
      {
        name: 'Press'
      },
      {
        name: 'Photo'
      },
      {
        name: 'Video'
      },
      {
        name: 'Mixes'
      }
    ]
  }
];

seeder.connect(config.db.uri, () => {
  seeder.loadModels(['server/db/models/post.js', 'server/db/models/tag.js', 'server/db/models/page.js']);
  seeder.clearModels(['Post', 'Tag', 'Page'], () => {
    seeder.populateModels(data, function() {
      console.log('done seeding database');
      process.exit(0);
    })
  });
});