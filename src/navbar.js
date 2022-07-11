(function(document, window) {
    let navBackground;
    const darkNavClass = "darknav";

    let now = Date.now || function() {
        return new Date().getTime();
    };

    let throttle = (func, wait, options) => {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};
    
        var later = function() {
            previous = options.leading === false ? 0 : now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
    
        var throttled = function() {
            var _now = now();
            if (!previous && options.leading === false) previous = _now;
            var remaining = wait - (_now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                clearTimeout(timeout);
                timeout = null;
                }
                previous = _now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    
        throttled.cancel = function() {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };
    
        return throttled;
    }

    let checkNavBackground = throttle(() => {
        if(!navBackground) {
           navBackground = document.getElementById("nav-background");
        }

        // are we at the top?
        if(window.scrollY === 0 && navBackground.classList.contains(darkNavClass)) {
            navBackground.classList.remove(darkNavClass);
        } else if(window.scrollY !== 0 && !navBackground.classList.contains(darkNavClass)) {
            navBackground.classList.add(darkNavClass)
        }
    })

    checkNavBackground();
    window.onscroll = checkNavBackground;

})(document, window);