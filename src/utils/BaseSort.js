export default class BaseSort {

    static get dimension() { return -1; }
    static get name() { return "BaseSort"; }

    static initStep() {

        throw new Error("Abstract Method has no implementation");

    }

    static nextStep() {

        throw new Error("Abstract Method has no implementation");

    }

    static numeralCompare(a, b) {
        return a - b;
    }

}