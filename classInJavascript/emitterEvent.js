class EventEmitter {
    #listeners = new Map();

    on(event, fn) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(fn);
        return this;
    };

    emit(event, ...args) {
        const fns = this.#listeners.get(event);
        if (!fns || fns.length === 0) return false;
        [...fns].forEach((fn) => fn(...args));
        return true;
    };

    off(event, fn) {
        const fns = this.#listeners.get(event);
        if (!fns) return this;
        this.#listeners.set(event, fns.filter((f) => f !== fn));
        return this;
    };

    once(event, fn) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            fn(...args)
        };
        return this.on(event, wrapper);
    };
};

const e = new EventEmitter();

e.once("greet", () => console.log("Hello, Ben"));
// e.once("greet", () => console.log("Welcome"));

e.emit("greet");
e.emit("greet");