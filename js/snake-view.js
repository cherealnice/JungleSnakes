(function () {
  if (typeof Snake === "undefined") {
    window.Snake = {};
  }

  var View = Snake.View = function ($el) {
    this.$el = $el;
    this.board = new Snake.Board();
    this.game = this.board.game;
    this.setupBoard();
    this.$board = this.$el.find(".board");
    this.bindEvents();
    this.intervalId = setInterval(this.step.bind(this), 200);
    this.angle = 0;
    this.rotateIntervalId = setInterval(this.rotate.bind(this), 100);
  };

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };

  View.prototype.rotate = function () {
    this.angle += 1 * this.board.score;
    var rotatorY = Math.floor(this.board.score / 7);
    var rotatorX = Math.floor(this.board.score / 14);
    if (this.board.score !== 0 && this.board.score % 7 === 0 ) {
      var crazyStr = "rotate(0deg) rotateY(0deg) rotateX(0deg)";
      this.angle = 0;
    } else {
      var crazyStr = "rotate(" + this.angle + "deg) rotateY(" + rotatorY*180 +"deg) rotateX(" + rotatorX*180 +"deg)";
    }
    this.$board.css("transform", crazyStr);
  }

  View.prototype.bindEvents = function () {
    $(document).on("keydown", function (e) {
      this.game.turn(View.KEYS[e.which]);
    }.bind(this));
  };

  View.prototype.unbindEvents = function () {
    $(document).off("keydown");
  };

  View.prototype.makeMove = function () {
    return this.board.move();
  };

  View.prototype.step = function () {
    if (!this.makeMove()) {
      this.gameOver();
    }
    this.render();
  };

  View.prototype.gameOver = function () {
    clearInterval(this.intervalId);
    this.intervalId = null;
    setTimeout(function() {
      clearInterval(this.rotateIntervalId);
      this.$board.css("transform", "rotate(0deg)");
      this.$board.css("transition", "transform 1s")
    }.bind(this), 2000);
    this.unbindEvents();
    this.$el.addClass("game-over");
  };

  View.prototype.setupBoard = function () {
    var $title = $("<h1>", {"text": "Snake"});

    var $board = $("<ul>", {"class": "board group"});
    for (var rowNum = 0; rowNum < Snake.Board.SIZE; rowNum++) {
      for (var colNum = 0; colNum < Snake.Board.SIZE; colNum++) {
        var $square = $("<li>", {"data": {"pos": [rowNum, colNum]}});
        $board.append($square);
      }
    }

    var $score = $("<p>", {"text": "Score: "});
    $score.append($("<span>", {"class": "score", "text": "0"}));

    this.$el.append($title, $board, $score);
  };

  View.prototype.render = function () {
    var $allSquares = this.$el.find("li");
    $allSquares.removeClass("snake apple");

    this.board.apples.forEach(function (coord) {
      var idx = coord.toIndex(Snake.Board.SIZE);
      $allSquares.eq(idx).addClass("apple");
    });

    this.game.segments.forEach(function (coord) {
      var idx = coord.toIndex(Snake.Board.SIZE);
      $allSquares.eq(idx).addClass("snake");
    });

    this.$el.find(".score").text(this.board.score);

  };
})();
