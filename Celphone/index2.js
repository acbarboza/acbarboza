class celphone {
    constructor(){

        this.color = "silver";
    }

    call(){

        console.log("one call");
        return "calling";
    }
}

let objeto = new celphone();

console.log(objeto.call());