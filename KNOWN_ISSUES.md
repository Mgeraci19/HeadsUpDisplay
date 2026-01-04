# Known Issues

## Google Calendar Embed - Some Events Not Displayed

**Status:** Open

**Description:**
Some calendar events do not appear in the Google Calendar embed, even when they are confirmed to be on the primary calendar. This has been observed with meeting invites (e.g., flight bookings).

**Symptoms:**
- Event exists on the primary Google Calendar
- Event is visible when viewing the calendar directly in Google Calendar
- Event does not appear in the embedded AGENDA or WEEK view on the dashboard

**Possible Causes:**
- Google Calendar embed may not display certain event types (e.g., events created from email parsing, travel reservations)
- Meeting invites that haven't been explicitly "accepted" may not show
- Events with special metadata or imported from external sources may be filtered

**Workarounds:**
- Check the event directly in Google Calendar
- Consider using Google Calendar API instead of the embed for more control (requires API key setup)

**Potential Future Fix:**
Replace the iframe embed with a proper Google Calendar API integration that fetches and displays events directly. This would give full control over which events are shown.
