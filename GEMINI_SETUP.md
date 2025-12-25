# Google Gemini AI Setup Guide

## 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## 2. Configure Application

### Option A: Environment Variable (Recommended)
```bash
export GEMINI_API_KEY=your-actual-api-key-here
```

### Option B: Application Properties
Edit `src/main/resources/application.properties`:
```properties
gemini.api.key=your-actual-api-key-here
```

## 3. Test the Integration

1. Start the application
2. Login as a patient
3. Navigate to "AI Health Assistant"
4. Enter symptoms like: "I have a headache and fever for 2 days"
5. The AI should respond with detailed medical analysis

## 4. Features

- **Real AI Responses**: Uses Google Gemini Pro model
- **Medical Expertise**: Trained on medical knowledge
- **Fallback System**: If API fails, provides basic response
- **Chat History**: All conversations are saved
- **Safety First**: Always recommends professional medical consultation

## 5. API Limits

- Free tier: 60 requests per minute
- For production: Consider upgrading to paid plan
- Monitor usage in Google AI Studio console

## 6. Troubleshooting

- **Invalid API Key**: Check key is correct and active
- **Rate Limits**: Wait and retry, or upgrade plan  
- **Network Issues**: Check internet connection
- **Fallback Response**: API temporarily unavailable, try again later