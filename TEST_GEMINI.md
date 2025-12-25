# Quick Gemini API Test

## Step 1: Set API Key (Choose ONE method)

### Method A: Windows Environment Variable (Permanent)
```cmd
setx GEMINI_API_KEY "your-actual-api-key-here"
```
Then restart your IDE and application.

### Method B: Application Properties (Temporary)
Edit `src/main/resources/application.properties`:
```properties
gemini.api.key=your-actual-api-key-here
```

### Method C: IDE Environment Variable
In your IDE run configuration, add:
```
GEMINI_API_KEY=your-actual-api-key-here
```

## Step 2: Test Endpoints

1. **Start your application**
2. **Test configuration**: http://localhost:8080/api/ai-chat/config
3. **Test API**: http://localhost:8080/api/ai-chat/test
4. **Check logs** for detailed error messages

## Step 3: Debug Steps

1. Check application logs on startup for:
   ```
   ✅ Gemini API key configured successfully (length: XX)
   ```

2. If you see warnings about API key, it's not configured properly.

3. Try the test endpoint and check logs for detailed error messages.

## Common Issues:

- **Environment variable not loaded**: Restart IDE completely
- **Invalid API key**: Check key is correct from Google AI Studio
- **Network issues**: Check internet connection
- **Rate limits**: Wait a few minutes and try again