var handles=[];
//Get the search terms and generate the input fields
$.get("/getTerms",function(data){
  for(i=0;i<data.length;i++){
    handles.push(data[i].handle);
  }
  for(i=0;i<handles.length;i++){
    temp="<tr><td><input type='text' class='form-control' data-new='no' value='"+handles[i]+"'></td><td><input class='form-control' type='checkbox' id='"+i+"'></td></tr>";
    $("#handlesContainter").append(temp);
  }
});

//Handle creating a new input field for additional terms
$("#add").click(function(){
  temp="<tr><td><input type='text' data-new='yes' class='form-control'></td><td><input class='form-control' type='checkbox' value='new'></td></tr>";
  $("#handlesContainter").append(temp);
});

//Handle the update by creating a new list of search terms and posting to /updateTerms
$("#update").click(function(){
  $("input").each(function(data,obj){
    type=$(obj).attr("type");
    newHandle=$(obj).attr("data-new");
    val=$(obj).val();
    if(type=="text"){
      if(newHandle=='no'){
        temp="#"+(data/2).toString();
        if($(temp).is(":checked")){
          handles[data/2]="";
        }
        else{
          handles[data/2]=val;
        }
      }
      else if(val!="" && handles.indexOf(val)==-1){
        handles.push(val)
      }
    }
  });
  for(i=0;i<handles.length;i++){
    if(handles[i]==""){
      handles.pop(i)
    }
  }
  $.post("/updateTerms",{"newTerms":handles});
  location.reload();
});

//Hide UAC and password modal when clicked outside of
window.onclick = function (event) {
    if (event.target == $("#generalAccount")[0] ){
        $("#generalAccount").fadeOut();
    }
    else if (event.target == $("#passwordChange")[0] ){
        $("#passwordChange").fadeOut();
    }
}

//Get user info to show in UAC panel
$("#generalUAC").click(function(){
  $.get("/getUser",function(data){
    $("#usersName").val(data.name);
    $("#uName").val(data.uname);
    $("#email").val(data.email);
    $("#generalAccount").fadeIn();
  });
});

//Show password change panel
$("#changePassword").click(function(){
  $("#passwordChange").fadeIn();
});

//Validate input from password form and post to /updatePassword
$('#passwordForm').click(function(ev) {
  current=$("#current").val();
  newPass=$("#newPass").val();
  newPass2=$("#newPass2").val();
  console.log(current+newPass)
  if(current==newPass){
    $("#message").text("New password Matches old password");
  }
  else if(newPass!=newPass2){
    $("#message").text("New passwords do not match");
  }
  else{
    $("#message").text("Updating Password");
    $.post("/updatePassword",{currentPassword:current,newPassword:newPass});
  }
});
