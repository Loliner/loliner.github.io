/**
 * Created by sony on 2015/8/31.
 */
/*********获取元素height和top的工具方法************/
function getValue(className) {
    var $elem = $("" + className);
    return {
        height: $elem.height(),
        top: $elem.position().top
    };
}

/*********获取不同浏览器animation的结束事件************/
function animationEnd(){
    var explorer = navigator.userAgent;
    if( ~explorer.indexOf("WebKit") ){
        return 'webkitAnimationEnd';
    }
    return 'animationend';
}

/**************以百分比形式返回页面宽高*****************/
function calculateDist(direction, proportion) {
    return (direction == "x" ? $("#container").width() : $("#container").height()) * proportion;
}