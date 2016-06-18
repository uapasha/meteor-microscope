Posts = new Mongo.Collection('posts');

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update:function(userId, post, fieldNames){
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
})


Meteor.methods({
  postInsert: function(postAttributes) {
    // check(Meteor.userId(), String);
    // check(postAttributes, {
    //   title: String,
    //   url: String
    // });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      commentsCount: 0,
      voters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },

  upvote: function(postId) {
    var user = Meteor.user();

    if (!user)
      throw new Meteor.Error(401, 'You should log in');
    // var post = Posts.findOne(postId);
    // if (!post)
    //   throw new Meteor.Error(422, 'Post not found');
    // if (_.include(post.upvoters, user._id))
    //   throw new Meteor.Error(422, "You've already voted");
    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    },{
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});