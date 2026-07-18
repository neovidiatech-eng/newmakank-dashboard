# Dashboard Frontend Integration Guide: Online Representative Settings

This guide documents the API schemas and integration instructions for adding the new Online Representative configuration fields to the admin dashboard settings screen.

---

## 1. Setting Keys
The backend exposes two new settings:
- **`onlineRepresentativeBaseFee`**: The base delivery price for the Online Representative service (corresponds to `customDeliveryBaseFee` in custom delivery).
- **`onlineRepresentativeExtraStopPrice`**: The additional price charged per stop beyond the initial stops (corresponds to `customDeliveryExtraStopPrice` in custom delivery).

---

## 2. API Communication

### A. Fetching Settings
To load the settings, make a `GET` request to the existing settings endpoint:

**Request:**
```http
GET /api/settings
```

**Response Segment:**
```json
[
  {
    "setting": "onlineRepresentativeBaseFee",
    "value": "2.000000000000000000000000000000",
    "domain": "ORDER",
    "dataType": "NUMBER",
    "name": {
      "ar": "سعر التوصيل الأساسي للمندوب الأونلاين",
      "en": "Online Representative Base Delivery Fee"
    },
    "enumValues": null
  },
  {
    "setting": "onlineRepresentativeExtraStopPrice",
    "value": "0",
    "domain": "ORDER",
    "dataType": "NUMBER",
    "name": {
      "ar": "سعر المحطة الإضافية للمندوب الأونلاين",
      "en": "Online Representative Additional Station Fee"
    },
    "enumValues": null
  }
]
```

### B. Updating Settings
Submit changes to the existing `PATCH /api/settings` endpoint. Since the API accepts multi-part form-data, serialize the settings array as a JSON string under the `settings` form field:

**Request:**
```http
PATCH /api/settings
Content-Type: multipart/form-data
```

**Body Form Fields:**
- `settings`: A stringified JSON array containing the modified settings.

```json
[
  {
    "setting": "onlineRepresentativeBaseFee",
    "value": "5.00",
    "name": {
      "ar": "سعر التوصيل الأساسي للمندوب الأونلاين",
      "en": "Online Representative Base Delivery Fee"
    }
  },
  {
    "setting": "onlineRepresentativeExtraStopPrice",
    "value": "2.50",
    "name": {
      "ar": "سعر المحطة الإضافية للمندوب الأونلاين",
      "en": "Online Representative Additional Station Fee"
    }
  }
]
```

---

## 3. UI Display Choices

Depending on how your dashboard settings form is built, choose one of these integration paths:

### Scenario A: Fully Dynamic Settings Page
If your settings page iterates through the settings payload returned by the server and renders input components dynamically:
1. **No Frontend Changes Needed**: The new settings will automatically appear under the **ORDER** domain group with the Arabic/English labels specified in the `name` column.
2. **Numeric Input**: The UI will automatically render numeric inputs since `dataType` is `"NUMBER"`.

### Scenario B: Hardcoded/Static Layout Form
If your settings form is designed with hardcoded static inputs and labels:
1. Locate the **Custom Delivery / Representative** configuration section.
2. Add two new numeric inputs mapping to the following keys:
   - `onlineRepresentativeBaseFee`
   - `onlineRepresentativeExtraStopPrice`
3. Map their default values from the fetched settings array where `setting === 'onlineRepresentativeBaseFee'` and `setting === 'onlineRepresentativeExtraStopPrice'`.
4. Ensure validation blocks negative values (`value >= 0`) before submission to mirror the backend constraints.
