import {Expose} from "class-transformer";

export function ExposeAll() {
    return function (constructor: Function) {
        const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
        for (const propertyName of propertyNames) {
            if (propertyName !== 'constructor') {
                Expose()(constructor.prototype, propertyName);
            }
        }
    };
}
