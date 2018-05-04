var iQuery = function() {
    return new iQuery.fn.init();
}

iQuery.fn = iQuery.prototype = {
    constructor: iQuery,
    init: function() {
        this.age = 23;
        return this;
    },
    setName: function(name){
        this.name = name;
        return this;
    }
}

iQuery.fn.init.prototype = iQuery.fn;
