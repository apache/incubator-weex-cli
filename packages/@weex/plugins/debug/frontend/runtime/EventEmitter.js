function EventEmitter() {
    this._handlers = {};
}
EventEmitter.prototype = {
    constructor: EventEmitter,
    off: function (method, handler) {
        if (handler) {
            for (var i = 0; i < this._handlers[method].length; i++) {
                if (this._handlers[method][i] === handler) {
                    this._handlers[method].splice(i, 1);
                    i--;
                }
            }
        }
        else {
            this._handlers[method] = [];
        }
    },
    once: function (method, handler) {
        var self = this;
        var fired = false;

        function g() {
            self.off(method, g);
            if (!fired) {
                fired = true;
                handler.apply(self, Array.prototype.slice.call(arguments));
            }
        }

        this.on(method, g);
    },
    on: function (method, handler) {
        if (this._handlers[method]) {
            this._handlers[method].push(handler);
        }
        else {
            this._handlers[method] = [handler];
        }
    },

    _emit: function (method, args, context) {
        var handlers = this._handlers[method];
        if (handlers && handlers.length > 0) {
            handlers.forEach(function (handler) {
                handler.apply(context, args)
            });
            return true;
        }
        else {
            return false;
        }
    },

    emit: function (method) {
        var context = {};
        var args = Array.prototype.slice.call(arguments, 1);
        if (!this._emit(method, args, context)) {
            this._emit('*', args, context)
        }
        this._emit('$finally', args, context);
        return context;
    }
};