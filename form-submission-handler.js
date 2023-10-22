document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".gform");
  var sectionExtra = document.getElementById("section_extra");
  var loginButton = document.getElementById("login-button");
  var messageText = document.getElementById("message-text");

  // Hide message-text initially
  if (messageText) {
    messageText.style.display = "none";
  }

  loginButton.addEventListener("click", function (event) {
    // Check if the input fields are empty
    var nameInput = document.getElementById("name");
    var messageInput = document.getElementById("message");

    if (nameInput.value.trim() === "" || messageInput.value.trim() === "") {
      event.preventDefault(); // Prevent the form from submitting
      return;
    }

    // Hide section_extra when the login button is clicked
    if (sectionExtra) {
      sectionExtra.style.display = "none";
    }

    // Show the message text under the login button
    if (messageText) {
      messageText.style.display = "block";

      // Hide the message text after 3 seconds
      setTimeout(function () {
        messageText.style.display = "none";
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  });

  form.addEventListener("submit", handleFormSubmit, false);

  function handleFormSubmit(event) {
    var formData = getFormData(form);

    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
      return false;
    }

    disableAllButtons(form);
    var url = form.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        form.reset();
        var formElements = form.querySelector(".form-elements");
        if (formElements) {
          formElements.style.display = "none"; // hide form
        }
        var thankYouMessage = document.getElementById("thankyou_message");
        if (thankYouMessage) {
          thankYouMessage.style.display = "block"; // display thank you message
        }
      }
    };

    var encoded = Object.keys(formData.data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(formData.data[k]);
    }).join('&');
    xhr.send(encoded);
  }

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  

  // Rest of your code...
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
      var preloader = document.querySelector(".preloader");
      preloader.classList.add("fade-out");
      setTimeout(function () {
          preloader.style.display = "none";
      }, 150); // Adjust the timing to match your fade-out duration
  }, 3000); // Adjust the timing for 5 seconds (5000 milliseconds)
});




(function() {
  // get all data in form and return object
  function getFormData(form) {
    var elements = form.elements;
    var honeypot;

    var fields = Object.keys(elements).filter(function(k) {
      if (elements[k].name === "honeypot") {
        honeypot = elements[k].value;
        return false;
      }
      return true;
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });

    var formData = {};
    fields.forEach(function(name){
      var element = elements[name];
      
      // singular form elements just have one value
      formData[name] = element.value;

      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail
      = form.dataset.email || ""; // no email by default

    return {data: formData, honeypot: honeypot};
  }

  function handleFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
      return false;
    }

    disableAllButtons(form);
    var url = form.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          form.reset();
          var formElements = form.querySelector(".form-elements")
          if (formElements) {
            formElements.style.display = "none"; // hide form
          }
          var thankYouMessage = form.querySelector(".thankyou_message");
          if (thankYouMessage) {
            thankYouMessage.style.display = "block";
          }
        }
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
  }
  
  function loaded() {
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();






