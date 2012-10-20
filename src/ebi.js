var ElementBuilder = function(target, properties) {

  if (typeof target == 'string') {
    if (target[0] == '#') {
      this.target = document.getElementById(target.substr(1));
    } else {
      this.target = document.createElement(target);
    }
  } else {
    this.target = target
  }

  if (properties) {
    for (var property in properties) {
      this.target[property] = properties[property];
    }
  }
};

ElementBuilder.prototype = {

  append: function(value) {

    if (typeof value == 'string') {
      value = document.createTextNode(value);
    } else if (value instanceof ElementBuilder) {
      value = value.target;
    }

    this.target.appendChild(value);

    return this;
  }
};

ElementBuilder.$ = function(value) {
  return new ElementBuilder(value);
};
