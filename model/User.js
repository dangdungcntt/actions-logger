const mongoose = require('mongoose')
var bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
}, { versionKey: false,timestamps: true })

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) { return next() };
    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})
userSchema.methods.comparePassword = function (candidatePassword, next) {
    return bcrypt.compareSync(candidatePassword, this.password);
}
module.exports = mongoose.model("User", userSchema);