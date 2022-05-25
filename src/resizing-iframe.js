// CLIENT CODE
var queryParams = (function(l) {
    var s = l.search.slice(1).split("&");
    var q = s.reduce(function(a, q) {
        if (!q) return a;
        var [k, v] = q.split("=");
        a[decodeURIComponent(k)] = decodeURIComponent(v || "");
        return a;
    }, {});
    return q;
})(location)

function attachProps(obj, props) {
    Object.keys(props).forEach((k) => {
        obj[k] = props[k];
    });
    return obj;
}

function doPostMessage(ev, params) {
    console.log(`${ev} post message event fired inside CTA`);
    console.log("Event params:", params);
    var postEvent = attachProps({
        event: ev,
    }, params);
    window.parent.postMessage(
        postEvent,
        document.referrer || queryParams.origin,
    );
}

(function(d) {    
    function resizeListener() {
        doPostMessage("resize", { height: d.body.scrollHeight });
    }

    var obj = d.createElement("object");
    obj.style.cssText = "display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none; z-index:-1;";
    obj.type = "text/html";
    obj.data = "about:blank";

    d.body.style.position = "relative";
    d.body.appendChild(obj);
            
    console.log('obj', obj.contentDocument);
    obj.contentDocument.defaultView.onresize = () => {
        console.log("Event listener");
        resizeListener();
    };
    setTimeout(resizeListener, 500);
})(document);

// HOST CODE
(function(d) {    
    var iframe = document.getElementById("magic");
    window.addEventListener("message", (ev) => {
    console.log("receiving some message");
    if (ev.source !== iframe.contentWindow) return;
    console.log("event data:", ev.data);
    iframe.height = ev.data.height;
    });
    
})(document);
