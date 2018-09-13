module.exports = function(path){
    let lastIndex = path.lastIndexOf("\\");
    if(lastIndex < 0){
        lastIndex = path.lastIndexOf("/");
    }
    return path.substring(lastIndex + 1, path.length);
}