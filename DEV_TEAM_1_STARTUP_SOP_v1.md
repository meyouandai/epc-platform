# Dev Team 1 System Startup SOP v1
## Standard Operating Procedure for Full System Activation

**Date**: September 21, 2025
**Version**: 1.0
**Purpose**: Reliable startup of complete Dev Team 1 competitive AI orchestration system

---

## Pre-Flight Checklist

### ✅ **1. Environment Verification**
```bash
# Check you're in the right directory
pwd
# Should show: /Users/craga/Desktop/breakthrough_system

# Verify core files exist
ls -la dev_team_1.py
ls -la dev_team_1_monitor_v1.2.py
ls -la .env
```

### ✅ **2. API Keys Status Check**
```bash
# Test all 4 API connections
python3 test_4_models.py
```
**Expected Output:**
```
✓ Claude Opus 4 client ready
✓ Grok client ready
✓ GPT-4 client ready
✓ Gemini Pro client ready
Dev Team 1 initialized with 4 models
```

**If Any Fail:**
- Check `.env` file has all 4 keys
- Verify model names are current:
  - `claude-opus-4-1-20250805`
  - `grok-4-fast-reasoning`
  - `gpt-5-mini`
  - `gemini-2.5-flash`

### ✅ **3. Folder Structure Creation**
```bash
# Ensure all required directories exist
mkdir -p dev_team_inbox
mkdir -p final_solution
mkdir -p problem_tracking/active_problems
mkdir -p problem_tracking/self_solved
mkdir -p problem_tracking/dev_team_solved

# Verify structure
ls -la problem_tracking/
```

### ✅ **4. System Prompt Preparation**

**For Claude Code System:**
- Add `AI_Reality_System_Prompt.txt` to Claude Code system prompt
- Focus: Business reality and capability assessment

**For Dev Team 1 Models:**
- Each model gets `AI_DevTeam_Reality_System_Prompt_v1.txt` in their system prompt
- Focus: Individual capability unshackling

---

## System Activation Steps

### **Step 1: Clear Previous Session**
```bash
# Remove any old test files (optional)
rm -f dev_team_inbox/test_*.md
rm -f final_solution/solution_test_*.md

# Check for any stuck processes
ps aux | grep dev_team
```

### **Step 2: Start Auto-Monitor**
```bash
# Launch the monitoring system
python3 dev_team_1_monitor_v1.2.py
```

**Expected Output:**
```
==================================================
🎯 DEV TEAM 1 AUTO-MONITOR v1.2 ACTIVATED
==================================================
📂 Monitoring: dev_team_inbox/
🔄 Drop .md files to auto-solve
📚 Learning system: problem_tracking/
⌨️  Press Ctrl+C to stop
--------------------------------------------------
📊 Dev Team 1 Learning System Status:
========================================
active_problems    :   0 files
self_solved        :   0 files
dev_team_solved    :   0 files
final_solution     :   0 files
dev_team_inbox     :   0 files
----------------------------------------
```

### **Step 3: Verify System Readiness**
```bash
# In a separate terminal, test with a simple problem
echo "# Problem: Test System Activation

## Project Context
- Building: System verification test
- Current Phase: Startup verification

## Issue Details
- What you were trying to build: Verify Dev Team 1 is working
- Specific problem encountered: Testing system activation
- Error messages: None

## Attempts Made
### Attempt 1: Manual verification
- Strategy: Created test problem
- Result: Checking if system responds

## Requirements
- Success criteria: System processes this test problem
- Constraints: Must complete in under 2 minutes" > dev_team_inbox/test_activation.md
```

**Expected Behavior:**
- Monitor detects file within 30 seconds
- macOS notification appears: "🤖 Dev Team 1 Activated"
- Processing completes in 1-3 minutes
- Success notification: "✅ Solution Ready!"
- New file appears in `final_solution/`

---

## Verification Procedures

### **Check 1: Monitor Response**
- File detected within 30 seconds ✅
- Processing notification sent ✅
- No error messages in terminal ✅

### **Check 2: Solution Generation**
```bash
# Check latest solution file
ls -la final_solution/ | tail -1

# Verify cascading format
head -20 final_solution/solution_*.md
```

**Should contain:**
- All 4 model solutions ranked
- Average ranks and #1 vote counts
- Implementation instructions
- Tie-breaking information if applicable

### **Check 3: Learning System Update**
```bash
# Verify problem was moved to dev_team_solved
ls -la problem_tracking/dev_team_solved/

# Check learning record was created
ls -la problem_tracking/dev_team_solved/learning_*.md
```

---

## Integration with Claude Code

### **Claude Code Configuration:**
1. **System Prompt**: Include `AI_Reality_System_Prompt.txt`
2. **Escalation Protocol**: When 3 attempts fail:
   ```bash
   # Claude Code should create escalation file:
   echo "[problem details]" > dev_team_inbox/problem_[timestamp].md
   ```
3. **Solution Monitoring**: Check `final_solution/` for cascading solutions
4. **Implementation**: Try solutions in ranked order

### **Expected Workflow:**
```
Claude Code Problem → 3 Attempts → Escalation File →
Dev Team 1 Activation → 4-Model Competition →
Peer Review → Cascading Solutions → Claude Code Implementation
```

---

## Troubleshooting Guide

### **Issue: API Connection Failures**
```bash
# Check API keys
cat .env | grep -E "(EINSTEIN|XAI|GOOGLE|OPENAI)"

# Test individual models
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('Claude:', 'YES' if os.getenv('EINSTEIN_TOKYO_001') else 'NO')
print('Grok:', 'YES' if os.getenv('XAI_API_KEY') else 'NO')
print('Gemini:', 'YES' if os.getenv('GOOGLE_API_KEY') else 'NO')
print('OpenAI:', 'YES' if os.getenv('OPENAI_API_KEY') else 'NO')
"
```

### **Issue: Monitor Not Detecting Files**
- Check file extension is `.md` ✅
- Verify file is in `dev_team_inbox/` ✅
- Wait 30 seconds for detection cycle ✅
- Check terminal for error messages ✅

### **Issue: Processing Timeout**
- Default timeout is 120 seconds
- Complex problems may need longer
- Check model-specific errors in terminal
- Verify all models are responding

### **Issue: Incomplete Solutions**
- Check which models failed in terminal output
- Verify model names haven't changed
- Test individual model connections
- Check API rate limits

---

## Quick Reference Commands

### **System Status:**
```bash
# Check if monitor is running
ps aux | grep dev_team_1_monitor

# View latest solution
ls -la final_solution/ | tail -5

# Check problem tracking
find problem_tracking/ -name "*.md" | wc -l
```

### **Manual Problem Processing:**
```bash
# Process specific problem without monitor
python3 dev_team_1.py problem_file.md
```

### **System Health Check:**
```bash
# Full system verification
python3 test_4_models.py && echo "APIs: OK" || echo "APIs: FAIL"
ls dev_team_1_monitor_v1.2.py && echo "Monitor: OK" || echo "Monitor: MISSING"
ls AI_DevTeam_Reality_System_Prompt_v1.txt && echo "Prompt: OK" || echo "Prompt: MISSING"
```

### **Emergency Stop:**
```bash
# Stop monitor
pkill -f dev_team_1_monitor

# Clear stuck processes
pkill -f dev_team_1
```

---

## Success Criteria

✅ **System Successfully Started When:**
1. All 4 API connections verified
2. Monitor running and detecting files
3. Test problem processed successfully
4. Cascading solution generated
5. Learning record created
6. No error messages in logs

✅ **Ready for Production When:**
- Claude Code configured with proper system prompt
- Escalation workflow tested end-to-end
- Solution implementation verified
- Monitoring notifications working

---

## Post-Startup Checklist

- [ ] All 4 models connected
- [ ] Monitor actively watching inbox
- [ ] Test problem processed successfully
- [ ] Solution quality verified
- [ ] Learning system updating
- [ ] Claude Code integration ready
- [ ] Notifications working
- [ ] No errors in logs

**System Status: FULLY OPERATIONAL** 🚀

---

*Next: Consider automated startup script to eliminate manual steps*