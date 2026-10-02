# Contact

You can reach us by email at <thevaltorna@gmail.com> or through this form. Both reach the same place, and we reply to the address you give.

<form id="contact-form" novalidate>
  <p>
    <label for="contact-name">Your name (optional)</label><br>
    <input id="contact-name" name="name" type="text" autocomplete="name" maxlength="100"
           style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="contact-email"><strong>Your email address, so we can reply</strong></label><br>
    <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254"
           placeholder="you@example.com" style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="contact-message"><strong>Your message</strong> (10 to 2000 characters)</label><br>
    <textarea id="contact-message" name="message" rows="6" minlength="10" maxlength="2000" required
              style="width:100%;max-width:28rem;padding:.5rem;font:inherit"></textarea>
  </p>
  <p style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden" aria-hidden="true">
    <label for="contact-website">Leave this empty</label>
    <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off">
  </p>
  <p><button type="submit" style="padding:.6rem 1.2rem;font:inherit">Send the message</button></p>
  <p id="contact-result" role="status" hidden></p>
</form>

<script>
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var out = document.getElementById("contact-result");
  var button = form.querySelector("button");
  var MAIL = "thevaltorna@gmail.com";
  function show(text, done) {
    out.hidden = false;
    out.textContent = text;
    button.disabled = !!done;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("contact-email");
    var message = document.getElementById("contact-message");
    if (!email.value.trim() || email.validity.typeMismatch) {
      show("Please enter a valid email address so we can reply.");
      email.focus();
      return;
    }
    if (message.value.trim().length < 10) {
      show("Please write a message of at least 10 characters.");
      message.focus();
      return;
    }
    button.disabled = true;
    fetch("https://api.geteduvia.com/public/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("contact-name").value,
        email: email.value,
        message: message.value,
        honeypot: document.getElementById("contact-website").value
      })
    }).then(function (res) {
      if (res.status === 202) {
        form.reset();
        show("Thank you, your message has arrived. We will reply to the address you gave.", true);
      } else if (res.status === 429) {
        show("Many messages came from your connection just now. Please try again in an hour, or write to " + MAIL + ".");
      } else if (res.status === 400) {
        show("The message could not be accepted. Please check the email address and the length of the message (10 to 2000 characters).");
      } else {
        show("That did not work. Please try again later, or write to " + MAIL + ".");
      }
    }, function () {
      show("That did not work. Please try again later, or write to " + MAIL + ".");
    });
  });
})();
</script>

What happens to what you send: we store your name (if you give one), your email address, your message and the time, in order to reply to you, and delete them automatically after 60 days. We do not store your IP address. The details are in the [Privacy Policy](https://geteduvia.com/privacy), Section 3.10.

Controller: Oleh Herasymenko, Röntgenstraße 5, 88048 Friedrichshafen, Deutschland. Email: <thevaltorna@gmail.com>
