/**
 * @name 配置页面缩放比例
 * @description
 * @author gongjf
 * @since 2019年8月24日 11:12:49
 */

!(function(win) {
    let doc = win.document;

    let metaEl = doc.querySelector('meta[name="viewport"]');
    if(!metaEl) {
        metaEl = doc.createElement("meta");
        metaEl.setAttribute("name", "viewport");
    }
    
    let docEl = doc.documentElement;
    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
    } else {
        let wrap = doc.createElement("div");
        wrap.appendChild(metaEl);
        doc.write(wrap.innerHTML);
    }

    function refreshScale() {
        let dpr = win.devicePixelRatio;
        let scale = 1 / dpr;
        metaEl.setAttribute(
            "content",
            "initial-scale=" +
            scale +
            ", maximum-scale=" +
            scale +
            ", minimum-scale=" +
            scale +
            ", user-scalable=no"
        );
    }
    
    let tid;
    win.addEventListener(
        "resize",
        function() {
            clearTimeout(tid);
            tid = setTimeout(refreshScale, 300);
        },
        false
    );
    win.addEventListener(
        "pageshow",
        function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshScale, 300);
        }
        },
        false
    );

    refreshScale();

})(window);