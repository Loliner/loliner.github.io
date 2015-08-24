(function(){
  //准备画布
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;
  document.body.appendChild(canvas);

  //准备图片
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function(){
    bgReady = true;
  };
  bgImage.src = "imgs/background.png";

  var heroReady = false;
  var heroImage = new Image();
  heroImage.onload = function(){
    heroReady = true;
  };
  heroImage.src = "imgs/hero.png";

  var monsterReady = false;
  var monsterImage = new Image();
  monsterImage.onload = function(){
    monsterReady = true;
  };
  monsterImage.src = "imgs/monster.png";

  //游戏对象
  var hero = {
    speed : 256,  //每秒移动的像素
    x : 0,
    y : 0
  };
  var monster = {
    x : 0,
    y : 0
  };
  var monstersCaught = 0;

  //处理用户的输入
  var keysDown = {};
  addEventListener("keydown", function(e){
    var e = e || event;
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
  }, false);

  //开始一轮游戏
  var reset = function(){
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
  }

  //更新游戏对象的属性
  var update = function(modifier) {
    if (38 in keysDown) {
      hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) {
      hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) {
      hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) {
      hero.x += hero.speed * modifier;
    }

    if (
      hero.x <= (monster.x + 32)
      && monster.x <= (hero.x + 32)
      && hero.y <= (monster.y + 32)
      && monster.y <= (hero.y + 32)
    ) {
      ++monstersCaught;
      reset();
    }
  }

  //画出所有物体
  var render = function(){
    if (bgReady) {
      ctx.drawImage(bgImage,0,0);
    }
    if (heroReady) {
      ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (monsterReady) {
      ctx.drawImage(monsterImage, monster.x, monster.y)
    }

    ctx.fillStyle = "rgb(250,250,250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
  }

  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

  //主循环函数
  var main = function(){
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    //立即调用主函数
    requestAnimationFrame(main);
  }

  var then = Date.now();
  reset();
  main();
})();
