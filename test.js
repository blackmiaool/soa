var _host = "" + window.location.host,
    _href = function (a, b) {
        return /[\u4E00-\u9FA5]/g.test(b) ? "http://" + _host + "/" + encodeURIComponent(b) : a
    }(window.location.href, window.location.pathname);
$(window).resize(function () {
    var a = $(".righter").offset().left + 300;
    $("#rightBan").css("left", a);
    $(".topback").css("left", a)
});
if (_host.indexOf("dict.cn") != -1 && document.domain != "dict.cn") {
    document.domain = "dict.cn"
}! function (a) {
    a.mouseover(function (d) {
        var c = $(d.target);
        if (c) {
            var b = c.parents(".more");
            if (b.length) {
                b.find(".morehover").addClass("hover");
                b.find(".morelinks, .personinfo").css("display", "block")
            } else {
                a.find(".morehover").removeClass("hover");
                a.find(".morelinks, .personinfo").css("display", "none")
            }
        }
    }).trigger("mouseover");
    a.find(".morelinks, .personinfo").click(function () {
        a.find(".morehover").removeClass("hover");
        a.find(".morelinks, .personinfo").css("display", "none")
    })
}($(document.body));
! function (a) {
    a.attr("href", a.attr("href") + "?url=" + _href)
}($("#header .logout"));
/*!
 * dictDailog
 *
 * @onwer http://dict.cn/
 * @developer Yanis Wang
 *
 * @Version: 1.0.0
 * @Build 20111102
 */
(function ($, _win, _doc, undefined) {
    var defaults = {
        title: "提示",
        content: "",
        type: "text",
        skin: "default",
        position: {
            left: "center",
            top: "center"
        },
        focus: "mousedown",
        shadow: 4,
        time: 0,
        noTitle: false,
        fixed: false,
        drag: false,
        modal: false,
        animate: 300
    };
    var dictDialog = function () {
        var _this = this;
        _this.init.apply(_this, arguments)
    };
    dictDialog.version = "1.0.0";
    dictDialog.settings = defaults;
    var jsRoot = $($("script").get($("script").length - 1))[0].src.replace(/[^\/]+$/, "");
    if (!jsRoot.match(/^https?/i)) {
        jsRoot = location + jsRoot
    }
    var ua = window.navigator.userAgent;
    var ie6 = ua.indexOf("MSIE 6") != -1,
        ie7 = ua.indexOf("MSIE 7") != -1,
        ie8 = ua.indexOf("MSIE 8"),
        isTouch = ("ontouchend" in _doc);
    var $win = $(_win),
        _docElem, _body;
    var $modalMask, $dragMask;
    var arrTopZindex = [99999, 99999999];
    var arrModalDailog = [],
        modalCount = 0;

    function showModal(dialog) {
        if (arrModalDailog.length == 0) {
            $modalMask.show()
        }
        $modalMask.css("zIndex", dialog.zIndex);
        arrModalDailog.push(dialog);
        modalCount++
    }

    function hideModal() {
        arrModalDailog.pop();
        modalCount--;
        modalCount == 0 ? $modalMask.hide() : $modalMask.css("zIndex", arrModalDailog[arrModalDailog.length - 1].zIndex)
    }
    $(function () {
        _docElem = _doc.documentElement;
        _body = _doc.body;
        $("head").append("<style>.dDialog{position:absolute;}.dd_shadow{position:absolute;background:#000;}.dd_mask{position:fixed;top:0;left:0;height:100%;width:100%;background-color:#000;opacity:.2;filter:alpha(opacity=20);_position:absolute;_height:expression(Math.max(document.documentElement.clientHeight,document.documentElement.scrollHeight)+'px');_width:expression(Math.max(document.documentElement.clientWidth,document.documentElement.scrollWidth)+'px');}.dd_drag{cursor:move;user-selec:none;-moz-user-selec:none;-webkit-user-select:none;}.dd_wait{width:100%;height:100%;}.dd_dragMask{display:none;position:fixed;cursor:move;z-index:99999999999;top:0;left:0;height:100%;width:100%;background-color:#000;opacity:0;filter:alpha(opacity=0);_position:absolute;_height:expression(Math.max(document.documentElement.clientHeight,document.documentElement.scrollHeight)+'px');_width:expression(Math.max(document.documentElement.clientWidth,document.documentElement.scrollWidth)+'px');}.dd_content{word-break:break-all;word-wrap:break-word;}.dd_info{padding:20px;}.dd_button{text-align:right;padding:6px 10px;background:#F6F6F6;border-top:1px solid #EBEBEB;}.dd_button button{margin-right:5px;padding:2px 10px;vertical-align: bottom;}</style>");
        $modalMask = $('<div class="dd_mask" style="display:none"></div>').appendTo("body");
        $dragMask = $('<div class="dd_dragMask"></div>').appendTo("body");
        ie6 && $(_body).css("backgroundAttachment") !== "fixed" && $("html").css({
            backgroundImage: "url(about:blank)",
            backgroundAttachment: "fixed"
        });
        $(_doc).keydown(function (e) {
            if (e.which === 27) {
                if (modalCount > 0) {
                    var dialog = arrModalDailog[modalCount - 1];
                    if (!dialog.settings.noClose) {
                        dialog.hide()
                    }
                }
                return false
            }
        })
    });
    dictDialog.prototype = {
        init: function (options, callback) {
            var _this = this;
            _this.bShow = false;
            var settings = _this.settings = $.extend({}, dictDialog.settings, options);
            if (((ie6 || ie7 || ie8) && settings.corner) || ie6) {
                settings.animate = false
            }
            if (isTouch) {
                settings.fixed = false
            }
            var $wrap = $('<div class="dd_' + settings.skin + '"></div>').appendTo("body");
            var $dialog = _this.$dialog = $('<div style="display:none;" class="dDialog">' + (!settings.noTitle ? '<div class="dd_title">标题</div>' : "") + '<span title="关闭' + (_this.settings.modal ? " (Esc)" : "") + '" class="dd_close"' + (settings.noClose ? ' style="display:none"' : "") + '>×</span><div class="dd_content"></div></div>').appendTo($wrap);
            var $title = _this.$title = $dialog.find(".dd_title");
            _this.$titletext = $dialog.find(".dd_title");
            var $content = _this.$content = $dialog.find(".dd_content");
            var $shadow = _this.$shadow = $('<div style="display:none;" class="dd_shadow"></div>').appendTo($wrap).css("opacity", 0.15);
            _this.setTitle(settings.title).setContent(settings.content);
            var corner = settings.corner;
            if (corner) {
                var arrCorner = corner.match(/[a-z]+|[A-Z][a-z]+|\d+/g),
                    cornerSide = arrCorner[0],
                    cornerPosition = arrCorner[1],
                    distance = arrCorner[2] ? parseInt(arrCorner[2]) : 0,
                    centerName = cornerSide.match(/top|bottom/) ? "left" : "top";
                var $corner = _this.$corner = $('<div class="dd_corner dd_corner_' + cornerSide + '" style="' + cornerSide + ":-20px;" + (cornerPosition == "Center" ? centerName + ":50%;margin-" + centerName + ":-10px;" : (cornerPosition + ":" + distance + "px;")) + '"></div>').appendTo($dialog);
                var x = 0,
                    y = 0,
                    dialogWidth = $dialog.outerWidth(),
                    dialogHeight = $dialog.outerHeight();
                var s1 = cornerSide.substr(0, 1),
                    p1 = cornerPosition.substr(0, 1),
                    d = distance + 11;
                if (s1.match(/[tb]/)) {
                    if (s1 == "t") {
                        y = 10
                    } else {
                        y = -(dialogHeight + 10)
                    }
                    if (p1 == "L") {
                        x = -d
                    }
                    if (p1 == "C") {
                        x = -(dialogWidth / 2)
                    }
                    if (p1 == "R") {
                        x = -(dialogWidth - d)
                    }
                }
                if (s1.match(/[lr]/)) {
                    if (s1 == "l") {
                        x = 10
                    } else {
                        x = -(dialogWidth + 10)
                    }
                    if (p1 == "T") {
                        y = -d
                    }
                    if (p1 == "C") {
                        y = -(dialogHeight / 2)
                    }
                    if (p1 == "B") {
                        y = -(dialogHeight - d)
                    }
                }
                _this.offsetFix = {
                    x: x,
                    y: y
                }
            }
            var focus = settings.focus;
            if (focus) {
                $dialog.bind(focus + " touchstart", function () {
                    _this.setTopLayer()
                })
            }
            $dialog.find(".dd_close").bind("click touchend", function () {
                _this.hide();
                return false
            });
            var drag = settings.drag,
                shadow = settings.shadow;
            if (drag) {
                (drag == "all" ? $dialog : $title).addClass("dd_drag").bind({
                    "mousedown touchstart": function (e) {
                        if (e.target.className == "dd_close") {
                            return
                        }
                        if (e.type.substr(0, 5) == "touch") {
                            e = e.originalEvent.targetTouches[0]
                        }
                        _this.bDrag = true;
                        var offset = $dialog.offset();
                        _this.lastDragOffset = {
                            x: e.pageX - offset.left,
                            y: e.pageY - offset.top
                        };
                        $dragMask.show();
                        if (e.preventDefault) {
                            e.preventDefault()
                        }
                    },
                    selectstart: function () {
                        return false
                    }
                });
                $(_doc).bind({
                    "mousemove touchmove": function (e) {
                        if (_this.bDrag) {
                            if (e.type.substr(0, 5) == "touch") {
                                e = e.originalEvent.targetTouches[0]
                            }
                            var scrollLeft = _docElem.scrollLeft || _body.scrollLeft,
                                scrollTop = _docElem.scrollTop || _body.scrollTop;
                            var limitLeft = 0,
                                limitTop = 0,
                                limitRight = _docElem.clientWidth - $dialog.outerWidth(),
                                limitBottom = _docElem.clientHeight - $dialog.outerHeight();
                            var lastDragOffset = _this.lastDragOffset;
                            var left = e.pageX - lastDragOffset.x,
                                top = e.pageY - lastDragOffset.y;
                            if (settings.fixed && !ie6) {
                                left -= scrollLeft;
                                top -= scrollTop
                            } else {
                                limitLeft = scrollLeft;
                                limitTop = scrollTop;
                                limitRight += limitLeft;
                                limitBottom += limitTop
                            }
                            left = left < limitLeft ? limitLeft : (left > limitRight ? limitRight : left);
                            top = top < limitTop ? limitTop : (top > limitBottom ? limitBottom : top);
                            if (!ie6 || !corner) {
                                $dialog.css("opacity", 0.5);
                                $shadow.hide()
                            }
                            $dialog.css({
                                left: left,
                                top: top
                            });
                            $shadow.css({
                                left: left + shadow,
                                top: top + shadow
                            });
                            if (ie6) {
                                _this.changeFixed()
                            }
                            return false
                        }
                    },
                    "mouseup touchend": function () {
                        if (_this.bDrag) {
                            _this.bDrag = false;
                            $dialog.css("opacity", "");
                            $shadow.show();
                            $dragMask.hide()
                        }
                    }
                })
            }
            _this.changeFixed().setTopLayer().moveTo();
            var timer;
            if (!drag) {
                $win.bind("resize", function () {
                    if (timer) {
                        clearTimeout(timer)
                    }
                    timer = setTimeout(function () {
                        _this.moveTo()
                    }, 100)
                })
            }
        },
        setTitle: function (sHtml) {
            var _this = this;
            _this.$titletext.html(sHtml);
            return _this
        },
        setContent: function (sHtml) {
            var _this = this,
                settings = _this.settings,
                type = settings.type;
            if (type == "iframe") {
                _this.bIframeInit = false;
                sHtml = $('<div class="dd_wait"></div><iframe frameborder="0" src="' + sHtml + (/\?/.test(sHtml) ? "&" : "?") + "parenthost=" + location.host + '" style="width:100%;height:100%;visibility:hidden;"></iframe>')
            } else {
                if (type == "ajax") {
                    $.get(sHtml + (sHtml.indexOf("?") != -1 ? "&" : "?") + "r=" + (new Date().getTime()), function (data) {
                        _this._setContent(data)
                    });
                    sHtml = $('<div class="dd_wait" style="width:200px;height:100px;"></div>')
                } else {
                    if (type == "text") {
                        sHtml = $('<div class="dd_text"></div>').append(sHtml)
                    }
                }
            }
            _this._setContent(sHtml);
            return _this
        },
        _setContent: function (sHtml) {
            var _this = this;
            _this.$content.html(sHtml);
            _this._updateSize();
            return _this
        },
        _updateSize: function () {
            var _this = this,
                $dialog = _this.$dialog,
                $content = _this.$content,
                settings = _this.settings,
                width = settings.width,
                height = settings.height;
            $dialog.add($content).css({
                width: "",
                height: ""
            });
            var dialogWidth = $dialog.width(),
                newWidth;
            if (width) {
                if (isNaN(width)) {
                    var minWidth = width[0],
                        maxWidth = width[1];
                    if (minWidth && dialogWidth < minWidth) {
                        newWidth = minWidth
                    }
                    if (maxWidth && dialogWidth > maxWidth) {
                        newWidth = maxWidth
                    }
                } else {
                    newWidth = width
                }
                if (newWidth) {
                    $dialog.css("width", newWidth);
                    $content.css({
                        width: newWidth
                    })
                }
            }
            var dialogHeight = $dialog.height(),
                newHeight;
            if (height) {
                if (isNaN(height)) {
                    var minHeight = height[0],
                        maxHeight = height[1];
                    if (minHeight && dialogHeight < minHeight) {
                        newHeight = minHeight
                    }
                    if (maxHeight && dialogHeight > maxHeight) {
                        newHeight = maxHeight
                    }
                } else {
                    newHeight = height
                }
                if (newHeight) {
                    $dialog.css("height", newHeight);
                    $content.css("height", newHeight - _this.$title.outerHeight())
                }
            }
            _this.$shadow.css({
                width: $dialog.outerWidth(),
                height: $dialog.outerHeight()
            });
            setTimeout(function () {
                if (_this.$dialog) {
                    _this.$shadow.css({
                        width: $dialog.outerWidth(),
                        height: $dialog.outerHeight()
                    })
                }
            }, 300)
        },
        show: function (position, y) {
            var _this = this;
            if (position) {
                _this.moveTo(position, y)
            }
            if (!_this.bShow) {
                var settings = _this.settings;
                if (settings.beforeShow && settings.beforeShow.call(_this) === false) {
                    return _this
                }
                var $all = _this.$dialog.add(_this.$shadow);
                if (settings.modal) {
                    showModal(_this)
                }
                var animate = settings.animate;
                animate ? $all.fadeIn(animate) : $all.show();
                _this._updateSize();
                _this.bShow = true;
                if (settings.type == "iframe" && !_this.bIframeInit) {
                    var $arrDiv = _this.$content.children(),
                        $iframe = $arrDiv.eq(1),
                        $wait = $arrDiv.eq(0);
                    var iframeWin = $iframe[0].contentWindow,
                        result;
                    var onIframeCallback = settings.iframeCallback;
                    $iframe.load(function () {
                        initIframe();
                        if (result) {
                            var bResult = true;
                            try {
                                result = eval("(" + unescape(result) + ")")
                            } catch (e) {
                                bResult = false
                            }
                            if (bResult) {
                                return iframeCallback(result)
                            }
                        }
                        if ($wait.is(":visible")) {
                            $wait.remove();
                            $iframe.css("visibility", "")
                        }
                    });

                    function initIframe() {
                        try {
                            iframeWin.callback = iframeCallback;
                            iframeWin.unloadme = function () {
                                _this.hide()
                            };
                            $(iframeWin.document).keydown(function () {});
                            result = iframeWin.name
                        } catch (ex) {}
                    }

                    function iframeCallback(v) {
                        iframeWin.document.write("");
                        _this.hide();
                        if (v != null && onIframeCallback) {
                            onIframeCallback.call(_this, v)
                        }
                    }
                    initIframe();
                    _this.bIframeInit = true
                }
                var time = settings.time;
                if (time > 0) {
                    setTimeout(function () {
                        _this.hide()
                    }, time)
                }
                if (settings.afterShow) {
                    settings.afterShow.call(_this)
                }
            }
            return _this
        },
        hide: function () {
            var _this = this,
                settings = _this.settings;
            if (_this.bShow) {
                if (settings.beforeHide && settings.beforeHide.call(_this) === false) {
                    return _this
                }
                var $all = _this.$dialog.add(_this.$shadow);
                if (settings.modal) {
                    hideModal()
                }
                var animate = settings.animate;
                animate ? $all.fadeOut(animate * 0.5) : $all.hide();
                _this.bShow = false;
                if (settings.afterHide) {
                    settings.afterHide.call(_this)
                }
            }
            return _this
        },
        moveTo: function (position, y) {
            var _this = this,
                settings = _this.settings,
                $dialog = _this.$dialog;
            if (y !== undefined) {
                position = {
                    left: position,
                    top: y
                }
            }
            if (position !== undefined) {
                settings.position = position
            } else {
                position = settings.position
            }
            var left, top;
            var scrollLeft = _docElem.scrollLeft || _body.scrollLeft,
                scrollTop = _docElem.scrollTop || _body.scrollTop,
                clientWidth = _docElem.clientWidth,
                clientHeight = _docElem.clientHeight,
                dialogWidth = $dialog.outerWidth(),
                dialogHeight = $dialog.outerHeight();
            var right = position.right,
                bottom = position.bottom;
            left = position.left != undefined ? position.left : right != "center" ? (clientWidth - dialogWidth - right) : right;
            top = position.top != undefined ? position.top : bottom != "center" ? (clientHeight - dialogHeight - bottom) : bottom;
            if (left == "center") {
                left = (clientWidth - dialogWidth) / 2
            }
            if (top == "center") {
                top = (clientHeight - dialogHeight) / 2
            }
            if (settings.fixed && ie6) {
                left += scrollLeft;
                top += scrollTop
            }
            var offsetFix = _this.offsetFix;
            if (offsetFix) {
                left += offsetFix.x;
                top += offsetFix.y
            }
            var moveMode = settings.animate && _this.bShow ? "animate" : "css",
                shadow = settings.shadow;
            _this.$dialog[moveMode]({
                left: left,
                top: top
            });
            _this.$shadow[moveMode]({
                left: left + shadow,
                top: top + shadow
            });
            if (ie6) {
                _this.changeFixed()
            }
            return _this
        },
        setTopLayer: function () {
            var _this = this,
                i = _this.settings.modal ? 1 : 0;
            if (!_this.zIndex || _this.zIndex + 3 < arrTopZindex[i]) {
                _this.zIndex = arrTopZindex[i]++;
                _this.$shadow.css("zIndex", arrTopZindex[i]++);
                _this.$dialog.css("zIndex", arrTopZindex[i]++)
            }
            return _this
        },
        remove: function () {
            var _this = this,
                $dialog = _this.$dialog;
            if ($dialog) {
                _this.hide();
                $dialog.parent().html("").remove();
                _this.$dialog = _this.$shadow = null;
                _this.bShow = false
            }
        },
        changeFixed: function (bFixed) {
            var _this = this,
                settings = _this.settings;
            if (bFixed != undefined) {
                settings.fixed = bFixed
            } else {
                bFixed = settings.fixed
            }
            var style1 = _this.$dialog[0].style,
                style2 = _this.$shadow[0].style;
            if (bFixed) {
                if (ie6) {
                    var sDocElem = "(document.documentElement||document.body)";
                    var left = parseInt(style1.left) - _docElem.scrollLeft,
                        top = parseInt(style1.top) - _docElem.scrollTop;
                    style2.position = style1.position = "absolute";
                    style1.setExpression("left", sDocElem + ".scrollLeft+" + left + "+'px'");
                    style1.setExpression("top", sDocElem + ".scrollTop+" + top + "+'px'");
                    style2.setExpression("left", sDocElem + ".scrollLeft+" + (left + settings.shadow) + "+'px'");
                    style2.setExpression("top", sDocElem + ".scrollTop+" + (top + settings.shadow) + "+'px'")
                } else {
                    style2.position = style1.position = "fixed"
                }
            } else {
                style2.position = style1.position = "absolute";
                if (ie6) {
                    style1.removeExpression("left");
                    style1.removeExpression("top")
                }
            }
            return _this
        }
    };
    _win.dDialog = dictDialog;
    var sOk = '<button class="dd_ok">确定</button>',
        sCancel = '<button class="dd_cancel">取消</button>';
    var alertFunc = dDialog.alert = function (sHtml, callback) {
        var bCallback = false,
            $dialog, $content = $('<div class="dd_info">' + sHtml + '</div><div class="dd_button">' + sOk + "</div>"),
            $button = $content.find("button");
        $dialog = showMessage($content, function () {
            return checkCallback("hide")
        });
        $button.focus().click(function () {
            checkCallback("ok")
        });

        function checkCallback(type) {
            if (bCallback) {
                return
            }
            if (callback && callback({
                    type: type
                }) == false) {
                return false
            }
            bCallback = true;
            if (type != "hide") {
                $dialog.hide()
            }
            $dialog = null
        }
    };
    var confirmFunc = dDialog.confirm = function (sHtml, callback) {
        var bCallback = false,
            $dialog, $content = $('<div class="dd_info">' + sHtml + '</div><div class="dd_button">' + sOk + sCancel + "</div>"),
            $button = $content.find("button");
        $dialog = showMessage($content, function () {
            return checkCallback("hide")
        });
        $button.click(function () {
            checkCallback(this.className.substr(3))
        }).eq(0).focus();

        function checkCallback(type) {
            if (bCallback) {
                return
            }
            if (callback && callback({
                    type: type
                }) == false) {
                return false
            }
            bCallback = true;
            if (type != "hide") {
                $dialog.hide()
            }
            $dialog = null
        }
    };
    var promptFunc = dDialog.prompt = function (sHtml, defValue, callback) {
        var bCallback = false,
            $dialog, $content = $('<div class="dd_info">' + sHtml + '<br /><br /><input type="text" size="30" value="' + defValue + '"/></div><div class="dd_button">' + sOk + sCancel + "</div>"),
            $input = $content.find("input"),
            $button = $content.find("button");
        $button.click(function () {
            var type = this.className.substr(3);
            checkCallback(type, type == "ok" ? $input.val() : "")
        });
        $content.find("input[type=text]").keypress(function (e) {
            if (e.which == 13) {
                checkCallback("ok", $input.val())
            }
        });
        $dialog = showMessage($content, function () {
            return checkCallback("hide")
        });
        $input.focus();

        function checkCallback(type, data) {
            if (bCallback) {
                return
            }
            if (callback && callback({
                    type: type,
                    data: data
                }) == false) {
                return false
            }
            bCallback = true;
            if (type != "hide") {
                $dialog.hide()
            }
            $dialog = null
        }
    };

    function showMessage(sHtml, hideCallback) {
        return new dDialog($.extend({}, dDialog.messageSettings, {
            content: sHtml,
            beforeHide: function () {
                return hideCallback()
            },
            afterHide: function () {
                this.remove()
            }
        })).show()
    }
    dDialog.messageSettings = {
        type: "html",
        modal: true,
        drag: true,
        fixed: true,
        animate: false,
        width: [0, 300]
    };
    var popupFunc = dDialog.popup = function (sHtml, popupOptions, dialogOptions) {
        if (!popupOptions) {
            popupOptions = {}
        }
        if (!dialogOptions) {
            dialogOptions = {}
        }
        var $dialog = new dDialog($.extend({}, dDialog.popupSettings, {
            content: sHtml,
            corner: popupOptions.corner
        }, dialogOptions));

        function popupTo(target, position) {
            var _this = this,
                $target = $(target);
            if (position) {
                popupPosition = position
            } else {
                position = popupPosition
            }
            var offset = $target.offset(),
                width = $target.outerWidth(),
                height = $target.outerHeight();
            var left = offset.left,
                top = offset.top;
            if (position) {
                if (position.left != undefined) {
                    left += position.left;
                    top += position.top
                } else {
                    if (position.match(/^center$/i)) {
                        left += width / 2;
                        top += height / 2
                    } else {
                        var arrCorner = position.match(/[a-z]+|[A-Z][a-z]+|\d+/g);
                        var s1 = arrCorner[0].substr(0, 1),
                            p1 = arrCorner[1].substr(0, 1),
                            d = arrCorner[2] ? parseInt(arrCorner[2]) : 0;
                        if (s1.match(/[tb]/)) {
                            if (s1 == "b") {
                                top += height
                            }
                            if (p1 == "L") {
                                left += d
                            } else {
                                if (p1 == "C") {
                                    left += width / 2
                                } else {
                                    left += width - d
                                }
                            }
                        } else {
                            if (s1 == "r") {
                                left += width
                            }
                            if (p1 == "T") {
                                top += d
                            } else {
                                if (p1 == "C") {
                                    top += height / 2
                                } else {
                                    top += height - d
                                }
                            }
                        }
                    }
                }
            } else {
                left += width;
                top += height
            }
            $dialog.moveTo(left, top);
            return _this
        }
        $dialog.popupTo = popupTo;
        var target = popupOptions.target,
            popupPosition = popupOptions.position;
        if (target) {
            $dialog.popupTo(target)
        } else {
            if (popupPosition && popupPosition.left) {
                $dialog.moveTo(popupPosition)
            }
        }
        var _timerShow, _timerHide;
        var showOptions = popupOptions.show,
            showTarget;
        if (showOptions && (showTarget = showOptions.target ? showOptions.target : target)) {
            var showDelay = showOptions.delay ? showOptions.delay : 0;
            $(showTarget).bind(showOptions.event, function () {
                var _this = this;
                if (showDelay) {
                    clearTimeout(_timerShow);
                    _timerShow = setTimeout(function () {
                        $dialog.popupTo(_this).show()
                    }, showDelay)
                } else {
                    $dialog.popupTo(_this).show()
                }
            })
        }
        var hideOptions = popupOptions.hide;
        if (hideOptions) {
            var hideTarget = hideOptions.target;
            if (hideTarget == "both") {
                hideTarget = $dialog.$dialog.add(target)
            } else {
                hideTarget = target
            }
            if (hideTarget) {
                var hideDelay = hideOptions.delay,
                    $hideTarget = $(hideTarget);
                $hideTarget.bind(hideOptions.event, function (e) {
                    var hideTarget, relatedTarget = e.relatedTarget;
                    for (var i = 0; i < $hideTarget.length; i++) {
                        hideTarget = $hideTarget[i];
                        if (hideTarget === relatedTarget || $.contains(hideTarget, relatedTarget)) {
                            return
                        }
                    }
                    clearTimeout(_timerShow);
                    if (hideDelay) {
                        clearTimeout(_timerHide);
                        _timerHide = setTimeout(function () {
                            $dialog.hide()
                        }, hideDelay)
                    } else {
                        $dialog.hide()
                    }
                });
                if (hideDelay) {
                    $hideTarget.mouseover(function () {
                        clearTimeout(_timerHide)
                    })
                }
            }
        }
        return $dialog
    };
    dDialog.popupSettings = {
        noTitle: true,
        noClose: true
    };
    $.fn.dDialog = function (options) {
        var arrDialog = [],
            arrDiv;
        this.each(function () {
            arrDiv = $(this).hide().children("div");
            arrDialog.push(new dDialog($.extend(options, {
                title: arrDiv[0].childNodes,
                content: arrDiv[1].childNodes
            })))
        });
        if (arrDialog.length === 0) {
            arrDialog = false
        }
        if (arrDialog.length === 1) {
            arrDialog = arrDialog[0]
        }
        return arrDialog
    };
    $.fn.dTip = function (options) {
        var _this = this;
        _this.each(function () {
            var $this = $(this);
            $this.attr("dtitle", $this.attr("title")).removeAttr("title")
        });
        var settings = $.extend({}, {
                maxWidth: 300,
                delay: 200
            }, options),
            dialogOptions = {
                content: "",
                noTitle: true,
                noClose: true,
                skin: "tip"
            };
        var delay = settings.delay,
            maxWidth = settings.maxWidth,
            skin = settings.skin;
        if (maxWidth) {
            dialogOptions.width = [0, maxWidth]
        }
        if (skin) {
            dialogOptions.skin = skin
        }
        var dialog = new dDialog(dialogOptions);
        var bTitleClose, bShow, lastOffset, _timer;
        _this.bind({
            mouseover: function () {
                hideTip();
                bTitleClose = false
            },
            mousemove: function (e) {
                if (!bTitleClose) {
                    var $this = $(this);
                    if (bShow) {
                        if (Math.abs(e.pageX - lastOffset.x) > 10 || Math.abs(e.pageY - lastOffset.y) > 10) {
                            hideTip();
                            bTitleClose = true
                        }
                    } else {
                        clearTimeout(_timer);
                        _timer = setTimeout(function () {
                            dialog.setContent($this.attr("dtitle")).moveTo(e.pageX, e.pageY + 22).show();
                            bShow = true;
                            lastOffset = {
                                x: e.pageX,
                                y: e.pageY
                            }
                        }, delay)
                    }
                }
            },
            mouseout: function () {
                if (!bTitleClose) {
                    clearTimeout(_timer);
                    hideTip()
                }
            }
        });

        function hideTip() {
            dialog.hide();
            bShow = false
        }
        return _this
    }
})(jQuery, window, document);
String.prototype.replaceAll = function (a, b) {
    return this.replace(new RegExp(a, "gm"), b)
};
window.getCookie = function (a) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(a + "=");
        if (c_start != -1) {
            c_start = c_start + a.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return decodeURIComponent(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
};
window.setCookie = function (a, c) {
    var b = 30;
    var d = new Date();
    d.setTime(d.getTime() + b * 24 * 60 * 60 * 1000);
    document.cookie = a + "=" + encodeURIComponent(c) + ";expires=" + d.toGMTString() + ";path=/;domain=.dict.cn"
};
var $user_id = getCookie("DictCN_uid"),
    $user_name = getCookie("DictCN_username"),
    $user_auth = getCookie("DictCN_auth");

function myEncodeURI(a) {
    a = a.replace(/(^\s+)|(\s+$)/, "").replace(/_/g, "_5F").replace(/\./g, "_2E").replace(/\+/g, "_2B").replace(/\//g, "_2F");
    return encodeURIComponent(a)
}

function domainURI(b) {
    var a = /http:\/\/([^\/]+)\//i;
    domain = b.match(a);
    return "http://" + domain[1]
}

function isNewLang(b) {
    if (!multi_langs) {
        multi_langs = "kr|jp|fr|it|de|ru|es"
    }
    var c = new RegExp("/(?:" + multi_langs + ")/", "i");
    var a = b.match(c);
    if (a) {
        return a
    }
    return false
}
window.isEmail = function (b) {
    var a = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return a.test(b)
};
window.changeIMG = function (a) {
    a.each(function () {
        var b = $(this);
        if (b.attr("src")) {
            b.attr("src", b.attr("src").replace("/i1/images/", i1_home + "/i1/images/"))
        }
    })
};
window.stringToDateTime = function (h) {
    var b = 1000;
    var e = b * 60;
    var j = e * 60;
    var k = j * 24;
    var a = k * 30;
    var c = k * 365;
    var f = new Date();
    var l = f.getTime() - h;
    var g = 0;
    if (l > a * 2) {
        var d = new Date(h);
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    } else {
        if (l > a) {
            return "1个月前"
        } else {
            if (l > k * 7) {
                return ("1周前")
            } else {
                if (l > k) {
                    return (Math.floor(l / k) + "天前")
                } else {
                    if (l > j) {
                        return (Math.floor(l / j) + "小时前")
                    } else {
                        if (l > e) {
                            return (Math.floor(l / e) + "分钟前")
                        } else {
                            if (l > b) {
                                return (Math.floor(l / b) + "秒前")
                            } else {
                                return (l + " error ")
                            }
                        }
                    }
                }
            }
        }
    }
};
jQuery.isMobile = new RegExp("Mobile").test(window.navigator.userAgent);
jQuery.fn.extend({
    drag: function (b) {
        var c = $(this),
            a = $(document.body),
            d = $(window);
        if (b.mover == undefined) {
            b.mover = c
        }
        if (b.pooler == undefined) {
            b.pooler = a
        }
        if (b.boundary == undefined) {
            b.boundary = false
        }
        if (b.boundary == "document") {
            b.boundary = a
        }
        if (b.deviation == undefined) {
            b.deviation = {
                x: 0,
                y: 0
            }
        }
        c.mousedown(function (j) {
            var h = j.clientX,
                g = j.clientY,
                f = h - b.mover.offset().left,
                k = g - b.mover.offset().top;
            b.pooler.mousemove(function (o) {
                var m = o.clientX,
                    l = o.clientY;
                if (m != h || l != l) {
                    var p = m - f + b.deviation.x,
                        n = l - k + b.deviation.y;
                    b.mover.css({
                        left: p,
                        top: n
                    })
                }
            });
            a.mouseup(function () {
                b.pooler.unbind("mousemove")
            })
        })
    },
    sounder: function (b) {
        var e = this;
        if (!window.audios) {
            window.audios = {}
        }
        if (!window.dtype) {
            window.dtype = jQuery.isMobile || !!(document.createElement("audio").play)
        }
        if (!window.ddaudio) {
            window.ddaudio = window.dtype ? new Audio(b) : jQuery("#daudio").get(0)
        }
        if (window.dtype) {
            window.ddaudio.src = b;
            window.ddaudio.play()
        } else {
            var a = 15,
                d = function () {
                    try {
                        window.ddaudio.doPlay(b);
                        clearTimeout(c)
                    } catch (f) {
                        c = setTimeout(d, a);
                        a < 1000 ? a += 15 : clearTimeout(c)
                    }
                },
                c = setTimeout(d, a)
        }
        return this
    },
    stopSound: function () {
        try {
            window.dtype ? window.ddaudio.pause() : window.ddaudio.doStop()
        } catch (a) {}
        return this
    }
});
var audioCss = "position:absolute;top:-1000%;width:1px;height:1px;overflow:hidden;-khtml-opacity:0;-moz-opacity:0;opacity:0;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);";
if (window.HTMLAudioElement && jQuery.isMobile) {
    jQuery("#daudio").length ? jQuery("#daudio").replaceWith('<audio style="' + audioCss + '" id="daudio" controls></audio>') : $(document.body).prepend('<audio style="' + audioCss + '" id="daudio" controls></audio>')
}
$(document.body).delegate("[audio]", jQuery.isMobile ? "touchstart" : "click", function () {
    var a = "http://audio.dict.cn/" + ((cur_dict == "dict" || cur_dict == "hanyu") ? "output.php?id=" : "mp3.php?q=") + $(this).attr("audio");
    $.fn.sounder(a)
});
$(document.body).delegate("[naudio]", jQuery.isMobile ? "touchstart" : "click", function () {
    var a = "http://audio.dict.cn/" + $(this).attr("naudio");
    $.fn.sounder(a)
});
var editorPath = (_host == "dict.cn" || _host == "hanyu.dict.cn") ? "http://editor.dict.cn/" : "http://test.editor.dict.cn/";
jQuery(function () {
    var a = '<em action="feedback" onclick="feedBackForm(this);" title="意见反馈">意见反馈</em><i>|</i><a title="注册" href="http://passport.dict.cn/register">注册</a><i>|</i><a title="登录" href="http://passport.dict.cn/login">登录</a>';
    var b = '<em action="feedback" onclick="feedBackForm(this);" title="意见反馈">意见反馈</em><i>|</i><a target="_blank" href="http://account.dict.cn/">设置</a><i>|</i><div class="more"><a class="morehover" href="http://my.dict.cn/' + getCookie("DictCN_uid") + '"><span>' + getCookie("DictCN_username") + '</span></a><div class="personinfo"><ol><ul><li><a target="_blank" href="http://my.dict.cn/home-space-do-notice.html">查看提醒</a></li><li><a target="_blank" href="http://my.dict.cn/home-space-do-pm.html">查看短消息</a></li><li><a target="_blank" href="http://ask.dict.cn">我的问海词</a></li></ul><ul><li><a class="logout" href="http://passport.dict.cn/logout">退出</a></li></ul></ol></div></div>';
    if ($user_auth) {
        if ($(".login").find(".more").length == 0) {
            $(".login").html(b)
        }
    } else {
        if ($(".login").find(".more").length != 0) {
            $(".login").html(a)
        }
    }
});
jQuery(function ($) {
    $.reg = {
        mail: /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
    };
    $.ie6 = new RegExp("MSIE 6.0").test(window.navigator.userAgent);
    ! function (window, body) {
        var rLeft = $(".righter").offset().left + 300;
        var backTop = $('<div class="topback"></div>').css("left", rLeft);
        body.append(backTop);
        $("#rightBan").css("left", rLeft).show();
        backTop.fadeOut(0);
        window.scrollTop() > 0 ? backTop.fadeIn(0) : backTop.fadeOut(0);
        window.scroll(function () {
            if (window.scrollTop() > 0) {
                backTop.stop().fadeIn(0).unbind("click").click(function () {
                    var scroll = window.scrollTop(),
                        interval = setInterval(function () {
                            scroll /= 1.2;
                            if (scroll > 1) {
                                window.scrollTop(scroll)
                            } else {
                                window.scrollTop(0);
                                backTop.stop().fadeOut(0);
                                clearInterval(interval)
                            }
                        }, 30)
                })
            } else {
                backTop.stop().fadeOut(0)
            }
            if (test_ads) {
                if (test_ads == 1) {
                    test_ads = $(".right-google-ads>:first-child").offset().top
                }
                if (test_ads < window.scrollTop()) {
                    if ($(".right-google-ads>:first-child").css("top") != "0px") {
                        $(".right-google-ads>:first-child").css("position", "fixed");
                        $(".right-google-ads>:first-child").css("top", "0px");
                        $(".right-google-ads>:first-child").css("z-index", "2")
                    }
                } else {
                    if ($(".right-google-ads>:first-child").css("top") == "0px") {
                        $(".right-google-ads>:first-child").css("position", "static");
                        $(".right-google-ads>:first-child").css("top", test_ads + "px")
                    }
                }
            }
        })
    }($(window), $(document.body));
    ! function (dom) {
        dom = $(dom.get(dom.length - 1));
        var az = "abcdefghijklmnopqrstuvwxyz";

        function each(arr, fn) {
            for (var i = 0; i < arr.length; i++) {
                if (fn) {
                    fn(i, arr[i])
                }
            }
        }

        function encBase62(v) {
            var s = "";
            for (var i = 0; i < 5; i++) {
                var m = v % 62;
                v = (v - m) / 62;
                if (m < 10) {
                    s += m
                } else {
                    if (m < 36) {
                        s += az.charAt(m - 10)
                    } else {
                        s += az.charAt(m - 36).toUpperCase()
                    }
                }
            }
            return s
        }

        function decBase62(v) {
            var m = 0;
            if (v.length != 5) {
                return 0
            }
            for (var i = 4; i >= 0; i--) {
                var n = v.charCodeAt(i);
                if (n > 64 && n < 91) {
                    m = m * 62 + n - 29
                } else {
                    if (n > 96 && n < 123) {
                        m = m * 62 + n - 87
                    } else {
                        if (n > 47 && n < 59) {
                            m = m * 62 + n - 48
                        } else {}
                    }
                }
            }
            return m
        }

        function writeHistoryDom(cookie) {
            $.each(cookie.split("/"), function (i, r) {
                if (i && i < 6) {
                    dom.append('<li><a href="http://' + _host + "/" + r + '">' + ($dict_dict == "ec" ? decodeURIComponent(r).substring(0, 8) : decodeURIComponent(r).substring(0, 5)) + "</a></li>")
                }
            });
            if (dom.children("li").length >= 5) {
                dom.append('<li><a href="/list/history.php">查看更多»</a></li>')
            }
        }

        function insertHistory(cookie_name, wkey, wid) {
            var cookie = getCookie(cookie_name),
                fin = "",
                widPart = new Array(),
                keyPart = new Array(),
                widStr = encBase62(wid),
                keyStr = encodeURIComponent(wkey);
            if (cookie.length) {
                var cookie_arr = cookie.split("/");
                each(cookie_arr, function (z, v) {
                    if (z) {
                        if (keyStr != v) {
                            keyPart.push(v)
                        }
                    } else {
                        for (var i = 0; i < v.length / 5; i++) {
                            if (widStr != v.substr(i * 5, 5)) {
                                widPart.push(v.substr(i * 5, 5))
                            }
                        }
                    }
                });
                widPart.unshift(widStr);
                while (widPart.length > 20) {
                    widPart.pop()
                }
                keyPart.unshift(keyStr);
                while (keyPart.length > 5) {
                    keyPart.pop()
                }
                each(widPart, function (z, v) {
                    fin += v
                });
                each(keyPart, function (z, v) {
                    fin += "/" + v
                })
            } else {
                fin = widStr + "/" + keyStr
            }
            setCookie(cookie_name, fin);
            writeHistoryDom(fin)
        }
        if ($dict_dict == "ec" || $dict_dict == "ce" || $dict_dict == "han") {
            var cookie_name = "dicth" + $dict_dict.substr(0, 1);
            if ($dict_id && $dict_query) {
                insertHistory(cookie_name, $dict_query, $dict_id)
            } else {
                writeHistoryDom(getCookie(cookie_name))
            }
        }
    }($(".floatsidenav ul"));
    ! function (slider, win) {
        slider.each(function (i, p) {
            var slid = $(p),
                content = slid.css({
                    overflow: "hidden"
                }),
                child = content.children(),
                count = Number(slid.attr("slider")),
                def = 0,
                more = $('<a class="fold" href="javascript:;">' + (langt == "zh-tw" ? "查看更多" : "查看更多") + "</a>"),
                type = 0,
                moh, defSH = win.scrollTop();
            if (child.eq(0).css("display") == "inline-block") {
                type = 1
            }
            child.each(function (i, p) {
                p = $(p);
                if (i < count) {
                    if (!type || (type && i % 2 == 0)) {
                        def += p.outerHeight() < p.attr("sh") ? Number(p.attr("sh")) : p.outerHeight()
                    }
                }
                p.removeAttr("sh")
            });
            if ((child.length > count && !type) || (child.length > count && type)) {
                slid.after(more);
                if (p.tagName == "OL") {
                    more.css({
                        "margin-left": 22
                    })
                }
                more.css({
                    "margin-bottom": 10
                });
                more.click(function () {
                    moh = content.height();
                    if (moh == def) {
                        content.height("auto");
                        more.removeClass("fold").addClass("unfold").text("收起")
                    } else {
                        content.height(def);
                        more.removeClass("unfold").addClass("fold").text("查看更多");
                        if (defSH) {
                            try {
                                window.scrollBy(0, def - moh)
                            } catch (e) {}
                        }
                    }
                }).trigger("click")
            }
            slid.removeAttr("slider")
        })
    }($("[slider]"), $(window));
    ! function (menu) {
        menu.each(function (i, p) {
            p = $(p);
            if (p.parents(".ref").length || p.parents(".supp_form").length) {
                p.css("background", "none");
                return
            }
            p.addClass("on").click(function () {
                p.toggleClass("off").next().slideToggle()
            }).trigger("click")
        });
        $(".section .layout").find("dl").each(function () {
            if ($(this).index() == 1) {
                $(this).find("dt").trigger("click")
            }
        })
    }($(".section dt"));
    var navGoUrl = function (jqObj, toUrl) {
        var target = jqObj.attr("target");
        if (target && (target == "_blank" || target == "blank")) {
            window.open(toUrl)
        } else {
            window.location.href = toUrl
        }
    };
    var allowParam = function (search, params) {
        if (!params) {
            return false
        }
        if (("," + params + ",").indexOf("," + search + ",") != -1) {
            return true
        }
        return false
    };

    function isChinese(temp) {
        var re = /[^\u4e00-\u9fa5]/;
        if (re.test(temp)) {
            return false
        }
        return true
    }

    function isAllChinese(temp) {
        var cnt = 0;
        for (var i = 0; i < temp.length; i++) {
            if (!isChinese(temp.charAt(i))) {
                return false
            }
        }
        return true
    }! function (naver) {
        naver.click(function () {
            var menu = $(this),
                q = $("#q"),
                param = menu.attr("href"),
                val = (q.val() == (q.attr("placeholder") || "请输入要查询的单词、短语") ? "" : q.val()),
                data_param = $(this).attr("data-param"),
                gourl = "";
            if (q.length && val.length) {
                if (/^[A-Za-z]+$/.test(val)) {
                    gourl = allowParam("en", data_param) ? param.replace(/\/$/, "") + "/" + val : param;
                    navGoUrl(menu, gourl);
                    return false
                } else {
                    if (isAllChinese(val)) {
                        gourl = allowParam("zh", data_param) ? param.replace(/\/$/, "") + "/" + myEncodeURI(val) : param;
                        navGoUrl(menu, gourl);
                        return false
                    } else {
                        gourl = allowParam("other", data_param) ? param.replace(/\/$/, "") + "/" + myEncodeURI(val) : param;
                        navGoUrl(menu, gourl);
                        return false
                    }
                }
                return false
            }
        })
    }($(".search_nav a, .sbox_more a"));

    function tiper(tip) {
        if (tip.length) {
            tip.each(function (i, p) {
                p = $(p);
                if (p.parent("h2").length) {
                    var I = $("<i></i>").css({
                        width: 40,
                        height: 30,
                        display: "block",
                        cursor: "pointer",
                        background: "none"
                    });
                    p.append(I)
                } else {
                    var I = p
                }
                var tipDialog = dDialog.popup(p.attr("tip"), {
                    target: I,
                    show: {
                        event: "mouseover",
                        delay: 200
                    },
                    hide: {
                        target: "both",
                        event: "mouseout",
                        delay: 200
                    },
                    fixed: false,
                    position: {
                        left: 15,
                        top: p.outerHeight() - 5
                    },
                    corner: "topLeft5"
                })
            })
        }
    }
    tiper($("[tip]"));

    function ajaxTab(section) {
        var lef = 40;
        section.each(function (i, s) {
            var sec = $(s),
                tab = sec.find("h3"),
                seo = sec.find("h2"),
                con = sec.find(".layout");
            seo.each(function (x, p) {
                p = $(p).css("position", "static");
                p.children("i").css("position", "absolute");
                tiper(p.children("i"))
            });
            tab.each(function (x, p) {
                p = $(p).css("position", "absolute");
                x ? p.css("left", lef + 90 * x) : p.css("left", lef);
                p.click(function () {
                    tab.removeClass("cur");
                    p.addClass("cur");
                    con.hide(0).eq(x).stop().show(0)
                })
            }).eq(0).trigger("click")
        })
    }! function (sorter) {}($(".sort"));
    ! function (satis) {
        var satisLog;

        function satisEffect(satisLog) {
            satisLog.show()
        }
        satis.eq(1).attr("createword", "imp");
        satis.eq(0).click(function () {
            var p = $(this);
            if (p.attr("isClick") == "false") {
                satisEffect(satisLog)
            } else {
                $.ajax({
                    url: editorPath + "menus/usercontent_satisfaction/evaluate/" + $dict_dict + "/" + $.trim($(".keyword").text()) + "/" + p.attr("satis"),
                    dataType: "jsonp",
                    jsonp: "jsonpcallback",
                    success: function (data) {
                        var msg = "感谢您对海词团队的支持!";
                        satis.each(function (x, o) {
                            $(o).attr("isClick", "false")
                        });
                        satisLog = new dDialog({
                            width: 400,
                            height: 250,
                            position: {
                                left: p.offset().left - 80,
                                top: p.offset().top - 80
                            },
                            skin: "class",
                            drag: true,
                            title: "请分享您对海词网的支持",
                            content: $("#dshared").html()
                        }).show()
                    }
                })
            }
        })
    }($("[satis]"));
    ! function (sidenav, main) {
        if (main.length > 0 && sidenav.length > 0) {
            sidenav.css("left", main.offset().left - sidenav.outerWidth()).appendTo(document.body)
        }
    }($(".sidenav"), $(".main"));
    ! function (nav, side, main, win) {
        if (nav.length) {
            var def_top = nav.offset().top,
                win_top = 0,
                mov_eff = function () {
                    win_top = win.scrollTop();
                    (win_top > def_top) ? nav.css("top", win_top - def_top): nav.css("top", 0)
                },
                rez_eff = function () {
                    if (main.offset().left - side.outerWidth() >= 0) {
                        side.css("left", main.offset().left - side.outerWidth()).appendTo(document.body)
                    }
                };
            win.bind({
                scroll: mov_eff,
                resize: rez_eff
            });
            try {
                win.trigger("scroll")
            } catch (e) {}
        }
    }($(".floatsidenav"), $(".sidenav"), $(".main"), $(window));
    window.onload = function () {
        ! function (nav, win) {
            if (nav.length <= 0) {
                return
            }
            var def_top = nav.offset().top;
            if (nav.length) {
                var win_top = 0;
                mov_eff = function () {
                    win_top = win.scrollTop();
                    (win_top > def_top) ? nav.css("top", win_top - def_top): nav.css("top", 0)
                }, rez_eff = function () {};
                win.bind({
                    scroll: mov_eff,
                    resize: rez_eff
                });
                try {
                    win.trigger("scroll")
                } catch (e) {}
            }
        }($(".floatads"), $(window))
    };
    ! function (feedback) {
        feedback.click(function () {
            if (dialog) {
                dialog.show(0)
            } else {
                var dialog = new dDialog({
                    content: "正在加载...",
                    drag: true,
                    width: 480,
                    height: 330,
                    skin: "class",
                    title: "意见反馈",
                    position: {
                        top: 46,
                        right: 40
                    },
                    animate: false
                });
                dialog.show(0);
                $.getJSON("http://report.dict.cn/?callback=?&from_type=1&ref=" + _href, function (data) {
                    dialog.setContent(data)
                })
            }
        })
    }($("[act=feedback],[action=feedback]"));
    ! function (doClass) {
        doClass.bind({
            click: function () {
                var doDialog = new dDialog({
                    title: "真题练习",
                    content: doClass.attr("url"),
                    type: "iframe",
                    modal: true,
                    height: 581,
                    width: 791
                });
                doDialog.show();
                $(".dd_close").css("zoom", 1)
            },
            mouseover: function () {
                doClass.css("background-color", "#f2f5f6")
            },
            mouseout: function () {
                doClass.css("background-color", "transparent")
            }
        })
    }($("[act=doClass]"));
    ! function (symbol) {
        symbol.click(function () {
            $.get("/list/yinbiao.html", function (data) {
                var symbolDialog = new dDialog({
                    title: "海词词典音标说明",
                    content: $(data),
                    skin: "class",
                    modal: true,
                    fixed: true,
                    position: {
                        top: 0,
                        left: "center"
                    },
                    height: 660,
                    width: 860
                });
                symbolDialog.show(0)
            })
        })
    }($("[act=symbol]"));
    window.sugg_form_init = function () {
        $(".close").click(function () {
            $(this).parents(".box:first").hide()
        });
        $(".pron-editor-show").click(function () {
            $("#pron-editor-box").show()
        });
        $("#sugg-pron").click(function () {
            $("#pron-editor-box").show()
        });
        $("#pron-ok").click(function () {
            $("#pron-editor-box").hide()
        });
        $("#pron-typein").unbind();
        var prons = {
            en: {
                A: "æ",
                B: "ɑ",
                E: "ə",
                F: "ʃ",
                J: "ʊ",
                L: "ɚ",
                N: "ŋ",
                R: "ʌ",
                O: "ɔ",
                T: "ð",
                G: "ʒ",
                X: "ɛ",
                Y: "ɜ",
                Z: "θ",
                "`": "'",
                "\\.": "ˌ"
            }
        };
        $("#pron-typein").keyup(function (e) {
            var str = $(this).val();
            if ($(this).attr("dict") == "ec") {
                var str2 = str.replace(new RegExp("[^abdefghijklmnprstuvwzABEFJLNROTGEXYZ`.,)(: ;']", "g"), "");
                if (str != str2) {
                    $(this).val(str2);
                    str = str2
                }
                for (var i in prons.en) {
                    if (str.search(i) != -1) {
                        str = str.replace(eval("/" + i + "/g"), prons.en[i])
                    }
                }
            } else {
                var str2 = str.replace(new RegExp("[^abcdefghijklmnopqrstuvwxyz,)(: ;12345]", "g"), "");
                if (str != str2) {
                    $(this).val(str2);
                    str = str2
                }
                if (str.search(/[1-5]/g) != -1) {
                    str = mk_pinyin(str)
                }
            }
            $("#pron-preview").html($.trim(str));
            $("#sugg-pron").val($("#pron-preview").text())
        });
        $("#add_sense").click(function () {
            var p = $("#sugg-exp");
            p.append($(".sense_item_tpl").html());
            if (p.height() > 199) {
                p.css({
                    height: "200px",
                    overflow: "auto"
                })
            } else {
                p.css({
                    height: "auto"
                })
            }
            p.attr("scrollTop", p.attr("scrollHeight"))
        });
        $(".rm_sense_item").live("click", function () {
            $(this).parents(".sense_item").remove();
            if ($("#edit-exp .exp-input").length < 9) {
                $("#edit-exp").css("height", "auto")
            }
        });
        var str0 = "请输入您的Email，方便我们联系您。",
            str1 = "例句、来源、意见等..",
            str2 = "在这里补充说明...";
        var suggSubmitBtn = $("#sugg-submit-btn");
        suggSubmitBtn.click(function () {
            if ($(".sugg-imp-items").length >= 1 && $(".sugg-imp-items input:checked").length <= 0) {
                $(".sugg-imp-items").css("background", "#fcc").click(function () {
                    $(this).css("background", "#fff").unbind()
                });
                return false
            }
            if ($("#sugg-author").length >= 1 && $("#sugg-author").val() != "" && !isEmail($("#sugg-author").val())) {
                $("#sugg-author").css("background", "#fcc").focus(function () {
                    $(this).css("background", "#fff").unbind()
                });
                return false
            }
            var reqs = $("#sugg-form-form [req]");
            var len = reqs.length;
            reqs.each(function (i) {
                if ($(this).val() == "" || $(this).val() == "0" || $(this).val() == str0 || $(this).val() == str1 || $(this).val() == str2) {
                    $(this).css("background", "#fcc").focus(function () {
                        $(this).css("background", "#fff").unbind()
                    });
                    return false
                } else {
                    if (i == len - 1) {
                        if ($("textarea.remark").val() == str1) {
                            $("textarea.remark").val("")
                        }
                        var url = $("#sugg-form-form").attr("action") + "?callback=?&dict=" + $dict_dict + "&type=imp&word=" + $dict_query + "&imp_desc=" + $("[name=imp_desc]").val() + "&email=" + $("#sugg-author").val();
                        ! function (checker) {
                            checker.each(function (i, p) {
                                url += "&" + $(p).attr("name") + "=" + $(p).val()
                            })
                        }($(".sugg-imp-items input:checked"));
                        if ($.ie6) {
                            $.getJSON(url);
                            alert("提交成功");
                            $("#sugg-form-box").remove()
                        } else {
                            $.getJSON(url, function (data) {
                                data ? alert("提交成功") : alert("提交失败");
                                $("#sugg-form-box").remove()
                            })
                        }
                        suggSubmitBtn.unbind("click");
                        return
                    }
                }
            })
        })
    };
    window.sugg_after_submit = function (flag) {
        $("#sugg-form-box").remove()
    };
    var sugg_load = false;
    $(document.body).delegate("[createword]", "click", function () {
        var p = $(this);
        if ($("#sugg-form-box").length) {
            $("#sugg-form-box").show();
            return
        }
        if (sugg_load) {
            alert("对不起，您不能重复提交哦!");
            return
        }
        sugg_load = true;
        var type = p.attr("createword");
        type = "imp";
        $dict_query = $dict_query ? encodeURIComponent($dict_query) : $dict_query;
        $.getJSON(editorPath + "external/suggestion/form/" + $dict_dict + "/" + type + "/" + $dict_query + "?callback=?", function (data) {
            data = $(data);
            $(document.body).append(data);
            data.css({
                zoom: 1
            });
            $(".sugg-form-title").drag({
                mover: $("#sugg-form-box")
            });
            $("#sugg-form-box").find(".close").click(function () {
                if ($(this).attr("act") == "inner") {
                    $("#pron-editor-box").hide(0)
                } else {
                    $("#sugg-form-box").hide(0)
                }
            });
            if (p.attr("satis")) {
                $("#sugg-form-box").css({
                    left: p.offset().left + p.outerWidth() + 10,
                    top: p.offset().top - p.outerHeight() - 140
                })
            } else {
                $("#sugg-form-box").css({
                    left: p.offset().left - 300,
                    top: p.offset().top - p.outerHeight() - 40
                })
            }
            $(".sugg-form-title").css({
                cursor: "move",
                position: "relative",
                overflow: "hidden",
                zoom: 1
            }).find("a.close").css({
                position: "absolute",
                right: 2,
                top: 2
            });
            sugg_form_init()
        })
    });
    var supp_html = "";
    ! function (dom) {
        supp_html = '<div class="supp_btn"><a href="javascript:;" act="iask" title="你会得到海词的专业回答">我要提问</a><a href="###" act="isup" title="补充该词条的相关信息">我来补充</a><p>让千万用户阅读到你编写的内容。</p></div><div class="supp_con"><div class="supp_mask"></div><iframe id="supp_iframe" class="supp_iframe" name="supp-submit-iframe"></iframe><ul><div>我来补充:</div><form id="supp_form" target="supp-submit-iframe" method="post" accept-charset="utf-8" action="' + editorPath + 'external/suppinfo/newpost"><input type="hidden" name="dict" value="' + $dict_dict + '"><input type="hidden" name="word" value="' + $dict_query + '"><input type="hidden" name="ci_csrf_token" value="' + getCookie("ci_csrf_token") + '"><li><label><em>*</em>内容</label><bdo>请参考</bdo><a href="javascript:;" class="conTip" tip="您提交的补充资料会在我们审核之后发表，审核标准为：<br/>①与词条相关<br/>②有价值<br/>③准确<br/>④表达精炼<br/>请不要提交个人相关信息、对词条的主观评价或疑似广告等。补充内容版权归海词网所有。">资料补充准则</a><textarea class="supp_area" name="cont" placeholder="请输入你要补充的内容.."></textarea></li><li><label>内容分类</label><div><input type="radio" class="supp_radio" name="cat" id="1"><b for="cat_1">释义</b><input type="radio" class="supp_radio" name="cat" id="2"><b for="cat_2">短语词组</b><input type="radio" class="supp_radio" name="cat" id="3"><b for="cat_3">例句用法</b><input type="radio" class="supp_radio" name="cat" id="4"><b for="cat_4">近反义词</b><input type="radio" class="supp_radio" name="cat" id="5"><b for="cat_5">海词讲解</b><input type="radio" class="supp_radio" name="cat" id="6"><b for="cat_6">其他</b></div></li><li><label><em>*</em>电子邮箱</label><input type="text" class="supp_text" name="email" placeholder="请输入您常用的电子邮箱"></li>';
        supp_html += $user_id ? "" : ('<li><label><em>*</em>验证码</label><input type="text" class="supp_text" name="captcha" placeholder="请输入下方验证码"></li><li><label></label><img change="captcha" alt="点击更换验证码" style="background:white;"><span change="captcha">看不清?点击图片可以更换验证码</span></li>');
        supp_html += '<li><label></label><input type="button" class="supp_sub" value=""><a href="###" class="supp_cancel">取消</a></li></form></ul></div><div class="supp_ok"><dl><dt></dt><dd><p>成功提交！感谢您贡献资料。</p><span>去<a href="http://my.dict.cn/home-space-do-pm.html">短消息中心</a>查看资料审核状态。</span></dd></dl></div>';
        dom.append(supp_html);
        ! function (suppTip) {
            if (suppTip.length < 1) {
                return
            }
            dDialog.popup(suppTip.attr("tip"), {
                target: suppTip,
                show: {
                    event: "mouseover",
                    delay: 200
                },
                hide: {
                    target: "both",
                    event: "mouseout",
                    delay: 200
                },
                position: "bottomCenter5",
                corner: "topLeft5"
            })
        }($(".conTip[tip]"))
    }($(".ask").find(".layout"));
    ! function (btn, supp, suber, cancel, cont, cat, email, captcha, word, form, iframe, mask, backui) {
        var getQuestionURL = editorPath + "external/suppinfo/load/" + $dict_dict + "/" + $dict_query + "?callback=?";
        $.fn.extend({
            verii: function () {
                $(this).addClass("pink").click(function () {
                    $(this).removeClass("pink").unbind("click")
                })
            }
        });
        window.supp_callback = function (data) {
            switch (data) {
                case 1:
                    supp.hide(0);
                    backui.slideDown();
                    cont.val("");
                    email.val("");
                    captcha.val("");
                    $(window).trigger("scroll");
                    var timeout = setTimeout(function () {
                        backui.slideUp();
                        getSuppList();
                        clearTimeout(timeout)
                    }, 5000);
                    break;
                case -2:
                    captcha.verii("pink");
                    alert("验证码错误！");
                    break;
                default:
                    cont.verii("pink");
                    alert("无法提交，请检查输入的内容是否包含非法字符！");
                    break
            }
            suber.removeAttr("disabled")
        };
        ! function (vote) {
            vote.each(function (x, p) {
                p = $(p);
                p.click(function () {
                    if (p.hasClass("dis")) {
                        return
                    }
                    oid = p.parents(".si-item").attr("oid"), param = p.attr("class").replace("si-vote-", "");
                    $.getJSON(editorPath + "/external/suppinfo/vote/" + oid + "/" + param + "?callback=?", function (result) {
                        if (result == 1) {
                            p.addClass("dis");
                            var num = parseInt(p.find("span.si-num").text());
                            p.find("span.si-num").text(num + 1)
                        }
                    })
                })
            })
        }($(".si-vote-1, .si-vote-2"));
        supp.hide(0);
        backui.hide(0);
        if ($("[change=captcha]").length) {
            $("[change=captcha]").click(function () {
                $("[change=captcha]").get(0).src = editorPath + "external/suppinfo/captcha?" + Math.random()
            })
        }
        suber.click(function () {
            if (!cont.val().length || cont.val().length > 1000) {
                cont.verii("pink");
                return false
            }
            if (!cat.parent().children(":checked").length) {
                cat.parent().verii("pink");
                return false
            }
            if (!email.val().length || !$.reg.mail.test(email.val())) {
                email.verii("pink");
                return false
            }
            if (captcha.length) {
                if (!captcha.val().length) {
                    captcha.verii("pink");
                    return false
                }
            }
            var conText = cont.val().match(/(http:\/\/)(\w|\.)*dict\.cn(\w|\/)*/ig);
            if (conText != null) {
                $.each(conText, function (i, url) {
                    cont.val().replace(url, '<a href="' + url + '">' + url + "</a>")
                })
            }
            suber.attr("disabled", "disabled");
            var ajaxData = "dict=" + $("[name=dict]").val() + "&word=" + $("[name=word]").val() + "&ci_csrf_token=" + $("[name=ci_csrf_token]").val() + "&cont=" + cont.val() + "&cat=" + cat.parent().children(":checked").attr("id") + "&email=" + email.val() + "&captcha=" + captcha.val();
            $.ajax({
                dataType: "jsonp",
                data: ajaxData,
                url: form.attr("action"),
                jsonpCallback: "supp_callback"
            });
            return false
        });
        cancel.click(function () {
            cont.val("");
            email.val("");
            captcha.val("");
            supp.slideUp()
        })
    }($(".supp_btn"), $(".supp_con"), $(".supp_sub"), $(".supp_cancel"), $("[name=cont]"), $("[name=cat]"), $("[name=email]"), $("[name=captcha]"), $("[name=word]"), $("#supp_form"), $(".supp_iframe"), $(".supp_mask"), $(".supp_ok"));
    ! function (level) {
        if (level.length) {
            var tiper = dDialog.popup(level.attr("level"), {
                target: level,
                show: {
                    event: "mouseover",
                    delay: 200
                },
                hide: {
                    target: "both",
                    event: "mouseout",
                    delay: 200
                },
                position: "bottomCenter5",
                position1: {
                    left: 10,
                    top: 10
                },
                corner: "topLeft5"
            })
        }
    }($("[level]"));
    (function ($, _win, _doc, undefined) {
        var defaults = {
            drivers: ["dict", "juhai", "hanyu", "abbr", "shh", "gdh", "ename"],
            url: "http://dict.cn/apis/suggestion.php",
            height: 350,
            driver: "dict",
            inline: true,
            focusOnKeypress: false
        };
        var drivers = {};
        drivers.proto = {
            hasSugg: true,
            data: {},
            add: function (data) {
                var _this = this;
                if (data && data.q && data.s) {
                    _this.data[data.q] = data.s;
                    return true
                } else {
                    return false
                }
            },
            cached: function (q) {
                return (this.data && this.data[q])
            },
            getList: function (q, inline) {
                var _this = this;
                var d = _this.data[q];
                if ($.isArray(d) && d.length > 0) {
                    var r = new RegExp("(" + q + ")", "ig");
                    var h = "";
                    if (inline) {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].g.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].g + '"><dt>' + g + "&nbsp;&nbsp;&nbsp;&nbsp;<span>" + d[i].e + "</span></dt><dd></dd></dl>"
                        }
                    } else {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].g.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].g + '"><dt>' + g + "</dt><dd>" + d[i].e + "</dd></dl>"
                        }
                    }
                    return h
                } else {
                    return false
                }
            },
            query: function (q) {
                var form_action = $(".search form").attr("action");
                var newlang = isNewLang(form_action);
                form_action = newlang ? (domainURI(form_action) + newlang).replace(/\/$/, "") : domainURI(form_action);
                if (langt == "zh-tw") {
                    _win.location.href = form_action + "/big5/" + myEncodeURI(q)
                } else {
                    _win.location.href = form_action + "/" + myEncodeURI(q)
                }
            }
        };
        drivers.juhai = function () {
            this.query = function (q) {
                _win.location.href = "/" + myEncodeURI(q)
            }
        };
        drivers.juhai.prototype = drivers.proto;
        drivers.hanyu = function () {
            this.query = function (q) {
                _win.location.href = "/" + encodeURIComponent(q)
            }
        };
        drivers.abbr = function () {
            this.hasSugg = true;
            this.data = {};
            this.add = function (data) {
                var _this = this;
                if (data && data.q && data.s) {
                    _this.data[data.q] = data.s;
                    return true
                } else {
                    return false
                }
            };
            this.cached = function (q) {
                return (this.data && this.data[q])
            };
            this.getList = function (q, inline) {
                var _this = this;
                var d = _this.data[q];
                if ($.isArray(d) && d.length > 0) {
                    var r = new RegExp("(" + q + ")", "ig");
                    var h = "";
                    if (inline) {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].gt.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].gt + '"><dt>' + g + "&nbsp;&nbsp;<span>" + d[i].g + "</span>&nbsp;&nbsp;<span>" + d[i].e + "</span></dt><dd></dd></dl>"
                        }
                    } else {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].gt.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].gt + '"><dt>' + g + "</dt><dd>" + d[i].e + "</dd></dl>"
                        }
                    }
                    return h
                } else {
                    return false
                }
            };
            this.query = function (q) {
                _win.location.href = "/" + encodeURIComponent(q)
            }
        };
        drivers.ename = function () {
            this.hasSugg = true;
            this.data = {};
            this.add = function (data) {
                var _this = this;
                if (data && data.q && data.s) {
                    _this.data[data.q] = data.s;
                    return true
                } else {
                    return false
                }
            };
            this.cached = function (q) {
                return (this.data && this.data[q])
            };
            this.getList = function (q, inline) {
                var _this = this;
                var d = _this.data[q];
                if ($.isArray(d) && d.length > 0) {
                    var r = new RegExp("(" + q + ")", "ig");
                    var h = "";
                    if (inline) {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].g.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].g + '"><dt>' + g + "&nbsp;&nbsp;&nbsp;&nbsp;<span>" + d[i].e + "</span></dt><dd></dd></dl>"
                        }
                    } else {
                        for (var i = 0, j = d.length; i < j; i++) {
                            var g = d[i].gt.replace(r, "<b>$1</b>");
                            h += '<dl data="' + d[i].g + '"><dt>' + g + "</dt><dd>" + d[i].e + "</dd></dl>"
                        }
                    }
                    return h
                } else {
                    return false
                }
            };
            this.query = function (q) {
                _win.location.href = "/" + encodeURIComponent(q)
            }
        };
        drivers.gdh = function () {
            this.query = function (q) {
                _win.location.href = "/" + encodeURIComponent(q)
            }
        };
        drivers.gdh.prototype = drivers.proto;
        drivers.shh = function () {
            this.query = function (q) {
                _win.location.href = "/" + encodeURIComponent(q)
            }
        };
        drivers.shh.prototype = drivers.proto;
        var inputPrompt = function () {
            var _this = this;
            _this.init.apply(_this, arguments)
        };

        function getOffset(str) {
            if (typeof str == "string") {
                str = $.trim(str);
                var s = str.substr(0, 1);
                if (s == "+" || s == "-") {
                    return parseInt(str)
                } else {
                    return false
                }
            } else {
                return false
            }
        }
        getDriver.instances = {};

        function getDriver(driverName) {
            if (getDriver.instances[driverName]) {
                return getDriver.instances[driverName]
            } else {
                if (drivers[driverName]) {
                    return (getDriver.instances[driverName] = new drivers[driverName]())
                } else {
                    return false
                }
            }
        }
        inputPrompt.prototype = {
            q: null,
            driver: drivers.proto,
            options: {},
            list: null,
            ctrlbar: null,
            container: null,
            disabled: false,
            listHeight: 0,
            containerHeight: 0,
            repositionTimer: 0,
            showing: false,
            forbidKeycodes: [13, 27, 37, 38, 39, 40],
            hoverMutex: false,
            init: function (options) {
                var _this = this,
                    _q = $("#q");
                options = $.extend(defaults, options);
                _this.options = options;
                if ($.inArray(options.driver, options.drivers) == -1) {
                    return
                }
                var driverName = options.driver;
                var driver = getDriver(driverName);
                if (driver) {
                    _this.driver = driver
                } else {
                    options.driver = "dict";
                    _this.driver = drivers.proto
                }
                var input = $(options.input);
                if (input.length < 1) {
                    return
                }
                input.bind("keyup", {
                    self: _this
                }, _this._keyup).bind("keydown", function (e) {
                    _this.hoverMutex = true;
                    if (!_this.showing && e.which != 40) {
                        return
                    }
                    switch (e.which) {
                        case 38:
                            _this.moveup();
                            break;
                        case 40:
                            if (!_this.showing) {
                                var v = input.val();
                                if (v) {
                                    _this.showPrompt(v)
                                }
                            }
                            _this.movedown();
                            break
                    }
                }).bind("keypress", function (e) {
                    if (e.which == 13 && !$.trim(input.val()).length) {
                        return false
                    }
                });
                var focusInput = function (e) {
                    if (!e.ctrlKey && (e.target != input.get(0) && e.target.tagName != "TEXTAREA" && e.target.tagName != "INPUT")) {
                        var code = e.which;
                        if (code > 64 && code < 91) {
                            input.focus();
                            if (!e.shiftKey) {
                                code += 32
                            }
                            input.val(String.fromCharCode(code)).trigger("keyup");
                            if (input.setSelectionRange) {
                                input.focus();
                                input.setSelectionRange(1, 1)
                            } else {
                                if (input.createTextRange) {
                                    var range = input.createTextRange();
                                    range.collapse(true);
                                    range.moveEnd("character", 1);
                                    range.moveStart("character", 1);
                                    range.select()
                                }
                            }
                        } else {
                            if (code == 32) {
                                input.focus().select()
                            } else {
                                if (code == 27) {
                                    input.focus().select();
                                    input.val("")
                                }
                            }
                        }
                    }
                };
                if (options.focusOnKeypress) {
                    if (options.focusOnKeypress === true) {
                        $(_doc).keyup(focusInput)
                    } else {
                        $(options.focusOnKeypress).keyup(focusInput)
                    }
                }
                _this.container = $('<div class="input-prompt-container"></div>');
                _this.list = $('<div class="input-prompt-list"></div>');
                _this.ctrlbar = $('<div class="input-prompt-ctrl"></div>');
                $(function () {
                    var maxZ = Math.max.apply(null, $.map($("body > *:not(.morelinks)"), function (e, n) {
                        if ($(e).css("position") == "absolute") {
                            return parseInt($(e).css("z-index")) || 99
                        } else {
                            return 0
                        }
                    }));
                    _this.container.css({
                        zIndex: maxZ + 99
                    })
                });
                var offset;
                var width;
                if (options.width) {
                    offset = getOffset(options.width);
                    if (offset !== false) {
                        width = input.width() + offset
                    } else {
                        width = options.width
                    }
                } else {
                    width = input.width()
                }
                var height = options.height;
                var position = input.offset();
                var top;
                var inputBottom = position.top + input.outerHeight();
                if (options.top) {
                    offset = getOffset(options.top);
                    if (offset !== false) {
                        top = inputBottom + offset
                    } else {
                        top = options.top
                    }
                } else {
                    top = inputBottom
                }
                top++;
                var left;
                if (options.left) {
                    offset = getOffset(options.left);
                    if (offset !== false) {
                        left = position.left + offset
                    } else {
                        left = options.left
                    }
                } else {
                    left = position.left
                }
                _this.list.css("overflowY", "auto");
                var closer = $('<a class="close" href="javascript:void(0)">关闭输入提示</a>').click(function () {
                    _this.disablePrompt()
                });
                _this.containerHeight = height;
                _this.listHeight = height;
                _this.ctrlbar.append(closer);
                _this.container.width(width).height(height).append(_this.list).css({
                    "z-index": "1",
                    position: "absolute",
                    top: top,
                    left: left
                }).hide().prependTo(_doc.body);
                if (getCookie("suggOff") == 1) {
                    _this.disabled = true
                }
                $(window).bind("resize", function () {
                    _this.reposition()
                });
                $(options.trigger).bind("click", function () {
                    input.focus();
                    _this.enable();
                    _this.query(input.val())
                })
            },
            disablePrompt: function () {
                this.hidePrompt();
                setCookie("suggOff", 1);
                this.disabled = true
            },
            reposition: function () {
                var _this = this;
                if (_this.repositionTimer) {
                    clearTimeout(_this.repositionTimer)
                }
                _this.repositionTimer = setTimeout(function () {
                    _this._reposition()
                }, 200)
            },
            _reposition: function () {
                var _this = this;
                var options = _this.options;
                var input = $(options.input);
                var position = input.offset();
                var top;
                var inputBottom = position.top + input.outerHeight();
                if (options.top) {
                    offset = getOffset(options.top);
                    if (offset !== false) {
                        top = inputBottom + offset
                    } else {
                        top = options.top
                    }
                } else {
                    top = inputBottom
                }
                top++;
                var left;
                if (options.left) {
                    offset = getOffset(options.left);
                    if (offset !== false) {
                        left = position.left + offset
                    } else {
                        left = options.left
                    }
                } else {
                    left = position.left
                }
                var width;
                if (options.width) {
                    offset = getOffset(options.width);
                    if (offset !== false) {
                        width = input.width() + offset
                    } else {
                        width = input.outerWidth()
                    }
                } else {
                    width = input.width() - 2
                }
                _this.container.css({
                    top: top,
                    left: left,
                    width: width
                })
            },
            _keyup: function (e) {
                if (!e.ctrlKey && e.which != 16 && e.which != 17) {
                    var _this = e.data.self;
                    if (_this.hoverMutex) {
                        _this.hoverMutex = false
                    }
                    if (e.which == 13) {
                        if ($(_this.options.input).val().length) {
                            _this.choose($(_this.options.input).val())
                        }
                    } else {
                        if (e.which == 27 && _this.showing) {
                            _this.hidePrompt();
                            return
                        }
                    }
                    if ($.inArray(e.which, _this.forbidKeycodes) !== -1) {
                        return
                    }
                    if (!_this.disabled) {
                        _this.query(e.target.value)
                    }
                }
            },
            query: function (q) {
                var _this = this;
                _this.q = q;
                q = q;
                if (_this.options.driver == "dict") {
                    _this.options.url = "http://dict.cn/apis/suggestion.php"
                } else {
                    _this.options.url = "http://dict.cn/ajax/suggestion.php"
                }
                if (q && _this.driver.hasSugg) {
                    if (!_this.driver.cached(q)) {
                        $.ajax({
                            url: _this.options.url,
                            type: "GET",
                            cache: true,
                            dataType: "jsonp",
                            data: {
                                q: q,
                                dict: _this.options.driver,
                                s: _this.options.driver,
                                lt: langt
                            },
                            success: function (data) {
                                if (_this.driver.add(data)) {
                                    _this.showPrompt(q)
                                }
                            }
                        })
                    } else {
                        _this.showPrompt(q)
                    }
                } else {
                    _this.hidePrompt()
                }
            },
            movedown: function () {
                var _this = this;
                var items = _this.list.children("[data]");
                var current = items.filter(".hover");
                var next;
                if (current.length < 1) {
                    next = items.eq(0)
                } else {
                    next = current.next()
                }
                if (next.length > 0) {
                    current.removeClass("hover");
                    next.addClass("hover");
                    _this.scrollIntoView(next)
                }
            },
            moveup: function () {
                var _this = this;
                _this.hoverMutex = true;
                var current = this.list.children(".hover");
                if (current.length > 0) {
                    var next = current.prev();
                    if (next.length > 0) {
                        current.removeClass("hover");
                        next.addClass("hover");
                        _this.scrollIntoView(next)
                    }
                }
            },
            scrollIntoView: function (item) {
                var _this = this;
                var showVal = item.attr("data");
                $(_this.options.input).val(showVal);
                if (item.length > 0) {
                    var lh = _this.list.innerHeight();
                    var lpos = _this.list.position();
                    var h = item.outerHeight();
                    var pos = item.position();
                    var move = 0;
                    if (pos.top < lpos.top) {
                        move = pos.top - lpos.top
                    } else {
                        if (pos.top + h > lpos.top + lh) {
                            move = (pos.top + h) - (lpos.top + lh)
                        }
                    }
                    if (move !== 0) {
                        _this.list.scrollTop(_this.list.scrollTop() + move)
                    }
                }
            },
            hidePrompt: function () {
                this.container.hide();
                this.showing = false
            },
            attachListBar: function () {
                var _this = this;
                var bars = _this.list.children(["data"]);
                bars.css("cursor", "pointer").hover(function () {
                    if (!_this.hoverMutex) {
                        _this.restoreInput();
                        bars.removeClass("hover");
                        $(this).addClass("hover")
                    }
                }, function () {
                    if (!_this.hoverMutex) {
                        $(this).removeClass("hover")
                    }
                }).click(function () {
                    _this.choose($(this).attr("data"))
                })
            },
            showPrompt: function (q) {
                var _this = this;
                _this._reposition();
                var list = _this.driver.getList(q, _this.options.inline);
                if (list) {
                    _this.list.height("auto");
                    _this.list.html(list);
                    _this.attachListBar();
                    _this.container.show();
                    if (_this.list.height() >= _this.listHeight) {
                        _this.list.height(_this.listHeight).scrollTop(0);
                        _this.container.height(_this.containerHeight)
                    } else {
                        _this.list.height("auto");
                        _this.container.height("auto")
                    }
                    this.showing = true;
                    return true
                } else {
                    _this.list.html("");
                    _this.hidePrompt();
                    return false
                }
            },
            restoreInput: function () {
                var _this = this;
                if (_this.q) {
                    $(_this.options.input).val(_this.q)
                }
            },
            choose: function (word) {
                var _this = this;
                if ($.isFunction(_this.options.onchoose)) {
                    _this.options.onchoose(word)
                }
                _this.hidePrompt()
            },
            attemptHide: function (target) {
                var _this = this;
                if (_this.showing) {
                    var c = _this.container.get(0);
                    if (!$.contains(c, target) && (_this.options.trigger && $(_this.options.trigger).get(0) != target) && target != $(_this.options.input).get(0)) {
                        _this.hidePrompt()
                    }
                }
            },
            enable: function () {
                var _this = this;
                if (_this.disabled) {
                    delCookie("suggOff");
                    _this.disabled = false
                }
            },
            setDriver: function (driverName) {
                var _this = this;
                var driver = getDriver(driverName);
                if (driver) {
                    _this.driver = driver;
                    _this.options.driver = driverName
                } else {
                    _this.driver = drivers.proto;
                    _this.options.driver = driverName
                }
            }
        };
        var allPrompts = [];
        $.fn.inputPrompt = function (options) {
            var arr = [];
            this.each(function () {
                var _this = this;
                arr.push(new inputPrompt($.extend(options, {
                    input: _this
                })))
            });
            allPrompts = allPrompts.concat(arr);
            return arr
        };
        $(_doc).bind("click", function (e) {
            if (allPrompts.length > 0) {
                for (var i = 0, j = allPrompts.length; i < j; i++) {
                    if ($(e.target).parent().attr("id") != "sx-botton" && $(e.target).parent().attr("id") != "dict-draw-panel") {
                        allPrompts[i].attemptHide(e.target);
                        $("#dict-draw-panel").hide()
                    }
                }
            }
            return
        });
        return allPrompts
    })(jQuery, window, document);
    (function ($, _win, _doc, undefined) {
        var zInput, zTabList, zSearchForm, zSearchBtn, sx;
        var supportPlaceHolder = ("placeholder" in document.createElement("input"));
        var timer;
        $(function () {
            zInput = $("#q");
            zHolder = zInput.attr("placeholder");
            zTabList = $("#tab-list>li.dict");
            zSearchForm = $("#f");
            zSearchBtn = $("#search");
            sx = $("#sx-botton");
            var placeholder = zHolder;
            if (!supportPlaceHolder) {
                var holder = zHolder;
                var val = zInput.val();
                if (!val) {
                    zInput.val(holder).removeClass("focus").addClass("blur")
                } else {
                    if (holder == val) {
                        zInput.removeClass("focus").addClass("blur")
                    }
                }
            }
            var prompt = zInput.inputPrompt({
                driver: cur_dict || "dict",
                width: zInput.outerWidth(),
                trigger: $("#sugg-trigger"),
                top: "-2",
                focusOnKeypress: true,
                onchoose: function (q) {
                    if (prompt[0]) {
                        prompt[0].driver.query(q)
                    }
                }
            });
            zSearchBtn.bind("click", function () {
                var q = $.trim(zInput.val());
                var reci = zInput.data("reci");
                if (reci) {
                    if ($.trim(reci[0]) == q || q == "") {
                        location.href = reci[3];
                        return false
                    }
                }
                if (q && q != zHolder) {
                    if (prompt && prompt[0]) {
                        prompt[0].driver.query(q);
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            });
            try {
                zInput.focus().select()
            } catch (e) {}
            zInput.click(function () {
                zInput.bind({
                    focusin: function () {
                        if ($.trim(zInput.val()) == zHolder || $.trim(zInput.val()) == zInput.attr("hotword")) {
                            zInput.val("").css("color", "#444")
                        }
                    },
                    focusout: function () {
                        if (!$.trim(zInput.val()).length) {
                            zInput.val(zHolder).css("color", "#999")
                        }
                    }
                }).trigger("focusin")
            }).mouseover(function () {
                try {
                    $.browser.msie ? zInput.get(0).select() : zInput.focus().select()
                } catch (e) {}
                zInput.trigger("click")
            });
            zInput.select(function () {
                return false
            })
        })
    })(jQuery, window, document);
    if ($dict_id == null && $dict_query && use_bingTrans !== "no") {
        ! function (query) {
            function initUI(dom) {
                dom.find("h2").css("position", "static")
            }

            function hoter(a, o) {
                if (ma = (o.match(/[^\u0000-\u0080]/g) ? RegExp(o, "g") : RegExp("\\b" + o + "\\b", "gi")).exec(a)) {
                    var b = ma[0].length;
                    return a.substring(0, ma.index) + '<em class="hot">' + ma[0] + "</em>" + a.substr(ma.index + b)
                } else {
                    return a
                }
            }
            $.ajax({
                type: "get",
                dataType: "jsonp",
                url: "http://fuzz.dict.cn/dict/api.php",
                data: {
                    action: "fuzz",
                    from: "jsonp",
                    q: query,
                    t: dictCrypto(query)
                },
                success: function (msg) {
                    if (msg && msg.ok == 1) {
                        var n = msg.content.length,
                            html = '<div class="section sent"><a name="sent"></a><h2>' + $.trim($(".word").text()) + '<i tip="例句用法"></i></h2><h3 style="left: 40px;" class="cur">例句用法</h3><div class="layout sort"><ul>';
                        for (var i = 0; i < n; i++) {
                            if (i > 3) {
                                break
                            }
                            html += '<li><a href="/' + myEncodeURI(msg.content[i].k + msg.content[i].a) + '">' + msg.content[i].k + "</a>" + msg.content[i].e + "</li>"
                        }
                        html += '</ul><div class="wtip">*提示：机器翻译内容可能存在明显错误，请自行判断使用。</div></div><div class="more"><a href="http://juhai.dict.cn/' + myEncodeURI(query) + '">去句海，查更多例句</a></div></div>';
                        html = $(html);
                        if ($(".unfind ul li").length) {
                            if ($(".unfind ul li a").eq(0).html() == html.find("ul li").eq(0).find("a").html()) {} else {
                                $(".unfind ul").append(html.find("ul").html())
                            }
                        } else {
                            $(".ifufind").after(html.find(".layout").html());
                            $(".wtip:last").html('如果不是以上词条，让海词编辑来提供解释 <a createword="imp" href="###">请改进词条</a>').prev().remove()
                        }
                        if ($dict_id == null) {
                            nwd_re_load()
                        }
                    } else {
                        $(".def").remove()
                    }
                }
            });

            function bing_trans() {
                getBingDB("TLV_LW2WaTQL4Ecn6M4yZ8Bbug0g9cN6QiRKz6PBWwxE*")
            }

            function getKeyID(fn) {
                $.getJSON("http://capi.dict.cn/fanyi.php?callback=?", function (key) {
                    if (fn) {
                        fn(key)
                    }
                })
            }

            function sendReport(options, fn) {
                $.ajax({
                    url: editorPath + "external/fanyi/report?word=" + options.word + "&dict=" + options.dict + "&src=bing&content=" + options.content,
                    dataType: "jsonp",
                    success: function (data) {
                        if (fn) {
                            fn(data)
                        }
                    }
                })
            }

            function getBingDB(BingAppID) {
                if ($dict_dict == "ec") {
                    var from = "en";
                    var to = "zh-CHS"
                } else {
                    if ($dict_dict == "ce") {
                        var from = "zh-CHS";
                        var to = "en"
                    }
                }
                getKeyID(function (key) {
                    $.getJSON("http://api.microsofttranslator.com/V2/Ajax.svc/TranslateArray?appId=" + key + "&from=" + from + "&to=" + to + "&texts=%5B%22" + $dict_query + "%22%5D&oncomplete=?", function (data) {
                        if (data[0].TranslatedText != undefined && data[0].TranslatedText != $dict_query) {
                            var one = $("<li><strong>" + $.trim(data[0].TranslatedText) + "</strong></li>");
                            if ($(".def").length) {
                                var section = $(".def")
                            } else {
                                var section = $('<div class="section def"><a name="unword"></a><h2>机器翻译<i tip="机器翻译"></i></h2><h3 class="cur" style="left:40px;">机器翻译</h3><div class="layout unword"><ul></ul><div class="wtip">*提示：机器翻译内容可能存在明显错误，请自行判断使用。</div></div></div>');
                                $(".word").after(section);
                                $(".floatsidenav ul:eq(0)").prepend('<li><a href="#unword">释义</a></li>')
                            }
                            section.find("ul").append(one);
                            ajaxTab(section);
                            sendReport({
                                word: $dict_query,
                                dict: $dict_dict,
                                content: encodeURI($.trim(data[0].TranslatedText))
                            })
                        }
                    })
                })
            }

            function nwd_re_load() {
                $.getJSON(editorPath + "external/noword/report?word=" + $dict_query + "&dict=" + $dict_dict + "&callback=?", function (data) {
                    var flag = false;
                    if (data == -1 || data == -2) {} else {
                        var one = $("<ul></ul>");
                        if (data.Senses) {
                            for (var i = 0; i < data.Senses.length; i++) {
                                one.append("<li><strong>" + $.trim(data.Senses[i].replaceAll("&nbsp;", "")) + "</strong></li>")
                            }
                        }
                        if (data.WebSenses) {
                            for (var i = 0; i < data.WebSenses.length && i < 6; i++) {
                                one.append("<li><strong>" + $.trim(data.WebSenses[i].replaceAll("&nbsp;", "")) + "</strong></li>")
                            }
                        }
                        if ($(".def").length) {
                            var section = $(".def")
                        } else {
                            var section = $('<div class="section def"><a name="unword"></a><h2>机器翻译<i tip="机器翻译"></i></h2><h3 class="cur" style="left:40px;">机器翻译</h3><div class="layout unword"></div></div>');
                            $(".word").after(section);
                            $(".floatsidenav ul:eq(0)").prepend('<li><a href="#unword">释义</a></li>')
                        }
                        section.find(".unword").append(one.after('<div class="wtip">*提示：机器翻译内容可能存在明显错误，请自行判断使用。</div>'));
                        ajaxTab(section);
                        flag = true
                    }
                    if (($dict_dict == "ec" || $dict_dict == "ce") && !flag) {
                        bing_trans()
                    }
                })
            }
        }($dict_query)
    }
    $(function () {
        if (_host.indexOf("hanyu") != -1) {
            var sx = $('<span id="sx-botton"><img style="top:0;left:0;position:absolute;" src="' + i1_home + '/i1/images/search_sx02.gif" /></span>').css({
                    position: "relative",
                    right: 30,
                    top: 16,
                    cursor: "pointer"
                }).hover(function () {
                    $(this).find("img").attr("src", i1_home + "/i1/images/search_sx01.gif")
                }, function () {
                    $(this).find("img").attr("src", i1_home + "/i1/images//search_sx02.gif")
                }),
                dp = $('<div id="dict-draw-panel"><object style="width:271px;height:201px;" type="application/x-shockwave-flash" data="' + i1_home + '/i1/swf/drawinput.swf"><param name="movie" value="' + i1_home + '/i1/swf/drawinput.swf" /><param name="AllowScriptAccess" value="always" /><param name="wmode" value="opaque" /></object></div>').css({
                    position: "absolute",
                    display: "none",
                    zIndex: 2000
                }),
                q = $("#q").before(sx).mouseover(function () {
                    q.focus().select()
                }),
                inflash = true;
            $(document.body).prepend(dp);
            sx.hover(function () {
                dp.show(0)
            }, function () {
                if (!inflash) {
                    dp.hide(0)
                }
                inflash = true
            });
            dp.css({
                left: q.outerWidth() + q.offset().left - 285,
                top: q.outerHeight() + q.offset().top - 16
            }).focus().bind({
                mouseup: function () {
                    inflash = false
                },
                mouseout: function () {
                    if ($("#input-prompt-container").css("display") == undefined) {
                        $(this).hide();
                        inflash = true
                    }
                }
            })
        }
    });
    window.drawinput_select_callback = function (c) {
        var q = $("#q"),
            t = q.val();
        q.attr("placeholder") == t ? q.val(c) : q.val(t + c);
        return false
    };
    window.userPatchComment = function (obj, pcid, flag) {
        var num = parseInt($(obj).find("bdo").html());
        $(obj).parent().html($(obj).text().replace(/\d+/, num + 1));
        $.ajax({
            url: editorPath + "external/suppinfo/vote/" + pcid + "/" + flag,
            dataType: "jsonp",
            jsonp: "jsonpcallback",
            success: function (data) {}
        })
    };
    ! function (asker, supper) {
        var DICT_ROOT_SITE = "http://" + _host,
            askBox, userId = parseInt($user_id),
            switcher = true;
        supper.click(function () {
            $(".supp_con").slideToggle(function () {
                if (switcher) {
                    $("[change=captcha]:eq(0)").attr("src", editorPath + "external/suppinfo/captcha?" + Math.random());
                    switcher = false
                } else {
                    switcher = true
                }
            })
        });
        asker.click(function () {
            askDict(this)
        })
    }($("[act=iask]"), $("[act=isup]"));
    (function ($, _win, _doc) {
        var scburl = scb_home + "/api.php" || "";

        function dictLogined() {
            return getCookie("DictCN_auth").length != 0
        }

        function addWord(parm, fn) {
            $.ajax({
                type: "POST",
                dataType: "jsonp",
                url: scburl,
                data: {
                    action: "add",
                    word: parm.item,
                    level: parm.level,
                    scbid: parm.scbid,
                    from: "jsonp"
                },
                timeout: 3000,
                success: fn,
                cache: "false"
            })
        }

        function getFamiliar(wid, dtype, fn) {
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: scburl,
                data: {
                    action: "test",
                    id: wid,
                    dtype: dtype,
                    from: "jsonp"
                },
                timeout: 30000,
                success: function (data) {
                    if (data) {
                        fn(data)
                    }
                }
            })
        }
        var zAdd, zChoices, zBar;
        var loginBox;

        function addProc() {
            var scbid = $("select[name=scbid]").find("option:selected").val(),
                level = $("select[name=level]").find("option:selected").val();
            addWord({
                scbid: scbid,
                level: level,
                item: $dict_query
            }, function (data) {
                if (data && data.ret >= 0) {
                    if (window.scb_ddialog) {
                        window.scb_ddialog.remove()
                    }
                    if (scbid == undefined) {
                        scbid = window.scbs.defid;
                        if (scbid == undefined) {
                            $.each(window.scbs.scblist, function (k, v) {
                                scbid = k;
                                return false
                            })
                        }
                    }
                    window.scbs.scblist[scbid].selected = 1;
                    window.scbs.scbid = scbid;
                    zAdd.addClass("hasadd").attr({
                        title: "已添加到生词本中"
                    });
                    if (window.addcount) {
                        bombBox();
                        return
                    }
                } else {
                    if (data && data.ret <= -6) {
                        if (window.scb_ddialog) {
                            window.scb_ddialog.remove()
                        }
                        if (scbid == undefined) {
                            scbid = window.scbs.defid;
                            if (scbid == undefined) {
                                $.each(window.scbs.scblist, function (k, v) {
                                    scbid = k;
                                    return false
                                })
                            }
                        }
                        window.scbs.scblist[scbid].selected = 1;
                        window.scbs.scbid = scbid;
                        if (window.addcount) {
                            bombBox();
                            zAdd.trigger("click");
                            $(".tip").text("请选择其他生词本(该本已满)");
                            return
                        }
                    } else {
                        zAdd.one("click", addProc)
                    }
                }
            });
            return false
        }

        function bombBox() {
            if (window.scbs.scblist) {
                zAdd.bind("click", function () {
                    if (window.scb_ddialog) {
                        return
                    }
                    window.scb_ddialog = new dDialog({
                        width: 300,
                        height: 180,
                        position: {
                            left: zAdd.offset().left - 80,
                            top: zAdd.offset().top + 20
                        },
                        skin: "class",
                        fixed: true,
                        drag: true,
                        title: "添加到我的生词本",
                        afterHide: function () {
                            this.remove();
                            window.scb_ddialog.remove();
                            window.scb_ddialog = null
                        },
                        content: getHtml()
                    }).show();
                    $("select[name=scbid]").bind("change", getScbInfo);
                    window.addcount = 0;
                    $("input[name=saveSubmit]").bind("click", addProc);
                    getScbInfo()
                })
            }
        }

        function getScbInfo() {
            var $scbid = $("select[name=scbid]");
            $.ajax({
                type: "get",
                dataType: "jsonp",
                url: scburl,
                data: {
                    action: "getinfo",
                    wid: $.trim(zAdd.attr("wid")),
                    scbid: $scbid.val(),
                    name: decodeURIComponent($scbid.find("option:selected").text()),
                    dtype: $dict_dict,
                    from: "jsonp"
                },
                timeout: 3000,
                cache: false,
                success: function (res) {
                    if (res.status) {
                        $(".tip").text(res.msg)
                    } else {
                        $(".tip").text("")
                    }
                    if (res.level) {
                        $("#sel-level").val(res.level)
                    }
                    if (res.scbid) {
                        $scbid.find("option:selected").attr("value", res.scbid)
                    }
                    $("a.inscb").attr("href", getUrl())
                }
            })
        }

        function selScb() {
            var scbid = $("select[name=scbid]").find("option:selected").val(),
                tips = "";
            if (window.scbs.scblist[scbid].selected) {
                tips = "该生词已存在";
                window.scbs.scbid = scbid;
                $("a.inscb").attr("href", getUrl())
            }
            $(".tip").text(tips)
        }

        function getUrl() {
            var url = scb_home + "/?";
            if (window.scbs.scbid != undefined) {
                url += "id=" + window.scbs.scbid
            }
            return url + "&sword=" + $dict_query
        }

        function getHtml() {
            var html = '<div id="scbbox">';
            html += '<p>选择生词本：<select name="scbid">';
            if (window.scbs.scblist) {
                $.each(window.scbs.scblist, function (k, v) {
                    if (window.scbs.scbid == k) {
                        html += '<option value="' + k + '" selected="selected">' + v.name + "</option>"
                    } else {
                        html += '<option value="' + k + '">' + v.name + "</option>"
                    }
                })
            }
            html += "</select></p>";
            if (window.scbs.scbid != undefined) {
                html += '<div class="tip">该生词已存在</div>'
            }
            html += '<p>修改熟悉度：<select name="level" id="sel-level">';
            if (window.scbs.level) {
                $.each(window.scbs.level, function (k, v) {
                    if (window.scbs.ret == k) {
                        html += '<option value="' + k + '" selected="selected">' + v + "</option>"
                    } else {
                        html += '<option value="' + k + '">' + v + "</option>"
                    }
                })
            }
            html += "</select></p>";
            html += '<p class="button"><input type="button" name="saveSubmit" value="确定" /></p>';
            if (window.scbs.scbid != undefined) {
                html += '<a href="' + getUrl() + '" class="inscb">进入生词本>></a>'
            }
            html += "</div>";
            return html
        }
        $(function () {
            zAdd = $("[act=addword]").attr("title", "添加该生词到生词本中");
            $(_doc.body).prepend(zBar);
            var wid = zAdd.attr("wid");
            if (wid) {
                if (dictLogined()) {
                    getFamiliar(wid, $dict_dict, function (data) {
                        window.scbs = data;
                        if (data.scbid != undefined && data.ret && data.ret > 0 && data.ret < 6) {
                            zAdd.addClass("hasadd").attr({
                                title: "已添加到生词本中"
                            });
                            bombBox()
                        } else {
                            window.addcount = 1;
                            zAdd.one("click", addProc)
                        }
                    })
                } else {
                    zAdd.click(function (e) {
                        $.getScript(xuehai_home + "/javascripts/login.js", function (data) {
                            link = passport_home + "/login?format=dialog&callback_url=" + _host + "/goto/callback.php";
                            login_ddialog = popup_login_dialog(link);
                            $(".dd_content").find("iframe").height("100%");
                            $(".dd_shadow").css("display", "none");
                            if ($.ie6) {
                                login_ddialog.moveTo({
                                    left: "center",
                                    top: 100
                                })
                            }
                        });
                        return false
                    })
                }
            }
        })
    })(jQuery, window, document);
    window.askDict = function (obj) {
        var word = $.trim($(".keyword").text());
        if (!word) {
            alert("无法获取查询的词语");
            return
        }
        if ($user_id > 0) {
            var ask_box_html = '<div id="ask_box" class="ask-box"><form action="" word="' + $dict_query + '" onsubmit="return ajaxPostAsk(this);">';
            ask_box_html += '<div><textarea name="content" style="width:416px;height:20px;padding:2px;border: 1px solid #C4C4C4;"></textarea></div>';
            ask_box_html += '<div><ul class="ask-box-tip"><li>1. 询问范围：单词（词组）、短语及俗语（及谚语）；  </li><li>2. 请仔细检查，避免误拼及不规则字符；</li><li>3. 问题描述请尽量保证准确、切题、简练！</li></ul></div>';
            ask_box_html += '<div class="ask-box-btn"><a href="javascript:;" onclick="closeAsk(this);">取消</a><input type="submit" class="askbtn" value="添加问题" /></div>';
            ask_box_html += "</form>";
            ask_box_html += "</div>";
            window.askDialog = new dDialog({
                title: "提交关于 " + $dict_query + " 的问题",
                content: ask_box_html,
                skin: "class",
                fixed: true,
                drag: true,
                modal: true,
                height: 240,
                width: 452
            });
            askDialog.show()
        } else {
            $.getScript(xuehai_home + "/javascripts/login.js", function (data) {
                link = passport_home + "/login?format=dialog&callback_url=" + _host + "/goto/callback.php";
                login_ddialog = popup_login_dialog(link);
                $(".dd_content").find("iframe").height("100%");
                $(".dd_shadow").css("display", "none");
                if ($.ie6) {
                    login_ddialog.moveTo({
                        left: "center",
                        top: 100
                    })
                }
            });
            return false
        }
    };
    window.closeAsk = function (obj) {
        window.askDialog.remove()
    };
    window.ajaxPostAsk = function (obj) {
        var ask_tip_html = '<div><ul class="ask-box-tip"><li>我们的专业人员将会及时的回答您的问题，并以email和站内信的方式通知您。您也可以通过页面右上角用户名下拉菜单的<a href="http://ask.dict.cn/">问海词</a>选项进入自己的提问列表查看问题的最新状态。</li></ul></div>';
        ask_tip_html += '<div class="ask-box-btn"><input type="submit" class="askbtn" value="确定" onclick="closeAsk();" /></div>';
        var content = obj.content.value;
        if ($.trim(content) == "") {
            obj.content.focus();
            return false
        }
        $(obj).replaceWith(ask_tip_html);
        $.ajax({
            url: editorPath + "external/ask/addQuestion?text=" + content + "&word=" + $dict_query,
            dataType: "jsonp",
            jsonp: "callback",
            success: function (data) {
                return false
            }
        });
        return false
    };

    function popup_login_dialog(link) {
        return window.login_ddialog = new dDialog({
            noClose: true,
            noTitle: true,
            content: link,
            type: "iframe",
            modal: true,
            fixed: true,
            position: {
                left: "center",
                top: "center",
                width: 508,
                height: 415
            },
            width: 508,
            height: 415,
            shadowOpacity: 0,
            afterHide: function () {
                this.remove()
            }
        }).show()
    }
    window.call_login = function (data) {
        switch (data) {
            case "close":
                try {
                    window.login_ddialog.hide()
                } catch (e) {}
                break;
            case "success":
                try {
                    window.login_ddialog.hide();
                    window.location.reload()
                } catch (e) {
                    window.login_ddialog.hide();
                    window.location.href = window.location.href
                }
                break;
            default:
                break
        }
    };
    var isFoot = $("#footer img");
    isFoot.click(function (e) {
        if (e.ctrlKey) {
            alert(document.cookie);
            console.log(document.cookie);
            return false
        }
    })
});
! function (b) {
    if (b.length) {
        var a = "http://dict.dfile.cn/list/slots.php?callback=?&id=";
        b.each(function (c, d) {
            if (c != 0) {
                a += "-"
            }
            a += $(d).attr("slot")
        });
        $.getJSON(a, function (d) {
            if (d) {
                var c = {};
                $.each(d, function (e, f) {
                    if (!f.slot) {
                        f.slot = 0
                    }
                    if (!f.type) {
                        f.type = ""
                    }
                    if (!f.title) {
                        f.title = ""
                    }
                    if (!f.text) {
                        f.text = ""
                    }
                    if (!f.src) {
                        f.src = ""
                    }
                    if (!f.width) {
                        f.width = "auto"
                    }
                    if (!f.height) {
                        f.height = "auto"
                    }
                    if (!f.href) {
                        f.href = "javascript:;"
                    }
                    if (!f.html) {
                        f.html = ""
                    }
                    switch (f.type) {
                        case "text":
                            f.dom = $('<a title="' + f.text + '" target="_blank" href="' + f.href + '">' + f.text + "</a>");
                            break;
                        case "image":
                            f.dom = $('<a target="_blank" href="' + f.href + '"><img alt="' + f.title + '" src="' + f.src + '"></a>');
                            break;
                        case "slide":
                            if (f.slot) {
                                ! function (g) {
                                    f.dom = g.find("li").length ? g.find("ul").append('<li><a target="_blank" href="' + f.href + '"><img alt="' + f.title + '" src="' + f.src + '"></a></li>') : $('<ul><li><a target="_blank" href="' + f.href + '"><img alt="' + f.title + '" src="' + f.src + '"></a></li></ul>');
                                    if (!c.style) {
                                        c.style = $('<style type="text/css">.slot_slide{position:relative;}.slot_slide ul{position:absolute;left:0;top:0;width:312272592px;overflow:hidden;*zoom:1;}.slot_slide li{float:left;width:' + f.width + ";height:" + f.height + ";}</style>");
                                        g.before(c.style)
                                    }
                                    c.max = g.find("li").length - 1;
                                    c.move = g.find("ul");
                                    if (!c.interval) {
                                        c.index = 0;
                                        c.distance = f.width.match(/^\d+/);
                                        c.interval = setInterval(function () {
                                            c.index = c.index < c.max ? (c.index + 1) : 0;
                                            c.move.animate({
                                                left: -(c.distance * c.index)
                                            })
                                        }, 5000)
                                    }
                                }($("[slot=" + f.slot + "]"))
                            }
                            break;
                        case "flash":
                            f.dom = $('<object type="application/x-shockwave-flash" data="' + f.src + '" title="' + f.title + '" style="width:' + f.width + ";height:" + f.height + ';position:absolute;"><param name="movie" value="' + f.src + '" /><param name="AllowScriptAccess" value="always" /><param name="hasPriority" value="true" /><param name="wmode" value="transparent" /><param name="FlashVars" value="volume=100" /></object>');
                            break;
                        case "html":
                            f.dom = $(f.text);
                            break;
                        default:
                            break
                    }
                    if (f.slot) {
                        $("[slot]").each(function () {
                            if ($(this).attr("slot") == f.slot) {
                                $(this).addClass("slot").addClass("slot_" + f.type).css({
                                    width: f.width,
                                    height: f.height
                                }).empty().append(f.dom)
                            }
                        })
                    }
                })
            }
        })
    }
}($("[slot]"));

function dictCrypto(F) {
    function m(g, f) {
        var e, d, a, b, c;
        a = g & 2147483648;
        b = f & 2147483648;
        e = g & 1073741824;
        d = f & 1073741824;
        c = (g & 1073741823) + (f & 1073741823);
        if (e & d) {
            return c ^ 2147483648 ^ a ^ b
        }
        return e | d ? c & 1073741824 ? c ^ 3221225472 ^ a ^ b : c ^ 1073741824 ^ a ^ b : c ^ a ^ b
    }

    function E(g, f, e, d, a, b, c) {
        g = m(g, m(m(f & e | ~f & d, a), c));
        return m(g << b | g >>> 32 - b, f)
    }

    function n(g, f, e, d, a, b, c) {
        g = m(g, m(m(f & d | e & ~d, a), c));
        return m(g << b | g >>> 32 - b, f)
    }

    function q(g, f, e, d, a, b, c) {
        g = m(g, m(m(f ^ e ^ d, a), c));
        return m(g << b | g >>> 32 - b, f)
    }

    function p(g, f, e, d, a, b, c) {
        g = m(g, m(m(e ^ (f | ~d), a), c));
        return m(g << b | g >>> 32 - b, f)
    }

    function G(c) {
        for (var b = "++"; c > 0;) {
            var a = c % 64;
            b += a == 0 ? "+" : a == 1 ? "-" : a > 1 && a < 12 ? String.fromCharCode(a + 46) : a > 11 && a < 38 ? String.fromCharCode(a + 54) : String.fromCharCode(a + 59);
            c = (c - a) / 64
        }
        return b.substr(b.length - 2, 2)
    }

    function D(d) {
        var c = "",
            b = "",
            a;
        for (a = 0; a <= 3; a++) {
            b = d >>> a * 8 & 255;
            b = "0" + b.toString(16);
            c += b.substr(b.length - 2, 2)
        }
        return c
    }
    var r = [],
        C, H, l, k, x, w, v, s;
    F = function (d) {
        d = d.replace(/\r\n/g, "\n");
        for (var c = "", b = 0; b < d.length; b++) {
            var a = d.charCodeAt(b);
            if (a < 128) {
                c += String.fromCharCode(a)
            } else {
                if (a > 127 && a < 2048) {
                    c += String.fromCharCode(a >> 6 | 192)
                } else {
                    c += String.fromCharCode(a >> 12 | 224);
                    c += String.fromCharCode(a >> 6 & 63 | 128)
                }
                c += String.fromCharCode(a & 63 | 128)
            }
        }
        c += String.fromCharCode(80, 97, 83, 115);
        if (window.dict_pagetoken) {
            c += window.dict_pagetoken
        }
        return c
    }(F);
    r = function (g) {
        var f, e = g.length;
        f = e + 8;
        for (var d = ((f - f % 64) / 64 + 1) * 16, a = Array(d - 1), b = 0, c = 0; c < e;) {
            f = (c - c % 4) / 4;
            b = c % 4 * 8;
            a[f] |= g.charCodeAt(c) << b;
            c++
        }
        a[(c - c % 4) / 4] |= 128 << c % 4 * 8;
        a[d - 2] = e << 3;
        a[d - 1] = e >>> 29;
        return a
    }(F);
    x = 1732584193;
    w = 4023233417;
    v = 2562383102;
    s = 271733878;
    for (F = 0; F < r.length; F += 16) {
        C = x;
        H = w;
        l = v;
        k = s;
        x = E(x, w, v, s, r[F + 0], 7, 3614090360);
        s = E(s, x, w, v, r[F + 1], 12, 3905402710);
        v = E(v, s, x, w, r[F + 2], 17, 606105819);
        w = E(w, v, s, x, r[F + 3], 22, 3250441966);
        x = E(x, w, v, s, r[F + 4], 7, 4118548399);
        s = E(s, x, w, v, r[F + 5], 12, 1200080426);
        v = E(v, s, x, w, r[F + 6], 17, 2821735955);
        w = E(w, v, s, x, r[F + 7], 22, 4249261313);
        x = E(x, w, v, s, r[F + 8], 7, 1770035416);
        s = E(s, x, w, v, r[F + 9], 12, 2336552879);
        v = E(v, s, x, w, r[F + 10], 17, 4294925233);
        w = E(w, v, s, x, r[F + 11], 22, 2304563134);
        x = E(x, w, v, s, r[F + 12], 7, 1804603682);
        s = E(s, x, w, v, r[F + 13], 12, 4254626195);
        v = E(v, s, x, w, r[F + 14], 17, 2792965006);
        w = E(w, v, s, x, r[F + 15], 22, 1236535329);
        x = n(x, w, v, s, r[F + 1], 5, 4129170786);
        s = n(s, x, w, v, r[F + 6], 9, 3225465664);
        v = n(v, s, x, w, r[F + 11], 14, 643717713);
        w = n(w, v, s, x, r[F + 0], 20, 3921069994);
        x = n(x, w, v, s, r[F + 5], 5, 3593408605);
        s = n(s, x, w, v, r[F + 10], 9, 38016083);
        v = n(v, s, x, w, r[F + 15], 14, 3634488961);
        w = n(w, v, s, x, r[F + 4], 20, 3889429448);
        x = n(x, w, v, s, r[F + 9], 5, 568446438);
        s = n(s, x, w, v, r[F + 14], 9, 3275163606);
        v = n(v, s, x, w, r[F + 3], 14, 4107603335);
        w = n(w, v, s, x, r[F + 8], 20, 1163531501);
        x = n(x, w, v, s, r[F + 13], 5, 2850285829);
        s = n(s, x, w, v, r[F + 2], 9, 4243563512);
        v = n(v, s, x, w, r[F + 7], 14, 1735328473);
        w = n(w, v, s, x, r[F + 12], 20, 2368359562);
        x = q(x, w, v, s, r[F + 5], 4, 4294588738);
        s = q(s, x, w, v, r[F + 8], 11, 2272392833);
        v = q(v, s, x, w, r[F + 11], 16, 1839030562);
        w = q(w, v, s, x, r[F + 14], 23, 4259657740);
        x = q(x, w, v, s, r[F + 1], 4, 2763975236);
        s = q(s, x, w, v, r[F + 4], 11, 1272893353);
        v = q(v, s, x, w, r[F + 7], 16, 4139469664);
        w = q(w, v, s, x, r[F + 10], 23, 3200236656);
        x = q(x, w, v, s, r[F + 13], 4, 681279174);
        s = q(s, x, w, v, r[F + 0], 11, 3936430074);
        v = q(v, s, x, w, r[F + 3], 16, 3572445317);
        w = q(w, v, s, x, r[F + 6], 23, 76029189);
        x = q(x, w, v, s, r[F + 9], 4, 3654602809);
        s = q(s, x, w, v, r[F + 12], 11, 3873151461);
        v = q(v, s, x, w, r[F + 15], 16, 530742520);
        w = q(w, v, s, x, r[F + 2], 23, 3299628645);
        x = p(x, w, v, s, r[F + 0], 6, 4096336452);
        s = p(s, x, w, v, r[F + 7], 10, 1126891415);
        v = p(v, s, x, w, r[F + 14], 15, 2878612391);
        w = p(w, v, s, x, r[F + 5], 21, 4237533241);
        x = p(x, w, v, s, r[F + 12], 6, 1700485571);
        s = p(s, x, w, v, r[F + 3], 10, 2399980690);
        v = p(v, s, x, w, r[F + 10], 15, 4293915773);
        w = p(w, v, s, x, r[F + 1], 21, 2240044497);
        x = p(x, w, v, s, r[F + 8], 6, 1873313359);
        s = p(s, x, w, v, r[F + 15], 10, 4264355552);
        v = p(v, s, x, w, r[F + 6], 15, 2734768916);
        w = p(w, v, s, x, r[F + 13], 21, 1309151649);
        x = p(x, w, v, s, r[F + 4], 6, 4149444226);
        s = p(s, x, w, v, r[F + 11], 10, 3174756917);
        v = p(v, s, x, w, r[F + 2], 15, 718787259);
        w = p(w, v, s, x, r[F + 9], 21, 3951481745);
        x = m(x, C);
        w = m(w, H);
        v = m(v, l);
        s = m(s, k)
    }
    return function (d) {
        var c = parseInt("0x" + d.substr(0, 3), 16),
            b = parseInt("0x" + d.substr(3, 3), 16),
            a = parseInt("0x" + d.substr(6, 3), 16);
        d = parseInt("0x" + d.substr(9, 3), 16);
        return G(c) + G(b) + G(a) + G(d)
    }(D(x).substr(0, 4) + D(w).substr(0, 4) + D(v).substr(0, 4))
}
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-138041-2"]);
_gaq.push(["_setDomainName", "dict.cn"]);
_gaq.push(["_trackPageview"]);
(function (c, a, e) {
    if (langt == "zh-tw") {
        c("#go_def").html("<a href='#def'>釋義</a>");
        c("#go_sent").html("<a href='#sent'>例句</a>");
        c("#go_learn").html("<a href='#learn'>講解</a>");
        c("#go_ask").html("<a href='#ask'>問答</a>");
        c("#go_rel").html("<a href='#rel'>相關</a>")
    } else {
        c("#go_def").html("<a href='#def'>释义</a>");
        c("#go_sent").html("<a href='#sent'>例句</a>");
        c("#go_learn").html("<a href='#learn'>讲解</a>");
        c("#go_ask").html("<a href='#ask'>问答</a>");
        c("#go_rel").html("<a href='#rel'>相关</a>")
    }

    function b(d, g) {
        var f = e.createElement("script");
        f.type = "text/javascript";
        f.src = d;
        f.async = true;
        e.body.appendChild(f);
        f.onload = f.onreadystatechange = function () {
            if (g) {
                g()
            }
        }
    }
    b(i1_home + "/v/2/i1/js/highcharts/highcharts.js", function () {
        showChart(c("#dict-chart-basic"), 1);
        showChart(c("#dict-chart-examples"), 2)
    });
    b(hc_jspath, function () {
        if (a.dictHc) {
            ! function (d) {
                d.length ? dictHc.init({
                    area: d.get(0)
                }) : dictHc.init({
                    area: c("#footer").get(0)
                })
            }(c("#content"))
        }
    });
    if (c(e.getElementById("bdshell_js")).length > 0) {
        e.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000)
    }
    c("#bds_tips").html("分享单词到：");
    b("http://www.google-analytics.com/ga.js");
    if (c("#adcontainer1").length > 0) {
        (function (f, l, k, h, d, j) {
            f[h] = f[h] || function () {
                (f[h]["q"] = f[h]["q"] || []).push(arguments)
            }, f[h]["t"] = 1 * new Date;
            b("http://www.google.com/adsense/search/async-ads.js", function () {
                var m = {
                    pubId: "pub-5062500030325920",
                    query: c("#adcontainer1").attr("word"),
                    channel: "8711134773",
                    hl: "zh_CN",
                    location: false,
                    plusOnes: false,
                    siteLinks: false
                };
                var g = {
                    container: "adcontainer1",
                    number: 1,
                    width: "560px",
                    lines: 2,
                    fontSizeTitle: 14,
                    fontSizeDomainLink: 14,
                    colorTitleLink: "#444444",
                    colorText: "#999999",
                    colorDomainLink: "#999999",
                    noTitleUnderline: false,
                    detailedAttribution: false
                };
                _googCsa("ads", m, g)
            })
        })(a, e, "script", "_googCsa")
    }
})(jQuery, window, window.document);

function byteSub(d, e) {
    var c = /[^\x00-\xff]/g;
    if (d.replace(c, "mm").length <= e) {
        return d
    }
    var a = Math.floor(e / 2);
    for (var b = a; b < d.length; b++) {
        if (d.substr(0, b).replace(c, "mm").length >= e) {
            return d.substr(0, b) + ".."
        }
    }
    return d
}

function showChart(chartContainer, type) {
    if (!chartContainer) {
        return
    }
    var thisData = chartContainer.attr("data");
    if (thisData) {
        var dat = decodeURIComponent(thisData);
        eval("dat = " + dat);
        var options = {
            chart: {
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 20,
                spacingLeft: 0
            },
            title: {
                text: type == 1 ? "释义常用度分布图" : "词性常用度分布图",
                align: "left",
                margin: 20,
                style: {
                    color: "#808080",
                    fontSize: "12px"
                }
            },
            tooltip: {
                formatter: function () {
                    return "常用度:" + Highcharts.numberFormat(this.percentage, 0) + " %"
                },
                style: {
                    padding: "4px",
                    lineHeight: "20px"
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    startAngle: 90,
                    size: 100,
                    slicedOffset: 8,
                    dataLabels: {
                        distance: 14,
                        softConnector: false,
                        useHTML: true,
                        connectorPadding: 6,
                        connectorColor: "#808080",
                        formatter: function () {
                            return this.point.name
                        },
                        style: {
                            color: "#666",
                            fontSize: "12px"
                        }
                    }
                }
            },
            credits: {
                text: "海词统计",
                style: {
                    cursor: "default",
                    color: "#808080",
                    fontSize: "12px"
                },
                position: {
                    x: -2,
                    y: $.browser.msie ? -8 : -4
                }
            },
            series: [{
                type: "pie",
                name: "分布比例：",
                colors: ["#19B29F", "#53C8BA", "#62DDCF", "#82E3D9", "#9EF0E8", "#74E7DA", "#93F3E8", "#ACFBF2", "#BFF3EE", "#D0FFFB"],
                data: []
            }]
        };
        for (i in dat) {
            var title = type == 1 ? dat[i].sense : dat[i].pos;
            var tip = title;
            title = byteSub(title, 8);
            options.series[0].data[i - 1] = ["<font title='" + tip + "'>" + title + "</font>", dat[i].percent]
        }
        chartContainer.highcharts(options)
    }
}
jQuery(function () {
    $(".sbox_morebtn").click(function () {
        $(".sbox_more").show()
    });
    $(".search").mouseleave(function () {
        $(".sbox_more").hide()
    });
    $(".sbox_more").mouseleave(function () {
        $(".sbox_more").hide()
    });
    $("#q,#search").mouseenter(function () {
        $(".sbox_more").hide()
    });
    $.getJSON("http://en.dict.cn/api/article/hotwords_for_renren/3?callback=?", function (d) {
        var c = "";
        for (var b in d) {
            c += '<dd class="hwdd' + b + '">     <ul>         <li class="hwleft hwleft' + b + '"></li>         <li class="hwmid hwmid' + b + '"><a href="' + d[b].url + '?iref=dict-search-right-hotwords" target="_blank">' + d[b].zh_word + " - " + d[b].en_word + '</a></li>         <li class="hwright hwright' + b + '"></li>     </ul> </dd>'
        }
        $("#hot_words_content").replaceWith(c);
        $(".hot-words li a").click(function (f) {
            f.stopPropagation()
        });
        $(".hot-words dd").mouseenter(function () {
            $(this).addClass("hot_cur")
        }).mouseleave(function () {
            $(this).removeClass("hot_cur")
        }).click(function () {
            window.open($(this).find("li a").attr("href"))
        })
    });
    if ($(".layout.hysy").length > 0) {
        $hysytab = $("h3:contains('行业释义')");
        if ($hysytab.length > 0) {
            var a = $hysytab.css("left");
            a = parseInt(a) + 60;
            if (a) {
                $(".hysytab").css("left", a + "px").css("display", "block")
            }
        }
        $(".hysy-float").click(function () {
            if ($(this).attr("data-url")) {
                window.open($(this).attr("data-url"))
            }
        })
    }
});