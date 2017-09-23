import Vue from 'vue'
/*
 * @description: 浮层弹窗组件
 *
 * @update: cxy (2017-03-07)
 */
Vue.directive('clickoutside', {
    bind (el, binding, vnode) {
        function documentHandler(e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }

        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
});
/*
 * @description: vue长按事件
 *
 * @update: lwq (2017-03-08)
 */

Vue.directive('longTap', function (el, binding) {
    el.addEventListener('touchstart', function (event) {
        var evt = event || window.event;
        if (evt.targetTouches.length == 1) {
            var _TimeoutId = setTimeout(function () {
                if (binding.value.fun) {
                    if (binding.value.param) {
                        binding.value.param.el = el;
                        binding.value.fun(binding.value.param);
                    } else {
                        binding.value.fun();
                    }
                }
            }, 750);
            //当触发move cancel end 事件时清除长按事件
            el.addEventListener('touchcancel', _clearTimeout);
            el.addEventListener('touchmove', _clearTimeout);
            el.addEventListener('touchend', _unbindAll);
            function _clearTimeout() {
                clearTimeout(_TimeoutId);
            }

            function _unbindAll() {
                clearTimeout(_TimeoutId);
                //清除move cancel end事件
                el.removeEventListener('touchcancel', _clearTimeout);
                el.removeEventListener('touchmove', _clearTimeout);
                el.removeEventListener('touchend', _unbindAll);
            }
        }
    });
});

/*
 * @description: vue下拉刷新
 *
 * @update: cxy (2017-03-10)
 */
Vue.directive('refresh', {
    bind: function (el, binding) {
        var startY, moveY, movevalue, rmove, endrmove;
        el.addEventListener('touchstart', function (e) {
            var touch = e.targetTouches[0];
            startY = touch.clientY;
            el.addEventListener('touchmove', rmove, false);
        }, false);
        rmove = function (evt) {
            var e = evt;
            var touch = e.targetTouches[0];
            moveY = touch.clientY;
            movevalue = moveY - startY;
            var transfromY = parseFloat(getComputedStyle(el, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5]);
            if (transfromY >= 0 && movevalue > 100) {
                if (el.querySelector('.refresh')) {
                    el.querySelector('.refresh').style.display = 'block';
                    el.addEventListener('touchend', endrmove, false);
                }
                if (movevalue > 150) {
                    el.removeEventListener('touchmove', rmove, false);
                }
            }
        };
        endrmove = function () {
            let fnc = binding.value;
            fnc();
            if (el.querySelector('.refresh')) {
                setTimeout(function () {
                    el.querySelector('.refresh').style.display = 'none';
                }, 0)
            }
            el.removeEventListener('touchmove', rmove, false);
            el.removeEventListener('touchend', endrmove, false);
        }
    }
})
/*
 * @description: vue加载数据
 *
 * @update: cxy (2017-03-10)
 */
Vue.directive('load', {
    bind: function (el, binding) {
        var startY, moveY, movevalue, rmove, endrmove;
        el.addEventListener('touchstart', function (e) {
            var touch = e.targetTouches[0];
            startY = touch.clientY;
            el.addEventListener('touchmove', rmove, false);
        }, false);
        rmove = function (evt) {
            var e = evt;
            var touch = e.targetTouches[0];
            moveY = touch.clientY;
            movevalue = moveY - startY;
            var transfromY = parseFloat(getComputedStyle(el, null).getPropertyValue("-webkit-transform").substring(7).split(',')[5]);
            if (Math.abs(transfromY) >= el.offsetHeight - window.innerHeight - 1000){
                el.addEventListener('touchend', endrmove, false);
                el.removeEventListener('touchmove', rmove, false);
            }
        };
        endrmove = function () {
            let fnc = binding.value;
            fnc();
            el.removeEventListener('touchend', endrmove, false);
        }
    }
})