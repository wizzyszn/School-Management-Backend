module.exports.cleanCopy  = (object) =>{
    const copy = object.toObject();
    delete copy.password;
    return copy;
}