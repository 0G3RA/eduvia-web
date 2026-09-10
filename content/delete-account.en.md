# Deleting your Eduvia account

Effective Date: 2026-09-10 · Version 1.0

You can delete your Eduvia account and everything stored with it. There are two ways: inside the App, which is immediate, and by writing to us, which is for people who no longer have the App installed.

This page exists because you should be able to find out how to leave without installing anything first.

## In the App: immediate

1. Open Eduvia and go to your **Profile**.
2. Scroll to the **Danger zone** section at the bottom.
3. Tap **Delete account** and confirm.

Deletion happens in this order: your sign-in record is deleted first, so access stops immediately; then all your data is deleted from the database; then we ask RevenueCat, our subscription service, to delete your customer record there. If a step fails, the App shows an error and asks you to try again. Partial deletion is never reported as success.

## Without the App: write to us

Send an email to <thevaltorna@gmail.com> **from the email address your Eduvia account uses**, with the subject "Delete my account".

We use the sending address to confirm that the request comes from the account holder. If we cannot match it to an account, we will ask you one question to identify it, and nothing else. We complete the deletion within 30 days and confirm it by email; in practice it takes a few days.

## Send a deletion request

Use this form, or simply email us. Both reach the same place. We reply to the address you give, confirm that it is yours, and delete the account within 30 days of the request; in practice it takes a few days.


<form id="deletion-form" novalidate>
  <p>
    <label for="deletion-email"><strong>The email address your Eduvia account uses</strong></label><br>
    <input id="deletion-email" name="email" type="email" autocomplete="email" required
           placeholder="you@example.com" style="width:100%;max-width:28rem;padding:.5rem;font:inherit">
  </p>
  <p>
    <label for="deletion-note">Anything that helps us find the account (optional)</label><br>
    <textarea id="deletion-note" name="note" rows="3" maxlength="500"
              style="width:100%;max-width:28rem;padding:.5rem;font:inherit"></textarea>
  </p>
  <p><button type="submit" style="padding:.6rem 1.2rem;font:inherit">Send the request</button></p>
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
      out.textContent = "Request received. Before we delete anything we confirm the request with the address it names, so please watch for our email. If you do not hear from us, write to thevaltorna@gmail.com.";
    }
  });
})();
</script>

## What is deleted

Everything we hold about you: your account and sign-in record, your profile and settings, every conversation transcript, the tutor's memory of you, your vocabulary, your progress and level history, your subscription record with us, and your customer record at RevenueCat.

## What is not, and why

- **Technical database backups** clear automatically within 7 days. We do not restore deleted accounts from backups.
- **A technical deletion marker** remains for 48 hours. It holds your user ID, your RevenueCat customer ID and a flag saying whether the RevenueCat deletion still has to complete. It exists so a request still in flight cannot recreate data of a deleted account. After 48 hours it stops working.
- **Server logs** delete themselves within 7 days, including after account deletion.

## Two things worth knowing before you delete

- **Your subscription is not cancelled automatically.** Deleting your Eduvia account does not cancel it and does not refund it, because it is billed by your app store and not by us. Cancel it separately first: on iOS in Settings → your name → Subscriptions, on Android in the Google Play app → Payments and subscriptions → Subscriptions.
- **Take your data first if you want it.** The App can export everything as a JSON file, from your Profile. After deletion, learning data cannot be recovered.

## Related

- [Privacy Policy](https://geteduvia.com/privacy)
- [Terms of Use](https://geteduvia.com/terms)

Controller: Oleh Herasymenko, Röntgenstraße 5, 88048 Friedrichshafen, Deutschland. Email: <thevaltorna@gmail.com>
