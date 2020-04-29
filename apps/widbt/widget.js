(function(){
var img_bt = E.toArrayBuffer(atob("CxQBBgDgFgJgR4jZMawfAcA4D4NYybEYIwTAsBwDAA=="));
  
function draw() {
  g.reset();
  if (NRF.getSecurityStatus().connected) 
    E.showMessage("","ONLINE"); 
    g.setColor(0,0.5,1);
  else 
    E.showMessage("Equipamento \n Sem cobertura...\n","OFFLINE");
    g.setColor(0.3,0.3,0.3);
    g.drawImage(img_bt,10+this.x,2+this.y); 
}
function changed() {
  WIDGETS["bluetooth"].draw();
  g.flip();// turns screen on
}
NRF.on('connect',changed);
NRF.on('disconnect',changed);
WIDGETS["bluetooth"]={area:"tr",width:24,draw:draw};
})()
