/**
 * Created by sony on 2015/8/28.
 */

function Swipe(container){

    var element = container.find("ul.content-wrap"); //ul
    var slides = element.find(">");    //三个li
    var width = container.width();
    var height = container.height();

    var swipe = {};

    //设置ul的宽度和高度
    element.css({
        width : (slides.length * width) + "px",
        height : height + "px"
    });
    //设置li的宽度和高度
    $.each(slides, function(index){
        var slide = slides.eq(index);   //遍历每一个li
        slide.css({
            width : width + "px",
            height : height + "px"
        });
    });
    //公开一个对外接口，该接口可控制画面移动的距离、时长
    swipe.scrollTo = function(time, proportionX){
        var distX = container.width() * proportionX;
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': time + 'ms',
            'transform': 'translate3d(-' + distX + 'px,0px,0px)' //设置页面X轴移动
        });
    }

    return swipe;
}