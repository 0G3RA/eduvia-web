# Ihr Eduvia-Konto löschen

Gültig ab: 2026-09-10 · Version 1.0

Sie können Ihr Eduvia-Konto und alles, was damit gespeichert ist, löschen. Es gibt zwei Wege: in der App, dann geschieht es sofort, oder per E-Mail an uns, für den Fall, dass die App nicht mehr installiert ist.

Diese Seite gibt es, damit Sie sich informieren können, ohne vorher irgendetwas installieren zu müssen.

## In der App: sofort

1. Öffnen Sie Eduvia und gehen Sie zu Ihrem **Profil**.
2. Scrollen Sie ganz nach unten zum Abschnitt **Gefahrenzone**.
3. Tippen Sie auf **Account löschen** und bestätigen Sie.

Die Löschung läuft in dieser Reihenfolge ab: Zuerst wird Ihr Anmeldedatensatz gelöscht, der Zugang endet also sofort; dann werden alle Ihre Daten aus der Datenbank gelöscht; dann bitten wir RevenueCat, unseren Abonnementdienst, Ihren dortigen Kundendatensatz zu löschen. Schlägt ein Schritt fehl, zeigt die App einen Fehler und bittet Sie, es erneut zu versuchen. Eine teilweise Löschung wird nie als Erfolg gemeldet.

## Ohne die App: schreiben Sie uns

Senden Sie eine E-Mail an <thevaltorna@gmail.com> **von der E-Mail-Adresse, die Ihr Eduvia-Konto nutzt**, mit dem Betreff "Konto löschen".

Anhand der Absenderadresse stellen wir fest, dass die Anfrage vom Kontoinhaber stammt. Können wir sie keinem Konto zuordnen, stellen wir Ihnen genau eine Rückfrage zur Identifizierung und sonst nichts. Wir schließen die Löschung innerhalb von 30 Tagen ab und bestätigen sie per E-Mail; in der Praxis dauert es wenige Tage.

## Löschanfrage senden

Nutzen Sie dieses Formular oder schreiben Sie uns einfach eine E-Mail. Beides landet an derselben Stelle. Wir antworten an die angegebene Adresse, bestätigen, dass sie Ihnen gehört, und löschen das Konto innerhalb von 30 Tagen nach der Anfrage; in der Praxis dauert es wenige Tage.


<form id="deletion-form" novalidate>
  <p>
    <label for="deletion-email"><strong>Die E-Mail-Adresse, die Ihr Eduvia-Konto nutzt</strong></label><br>
    <input id="deletion-email" name="email" type="email" autocomplete="email" required
           placeholder="you@example.com" style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="deletion-note">Alles, was uns hilft, das Konto zu finden (optional)</label><br>
    <textarea id="deletion-note" name="note" rows="3" maxlength="500"
              style="width:100%;max-width:28rem;padding:.5rem;font:inherit"></textarea>
  </p>
  <p><button type="submit" style="padding:.6rem 1.2rem;font:inherit">Anfrage senden</button></p>
  <p id="deletion-result" role="status" hidden></p>
</form>

<script>
(function () {
  var form = document.getElementById("deletion-form");
  if (!form) return;
  var out = document.getElementById("deletion-result");
  var button = form.querySelector("button");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var field = document.getElementById("deletion-email");
    var email = field.value.trim();
    if (!email) { field.focus(); return; }
    button.disabled = true;
    fetch("https://api.geteduvia.com/public/account-deletion", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email, note: document.getElementById("deletion-note").value })
    }).then(show, show);
    function show() {
      out.hidden = false;
      out.textContent = "Anfrage erhalten. Bevor wir etwas löschen, bestätigen wir die Anfrage über die genannte Adresse; achten Sie also bitte auf unsere E-Mail. Sollten Sie nichts von uns hören, schreiben Sie an thevaltorna@gmail.com.";
    }
  });
})();
</script>

## Was gelöscht wird

Alles, was wir über Sie gespeichert haben: Konto und Anmeldedatensatz, Profil und Einstellungen, sämtliche Gesprächstranskripte, die Erinnerung des Tutors an Sie, Ihren Wortschatz, Ihren Fortschritt und Ihre Niveau-Historie, Ihren Abonnementdatensatz bei uns sowie Ihren Kundendatensatz bei RevenueCat.

## Was nicht, und warum

- **Technische Datenbank-Backups** löschen sich automatisch innerhalb von 7 Tagen. Gelöschte Konten stellen wir nicht aus Backups wieder her.
- **Ein technischer Löschvermerk** bleibt 48 Stunden bestehen. Er enthält Ihre Nutzerkennung, Ihre RevenueCat-Kundenkennung und einen Hinweis darauf, ob die Löschung bei RevenueCat noch abgeschlossen werden muss. Er verhindert, dass eine noch laufende Anfrage Daten eines gelöschten Kontos neu anlegt. Nach 48 Stunden wirkt er nicht mehr.
- **Server-Logs** löschen sich innerhalb von 7 Tagen, auch nach einer Kontolöschung.

## Zwei Dinge, die Sie vorher wissen sollten

- **Ihr Abonnement wird nicht automatisch gekündigt.** Das Löschen Ihres Eduvia-Kontos kündigt es nicht und erstattet es nicht, denn abgerechnet wird es über Ihren App-Store und nicht über uns. Kündigen Sie es vorher separat: unter iOS in Einstellungen → Ihr Name → Abonnements, unter Android in der Google-Play-App → Zahlungen und Abos → Abos.
- **Sichern Sie vorher Ihre Daten, wenn Sie sie behalten möchten.** Die App kann alles als JSON-Datei exportieren, aus Ihrem Profil heraus. Nach der Löschung lassen sich Lerndaten nicht wiederherstellen.

## Weiterführend

- [Datenschutzerklärung](https://geteduvia.com/privacy/de/)
- [Nutzungsbedingungen](https://geteduvia.com/terms/de/)

Verantwortlicher: Oleh Herasymenko, Röntgenstraße 5, 88048 Friedrichshafen, Deutschland. E-Mail: <thevaltorna@gmail.com>
