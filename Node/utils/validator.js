module.exports ={
    user:(app, req, res)=>{
        req.assert('name', 'Please, insert the name').notEmpty()
        req.assert('email', 'Please, insert a valid email').notEmpty().isEmail()
        
        let errors = req.validationErrors();

        if(errors){
            app.utils.error.send(errors,req, res);
            return false;
        } else {
            return true;
        }
    }
};