/**
 * Created by sony on 2015/8/27.
 */
/**
 * Created by sony on 2015/8/26.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var RAIDUS = 8;     //每一个小圆的半径
var MARGIN_LEFT = 10;
var MARGIN_TOP = 200;

var endTime = new Date();    //倒计时结束时间
endTime.setHours( endTime.getHours() + 3 );
var curShowTimeSeconds = 0;      //存储“当前时间”距离“倒计时结束时间”距离的秒数
var curTime;

var balls = [];     //用于存储所有弹跳小球
//用于随机小球的颜色
var colors = ["#FFFF66","#FFCCFF","#FF66FF","#FF6666","#99CC99","#6699CC","#FFCC99","#66FFFF","#66CC99"];

window.onload = function(){

    WINDOW_WIDTH = document.getElementById("clock_box").offsetWidth;
    WINDOW_HEIGHT = document.getElementById("clock_box").offsetHeight;

    console.log(WINDOW_WIDTH);
    console.log(WINDOW_WIDTH);

    MARGIN_LEFT = WINDOW_WIDTH/10;
    MARGIN_TOP = WINDOW_HEIGHT/5;

    RAIDUS = Math.round( (WINDOW_WIDTH*4/5)/108 ) -1;

    var canvas = document.getElementById("clock_canvas");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    if( canvas.getContext ){
        var ctx = canvas.getContext("2d");
        curShowTimeSeconds = getCurrentTimeSecond();
        setInterval(function(){     //动画设置
            render(ctx);            //其实完全可以在setIterval中加入curShowTimeSeconds = getCurrentTimeSecond();后再调用render()。
            update();               //只是这里特意把时间变化放在另一个函数中，以便将来制作掉小球的效果
        },50);
    } else {
        alert("Your browser is no support canvas, please update your browser.");
    }
};

function getCurrentTimeSecond(){

    curTime = new Date();
}

//绘制各位数字
function render(ctx) {
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    var hour = curTime.getHours();
    var minute = curTime.getMinutes();
    var second = curTime.getSeconds();

    //绘制时间
    renderDigit( MARGIN_LEFT, MARGIN_TOP, parseInt(hour/10), ctx);
    renderDigit( MARGIN_LEFT + 15*(RAIDUS+1), MARGIN_TOP, parseInt(hour%10), ctx);
    renderDigit( MARGIN_LEFT + 30*(RAIDUS+1), MARGIN_TOP, 10, ctx);
    renderDigit( MARGIN_LEFT + 39*(RAIDUS+1), MARGIN_TOP, parseInt(minute/10), ctx);
    renderDigit( MARGIN_LEFT + 54*(RAIDUS+1), MARGIN_TOP, parseInt(minute%10), ctx);
    renderDigit( MARGIN_LEFT + 69*(RAIDUS+1), MARGIN_TOP, 10, ctx);
    renderDigit( MARGIN_LEFT + 78*(RAIDUS+1), MARGIN_TOP, parseInt(second/10), ctx);
    renderDigit( MARGIN_LEFT + 93*(RAIDUS+1), MARGIN_TOP, parseInt(second%10), ctx);

    //绘制掉落小球
    for( var i=0; i<balls.length; i++ ){
        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc( balls[i].x, balls[i].y, RAIDUS, 0, 2*Math.PI );
        ctx.closePath();
        ctx.fill();
    }
}

//绘制每一个数字
function renderDigit(x, y, num, ctx){
    ctx.fillStyle = "#6699FF";

    for(var i=0; i<digit[num].length; i++){     //画出每次时间变化时，该位数的变化
        for(var j=0; j<digit[num][i].length; j++){
            if( digit[num][i][j] == 1 ){
                var centerX = x + j*(RAIDUS+1)*2 + (RAIDUS+1);
                var centerY = y + i*(RAIDUS+1)*2 + (RAIDUS+1);
                ctx.beginPath();
                ctx.arc(centerX, centerY, RAIDUS, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

function update(){
    var nextTime = new Date();

    var nextHours = nextTime.getHours();
    var nextMinutes = nextTime.getMinutes();
    var nextSeconds = nextTime.getSeconds();

    var curHours = curTime.getHours();
    var curMinutes = curTime.getMinutes();
    var curSeconds = curTime.getSeconds();

    if( nextSeconds != curSeconds ){    //如果下一个要显示的时间和现在的时间不一样，那么就改变curShowTimeSeconds
        curTime = nextTime;

        //同时获得所有要变化的位数
        if( parseInt(nextHours/10) != parseInt(curHours/10) ) {     //小时十位
            addBalls( MARGIN_LEFT, MARGIN_TOP, parseInt(nextHours/10) );
        }
        if( nextHours%10 != curHours%10 ) {                         //小时个位
            addBalls( MARGIN_LEFT + 15*(RAIDUS+1), MARGIN_TOP, nextHours%10 );
        }

        if( parseInt(nextMinutes/10) != parseInt(curMinutes/10) ) {     //分钟十位
            addBalls( MARGIN_LEFT + 39*(RAIDUS+1), MARGIN_TOP, parseInt(nextMinutes/10) );
        }
        if( nextMinutes%10 != curMinutes%10 ) {                         //分钟个位
            addBalls( MARGIN_LEFT + 54*(RAIDUS+1), MARGIN_TOP, nextMinutes%10 );
        }

        if( parseInt(nextSeconds/10) != parseInt(curSeconds/10) ) {     //秒十位
            addBalls( MARGIN_LEFT + 78*(RAIDUS+1), MARGIN_TOP, parseInt(nextSeconds/10) );
        }
        if( nextSeconds%10 != curSeconds%10 ) {                         //秒个位
            addBalls( MARGIN_LEFT + 93*(RAIDUS+1), MARGIN_TOP, nextSeconds%10 );
        }
    }

    //经过上面的判断，所有在下一次时间变化会出现的小球都会添加到balls中
    //此时我们就开始让小球产生速度，并自动滚落
    updateBalls();
}

function addBalls(x, y, num) {      //此处传入的x,y是位的坐标
    for( var i=0; i<digit[num].length; i++ ){
        for( var j=0; j<digit[num][i].length; j++ ){
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x : x + j*(RAIDUS+1)*2 + (RAIDUS+1),
                    y : y + i*(RAIDUS+1)*2 + (RAIDUS+1),
                    //随机一个-3到-5，3到5的x轴速度
                    vx : Math.pow(-1, parseInt(Math.random()*1000) ) < 0 ? selectFrom(-5,-3) : selectFrom(3,5),
                    vy : -10 * Math.random(),   //随机一个0到-10的y轴速度
                    g : 1.5 + Math.random(),    //随机1.5到2.5之间的一个加速度
                    color : colors[selectFrom(0,8)]    //随机一个颜色
                };
                balls.push(aBall);      //将new好的小球放到数组里面
            }
        }
    }
}

function updateBalls(){
    for(var i=0; i<balls.length; i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y > WINDOW_HEIGHT - RAIDUS ){      //触底碰撞检测
            balls[i].y = WINDOW_HEIGHT - RAIDUS;
            balls[i].vy = -balls[i].vy * 0.7;
        }
    }

    //删除不在屏幕上的小球
    var cnt = 0;
    for( i=0; i<balls.length; i++){
        if( balls[i].x+RAIDUS > 0 && balls[i].x-RAIDUS < WINDOW_WIDTH ){
            balls[cnt++] = balls[i];        //如果第i个小球符合规则，则将其挤到数组前面，第i个小球前不符合规则的小球，都会失去数组对其的引用
        }
    }
    //但如果数组最后有连续个不符合规则的小球，则不会失去引用
    //但由于该for循环结束以后，0到cnt-1都是符合规则的小球，而cnt到i-1都是不符合规则的小球，所以可以利用pop操作
    while( balls.length > Math.min(300,cnt) ){      //只保留还在屏幕上的前300个小球
        balls.pop();    //删除末尾元素
    }
}