"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctor_1 = require("./doctor");
function default_1() {
    return new Promise((resolve, reject) => {
        const doctor = new doctor_1.Doctor();
        resolve(doctor);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map