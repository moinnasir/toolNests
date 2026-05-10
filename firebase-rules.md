# Firebase Rules Starter

These are starter rules for the MVP. Review and harden them before production.

## Firestore

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    match /posts/{docId} {
      allow read: if true;
      allow write: if signedIn();
    }

    match /tool_usage/{docId} {
      allow create: if signedIn();
      allow read: if signedIn();
    }

    match /referral_codes/{docId} {
      allow read, write: if signedIn() && request.auth.uid == docId;
    }

    match /referral_events/{docId} {
      allow create: if true;
      allow read: if signedIn();
    }

    match /expiring_links/{docId} {
      allow read, write: if signedIn();
    }

    match /file_locker/{docId} {
      allow read, write: if signedIn();
    }

    match /scheduled_emails/{docId} {
      allow read, write: if signedIn();
    }
  }
}
```

## Storage

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
