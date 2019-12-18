// 封装localStorage的方法

// 获取
function getLocal(key){
    return JSON.parse(window.localStorage.getItem(key));
}
// 设置
function setLocal(key,value){
     window.localStorage.setItem(key,JSON.stringify(value));
}
// 删除
function removeLocal(key){
    window.localStorage.removeItem(key);
}


//按需暴露
export { getLocal,setLocal,removeLocal};