document.addEventListener("DOMContentLoaded", function () {
  // Check if we are on the correct page
  if (document.body.classList.contains("page-id-571")) {
    const button = document.getElementById("singpassButton");

    if (button) {
      button.addEventListener("click", function () {
        console.log("The Singpass button is pressed");

        // Redirect to Singpass login URL
        window.location.href = "/?option=oauthredirect&app_name=SingPass";
      });
    } else {
      console.log("Button not found. Check selector.");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const isSingPassRedirect = urlParams.get("singpass") === "true";

  if (document.body.classList.contains("page-id-571") && isSingPassRedirect) {
    removeQueryParameter("singpass");

    fetch(singpass_ajax.ajax_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ action: "singpass_button_pressed" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          populateNinjaFormFields(data.data.data);
        } else {
          console.error("Failed to retrieve data:", data.data);
          alert("An error has occurred. Please try again or manually fill up the form.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error has occurred. Please try again or manually fill up the form.");
      });
  }
});

function populateNinjaFormFields(data) {
  // Ensure jQuery is loaded
  if (typeof jQuery === "undefined") {
    console.error("jQuery is not loaded");
    return;
  }

  // Use jQuery to select and update the form fields
  const $ = jQuery;

  const fullNameField = $('input[name="full_name"]');
  const emailField = $('input[name="email"]');
  const mobileNoField = $('input[name="mobile_no"]');
  const dateOfBirthField = $("input.date_of_birth");
  const nricFinField = $('input[name="nric_fin"]');
  // const sexField = $("select.sex");
  // const nationalityField = $("select.nationality");
  // const raceField = $("select.race");
  const addressField = $('input[name="address"');
  const postalCodeField = $('input[name="postal_code"]')

  if (fullNameField.length) {
    fullNameField.val(data.full_name).trigger("input").trigger("change");
  }

  if (emailField.length) {
    emailField.val(data.email).trigger("input").trigger("change");
  }

  if (mobileNoField.length) {
    mobileNoField.val(data.mobile_no).trigger("input").trigger("change");
  }

  if (dateOfBirthField.length) {
    dateOfBirthField.val(data.date_of_birth).trigger("input").trigger("change");
  }

  if (nricFinField.length) {
    nricFinField.val(data.uinfin).trigger("input").trigger("change");
  }

  // if (sexField.length) {
  //   sexField.val(data.sex).trigger("input").trigger("change");
  // }

  // if (nationalityField.length) {
  //   nationalityField.val(data.nationality).trigger("input").trigger("change");
  // }

  // if (raceField.length) {
  //   raceField.val(data.race).trigger("input").trigger("change");
  // }

  if (addressField.length) {
    addressField.val(data.address).trigger("input").trigger("change");
  }

  if (postalCodeField.length) {
    postalCodeField.val(data.postal_code).trigger("input").trigger("change");
  }

  // Lock fields after populating them
  lockFieldsIfFilled();
}

function lockFieldsIfFilled() {
  const $ = jQuery;

  const fullNameField = $('input[name="full_name"]');
  const dateOfBirthField = $("input.date_of_birth");
  const nricFinField = $('input[name="nric_fin"]');
  // const sexField = $("select.sex");
  // const nationalityField = $("select.nationality");
  // const raceField = $("select.race");
  const addressField = $('input[name="address"');
  const postalCodeField = $('input[name="postal_code"]');

  if (fullNameField.length && fullNameField.val()) {
    fullNameField.prop("disabled", true).css("background-color", "#e0e0e0");
  }

  if (dateOfBirthField.length && dateOfBirthField.val()) {
    dateOfBirthField.prop("disabled", true).css("background-color", "#e0e0e0");
  }

  if (nricFinField.length && nricFinField.val()) {
    nricFinField.prop("disabled", true).css("background-color", "#e0e0e0");
  }

  // if (sexField.length && sexField.val()) {
  //   sexField.prop("disabled", true).css("background-color", "#e0e0e0");
  // }

  // if (nationalityField.length && nationalityField.val()) {
  //   nationalityField.prop("disabled", true).css("background-color", "#e0e0e0");
  // }

  // if (raceField.length && raceField.val()) {
  //   raceField.prop("disabled", true).css("background-color", "#e0e0e0");
  // }

  if (addressField.length && addressField.val()) {
    addressField.prop("disabled", true).css("background-color", "#e0e0e0");
  }

  if (postalCodeField.length && postalCodeField.val()) {
    postalCodeField.prop("disabled", true).css("background-color", "#e0e0e0");
  }
}

function removeQueryParameter(param) {
  const url = new URL(window.location);
  url.searchParams.delete(param);
  window.history.replaceState(null, "", url);
}
