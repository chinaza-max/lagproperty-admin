


class General {
    constructor() {

        this.domain="https://lagproperty.onrender.com/api/v1/"
        this.token=localStorage.getItem("token")
        this.restrictedPathsNoLogin = ["login"];
        this.navigateM=this.navigateM.bind(this)
        this.postData=this.postData.bind(this)
        this.runFirst()
    }
    

    isTokenAvailable() {
      return !!localStorage.getItem("token");
    }
    runFirst(){  

      const basePath = this.getBasePath(window.location.pathname);  
      console.log(this.isTokenAvailable())


      // Check if the current path is in the restricted paths and if the token is available
      if (this.restrictedPathsNoLogin.includes(basePath) && this.isTokenAvailable()) {
        // Redirect to home page
        //window.location.href = "/index.html";
        this.navigateM("/index.html")
      }
      else if(this.restrictedPathsNoLogin.includes(basePath) === this.isTokenAvailable()){

        this.navigateM("/login.html")
      }


    } 
    removeItemFromLocalStorage(key) {
      localStorage.removeItem(key);
    }
    logout(){

      localStorage.removeItem("token")
      this.navigateM("/login.html")

    }

    postData(path, data , button , buttonL) {


      $("#errorMessage").text("")

        if (!navigator.onLine) {

            $("#errorMessage").text("You are offline")

            $(`#${buttonL}`).hide();
            $(`#${button}`).show();

            return    

        }
        const token=this.token||''

        try {   
            $.ajax({
                url: this.domain + path,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                success: (response) => {
                  //this.hideLoader();
                  const response2=response.data


                  $(`#${buttonL}`).hide();
                  $(`#${button}`).show();

                  if(path==='auth/loginUser'){
                   
                    $.notify({
                      icon: 'icon-check',
                      title: 'success',
                      message: 'welcome to lagproperty',
                    },{
                      type: 'success',
                      placement: {
                        from: "top",
                        align: "right"
                      },
                      time: 400,
                    });

                    setTimeout(() => {
                     

                      localStorage.setItem("token",response2.token )
                      localStorage.setItem("user",JSON.stringify(response2.user) )
  
                      this.navigateM("index.html")

                    }, 2000);
               

                  }
                },
                error: function(error) {

             

                  $(`#${buttonL}`).hide();
                  $(`#${button}`).show();

                  if(path==='auth/loginUser'){
                    $("#errorMessage").text(error.responseJSON.message)
                  }

                }
              });
            
        } catch (error) {
          $(`#${buttonL}`).hide();
          $(`#${button}`).show();

        } 

    }


    getData( path , callback ,query  ,loader) {


        if (!navigator.onLine) {

          console.log("ddddddddddddddffffggggggg")
          $("#errorMessage").text("You are offline")
          return    

        }

        const token=this.token||''
        const queryString = query
        ? '?' + new URLSearchParams(query).toString()
        : '';



        try {   
            $.ajax({
                url: this.domain + path + queryString,
                type: 'GET',
                contentType: 'application/json',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                success: (response) => {
                  const response2=response.data


                  if(path==="user/getAllTrasaction"){

                    if(loader){
                      $(`#${loader}`).css('display', 'none');
                    }

                  }
                  callback(response2)

                },
                error: function(error) {


                  if(path==='auth/loginUser'){
                    $("#errorMessage").text(error.responseJSON.message)
                  }

                }
              });
            
        } catch (error) {
          console.log(error)


        } 

    }

  
    navigateM(path){
        window.location.href=path
    }
    getBasePath(path) {
      const fileName = path.split('/').pop();
      // Remove the ".html" extension if it exists
      const basePath = fileName.replace(/\.html$/, "");
      return basePath;
    }
    appendHtmlToDiv(htmlContent, divId) {
      const div = document.getElementById(divId);
      if (div) {
        div.innerHTML += htmlContent;
      } else {
        console.error(`Div with ID "${divId}" not found.`);
      }
    }
    generateTransactionTable(transactions) {

      if (!Array.isArray(transactions)) {
        console.error("Invalid transactions array.");
        return "";
      }
  
      return transactions
        .map(
          (transaction) => `
          <tr>
            <td scope="row">
              <button class="btn btn-icon btn-round btn-sm me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                </svg>
              </button>
              ${transaction.id}
            </td>
            <td scope="row">${transaction.type}</td>
            <td class="text-end">${transaction.date}</td>
            <td class="text-end">${transaction.amount}</td>
            <td class="text-end">
              <span class="badge ${
                transaction.status === "Completed" ? "badge-success" : "badge-warning"
              }">${transaction.status}</span>
            </td>
          </tr>`
        )
        .join("");
    }

  }
  
  const myGeneral = new General();
  
  

  
document.addEventListener("DOMContentLoaded", function () {

    const currentPath = window.location.pathname;
    const basePath = myGeneral.getBasePath(currentPath); 


  if (basePath === "login") {
    // Show the Loading button   
    const form = document.getElementById('loginForm');
    $(`#loginButtonL`).hide();

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        $("#loginButtonL").show();
        $("#loginButton").hide();


        // Get the input values
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

/*
        // Check if both fields are filled
        if (!email || !password) {
            alert('Both fields are required.');
            return;
        }*/

        // Proceed with the submission (you can send the data to the server here)
        const data = {
            emailAddress: email,
            password: password,       
            type:"admin"
        };

          
/*
        const data ={
          firstName:"chinaza",
          lastName:"ogbonna",
          emailAddress:"mosesogbonna68@gmail.com",
          password:"admin100",
          image:"sssss",
          privilege:"admin",
          type:"admin"
        }*/

        console.log('Form submitted:', data);

        myGeneral.postData('auth/loginUser', data, "loginButton", "loginButtonL");
    });


  }   
  else if (basePath === "index") {



    $('#Logout').click(function () {
      myGeneral.logout()
    })

    //$("#profileid").attr('src', 'assets/img/profile.jpg');
    const user= JSON.parse(localStorage.getItem("user"))
    $("#userEmail").text(user.emailAddress) 
    $("#userName").text(user.firstName+" "+user.lastName)
    $("#userName2").text(user.firstName)
    $('.my-avatar').attr('src',user.image);

    function callback(data){
    
      $("#Owner").text(data.propertyManagerCount)
      $("#Building").text(data.BuildingCount)
      $("#Tenant").text(data.tenantCount)
      $("#PropectiveT").text(data.prospectiveTenantCount)

    }

    function callback2(data){
      $("#Escrow").text("₦" + data.totalEscrowBalance)
    }

    function callback3(data){
      $("#Balance").text("₦" + data.currentBalance)

    }

    function callback4(data){
      console.log(data.length)


      data = [
        {
          id: "#10231-23333-3333939",
          type: "commission",
          date: "Mar 19, 2020, 2.45pm",
          amount: "$250.00",
          status: "Completed",
        },
        {  
          id: "#10232-23333-3333940",
          type: "payment",
          date: "Mar 20, 2020, 1.15pm",
          amount: "$300.00",
          status: "Pending",
        },
      ];
      if(data.length>0){
        $('#alertTransaction').css('display', 'none');

      }
      else{

      }
    }

    const query={
      limit:20
    }

    myGeneral.getData("user/getCount", callback)
    myGeneral.getData("user/getTotalEscrowBalance", callback2)
    myGeneral.getData("user/getIncome", callback3)
    myGeneral.getData("user/getAllTrasaction", callback4, query,"loader")


  }




});
