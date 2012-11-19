var Ebi = (function() {

  var _ = {};

  _.createBuilder = function(tags) {

    var builder = function(target, properties) {
      return new _.Element(target, properties);
    }

    if (tags) {
      for (var i = 0, length = tags.length; i < length; i++) {
        builder[tags[i]] = _.createTagFunction(tags[i]);
      }
    }

    /* Firefox only
    builder.__noSuchMethod__ = function(id, args) {
      return new _.Element(id, args[0]);
    }
    */

    return builder;
  };

  // default builder
  _._ = _.createBuilder(),

  _.createTagFunction = function(tag) {
    return function(properties) {
      return new _.Element(tag, properties);
    }
  };

  // Element class
  _.Element = function(target, properties) {

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
      this.setProperties(properties);
    }
  };

  _.Element.prototype = {

    // append short name
    _: function(value) {
      return this.append(value);
    },

    append: function(value) {

      if (typeof value == 'string') {

        this.target.appendChild(
                      document.createTextNode(value));

      } else if (value instanceof _.Element) {

        this.target.appendChild(value.target);

      } else if (value instanceof Node) {

        this.target.appendChild(value);

      } else if (value instanceof Array) {

        for (var i = 0, length = value.length; i < length; i++) {
          this.append(value[i]);
        }

      } else {

        this.setProperties(value);
      }

      return this;
    },

    clear: function() {

      while(this.target.firstChild){
        this.target.removeChild(this.target.firstChild);
      }

      return this;
    },

    setProperties: function(properties) {

      for (var property in properties) {
        this.target[property] = properties[property];
      }
    }
  };

  return _;
}());
