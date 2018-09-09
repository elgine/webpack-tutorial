
window.onload = function(){
    var confirmBtn = document.createElement("button"),
        cancelBtn = document.createElement("button");
    confirmBtn.innerText = "Confirm";
    cancelBtn.innerText = "Cancel";
    confirmBtn.addEventListener("click", function(e){
        import("./confirm").then((confirm)=>{
            confirm.default();
        });
    });
    cancelBtn.addEventListener("click", function(e){
        import("./cancel").then((cancel)=>{
            cancel.default();
        });
    });
    document.body.appendChild(confirmBtn);
    document.body.appendChild(cancelBtn);
}