/**
 * Created by sony on 2015/8/29.
 */
/******************公用全局变量*******************/



/*****************灯动画******************/
function Lamp(){
    this.element = $(".b_background");
    this.bright = function(){
        this.element.addClass("lamp_bright");
    };
    this.dark = function(){
        this.element.removeClass("lamp_bright");
    }
}

/*****************门动画******************/
function Door(){
    this.doorLeft = $(".door_left");
    this.doorRight = $(".door_right");
    this.openDoor = function(){
        return this.doorAction('-50%', '100%', 1500);
    };
    this.closeDoor = function(){
        return this.doorAction('0%', '50%', 1500);
    };
    this.doorAction = function(left, right, time){
        var defer = $.Deferred();
        var count = 2;
        var complete = function(){
            if( count == 1 ){
                defer.resolve();    //当该回调方法被执行第二次的时候，才使得defer状态为已成功
                return;
            }
            count--;
        };
        this.doorLeft.transition({
            "left" : left
        }, time, complete);     //两个transition方法的回调函数都为complete
        this.doorRight.transition({
            "left" : right
        }, time, complete);
        return defer;
    }
}

/*****************鸟******************/
function Bird(){
    this.element = $(".bird");
    this.fly = function(){
        this.element.addClass("birdFly");
        this.element.transition({
            right : $("#container").width()
        }, 15000, "linear");
    }
}
/*****************Logo******************/
function Logo(){
    this.element = $(".logo");
    this.display = function () {
        this.element.addClass("logoIn")
            .on(animationEnd(), function () {
                $(this).addClass("logoShake").off();    //off用于解除绑定的函数
            });
    }
}

/*****************小男孩动画******************/
var instanceX;
function Boy(){
    var container = $("#container");
    var $boy = $("#boy");
    var roadData = getValue(".a_background_middle");

    /**************修正小男孩的top值****************/
    //通过获取路Y轴坐标来修正小男孩的top值，让其走在路中间
    $boy.css({
        top: roadData.top + roadData.height/2 - $boy.height() + 25
    });

    /**************声明与移动动画有关的方法***************/
    //开始走路
    function walkTo(time, distX, distY) {
        time = time || 3000;
        var d1 = startWalk({
            "left" : distX + "px",
            "top" : distY ? distY : undefined
        },time);
        return d1;      //d1为jq的Deffered对象，里面保存着transition执行的状态
    }
    //boy脚动画开始（animation）
    function slowWalk(){
        $boy.removeClass("pause_walk");
        $boy.addClass("slow_walk");
    }
    //boy脚动画暂停
    function pauseWalk(){
        $boy.addClass("pause_walk");
    }
    //boy开始移动（transition）
    function startWalk(options, runTime) {
        var dfdPlay = $.Deferred();     //用于像ajax这样的延迟加载对象
        slowWalk();
        $boy.transition(options,runTime,"linear",function(){
            dfdPlay.resolve();      //动画完成时，将异步处理状态设置为“已成功”，链式处理根据该dfdPlay对象决定是否进行下一步操作
        });
        return dfdPlay;
    }
    /*******************结束声明*******************/

    /*******************进入商店的动画*******************/
    //进入商店
    function walkToShop(time){
        var $door = $(".door");
        var doorCenterX = $door.offset().left + $door.width() / 2;
        var boyCenterX = $boy.offset().left + $boy.width() / 2;
        instanceX = doorCenterX - boyCenterX;

        var defer = $.Deferred();   //该defer属于walkToShop方法，与startRun返回的defer无关，不可重叠
        var walkPlay = startWalk({   //startWalk会返回一个Deferred对象，该对象决定done的调用
            transform : "translateX(" + instanceX + "px), scale(0.3,0.3)",      //此处利用scale缩放boy的方法，产生在y轴移动的效果
            opacity : 0.1   //同时不断改变其透明度，感觉像在远离观众
        }, time);
        walkPlay.done(function(){
            $boy.css({
                opacity : 0
            })
            defer.resolve();    //完成后调整其状态
        });
        return defer;
    }
    //出商店
    function walkOutShop(time){
        var defer = $.Deferred();
        var walkPlay = startWalk({
            transform : "translateX(" + instanceX + "px), scale(1,1)",      //此处利用scale缩放boy的方法，产生在y轴移动的效果
            opacity : 1   //同时不断改变其透明度，感觉像在远离观众
        }, time);
        walkPlay.done(function(){
            defer.resolve();    //完成后调整其状态
        });
        return defer;
    }
    //在商店买花
    function buyFlower() {
        var defer = $.Deferred();
        setTimeout(function(){
            $boy.removeClass("slow_walk");
            $boy.addClass("flower_walk");
            defer.resolve();
        },1000);
        return defer;
    }
    /*******************商店动画结束*******************/

    /*******************返回对外接口********************/
    return {
        getWidth : function(){
            return $boy.width();
        },
        //花多长时间，走到哪里
        walkTo : function( time, proportionX, proportionY ) {
            var distX = calculateDist("x", proportionX);
            var distY = calculateDist("y", proportionY);
            return walkTo(time, distX, distY);
        },
        //暂停走路
        stopWalk : function() {
            pauseWalk();
        },
        //进商店
        toShop : function() {
            return walkToShop.apply(null, arguments);
        },
        //出商店
        outShop : function() {
            return walkOutShop.apply(null, arguments);
        },
        //买花
        buyFlower : function() {
            return buyFlower();
        },
        //拿着花停下
        flowerStop : function(){
            pauseWalk();
            $boy.removeClass("slow_walk flower_walk").addClass("boy_flower_stop");
        },
        //boy转身
        turnRound : function(callback){
            $boy.removeClass("pause_walk slow_walk flow_walk").addClass("boy_turn_round");
            if(callback){
                $boy.on(animationEnd(), function(){     //根据浏览器绑定事件
                    callback();
                    $(this).off();
                });
            }
        }

    };
}

function Girl(){
    this.element = $(".girl");
    this.getWidth = function(){
        return this.element.width();
    };
    this.getHeight = function(){
        return this.element.height();
    };
    this.modifiedOffset = function(){
        this.element.css({
            left : $("#container").width() / 2,
            top : getValue(".c_background_middle").top - this.element.height()
        });
    };
    this.getOffset = function(){
        return this.element.offset();
    };
    this.turnRound = function(){
        this.element.addClass("girl_turn_round");
    };
}

function SnowFlake(){
    this.snowflakeURL = [
        'imgs/snowflake1.png',
        'imgs/snowflake2.png',
        'imgs/snowflake3.png',
        'imgs/snowflake4.png',
        'imgs/snowflake5.png',
        'imgs/snowflake6.png'
    ];
    this.fcontainer = $("#snowflakeContainer");
    this.getImageName = function(){
        return this.snowflakeURL[Math.floor(Math.random() * 6)];
    };
    this.createSnowflake = function(){
        var url = this.getImageName();
        return $("<div class='snowflake_whirl'/>").css({
            "backgroundImage" : "url(" + url + ")"
        });
    };
    this.snowflakeAni = function(){
        //运动轨迹
        var left_start = Math.random() * this.fcontainer.width() - 100,
            opacity_start = Math.random() < 0.5 ? 1 : opacity_start,
            top_end = this.fcontainer.height() - 40,
            left_end = left_start - 100 + Math.random() * 500,
            duration = this.fcontainer.height() * 10 + Math.random() * 5000;

        var $flake = this.createSnowflake();
        $flake.css({
            left : left_start,
            opacity : opacity_start
        });
        this.fcontainer.append($flake);
        $flake.transition({
            top : top_end,
            left : left_end,
            opacity : 0.7
        }, duration, "ease-out", function(){
            $(this).remove();
        });
    };
    this.animationStart = function(){
        setInterval(function(athis){
            athis.snowflakeAni();
        },200,this);
    }
}

//音乐播放类
function Music(){
    this.audioConfig = {
        enable: true, // 是否开启音乐
        playURl: 'http://www.imooc.com/upload/media/happy.wav', //正常播放地址
        cycleURL: 'http://www.imooc.com/upload/media/circulation.wav'   //正常循环播放地址
    };
    this.html5Audio = function(url, loop){
        var audio = new Audio(url);
        audio.autoplay = true;
        audio.loop = loop || false;
        audio.play();
        return {
            end : function(callback){
                audio.addEventListener("ended", function(){
                    callback();
                }, false);
            }
        };
    }
}

function hiddenStartButton(){
    $(".start_box").transition({
        opacity : "0",
    },1000,"ease-out",function(){
        $(this).remove();
        $(this).css({display : "none"});
    });
}