(function () {
    "use strict";
    /*
     * @description: 客户端交互处理
     *
     * @update: cxy (2017-03-06)
     */
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'jlbbridge://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }

    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('rightAction', function (data, responseCallback) {
            jsRightAction();
        })

    })
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge)
            }, false)
        }
    }

    connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
        })
    });


    const util = {}
    /*
     * @description: utf-16编码(解决表情无法显示问题)
     *
     * @update: cxy (2017-03-06)
     */
    util.utf16toEntities = function (str) {
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
        // 检测utf16字符正则
        str = str.replace(patt, function (char) {
            var H, L, code;
            if (char.length === 2) {
                H = char.charCodeAt(0);
                // 取出高位
                L = char.charCodeAt(1);
                // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
        return str;
    }
    util.toUniCode = function (data) {
        if (data == '') return '请输入汉字';
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16);
        }
        return str;
    }
    util.changeDate = function (value) {
        var time = value * 1000;
        var now = new Date().getTime();
        var res = (now - time) / 1000 / 86400;
        var month = new Date(time).getMonth() + 1;
        var date = new Date(time).getDate();
        var hour = new Date(time).getHours();
        var min = new Date(time).getMinutes();
        var weekType = new Array("日", "一", "二", "三", "四", "五", "六");
        var week = '星期' + weekType[new Date(time).getDay()];
        if (min < 10) {
            min = '0' + min
        }
        if (new Date().getDate() - new Date(time).getDate() === 0) {
            if (hour > 12) {
                return '下午 ' + (hour - 12) + ':' + min;
            } else {
                return '上午 ' + hour + ':' + min;
            }

        } else if (new Date().getDate() - new Date(time).getDate() === 1) {
            if (hour > 12) {
                return '昨天 ' + ' 下午' + (hour - 12) + ':' + min;
            } else {
                return '昨天 ' + ' 上午' + hour + ':' + min;
            }
        }
        else if (new Date().getDate() - new Date(time).getDate() < 7 && new Date().getDay() - new Date(time).getDay() > 0) {
            return week + ' ' + hour + ':' + min;
            if (hour > 12) {
                return week + ' 下午' + (hour - 12) + ':' + min;
            } else {
                return week + ' 上午' + hour + ':' + min;
            }
        } else {
            if (hour > 12) {
                return month + '月' + date + '日' + ' 下午' + (hour - 12) + ':' + min;
            } else {
                return month + '月' + date + '日' + ' 上午' + hour + ':' + min;
            }

        }
    }
    util.changeFile = function (files, callbackFunc) {
        files.forEach(function (file) {
            var reader = new FileReader();
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;
                if (img.complete) {
                    callback(result, file.type);
                } else {
                    img.onload = callback;
                }
                function callback() {
                    var data = util.compress(img);
                    util.upload(data, file.type, 'app', callbackFunc);
                    img = null;
                }
            };
            reader.readAsDataURL(file);
        })
    }
    util.compress = function (img) {
        var initSize = img.src.length;
        var width = img.width;
        var height = img.height;
        // 如果图片大于四百万像素，计算压缩比并将大小压至100万以下
        var ratio;
        if ((ratio = width * height / 1000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 如果图片像素大于100万则使用瓦片绘制
        var count;
        if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
            // 计算每块瓦片的宽和高
            var nw = ~~(width / count);
            var nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio,
                        nh * ratio, 0, 0, nw, nh);
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }
        // 进行最小压缩
        var ndata = canvas.toDataURL('image/jpeg', 0.8);
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
    }
    util.upload = function (basestr, type, imgType, callbackFunc) {
        var text = window.atob(basestr.split(",")[1]);
        var buffer = new Uint8Array(text.length);
        var pecent = 0, loop = null;
        for (var i = 0; i < text.length; i++) {
            buffer[i] = text.charCodeAt(i);
        }
        var blob = util.newBlob(buffer, type);
        var xhr = new XMLHttpRequest();
        var formdata = needsFormDataShim ? new util.FormDataShim() : new FormData();
        formdata.append('file', blob);
        xhr.open('post', 'http://101.69.254.162:8022/jlb-web-image/upload/uploadFile.shtml?imgType=' + imgType);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonData = JSON.parse(xhr.responseText);
                jsonData.baseUrl = basestr;
                callbackFunc(jsonData);
            }
        };
        xhr.send(formdata);
    }
    /**
     * 获取blob对象的兼容性写法
     *
     * @param buffer
     * @param format
     * @returns {*}
     */
    util.newBlob = function (data, datatype) {
        var out;
        try {
            out = new Blob([data], {
                type: datatype
            });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder
                || window.MozBlobBuilder || window.MSBlobBuilder;

            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(data.buffer);
                out = bb.getBlob(datatype);
            } else if (e.name == "InvalidStateError") {
                out = new Blob([data], {
                    type: datatype
                });
            } else {
            }
        }
        return out;
    }
// 判断是否需要blobbuilder
    var needsFormDataShim = (function () {
        var bCheck = ~navigator.userAgent.indexOf('Android')
            && ~navigator.vendor.indexOf('Google')
            && !~navigator.userAgent.indexOf('Chrome');

        return bCheck
            && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    })(), blobConstruct = !!(function () {
        try {
            return new Blob();
        } catch (e) {
        }
    })(), XBlob = blobConstruct ? window.Blob
        : function (parts, opts) {
            var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
            parts.forEach(function (p) {
                bb.append(p);
            });

            return bb.getBlob(opts ? opts.type : undefined);
        };
    util.FormDataShim = function () {
        // Store a reference to this
        var o = this, parts = [], // Data to be sent
            boundary = Array(5).join('-')
                + (+new Date() * (1e16 * Math.random())).toString(32), oldSend = XMLHttpRequest.prototype.send;

        this.append = function (name, value, filename) {
            parts.push('--' + boundary
                + '\r\nContent-Disposition: form-data; name="' + name + '"');

            if (value instanceof Blob) {
                parts.push('; filename="' + (filename || 'blob')
                    + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                parts.push(value);
            } else {
                parts.push('\r\n\r\n' + value);
            }
            parts.push('\r\n');
        };

        // Override XHR send()
        XMLHttpRequest.prototype.send = function (val) {
            var fr, data, oXHR = this;

            if (val === o) {
                // 注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
                parts.push('--' + boundary + '--\r\n');
                data = new XBlob(parts);
                fr = new FileReader();
                fr.onload = function () {
                    oldSend.call(oXHR, fr.result);
                };
                fr.onerror = function (err) {
                    throw err;
                };
                fr.readAsArrayBuffer(data);

                this.setRequestHeader('Content-Type',
                    'multipart/form-data; boundary=' + boundary);
                XMLHttpRequest.prototype.send = oldSend;
            } else {
                oldSend.call(this, val);
            }
        };
    }
    //判断浏览器
    util.browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1 //是否微信 （2015-01-22新增）
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    //判断Android
    util.isAndroid = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("jlb-android-app") !== -1) {
            return true;
        } else {
            return false;
        }
    }
    // 判断IOS
    util.isIOS = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("native_ios") !== -1) {
            return true;
        } else {
            return false;
        }
    }
    //判断h5
    util.isH5 = function () {
        if (!util.isIOS() && !util.isAndroid()) {
            return true
        } else {
            return false
        }
    }
    /*
     * @description: jsBridge封装
     *
     * @update: cxy (2017-03-16)
     */
    util.JsBridge = function (funName, params, callback) {
        "use strict";
        try {
            let bridge = window.WebViewJavascriptBridge;
            if (Object.prototype.toString.call(params) !== '[object Object]') return;
            bridge.callHandler(funName, params, (res) => {
                if (Object.prototype.toString.call(res) === '[object String]') {
                    if (!params.noJSONParse) {
                        res = JSON.parse(res);
                    }
                }
                callback(res)
            });
        } catch (e) {

        }
    }


    util.jsBridgeCallBack = function (funName, callback) {
        window[funName] = function (res) {
            callback(res);
        }
    }
    util.audio=document.getElementById('audio');
    window.util = util;
    /*
     * @description: 日期格式化
     *
     * @update: lwq (2017-03-06)
     */
    Date.prototype.Format = function (format) {
        var o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };
    /*
     * @description: 倒计时格式化
     *
     * @update: lwq (2017-03-06)
     */
    Date.prototype.Time = function (format) {
        var o = {
            "d+": this.getUTCDate() - 1,
            "h+": this.getUTCHours(),
            "m+": this.getUTCMinutes(),
            "s+": this.getUTCSeconds(),
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

})()

