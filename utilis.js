function RandomNumGenerator(){
    return Math.floor(Math.random()*100)+1;
}
function CtoF(C){
    return(C*9)/5+32;
}
module.exports = { RandomNumGenerator, CtoF };
