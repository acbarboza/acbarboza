class CalcController{

    constructor(){

        this._audio = new Audio ('click.mp3');
        this._audioOnOof = false;
        this._lastOperator ='';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'en';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#date");
        this._timeEl = document.querySelector("#hour");
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeybord();
   
    }

    pasteFromClipboard(){
   
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);

        });
    }

    copyToClipboard(){

        let input = document.createElement('input');
        
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }
   
    initialize(){
       
        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000 );

        this.setLastNumberDisplay();
        this.pasteFromClipboard();  

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
        
    }
   
    toggleAudio(){
        
        this._audioOnOof = !this._audioOnOof;
        //this._audioOnOof = (this._audioOnOof)? false : true;
    }

    playAudio(){
        
        if(this._audioOnOof){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeybord(){
        
        document.addEventListener('keyup', e =>{
            
            this.playAudio();
       
            switch (e.key){
           
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                        this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':    
                       this.calc();
                    break;
                case '.':
                case ',':    
                        this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;                           
            }
        });

    }

    addEventListenerALL(element, events, fn){
        
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    
    }

    clearAll(){

        this._operation = [];
        this._lastOperator ='';
        this._lastNumber = '';
        this.setLastNumberDisplay();
    
    }

    clearEntry(){
    
        this._operation.pop();
        this.setLastNumberDisplay();
    
    }

    getLastOperation(){
    
        return this._operation[this._operation.length-1];
    
    }

    isOperator(value){
    
        return (['+','-','*','%','/'].indexOf(value) > -1);

    }

    setLastOperation(value){
        
        this._operation[this._operation.length -1] = value;
    
    }

    pushOperation(value){

        this._operation.push(value);
        if (this._operation.length >3){
            this.calc();
        }
    }

    getResult(){
        
        try{
            return eval(this._operation.join(""));
        } catch (e){
            setTimeout(()=>{
            this.setError();
            }, 1);
        }
    } 

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length >3){

            last = this._operation.pop();
            
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%'){

            result /= 100;
            this._operation =[result];

        }else {
            this._operation = [result];
        if(last) this._operation.push(last);
        }
       
        this.setLastNumberDisplay();
    }

    getLastItem(isOperator = true){
        
        let lastItem;

        for(let i = this._operation.length-1; i>=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    setLastNumberDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    }

    addOperation(value){
       // console.log('A', isNaN(this.getLastOperation()));

        if( isNaN(this.getLastOperation())){
            //string
            if (this.isOperator(value)){
                // change operador

                this.setLastOperation(value);
            
            } else{

                this.pushOperation(value);
                this.setLastNumberDisplay();
               
            }

        } else {
            if (this.isOperator(value)){
                this.pushOperation(value);
            }else {
             
            let newValue = this.getLastOperation().toString() + value.toString()
            this.setLastOperation(newValue);
            // update display 

            this.setLastNumberDisplay();
            }
        }

        //this._operation.push(value);
       // console.log(this._operation);

    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){
        
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')> -1) return;

        if(this.isOperator(lastOperation)|| !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.' );
        }

        this.setLastNumberDisplay();
    }


    execBtn(value){

        this.playAudio();

        switch (value){
           
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'sum':
                    this.addOperation('+');
                break;
            case 'subtraction':
                    this.addOperation('-');
                break;
            case 'multiplication':
                    this.addOperation('*');
                break;
            case 'division':
                    this.addOperation('/');
                break;
            case 'percent':
                    this.addOperation('%');
                break;
            case 'equal':
                   this.calc();
                break;
            case 'dot':
                    this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;                    
        }

    }
    initButtonsEvent(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
            buttons.forEach((btn, index)=>{ 
                this.addEventListenerALL(btn, 'click drag', e=>{
                    let textBtn = btn.className.baseVal.replace("btn-","");

                    this.execBtn(textBtn);
                });

                this.addEventListenerALL(btn, "mouseover mouseup mousedown", e =>{
                    btn.style.cursor = "pointer";
                });

            });
    }


    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
           day: "2-digit",
           month: "short",
           year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);    
    }


    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){

        if(value.toString().length >10){
           this.setError();
           return false; 
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }
}