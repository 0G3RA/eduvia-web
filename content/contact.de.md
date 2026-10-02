# Kontakt

Sie erreichen uns per E-Mail an <thevaltorna@gmail.com> oder über dieses Formular. Beides landet an derselben Stelle, und wir antworten an die Adresse, die Sie angeben.

<form id="contact-form" novalidate>
  <p>
    <label for="contact-name">Ihr Name (optional)</label><br>
    <input id="contact-name" name="name" type="text" autocomplete="name" maxlength="100"
           style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="contact-email"><strong>Ihre E-Mail-Adresse, damit wir antworten können</strong></label><br>
    <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254"
           placeholder="you@example.com" style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="contact-message"><strong>Ihre Nachricht</strong> (10 bis 2000 Zeichen)</label><br>
    <textarea id="contact-message" name="message" rows="6" minlength="10" maxlength="2000" required
              style="width:100%;max-width:28rem;padding:.5rem;font:inherit"></textarea>
  </p>
  <p style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden" aria-hidden="true">
    <label for="contact-website">Bitte leer lassen</label>
    <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off">
  </p>
  <p><button type="submit" style="padding:.6rem 1.2rem;font:inherit">Nachricht senden</button></p>
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
      show("Bitte geben Sie eine gültige E-Mail-Adresse an, damit wir antworten können.");
      email.focus();
      return;
    }
    if (message.value.trim().length < 10) {
      show("Bitte schreiben Sie eine Nachricht mit mindestens 10 Zeichen.");
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
        show("Danke, Ihre Nachricht ist angekommen. Wir antworten an die angegebene Adresse.", true);
      } else if (res.status === 429) {
        show("Von Ihrem Anschluss kamen gerade viele Nachrichten. Bitte versuchen Sie es in einer Stunde erneut oder schreiben Sie an " + MAIL + ".");
      } else if (res.status === 400) {
        show("Die Nachricht konnte nicht angenommen werden. Bitte prüfen Sie die E-Mail-Adresse und die Länge der Nachricht (10 bis 2000 Zeichen).");
      } else {
        show("Das hat nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an " + MAIL + ".");
      }
    }, function () {
      show("Das hat nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an " + MAIL + ".");
    });
  });
})();
</script>

Was mit Ihren Angaben geschieht: Wir speichern Ihren Namen (falls angegeben), Ihre E-Mail-Adresse, Ihre Nachricht und den Zeitpunkt, um Ihnen zu antworten, und löschen sie nach 60 Tagen automatisch. Ihre IP-Adresse speichern wir nicht. Einzelheiten stehen in der [Datenschutzerklärung](https://geteduvia.com/privacy/de/), Abschnitt 3.10.

Verantwortlich: Oleh Herasymenko, Röntgenstraße 5, 88048 Friedrichshafen, Deutschland. E-Mail: <thevaltorna@gmail.com>
