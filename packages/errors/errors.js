Errors = {
  // Локальная (только для клиента) коллекция


  throw: function(message) {
    Errors.collection.insert({message: message, seen: false})
  },
  clearSeen: function() {
    Errors.collection.remove({seen: true});
  }
};

Errors.collection = new Meteor.Collection(null);