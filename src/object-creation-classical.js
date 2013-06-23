var Mammel = function(name) {
  this.name = name;
};

Mammel.prototype.getName = function() {
  return this.name;
};

Mammel.prototype.makeSound = function() {
  return this.sound || 'Me no speakum.';
};

var Cat = function(name) {
  this.name = name;
  this.sound = 'Meow';
};

Cat.prototype = new Mammel();

Cat.prototype.purr = function() {
  return 'Puuuuuuuuuur';
};

Cat.prototype.getName = function() {
  return this.makeSound() + ' ' + this.name + ' ' + this.makeSound();
};
