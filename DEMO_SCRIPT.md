# 🎯 Judge Demo Script - TestSprite Integration

## 🚀 **Demo Flow**

### **1. Open the Application**
```bash
# Start the development server
npm run dev

# Open browser to:
http://localhost:3000/learn
```

### **2. Complete One Problem**
- Navigate to the Learn page
- Complete one fraction problem
- Submit an answer
- Request a hint (optional)

### **3. Test API Endpoint**
Open terminal and run:

```bash
# Test the problems API endpoint
curl -s http://localhost:3000/api/problems | jq 'length'
```

**Expected Results:**
- Returns 10 fraction problems
- Fast response using hardcoded problems for reliability

### **4. Show TestSprite Dashboard**
- Navigate to: `http://localhost:3000/testing`
- Show events: `problems.requested`, `problems.generated`, `validation_failed`, `repaired`, `fallback_mock`

### **5. Key Points to Highlight**

#### **TestSprite Integration**
- ✅ **LLM Quality Telemetry**: Logs all LLM generations and validation
- ✅ **Error Tracking**: Captures validation failures and repair attempts
- ✅ **Quality Metrics**: Tracks banned phrase hits and generation quality
- ✅ **Graceful Degradation**: Works without API keys

#### **Production Ready**
- ✅ **No UI Changes**: All instrumentation is invisible to users
- ✅ **Reliable Fallback**: Static problems if LLM fails
- ✅ **Topic Locked**: Always generates fraction problems
- ✅ **Error Handling**: Comprehensive validation and repair

## 🎤 **Presentation Script**

### **Opening** (30 seconds)
> "I'll demonstrate how we've instrumented our adaptive tutoring app with TestSprite for LLM quality telemetry. The topic is hard-coded to fractions, and the integration degrades gracefully."

### **Live Demo** (3 minutes)
1. **Show Application** (1 min): Open `/learn`, complete a problem
2. **Test API** (1 min): Show API call returning fraction problems
3. **Show Dashboard** (1 min): Demonstrate TestSprite telemetry

### **Key Benefits** (30 seconds)
> "This demonstrates production-ready instrumentation that provides valuable insights without affecting user experience. The app works perfectly with or without the TestSprite integration."

## 🔧 **Technical Details**

### **TestSprite Events Logged**
- `problems.requested` - When API is called
- `problems.generated` - When problems are successfully generated
- `problems.validation_failed` - When LLM output fails validation
- `problems.repaired` - When problems are successfully repaired
- `problems.fallback_mock` - When falling back to static problems
- `problems.metrics` - Quality metrics including banned phrase hits


### **Environment Variables**
```bash
# Required for full functionality
OPENAI_API_KEY=your_key
TESTSPRITE_API_KEY=your_testsprite_key
```

## ✅ **Acceptance Criteria**

- [x] App behavior unchanged for users
- [x] Endpoint always returns 10 valid problems for topic "fractions"
- [x] With key set, TestSprite logs events
- [x] With no key or SDK, app still works
- [x] UI remains intact
- [x] Graceful degradation when integrations are unavailable

## 🎯 **Success Metrics**

- **API Response**: Always returns 10 fraction problems
- **Telemetry Tracking**: Events logged for LLM operations
- **Error Handling**: Graceful fallback to static problems
- **User Experience**: No visible changes to UI/UX
