# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```bash
# OpenAI (existing)
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini

# TestSprite (optional; integration no-op if missing)
TESTSPRITE_API_KEY=your_testsprite_key
```

## Notes:
- The TestSprite integration will gracefully degrade if the API key is not provided
- The app will still work without the key, but telemetry features will be disabled
- Make sure to add `.env` to your `.gitignore` file to keep your API keys secure
