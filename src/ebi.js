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

  _.createTagFunction = function(tag) {
    return function(properties) {
      return new _.Element(tag, properties);
    }
  };


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
      for (var property in properties) {
        this.target[property] = properties[property];
      }
    }
  };

  _.Element.prototype = {

    append: function(value) {

      if (typeof value == 'string') {
        value = document.createTextNode(value);
      } else if (value instanceof _.Element) {
        value = value.target;
      }

      this.target.appendChild(value);

      return this;
    },

    clear: function() {

      while(this.target.firstChild){
        this.target.removeChild(this.target.firstChild);
      }

      return this;
    }
  };

  return _;
}());
