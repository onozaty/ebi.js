var Ebi = (function() {

  var _ = {};

  // Element class
  _.Element = function() {
    this.initialize.apply(this, arguments);
  };

  _.Element.prototype = {

    clazz: _.Element,
    parent: null,

    initialize: function(target, properties) {

      if (!target) return; // in extend Element

      if (typeof target === 'string') {
        if (target[0] === '#') {
          // element id
          this.target = document.getElementById(target.substr(1));
        } else {
          // tag name
          this.target = document.createElement(target);
        }
      } else {
        // element object
        this.target = target
      }

      if (properties) {
        // apply property
        this.property(properties);
      }
    },

    // append method short name
    _: function(value) {
      return this.append(value);
    },

    append: function(value) {

      if (typeof value === 'string') {

        this.target.appendChild(
                      document.createTextNode(value));

      } else if (value instanceof _.Element) {

        this.target.appendChild(value.target);
        value.parent = this;

      } else if (value instanceof Array) {

        for (var i = 0, length = value.length; i < length; i++) {
          this.append(value[i]);
        }

      } else {

        // element
        this.target.appendChild(value);
      }

      return this;
    },

    clear: function() {

      while (this.target.firstChild) {
        this.target.removeChild(this.target.firstChild);
      }

      return this;
    },

    property: function(value1, value2) {

      if (value2 != undefined) {

        // key value
        this.target[value1] = value2;

      } else {

        // properties object
        for (var property in value1) {
          this.target[property] = value1[property];
        }
      }

      return this;
    },

    style: function(value1, value2) {

      if (value2 != undefined) {

        // key value
        this.target.style[value1] = value2;

      } else {

        // properties object
        for (var property in value1) {
          this.target.style[property] = value1[property];
        }
      }

      return this;
    },

    start: function(target, properties) {

      var startElement = new this.clazz(target, properties);

      this.append(startElement);

      return startElement;
    },

    end: function() {
      return this.parent;
    }

  };

  // Builder
  _.createBuilder = function(tags) {

    var elementClass = _.Element;

    if (tags) {
      // extend Element class, add tag method.
      elementClass = function() {
        this.initialize.apply(this, arguments);
      };

      elementClass.prototype = new _.Element;
      elementClass.prototype.clazz = elementClass;

      for (var i = 0, length = tags.length; i < length; i++) {
        elementClass.prototype[tags[i]] = _.createTagFunction(tags[i], elementClass);
      }

      /* Firefox only
      elementClass.__noSuchMethod__ = function(id, args) {
        return start(id, args[0]);
      }
      */
    }

    var builder = function(target, properties) {
      return new elementClass(target, properties);
    }

    return builder;
  };

  // default Builder
  _.defaultBuilder = _.createBuilder();

  _.createElement = function(target, properties) {
    return _.defaultBuilder(target, properties);
  };

  _.createTagFunction = function(tag) {
    return function(properties) {
      return this.start(tag, properties);
    }
  };

  return _;
}());
