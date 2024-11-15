
console.log("dddddddddddd")
console.log("dddddddddddd")


class General {
    constructor() {

        this.domain="https://lagproperty.onrender.com/api/v1/"
        this.token=localStorage.getItem("token")
    }
  
    postData(path, data) {

        const token=this.token||''

        try {   
            $.ajax({
                url: this.domain + path,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                beforeSend: () => {
                  // Show the loader
                  this.showLoader();
                },
                success: function(response) {
                  console.log('Request successful:', response);
                  //this.hideLoader();

                },
                error: function(error) {
                  console.error('Request failed:', error);
                 // this.hideLoader();

                }
              });
            
        } catch (error) {
          this.hideLoader();

        } 

    }

    showLoader() {
      document.getElementById("loginForm").classList.add("loading");

      
    }
  
    hideLoader() {
      document.getElementById("loginForm").classList.remove("loading");
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


      console.log("aaaaaaaaaaaaa")
      const form = document.getElementById('loginForm');

      form.addEventListener('submit', function (event) {
          event.preventDefault(); // Prevent the default form submission
  
          // Get the input values
          const email = document.getElementById('emailInput').value;
          const password = document.getElementById('passwordInput').value;
  
          // Check if both fields are filled
          if (!email || !password) {
              alert('Both fields are required.');
              return;
          }
  
          // Proceed with the submission (you can send the data to the server here)
          const data = {
              email: email,
              password: password
          };
  
          console.log('Form submitted:', data);
  
          // Here you can call a function to send the data via AJAX or fetch
          myGeneral.postData('your-api-endpoint', data);
      });


    } 




});
