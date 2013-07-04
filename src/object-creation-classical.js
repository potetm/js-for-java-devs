var Mammal = function(name) {
  this.name = name;
};

Mammal.prototype.getName = function() {
  return this.name;
};

Mammal.prototype.makeSound = function() {
  return this.sound || 'Me no speakum.';
};

var Cat = function(name) {
  this.name = name;
  this.sound = 'Meow';
};

Cat.prototype = new Mammal();

Cat.prototype.purr = function() {
  return 'Puuuuuuuuuur';
};

Cat.prototype.getName = function() {
  return this.makeSound() + ' ' + this.name + ' ' + this.makeSound();
};
