Template.postsList.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submited: -1}});
  }
});