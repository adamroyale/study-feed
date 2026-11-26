# Sending progress to a Google Sheet

The site can log every quick-check answer and every finished deck to a private Google Sheet, so a parent can see progress from any device. The site sends only a random device id, card ids, right or wrong, scores and timestamps. No name, no typed text.

The Sheet and the script run under your Google account, so the deploy step has to be done by you. It takes about five minutes.

## 1. Open the Sheet

Use the **Study Feed Progress** spreadsheet in the School 2026-27 folder (or any empty Google Sheet you own).

## 2. Paste the script

1. In the Sheet, open **Extensions → Apps Script**.
2. Delete whatever is in the editor and paste the whole contents of `apps-script/Code.gs` from this repo.
3. Click the save icon.

## 3. Run setup once

1. In the function dropdown at the top, choose **setup**, then click **Run**.
2. Google asks you to authorize the script. Choose your account, click **Advanced → Go to (project name)**, then **Allow**. This is your own script asking for access to your own Sheet.
3. Back in the Sheet you should now see tabs named **events**, **sessions**, **devices** and **summary**.

## 4. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. "Anyone" is needed because the student's browser posts to it without signing in. The script only appends rows and never returns data, so nothing in the Sheet is exposed.
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

## 5. Connect the site

Open `assets/config.js` in this repo and set `endpoint` to the URL you copied:

```js
window.SF_CONFIG = {
  endpoint: "https://script.google.com/macros/s/.../exec",
  key: "studyfeed"
};
```

Commit and push. Or paste the URL into the chat and it will be added for you.

From then on the site queues events in the browser and sends them in small batches. If the phone is offline, events wait and are sent later.

## 6. Label the device

Open the Progress page on the student's phone once. It shows that phone's **device id**. In the Sheet's **devices** tab, type a label like "her phone" next to that id so you can tell devices apart. The label lives only in your Sheet.

## Parent mode

On the Progress page, turn on **parent mode** before you try the feed yourself. While it is on, nothing is saved or sent.

## Changing the script later

If you edit `Code.gs`, use **Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy**. The URL stays the same. A brand-new deployment gets a new URL and you would need to update `config.js` again.
