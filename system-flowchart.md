# Vendy System Flowchart

## User / Attendee Side

```mermaid
flowchart TD
    A["Start"] --> B["Open registration link"]
    B --> C["Enter full name, email, contact number, and company/school"]
    C --> D{"Is event active?"}
    D -- "No" --> E["Show registration closed message"]
    D -- "Yes" --> F{"Is email already registered for this event?"}
    F -- "Yes" --> G["Show duplicate email error"]
    F -- "No" --> H["Send email verification code"]
    H --> I["User enters verification code"]
    I --> J{"Is code valid?"}
    J -- "No" --> K["Show verification error / allow retry"]
    K --> I
    J -- "Yes" --> L["Proceed to face capture"]
    L --> M{"Is face detected clearly?"}
    M -- "No" --> N["Show camera / face detection error"]
    N --> L
    M -- "Yes" --> O["Save attendee details and face encoding"]
    O --> P["Generate QR code"]
    P --> Q["Send / display registration confirmation"]
    Q --> R["User goes to vending machine"]
    R --> S["Press left or right machine button"]
    S --> T["Scan QR code"]
    T --> U{"Is QR valid for active event?"}
    U -- "No" --> V["Show invalid QR error"]
    U -- "Yes" --> W{"Already claimed?"}
    W -- "Yes" --> X["Show already claimed error"]
    W -- "No" --> Y["Scan user's face"]
    Y --> Z{"Does face match registered face?"}
    Z -- "No" --> AA["Show face mismatch / face error"]
    Z -- "Yes" --> AB["Find available slot based on role and side"]
    AB --> AC{"Is stock available?"}
    AC -- "No" --> AD["Show out of stock message"]
    AC -- "Yes" --> AE["Dispense item using motor"]
    AE --> AF{"Did IR sensor confirm item drop?"}
    AF -- "No" --> AG["Show hardware error / call staff"]
    AF -- "Yes" --> AH["Deduct inventory stock"]
    AH --> AI["Mark attendee as claimed"]
    AI --> AJ["Queue sticker print job"]
    AJ --> AK["Print attendee sticker"]
    AK --> AL["Show success message"]
    AL --> AM["End"]
```

## Admin / Event Staff Side

```mermaid
flowchart TD
    A["Start"] --> B["Open admin dashboard"]
    B --> C["Log in as admin or event staff"]
    C --> D{"Are credentials valid?"}
    D -- "No" --> E["Show login error"]
    E --> C
    D -- "Yes" --> F["Load dashboard"]
    F --> G["Select active event"]
    G --> H["View event overview"]
    H --> I["Monitor registered attendees and claimed status"]
    H --> J["Open users management"]
    H --> K["Open inventory management"]
    H --> L["Receive stock alert in header"]

    J --> M["Search / filter attendees"]
    M --> N["View attendee name, email, company, role, and claimed status"]
    N --> O["Update attendee role if needed"]
    O --> P["Save role changes"]
    J --> Q["Export attendee CSV"]

    K --> R["View machine slots and current stock"]
    R --> S{"Any stock is low or zero?"}
    S -- "No" --> T["Show normal inventory status"]
    S -- "Yes" --> U["Show low stock / out-of-stock notification"]
    U --> V["Restock affected slot"]
    V --> W["Update inventory count"]
    W --> X["Dashboard reflects updated stock"]

    H --> Y["Monitor live updates during event"]
    Y --> Z["Attendees claim kits through vending machine"]
    Z --> AA["System updates claimed status and inventory"]
    AA --> H
```

## Short Process Summary

```text
User side:
Registration -> Email check -> Email verification -> Face capture -> QR creation -> QR scan at vending machine -> Face verification -> Dispense item -> Print sticker -> Mark claimed

Admin side:
Login -> Select event -> Monitor overview/users/inventory -> Receive low-stock alerts -> Manage attendees and inventory -> Track claims during event
```
