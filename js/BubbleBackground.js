/**
 * Created by sony on 2015/12/22 0022.
 */

;
(function ($) {
    var BubbleBackground = function () {
        var self = this;
        this.bubbleBackground = $("#bbg");
        this.bubbleArr = [];
        this.init();
    };

    BubbleBackground.prototype = {
        init: function () {
            var self = this;
            for (var i = 0; i < 10; i++) {
                var bubbleStr = "<div class='bubble'></div>";
                var bubble = $(bubbleStr);
                var widthAndHeight = 0;

                while (widthAndHeight < 100) {
                    widthAndHeight = Math.random() * 200;
                }
                var top = Math.random() * window.screen.height - widthAndHeight;
                var left = Math.random() * window.screen.width - widthAndHeight;
                bubble.css({width: widthAndHeight, height: widthAndHeight, top: top, left: left, opacity: Math.random() / 5});
                this.bubbleBackground.append(bubble);
                this.bubbleMove(bubble);
                this.bubbleArr.push(bubble);
            }
        },
        bubbleMove: function (bubble) {
            var self = this;
            var currentTop = bubble.css("top").replace(/px/, "");
            var currentLeft = bubble.css("left").replace(/px/, "");
            var top = Math.random() * window.screen.height - bubble.css("height").replace(/px/, "");
            var left = Math.random() * window.screen.width - bubble.css("width").replace(/px/, "");
            var time = Math.sqrt(Math.pow(Math.abs(currentTop - top), 2) + Math.pow(Math.abs(currentLeft - left), 2)) * 100;

            bubble.animate({top: top + "px", left: left + "px"}, time, "linear", function () {
                self.bubbleMove(bubble);
            });
        }
    };

    window['BubbleBackground'] = BubbleBackground;
})(jQuery);