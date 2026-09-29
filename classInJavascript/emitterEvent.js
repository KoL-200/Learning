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

class Logger extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }

    log(level, message) {
        const entry = {
            level,
            message,
            source: this.name,
            time: new Date().toString(),
        };
        console.log(`[${entry.level}] ${entry.message}`);
        this.emit("log", entry)
        this.emit(level, entry)
    }

    info(msg) { this.log("info", msg); }
    warn(msg) { this.log("warn", msg); }
    error(msg) { this.log("error", msg); }
}

// const e = new EventEmitter();

// e.once("greet", () => console.log("Hello, Ben"));
// // e.once("greet", () => console.log("Welcome"));

// e.emit("greet");
// e.emit("greet");

const logger = new Logger("api");

logger.on("error", (e) => {
    console.log("ALERT", e.message);
});

logger.once("log", () => console.log("first log ever"));

logger.info("Server started");
logger.error("DB connection failed")