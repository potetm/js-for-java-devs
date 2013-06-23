var mammel = function(spec) {
  var
    name  = spec.name  || 'Insert default mammel name here',
    sound = spec.sound || "Some mammels just don't speak"
  ;

  return {
    getName: function() {
      return name;
    },
    makeSound: function() {
      return sound;
    }
  };
};

var cat = function(spec) {
  var
    name  = spec.name  || 'Cat',
    sound = spec.sound || 'Meow',
    that  = mammel({ name: name, sound: sound })
  ;

  that.purr = function() {
    return 'Puuuuuuuuuur';
  };

  that.getName = function() {
    return that.makeSound() + ' ' + name + ' ' + that.makeSound();
  };

  return that;
};
