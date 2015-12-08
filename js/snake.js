(function () {
  if (!window.Snake) { window.Snake = {}; }

  var Coord = window.Snake.Coord = function (pos) {
    this.pos = pos;
  };

  Coord.ZERO = new Coord([0, 0]);

  Coord.prototype.plus = function (other) {
    var x = this.pos[0] + other.pos[0];
    var y = this.pos[1] + other.pos[1];
    return new Coord([x, y]);
  };

  Coord.prototype.equals = function (other) {
    return (this.pos[0] === other.pos[0] && this.pos[1] === other.pos[1]);
  };

  Coord.prototype.toIndex = function (width) {
    return this.pos[0] * width + this.pos[1];
  };

  Coord.prototype.isOpposite = function (other) {
    return this.plus(other).equals(Coord.ZERO);
  };

  Coord.prototype.inBounds = function (width, height) {
    return this.pos[0] >= 0 && this.pos[0] < width &&
           this.pos[1] >= 0 && this.pos[1] < height;
  };

  function coordsContain (coords, target) {
    for (var i = 0; i < coords.length; i++) {
      var coord = coords[i];
      if (coord.equals(target)) {
        return true;
      }
    }

    return false;
  }

  function coordsDoNotContain (coords, target) {
    return !coordsContain(coords, target);
  }

  var Game = window.Snake.Game = function (segments) {
    this.previousDir = "E";
    this.dir = "E";
    this.segments = segments;
  };

  Game.DIRS = {
    "N": new Coord([-1, 0]),
    "S": new Coord([1,  0]),
    "W": new Coord([0, -1]),
    "E": new Coord([0,  1])
  };

  Game.prototype.nextSquare = function () {
    var lastSegment = this.segments.slice(-1)[0];
    return lastSegment.plus(Game.DIRS[this.dir]);
  };

  Game.prototype.move = function () {
    this.eat();
    this.segments.shift();
  };

  Game.prototype.eat = function () {
    this.segments.push(this.nextSquare());
    this.previousDir = this.dir;
  };

  Game.prototype.turn = function (dir) {
    if (!Game.DIRS[this.previousDir].isOpposite(Game.DIRS[dir])) {
      this.dir = dir;
    }
  };

  var Board = window.Snake.Board = function () {
    this.game = new Game([new Coord([2, 2]), new Coord([2, 3]), new Coord([2, 4])]);
    this.apples = [];
    this.spawnApple();
    this.score = 0;
  };

  Board.SIZE = 20;

  Board.prototype.inBounds = function (square) {
    return square.inBounds(Board.SIZE, Board.SIZE);
  };

  Board.prototype.spawnApple = function () {
    var freeSquares = this.freeSquares();
    var randIdx = Math.floor(Math.random() * freeSquares.length);
    this.apples.push(freeSquares[randIdx]);
  };

  Board.prototype.allSquares = function () {
    var squares = [];
    for (var rowNum = 0; rowNum < Board.SIZE; rowNum++) {
      for (var colNum = 0; colNum < Board.SIZE; colNum++) {
        squares.push(new Coord([rowNum, colNum]));
      }
    }

    return squares;
  };

  Board.prototype.freeSquares = function () {
    var allSquares = this.allSquares();
    var takenSquares = this.apples.concat(this.game.segments);
    return allSquares.filter(coordsDoNotContain.bind(this, takenSquares));
  };

  Board.prototype.removeApple = function (square) {
    for (var i = 0, n = this.apples.length; i < n; i++) {
      if (this.apples[i].equals(square)) {
        this.apples.splice(i, 1);
        return;
      }
    }
  };

  Board.prototype.isOver = function (square) {
    return (!this.inBounds(square) ||
      (coordsContain(this.game.segments, square) &&
       !square.equals(this.game.segments[0]))
    );
  };

  Board.prototype.move = function () {
    var nextSquare = this.game.nextSquare();
    if (coordsContain(this.apples, nextSquare)) {
      this.game.eat();
      this.removeApple(nextSquare);
      this.score += 1;
      this.spawnApple();
    } else if (this.isOver(nextSquare)) {
      return false;
    } else {
      this.game.move();
    }

    return true;
  };

})();
