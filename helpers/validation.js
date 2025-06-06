const Joi = require("joi");


const userValidate = data =>{
    const userSchema = Joi.object({
        ...data,
        username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    })

    return userSchema.validate(data);
}

module.exports = {
    userValidate
}