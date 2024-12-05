document.addEventListener("DOMContentLoaded", function () {
  // Check if we are on the correct page
  if (document.body.classList.contains("page-id-571")) {
    const urlParams = new URLSearchParams(window.location.search);
    const buttonContainer = document.querySelector(".button-container");

    if (!buttonContainer) {
      // console.error(
      //   "Button container not found. Ensure it exists in the HTML."
      // );
      return;
    }
    // console.log("Button container found: ", buttonContainer);

    // Function to fetch and populate the Singpass button
    function populateButton() {
      if (!document.getElementById("singpassButton")) {
        // console.log("Attempting to fetch button.html...");
        fetch(`${singpass_ajax.theme_url}/button.html`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch button.html: ${response.statusText}`
              );
            }
            return response.text();
          })
          .then((html) => {
            // console.log("button.html fetched successfully. Injecting HTML...");
            buttonContainer.innerHTML = html;

            const button = document.getElementById("singpassButton");
            if (button) {
              // console.log("Button added successfully.");
              initializeButton(button);
            } else {
              // console.error("Button was not added. Check button.html content.");
            }
          })
          .catch((error) => {
            // console.error("Error loading button.html:", error);
          });
      } else {
        // console.log("Button already exists. Skipping populate.");
      }
    }

    // Function to remove the Singpass button
    function removeButton() {
      buttonContainer.innerHTML = "";
      // console.log("Button removed.");
    }

    // Function to initialize the Singpass button
    function initializeButton(button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        // console.log("The Singpass button is pressed");
        window.location.href = "/?option=oauthredirect&app_name=SingPass";
      });
    }

    // Function to handle form logic
    function handleFormLogic(form) {
      const formObserver = new MutationObserver(() => {
        const formStyle = window.getComputedStyle(form);
        if (formStyle.display === "none") {
          removeButton();
        } else {
          populateButton();
        }
      });

      formObserver.observe(form, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    // Observe DOM changes to detect when the Ninja Forms element is added
    const domObserver = new MutationObserver(() => {
      const form = document.querySelector("form"); // Adjust selector for Ninja Forms
      if (form) {
        // console.log("Form found:", form);
        handleFormLogic(form); // Handle form logic when form is found
        domObserver.disconnect(); // Stop observing once the form is found
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });

    // Checkbox observer for donor type logic
    const checkboxObserver = new MutationObserver(() => {
      const checkbox = document.querySelector(".donor_type");
      if (checkbox) {
        // console.log("Checkbox found:", checkbox);
        initializeCheckboxLogic();
        checkboxObserver.disconnect(); // Stop observing once the checkbox is found
      }
    });

    checkboxObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    function initializeCheckboxLogic() {
      const checkbox = document.querySelector(".donor_type");
      const button = document.getElementById("singpassButton");

      if (!checkbox) {
        // console.error("Checkbox not found. Ensure it exists in the DOM.");
        return;
      }

      if (!button) {
        // console.error("Button not found. Waiting for button to be added...");
        // Wait for the button to be added before initializing
        const buttonWaiter = new MutationObserver(() => {
          const newButton = document.getElementById("singpassButton");
          if (newButton) {
            // console.log("Button added. Initializing checkbox logic.");
            initializeCheckbox(checkbox, newButton);
            buttonWaiter.disconnect(); // Stop observing once the button is added
          }
        });

        buttonWaiter.observe(buttonContainer, { childList: true });
        return;
      }

      initializeCheckbox(checkbox, button);
    }

    function initializeCheckbox(checkbox) {
      // console.log("Initializing checkbox logic...");

      // Set initial state
      checkbox.checked ? removeButton() : populateButton();

      // Add event listener to toggle button visibility
      checkbox.addEventListener("change", function () {
        this.checked ? removeButton() : populateButton();
      });
    }

    // Additional logic for URL query parameters
    if (urlParams.has("nf_resume")) {
      // console.log("nf_resume detected. Button will not be shown.");
      removeButton();
      return;
    } else {
      populateButton();
    }

    if (urlParams.get("error") === "true") {
      removeQueryParameter("error");
      alert(
        "An error occurred during the Singpass login process. Please try again."
      );
    }

    if (urlParams.get("singpass") === "true") {
      removeQueryParameter("singpass");

      fetch(singpass_ajax.ajax_url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "singpass_button_pressed" }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // console.log("Singpass login successful.");
            populateNinjaFormFields(data.data.data);
          } else {
            // console.error("Failed to retrieve data:", data.data);
            alert(
              "An error has occurred. Please try again or manually fill up the form."
            );
          }
        })
        .catch((error) => {
          // console.error("Error:", error);
          alert(
            "An error has occurred. Please try again or manually fill up the form."
          );
        });
      removeQueryParameter("PHPSESSID");
    }
  }
});

function populateNinjaFormFields(data) {
  if (typeof jQuery === "undefined") {
    // console.error("jQuery is not loaded");
    return;
  }

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
  const postalCodeField = $('input[name="postal_code"]');

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
  window.history.replaceState(null, "", url); // Update URL without reloading
}
