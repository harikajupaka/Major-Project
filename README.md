# Major-Project

## Authentication setup

The backend supports password login followed by SMS OTP verification. Configure Twilio Verify with environment variables before starting the backend:

```bash
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token
export TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The values come from the Twilio Console:

- `TWILIO_ACCOUNT_SID`: Account SID
- `TWILIO_AUTH_TOKEN`: Auth Token
- `TWILIO_VERIFY_SERVICE_SID`: the Verify Service SID, created under Verify > Services

Phone numbers must use E.164 format, such as `+919876543210`. Twilio trial accounts can send only to verified recipient numbers. Never commit the Auth Token or place it in frontend code.

When the three Twilio values are absent, the backend uses a local in-memory OTP valid for five minutes and returns the code in the response for development. Set `OTP_EXPOSE_CODE=false` when testing without the development code response.