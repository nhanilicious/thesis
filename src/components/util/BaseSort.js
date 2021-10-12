export default class BaseSort {

    static dimension = -1;
    static id = "base_sort";
    static name = "BaseSort";

    static initStep() {

        throw new Error("Abstract Method has no implementation");

    }

    static nextStep() {

        throw new Error("Abstract Method has no implementation");

    }

}