var LOCALE_startscreen = [
    "",
    "Start",
    "Shut down",
    "Reboot",
    "Change avatar",
    "Lock",
    "Exit",
    "Apps",
    "Start",
    "Personalization",
    "Tiles",
    "Help",
    "Desktop",
    "Pin on start screen",
    "Unpin from start screen",
    `
        <h1>This Windows 8.1 PC is no longer supported.</h1>
        <img src="../../../img/EOSNotify.png" alt="">
        <p>As of January 10, 2023, support for Windows 8.1 has come to end. This PC is more vulnerable to viruses and malware due to:</p>
        <ul>
            <li>No new security updates</li>
            <li>No new software updates</li>
            <li>No technical support</li>
        </ul>
        <p>
            Microsoft Store apps and games are no longer available for new downloads and in-app purchases can no longer be made. Installed apps and games will continue to receive publisher updates through June 30, 2023. See additional information in the FAQ by clicking Learn more.
        </p>
        <p>
            Microsoft strongly recommends using Windows 11 on a new PC for the latest security features and protection against malicious software.
        </p>
        <button onclick="CloseEOSNotify()">Close</button>
    `,
    "Resize",
    "Large",
    "Wide",
    "Medium",
    "Tiny",
    "Disable live tile",
    "Enable live tile",
    `
        <h1>We have some problems</h1>
        <p>There was some problem reading tiles from local storage and we had to restore the default tile configuration.<br>This could happen when updating to a new version of Okna8.</p>
        <div class="buttons">
            <button onclick="CloseMetroDialog(__ID__)">Close</button>
        </div>
    `,
]