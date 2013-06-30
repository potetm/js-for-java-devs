var rockSomeCodz = function(codeToRock) {
  return this.name + "is gonna ROCK this code: " + codeToRock;
};

rockSomeCodz.apply({ name: "Tim" }, ["JavaScript"]);
rockSomeCodz.call({ name: "Tim" }, "JavaScript");
