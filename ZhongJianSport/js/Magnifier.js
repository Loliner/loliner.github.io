(function($) {

    var Magnifier = function(options) {
        this.init(options);
        this.addMouseListener();
        this.addButtonListener();
        this.addThumbnailListener();
    };

    Magnifier.prototype = {
        init: function(options) {
            var self = this;
            this.options = {
                width: 400,
                mask_width: 150
            }
            $.extend(this.options, options);
            this.magnifier = $("#magnifier");
            this.magnifier.css({
                width: this.options.width,
                height: this.options.width
            });
            //阴影层
            this.mask = $("#pointer-mask");
            this.mask.css({
                width: this.options.mask_width,
                height: this.options.mask_width
            });
            this.mask_width = this.options.mask_width;
            this.mask_height = this.options.mask_width;

            //普通图片层
            this.imgWrapper = $("#img-wrapper");
            this.img = this.imgWrapper.find("img");
            this.wrapper_width = this.imgWrapper.width();
            this.wrapper_height = this.imgWrapper.height();
            this.wrapper_top = this.imgWrapper.offset().top;
            this.wrapper_left = this.imgWrapper.offset().left;

            //放大图片层
            this.magImgBox = $("#mag-img-box");
            this.magImgBox.css({ //放大图片层宽高与与普通图宽高一样
                width: this.wrapper_width,
                height: this.wrapper_height,
                left: this.wrapper_width + 10
            });
            //放大图片
            this.magImg = this.magImgBox.find("#mag-img");
            //放大倍率
            this.scale = this.imgWrapper.width() / this.mask_width;
            this.magImg.css({
                width: this.magImgBox.width() * this.scale, //放大图片的宽高根据放大倍率来计算
                height: this.magImgBox.height() * this.scale
            });
        },
        addMouseListener: function() {
            var self = this;
            //鼠标移入事件
            this.imgWrapper.mouseover(function() {
                self.mask.css({
                    display: "block"
                });
                self.magImgBox.css({
                    display: "block"
                });
            });

            //鼠标移动事件
            this.imgWrapper.mousemove(function(e) {
                //通过鼠标xy轴的值计算蒙层的top和left，并将其限制在普通图范围内
                var top = e.pageY - self.wrapper_top - self.mask_width / 2;
                var left = e.pageX - self.wrapper_left - self.mask_height / 2;
                top = top < 0 ? 0 : top;
                top = top > self.wrapper_height - self.mask_height ? self.wrapper_height - self.mask_height : top;
                left = left < 0 ? 0 : left;
                left = left > (self.wrapper_width - self.mask_width) ? self.wrapper_width - self.mask_width : left;
                self.mask.css({
                    top: top,
                    left: left
                });
                self.magImg.css({
                    top: -(top * self.scale), //蒙层向右移多少，放大图片就相应往左移多少（*倍率）
                    left: -(left * self.scale)
                });
            });

            //鼠标移除事件
            this.imgWrapper.mouseleave(function(e) {
                self.mask.css({
                    display: "none"
                });
                self.magImgBox.css({
                    display: "none"
                });
            });
        },
        /*绑定按钮事件*/
        addButtonListener: function() {
            var self = this;
            //缩略图部分处理
            this.list = this.magnifier.find(".thumbnail-list");
            this.lis = this.list.find("li");
            //获得每个li的所占位置宽度（包括margin和border）
            var li_width = Number($(this.lis[0]).outerWidth()) + Number($(this.lis[0]).css("marginLeft").replace(/px/, "")) * 2;
            //根据li的个数设置ul的宽度
            this.list.css({
                width: li_width * this.lis.length
            });

            //通过wrapper和ul计算往左最大偏移量
            this.list_wrapper = this.magnifier.find(".list-wrapper");
            var left_end = $(this.list_wrapper).width() - this.list.width(); //ul往左的最大偏移量，保证左移时右边不出现空白

            //左右按钮事件绑定
            this.prev = this.magnifier.find(".prev");
            this.next = this.magnifier.find(".next");
            $(this.prev).click(function() {
                //当前左移量
                var current_left = Number(self.list.css("left").replace(/px/, ""));
                //判断左移是否让右边出现空白，如果会出现空白，则左移量为最大值
                var next_left = current_left - li_width < left_end ? left_end : current_left - li_width;
                self.list.animate({
                    "left": next_left
                });
            });
            $(this.next).click(function() {
                var current_left = Number(self.list.css("left").replace(/px/, ""));
                var next_left = current_left + li_width > 0 ? 0 : current_left + li_width;
                self.list.animate({
                    "left": next_left
                });
            });
        },
        /*绑定图片切换事件*/
        addThumbnailListener: function() {
            var self = this;
            this.thumnailImgs = this.list.find("img");
            $(this.list).delegate("img", "mouseenter", function(e) {
                self.thumnailImgs.each(function(index, _this) {
                    $(_this).css("borderColor", "#ddd");
                });
                $(e.target).css({
                    "borderColor": "red"
                });
                var src = e.target.src;
                self.img[0].src = src;
                self.magImg[0].src = src;
            });
        }
    };

    window['Magnifier'] = Magnifier;

})(jQuery);
