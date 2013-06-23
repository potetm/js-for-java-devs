var mammel = {
  name:    "Insert Default Mammel Name.",
  getName: function() {
    return this.name;
  },
  makeSound: function() {
    return this.sound || "Some mammels just don't speak";
  }
};

var cat = Object.create(mammel);
cat.name  = 'Sammy';
cat.sound = 'Meow';
cat.purr  = function() {
  return 'Puuuuuuuuuur';
};
cat.getName = function() {
  return this.makeSound() + ' ' + this.name + ' ' + this.makeSound();
};
