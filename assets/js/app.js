var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");

Frames.init("pk_test_6b833183-61e2-40be-8dee-de9ef6065d72");

var logos = generateLogos();
function generateLogos() {
  var logos = {};
  logos["card-number"] = {
    src: "card",
    alt: "card number logo"
  };
  logos["expiry-date"] = {
    src: "exp-date",
    alt: "expiry date logo"
  };
  logos["cvv"] = {
    src: "cvv",
    alt: "cvv logo"
  };
  return logos;
}

var errors = {};
errors["card-number"] = "Please enter a valid card number";
errors["expiry-date"] = "Please enter a valid expiry date";
errors["cvv"] = "Please enter a valid cvv code";

Frames.addEventHandler(
  Frames.Events.FRAME_VALIDATION_CHANGED,
  onValidationChanged
);
function onValidationChanged(event) {
  var e = event.element;

  if (event.isValid || event.isEmpty) {
    if (e === "card-number" && !event.isEmpty) {
      showPaymentMethodIcon();
    }
    setDefaultIcon(e);
    clearErrorIcon(e);
    clearErrorMessage(e);
  } else {
    if (e === "card-number") {
      clearPaymentMethodIcon();
    }
    setDefaultErrorIcon(e);
    setErrorIcon(e);
    setErrorMessage(e);
  }
}

function clearErrorMessage(el) {
  var selector = ".error-message__" + el;
  var message = document.querySelector(selector);
  message.textContent = "";
}

function clearErrorIcon(el) {
  var logo = document.getElementById("icon-" + el + "-error");
  logo.style.removeProperty("display");
}

function showPaymentMethodIcon(parent, pm) {
  if (parent) parent.classList.add("show");

  var logo = document.getElementById("logo-payment-method");
  if (pm) {
    var name = pm.toLowerCase();
    logo.setAttribute("src", "assets/images/card-icons/" + name + ".svg");
    logo.setAttribute("alt", pm || "payment method");
  }
  logo.style.removeProperty("display");
}

function clearPaymentMethodIcon(parent) {
  if (parent) parent.classList.remove("show");

  var logo = document.getElementById("logo-payment-method");
  logo.style.setProperty("display", "none");
}

function setErrorMessage(el) {
  var selector = ".error-message__" + el;
  var message = document.querySelector(selector);
  message.textContent = errors[el];
}

function setDefaultIcon(el) {
  var selector = "icon-" + el;
  var logo = document.getElementById(selector);
  logo.setAttribute("src", "assets/images/card-icons/" + logos[el].src + ".svg");
  logo.setAttribute("alt", logos[el].alt);
}

function setDefaultErrorIcon(el) {
  var selector = "icon-" + el;
  var logo = document.getElementById(selector);
  logo.setAttribute("src", "assets/images/card-icons/" + logos[el].src + "-error.svg");
  logo.setAttribute("alt", logos[el].alt);
}

function setErrorIcon(el) {
  var logo = document.getElementById("icon-" + el + "-error");
  logo.style.setProperty("display", "block");
}

Frames.addEventHandler(
  Frames.Events.CARD_VALIDATION_CHANGED,
  cardValidationChanged
);
function cardValidationChanged(event) {
  payButton.disabled = !Frames.isCardValid();
}

Frames.addEventHandler(
  Frames.Events.CARD_TOKENIZATION_FAILED,
  onCardTokenizationFailed
);
function onCardTokenizationFailed(error) {
  console.log("CARD_TOKENIZATION_FAILED: %o", error);
  Frames.enableSubmitForm();
}

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, onCardTokenized);
function onCardTokenized(event) {
  // var el = document.querySelector(".success-payment-message");
  // el.innerHTML ="Completed";

    makePayment(event)


}

Frames.addEventHandler(
  Frames.Events.PAYMENT_METHOD_CHANGED,
  paymentMethodChanged
);
function paymentMethodChanged(event) {
  var pm = event.paymentMethod;
  let container = document.querySelector(".icon-container.payment-method");

  if (!pm) {
    clearPaymentMethodIcon(container);
  } else {
    clearErrorIcon("card-number");
    showPaymentMethodIcon(container, pm);
  }
}

form.addEventListener("submit", onSubmit);
function onSubmit(event) {
  event.preventDefault();
  Frames.submitCard();
}

function makePayment(state) {
    state.currency = document.getElementById("currency").value;
    state.amount = document.getElementById("amount").value;

    var xhr = new XMLHttpRequest();
    var url = "/checkout.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (json.status == 'Pending') {

                location.replace(json._links.redirect.href)

            } else {
                var el = document.querySelector(".success-payment-message");
                el.innerHTML ="Completed";

            }
        }
    };
    var data = JSON.stringify({"data": state});
    xhr.send(data);

} 
