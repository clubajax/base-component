function emit (node, eventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true); // event type, bubbling, cancelable
    return node.dispatchEvent(event);
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

function getThisScriptTag () {
    var fileName = /loader/, i, scripts = document.getElementsByTagName('script');
    for(i = 0; i < scripts.length; i++){
        if(fileName.test(scripts[i].src)){
            return scripts[i];
        }
    }
}

function getScriptFileNames () {
    var
        node = getThisScriptTag(),
        files = node.getAttribute('files');
    return files.split(',').map(function (file) {
        file = file.trim();
        if(!/\.js/.test(file)){
            file += '.js';
        }
        return file;
    });
}

function loadFiles (callback) {
    var count = 0, files = getScriptFileNames();
    files.forEach(function (file) {
        loadScript(file, function () {
            if(++count >= files.length){
                callback();
            }
        });
    });
}

function onComponentsReady () {
    emit(document, 'onComponentsReady');
}

function onShimReady () {
    loadFiles(onComponentsReady);
}

loadScript('../bower_components/webcomponents/src/native-shim.js');

const supportsCustomElementsV1 = 'customElements' in window;
console.log('supportsCustomElementsV1:', supportsCustomElementsV1);

if (!supportsCustomElementsV1) {
    loadScript('/bower_components/webcomponents/custom-elements.min.js', onShimReady);
} else {
    // Native support. Good to go.
    onShimReady();
}
