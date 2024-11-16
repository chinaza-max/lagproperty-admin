


class General {
    constructor() {

        this.domain="https://lagproperty.onrender.com/api/v1/"
        this.token=localStorage.getItem("token")
    }
  
    postData(path, data , button , buttonL) {

        const token=this.token||''

        try {   
            $.ajax({
                url: this.domain + path,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                success: function(response) {
                  console.log('Request successful:', response);
                  //this.hideLoader();

                  $(`#${buttonL}`).hide();
                  $(`#${button}`).show();

                  if(path==="/login"){

                     // localStorage.setItem("token", )
                  }
                },
                error: function(error) {
                  console.error('Request failed:', error);
                 // this.hideLoader();

                 $(`#${buttonL}`).hide();
                 $(`#${button}`).show();

                }
              });
            
        } catch (error) {
          $(`#${buttonL}`).hide();
          $(`#${button}`).show();

        } 

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
  
          console.log('Form submitted:', data);

          myGeneral.postData('auth/loginUser', data, "loginButton", "loginButtonL");
      });


    } 




});
