


class General {
    constructor() {

        this.domain="https://lagproperty.onrender.com/api/v1/"
        this.token=localStorage.getItem("token")
        this.restrictedPaths = ["/login"];
        this.navigateM=this.navigateM.bind(this)
        this.postData=this.postData.bind(this)
        this.runFirst()
    }
    

    isTokenAvailable() {
      return !!localStorage.getItem("token");
    }
    runFirst(){  

      const basePath = this.getBasePath(window.location.pathname); 



      // Check if the current path is in the restricted paths and if the token is available
      if (this.restrictedPaths.includes(basePath) && this.isTokenAvailable()) {
        // Redirect to home page
        //window.location.href = "/index.html";
        this.navigateM("/index.html")
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

                  console.log(buttonL)
                  console.log(button)

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

  
    navigateM(path){
        window.location.href=path
    }
    getBasePath(path) {
      // Remove the ".html" extension if it exists
      const basePath = path.replace(/\.html$/, "");
      // Return the path without extension (e.g., "/login.html" => "/login")
      return basePath;
    }

  }
  
  const myGeneral = new General();
  
  

  
  document.addEventListener("DOMContentLoaded", function () {

    const currentPath = window.location.pathname;
    const basePath = myGeneral.getBasePath(currentPath); 


  if (basePath === "/login") {
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
          emailAddress:"mosesogbonn68@gmail.com",
          password:"admin100",
          image:"sssss",
          privilege:"admin",
          type:"admin"
        }*/

        console.log('Form submitted:', data);

        myGeneral.postData('auth/loginUser', data, "loginButton", "loginButtonL");
    });


  }   
  else if (basePath === "/index") {

    $('#Logout').click(function () {
      myGeneral.logout()z
    })

    $("#profileid").attr('src', 'assets/img/profile.jpg');
    const user= JSON.parse(localStorage.getItem("user"))
    console.log(user)
    $("#userEmail").text(user.emailAddress) 
    $("#userName").text(user.firstName+" "+user.lastName)
  }




});
