var initArr=[];
for(var i=0;i<10;i++>){
   initArr.push({sort:i,changeVale:{secondValue:i}},changeV:i);
};
var sortArr=initArr.sort((x,y)=>{return y.sort-x.sort});
console.log(initArr==sortArr,initArr,sortArr);
var reserveArr=initArr.reverse();
console.log(initArr==reserveArr,initArr,reserveArr);

var mapFilter=mapFilter.filter(x=>{x.changeV=x.changeV+1;return x.sort<5});
console.log(initArr==mapArr,initArr,mapArr);

var mapArr=initArr.map(x=>{x.changeV=x.changeV+1;});
console.log(initArr==mapArr,initArr,mapArr);

