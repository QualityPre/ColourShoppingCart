// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/items.json":[function(require,module,exports) {
module.exports = [{
  "id": 1,
  "name": "Red",
  "category": "Primary Color",
  "priceCents": 1600,
  "imageColor": "F00"
}, {
  "id": 2,
  "name": "Yellow",
  "category": "Primary Color",
  "priceCents": 2100,
  "imageColor": "FF0"
}, {
  "id": 3,
  "name": "Blue",
  "category": "Primary Color",
  "priceCents": 1200,
  "imageColor": "00F"
}, {
  "id": 4,
  "name": "Orange",
  "category": "Secondary Color",
  "priceCents": 1800,
  "imageColor": "F60"
}, {
  "id": 5,
  "name": "Green",
  "category": "Secondary Color",
  "priceCents": 1600,
  "imageColor": "0F0"
}, {
  "id": 6,
  "name": "Purple",
  "category": "Secondary Color",
  "priceCents": 2200,
  "imageColor": "60F"
}, {
  "id": 7,
  "name": "Light Gray",
  "category": "Grayscale",
  "priceCents": 1200,
  "imageColor": "AAA"
}, {
  "id": 8,
  "name": "Dark Gray",
  "category": "Grayscale",
  "priceCents": 1600,
  "imageColor": "333"
}];
},{}],"src/helpers/formatCurrency.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatCurrency;
var formatToUSDollars = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD'
});

function formatCurrency(amount) {
  return formatToUSDollars.format(amount);
}
},{}],"src/helpers/addGlobalEventListener.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addglobalEventListener;

function addglobalEventListener(type, selector, callback) {
  document.addEventListener(type, function (e) {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}
},{}],"src/js/shoppingCart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToCart = addToCart;
exports.setupShoppingCart = setupShoppingCart;

var _items = _interopRequireDefault(require("../items.json"));

var _formatCurrency = _interopRequireDefault(require("../helpers/formatCurrency"));

var _addGlobalEventListener = _interopRequireDefault(require("../helpers/addGlobalEventListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cartButton = document.querySelector('[data-cart-button]');
var cartItemWrapper = document.querySelector('[data-cart-items-wrapper]');
var shoppingCart = [];
var IMAGE_URL = "https://dummyimage.com/210x130/";
var shoppingItemTemplate = document.querySelector('#shopping-cart-template');
var shoppingItemContainer = document.querySelector('[data-cart-items-container ]');
var cartQuantity = document.querySelector('[data-cart-quantity]');
var cartTotal = document.querySelector('[data-cart-total]');
var cart = document.querySelector('[data-cart]');
var SESSION_STORAGE_KEY = "SHOPPING_CART-cart";

function setupShoppingCart() {
  (0, _addGlobalEventListener.default)('click', '[data-remove-from-cart-button]', function (e) {
    var id = parseInt(e.target.closest('[data-item]').dataset.itemId);
    removeFromCart(id);
  });
  shoppingCart = loadCart();
  renderCart(); // Show/hide the cart when clicked

  cartButton.addEventListener('click', function () {
    cartItemWrapper.classList.toggle('invisible');
  });
} // handle click event for adding..on store.js
// Calculate an accurate total
// Add the items to the cart


function addToCart(id) {
  //Handle multiple of same item of the cart
  var existingItem = shoppingCart.find(function (entry) {
    return entry.id === id;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({
      id: id,
      quantity: +1
    });
  }

  saveCart();
  renderCart();
} // Show/hide cart button when it has no items OR when it goes from 0 to 1 item


function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderShoppingCart();
  }
}

function hideCart() {
  cart.classList.add('invisible');
  cartItemWrapper.classList.add('invisible');
}

function showCart() {
  cart.classList.remove('invisible');
}

function renderShoppingCart() {
  cartQuantity.innerText = shoppingCart.length;
  var totalCents = shoppingCart.reduce(function (sum, entry) {
    var item = _items.default.find(function (i) {
      return i.id === entry.id;
    });

    return sum + item.priceCents * entry.quantity;
  }, 0);
  cartTotal.innerText = (0, _formatCurrency.default)(totalCents / 100);
  shoppingItemContainer.innerHTML = '';
  shoppingCart.forEach(function (entry) {
    var item = _items.default.find(function (i) {
      return i.id === entry.id;
    });

    var shoppingItem = shoppingItemTemplate.content.cloneNode(true);
    var container = shoppingItem.querySelector(' [data-item]');
    container.dataset.itemId = item.id;
    var name = shoppingItem.querySelector('[data-name]');
    name.innerText = item.name;
    var price = shoppingItem.querySelector('[data-price]');
    price.innerText = (0, _formatCurrency.default)(item.priceCents * entry.quantity / 100);
    var quantity = shoppingItem.querySelector('[data-quantity]');
    entry.quantity === 1 ? quantity.innerText = '' : quantity.innerText = "x".concat(entry.quantity);
    var image = shoppingItem.querySelector('[data-image]');
    image.src = "".concat(IMAGE_URL, "/").concat(item.imageColor, "/").concat(item.imageColor);
    shoppingItemContainer.appendChild(shoppingItem);
  });
} // Remove items from cart


function removeFromCart(id) {
  var existingItem = shoppingCart.find(function (entry) {
    return entry.id === id;
  });
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter(function (entry) {
    return entry.id !== id;
  });
  saveCart();
  renderCart();
} // Persist across multiple pages


function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}

function loadCart() {
  var cart = sessionStorage.getItem(SESSION_STORAGE_KEY);
  console.log(cart);
  return JSON.parse(cart) || [];
}
},{"../items.json":"src/items.json","../helpers/formatCurrency":"src/helpers/formatCurrency.js","../helpers/addGlobalEventListener":"src/helpers/addGlobalEventListener.js"}],"src/js/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupStore = setupStore;

var _items = _interopRequireDefault(require("../items.json"));

var _formatCurrency = _interopRequireDefault(require("../helpers/formatCurrency"));

var _shoppingCart = require("./shoppingCart");

var _addGlobalEventListener = _interopRequireDefault(require("../helpers/addGlobalEventListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storeItemTemplate = document.querySelector('#store-item-template');
var storeItemContainer = document.querySelector('[data-store-container]');
var IMAGE_URL = "https://dummyimage.com/420x260/";

function setupStore() {
  if (storeItemContainer == null) return;
  (0, _addGlobalEventListener.default)('click', '[data-add-to-cart-button]', function (e) {
    var id = e.target.closest('[data-store-item]').dataset.itemId;
    (0, _shoppingCart.addToCart)(+id);
  });

  _items.default.forEach(renderStoreItem);
}

function renderStoreItem(item) {
  var storeItem = storeItemTemplate.content.cloneNode(true);
  var container = storeItem.querySelector(' [data-store-item]');
  container.dataset.itemId = item.id;
  var name = storeItem.querySelector('[data-name]');
  name.innerText = item.name;
  var category = storeItem.querySelector('[data-category]');
  category.innerText = item.category;
  var price = storeItem.querySelector('[data-price]');
  price.innerText = (0, _formatCurrency.default)(item.priceCents / 100);
  var image = storeItem.querySelector('[data-image]');
  image.src = "".concat(IMAGE_URL, "/").concat(item.imageColor, "/").concat(item.imageColor);
  storeItemContainer.appendChild(storeItem);
}
},{"../items.json":"src/items.json","../helpers/formatCurrency":"src/helpers/formatCurrency.js","./shoppingCart":"src/js/shoppingCart.js","../helpers/addGlobalEventListener":"src/helpers/addGlobalEventListener.js"}],"src/js/jscript.js":[function(require,module,exports) {
"use strict";

var _store = require("./store");

var _shoppingCart = require("./shoppingCart");

(0, _store.setupStore)();
(0, _shoppingCart.setupShoppingCart)();
},{"./store":"src/js/store.js","./shoppingCart":"src/js/shoppingCart.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38173" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/jscript.js"], null)
//# sourceMappingURL=/jscript.9f7dc140.js.map