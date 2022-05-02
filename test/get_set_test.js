var x = {
  aInternal: 10,
  aListener: function (val) { },
  aListenerList: function (val) { },
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function (listener) {
    this.aListener = listener;
  }
};

x.registerListener(function (val) {
  alert("Someone changed the value of x.a to " + val);
});

var f = function (val) {
  alert("in f: Someone changed the value of x.a to " + val);
};



const change_arr = [{ name: "d", job: "f" }, { name: "gef", job: "rol" }];
const change_arr_handler = {
  get: (target, name) => {
    name in target ? console.log(target[name]) : console.log('404 not found');
  },
  set: (target, name, value) => {
    target[name] = value;
  }
};

const change_arr_validator = {

};

const change_arr_proxy = new Proxy(change_arr.change_arr_handler);
change_arr_proxy.job = "ga4c";