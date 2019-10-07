let celphone = function(){

    this.color = "silver";
    this.call = function()
    {

        console.log("one call");
        return "calling";
    }
}

let objeto = new celphone();

console.log(objeto.call());