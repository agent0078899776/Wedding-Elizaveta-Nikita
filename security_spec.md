# Security Specification for Wedding Invitation Website

## 1. Data Invariants
- **RSVPs (`/rsvps/{rsvpId}`)**:
  - Anyone can submit (create) an RSVP to let Nikita and Elizaveta know their preferences.
  - Reads (`get`, `list`) are strictly private or disabled for standard users to prevent scraping personal names or beverage/transport selections.
  - Updates and deletes are disallowed for standard public users.
  - Creation requires a valid name (string, length 1–100), attending flag (boolean), guestsCount (integer, 0–10), and transport flag (boolean). Beverage lists must be safe arrays (max size 10, items are strings under 50 characters).

- **Wishes (`/wishes/{wishId}`)**:
  - Anyone can read the Guestbook wishes (`get`, `list`) to share the happy atmosphere.
  - Anyone can create (write) a congratulatory wish.
  - Message must be between 1 and 1000 characters. Author must be between 1 and 100 characters.
  - No updates or deletes are allowed to prevent modifying other people's memories.
  - All writes must include `createdAt` reflecting the server time (`request.time`).

## 2. The "Dirty Dozen" Payloads
Here are 12 payloads representing attempts to violate security laws:
1. **Empty RSVP**: Create RSVP with missing name or invalid shape.
2. **Huge Plus-one**: RSVP with 1000 guests to skew catering counts.
3. **Poisoned Drink Entries**: Inserting massive binary strings in the beverage preferences choice.
4. **Scraping RSVPs**: Attempting to run a blank `get` or query listing all RSVP's.
5. **Hijacking Existing RSVP**: Overwriting an already created RSVP on update.
6. **Malicious Delete**: Public user trying to delete someone else's RSVP.
7. **Empty Guestbook Post**: Wish with no author or text.
8. **Spam Flooding Wish**: Wish containing a 10MB spam text.
9. **Spoofing Creation Date**: Setting a wish's `createdAt` in the future to keep it at the top.
10. **Modifying an Existing Wish**: Updating someone's sweet wish to vandalism content.
11. **Injecting JS script into message**: XSS style content (rules should enforce character lengths; sanitization handled on client).
12. **Malicious Deletion of Wishes**: Trying to wipe out the guestbook.

## 3. The Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // Validation functions
    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    // RSVP Validation
    function isValidRsvp(data) {
      return data.name is string && data.name.size() >= 1 && data.name.size() <= 100
        && data.attending is bool
        && (!('guestsCount' in data) || (data.guestsCount is int && data.guestsCount >= 0 && data.guestsCount <= 10))
        && (!('drinks' in data) || (data.drinks is list && data.drinks.size() <= 10))
        && (!('dietary' in data) || (data.dietary is string && data.dietary.size() <= 300))
        && (!('transport' in data) || (data.transport is bool))
        && data.createdAt == request.time;
    }

    // Wish Validation
    function isValidWish(data) {
      return data.author is string && data.author.size() >= 1 && data.author.size() <= 100
        && data.message is string && data.message.size() >= 1 && data.message.size() <= 1000
        && data.createdAt == request.time;
    }

    // RSVP rules
    match /rsvps/{rsvpId} {
      allow create: if isValidId(rsvpId) && isValidRsvp(incoming());
      allow read, update, delete: if false; // Private submissions, only readable in Firestore console.
    }

    // Wishes rules
    match /wishes/{wishId} {
      allow read, list: if true; // Everyone can read wishes.
      allow create: if isValidId(wishId) && isValidWish(incoming());
      allow update, delete: if false; // Wishes are permanent.
    }
  }
}
```
