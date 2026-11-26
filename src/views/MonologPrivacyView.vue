<script setup lang="ts">
import MonologPolicyShell from '@/components/monolog/MonologPolicyShell.vue'
</script>

<template>
  <MonologPolicyShell
    title="Monolog Privacy Policy"
    updated-label="Last updated 26 November 2026"
    updated-datetime="2026-11-26"
    canonical-url="https://monolog.notokens.co/privacy"
    alternate-label="Terms of Use"
    alternate-to="/monolog/tos"
  >
    <p>
      NoTokens provides Monolog. This policy covers the Monolog Android app and its official website (<a href="https://monolog.notokens.co/" target="_blank" rel="noopener noreferrer">monolog.notokens.co</a>). Contact <a href="mailto:monolog@notokens.co">monolog@notokens.co</a> for privacy questions or requests.
    </p>

    <h2>Keyboard, writing and journal</h2>
    <p>
      When Monolog is your active keyboard, it receives the text you type. Android may also provide selected or nearby text in the current field. Monolog uses this information to enter text, provide suggestions, check for sensitive material and perform actions you request. Local typing suggestions, writing assistance and journal search use data on your device.
    </p>
    <p>
      If Journal memory is on, Monolog can save summaries of eligible drafts, including text you have not sent. Use Settings → Journal memory to control this. Incognito and protected fields limit what Monolog saves and which features can use the current text. Your saved notes, media, reminders and personal dictionary stay on your device unless you choose to share, export or back up content. NoTokens does not use your typing, voice recordings or journal content to train models.
    </p>

    <h2>Microphone, screenshots and clipboard</h2>
    <p>
      Microphone access supports voice typing and voice notes when you start recording. Downloaded voice packs process speech on your device. If you select Android speech recognition, the app requests the device’s on-device recognition service. Audio is kept with voice notes you choose to save. You can revoke microphone access in Android settings.
    </p>
    <p>
      Quick Capture uses Android Accessibility if you enable it. It requests a screenshot when you activate capture and may use the position of Android’s accessibility shortcut to place its menu nearby. Screenshots and accompanying notes are kept when you save them. You can discard a capture or disable the service in Android settings.
    </p>
    <p>
      Clipboard history is optional and off by default. Clipboard history uses copied text and images for pasting. If clipboard action suggestions are enabled, Monolog can also read copied information to suggest an action. Unpinned history expires after one hour. Pinned items remain until removed or cleared. Android manages its system clipboard separately. If you enable system spell checking in Monolog, the selected Android spell-checking service may receive the word being checked.
    </p>

    <h2>Online services</h2>
    <p>
      If you request web results, Monolog sends your query or a search term derived from it to Wikipedia or the web provider available for that feature. If you open an action or search in another app, Monolog passes information needed for that action, such as a search term, phone number or email address. The receiving app handles that information under its own privacy practices.
    </p>
    <p>
      If you enable local weather, Android supplies location information while Monolog is in use. Rounded coordinates are sent to MET Norway for the forecast and can be used by Android’s place-name service. MET Norway logs the request, including the coordinates and IP address. You can disable weather or revoke location permission.
    </p>
    <p>
      Model and language-pack providers receive ordinary network information, including your IP address, when you download assets. Google’s on-device image recognition, translation and summarization components process content on your device. They can contact Google for model or service updates. The current Android build disables the upload channel these components use for usage and performance diagnostics. Earlier test builds may send those diagnostics to Google.
    </p>

    <h2>Optional Google Drive backup</h2>
    <p>
      When you connect Google Drive, Monolog uses your Google account name, email address, account identifier and authorization to connect to the selected account. If you enable backup, Monolog encrypts the selected journal content and attachments on your device before sending them to your Google Drive. You choose what to back up and when. Disconnecting stops future backup access. You can remove existing backup files separately in Google Drive.
    </p>

    <h2>Website and support</h2>
    <p>
      The Monolog website runs its interactive previews in your browser tab. The website host receives standard request information, such as your IP address and the pages requested, to serve and protect the site. If you contact NoTokens, we use your email address, message and any information you send to respond and follow up. We keep correspondence as needed to resolve your request, maintain relevant records or meet legal obligations.
    </p>
    <p>
      If you join the waitlist on <a href="https://monolog.notokens.co/#waitlist" target="_blank" rel="noopener noreferrer">monolog.notokens.co</a>, we store your email address and signup time in Upstash Redis so NoTokens can send Monolog Android launch updates. To prevent abuse, we also use a short-lived identifier derived from your IP address. Email us to leave the waitlist or request deletion.
    </p>

    <h2>Subscriptions</h2>
    <p>
      Subscriptions are planned. Terms shown at checkout will explain the plan, price and renewal. If you subscribe through Google Play once plans are available, Google Play handles payment. NoTokens does not receive your card details for Google Play purchases. Purchase identifiers and subscription status may be used to grant access, restore your purchase and resolve billing issues. We will update this policy before subscriptions launch if billing introduces additional data handling.
    </p>

    <h2>Your controls and data retention</h2>
    <p>
      Saved journal content stays on your device until you remove it or clear app storage. Use Settings → Privacy &amp; data → Clear local data to delete the local journal and reminders. Android’s Clear storage option removes Monolog’s remaining local settings, files and downloaded models. To remove Drive backups, open Google Drive settings and delete Monolog’s hidden app data. Disconnecting Monolog or uninstalling it leaves backups in Drive for you to remove separately.
    </p>
    <p>
      Monolog uses encrypted connections for the online features described above. If you have questions or wish to request access, correction or deletion of personal information held by NoTokens, email <a href="mailto:monolog@notokens.co">monolog@notokens.co</a>. We may ask for information to verify the request. Privacy rights depend on where you live. The latest policy and its update date are available on the Monolog website.
    </p>
  </MonologPolicyShell>
</template>
