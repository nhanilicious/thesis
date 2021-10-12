export default class BaseSort {

    static dimension = -1;
    static name = "BaseSort";

    static initStep() {

        throw new Error("Abstract Method has no implementation");

    }

    static nextStep() {

        throw new Error("Abstract Method has no implementation");

    }

}