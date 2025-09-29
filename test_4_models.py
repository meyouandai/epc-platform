#!/usr/bin/env python3
"""
Minimal test to verify all 4 models are working (low token usage)
"""
import os
from dotenv import load_dotenv

load_dotenv()

def test_all_4_models():
    print("🔧 Testing 4-Model Team Readiness")
    print("=" * 35)

    # Test Claude
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=os.getenv('EINSTEIN_TOKYO_001'))
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=5,
            messages=[{"role": "user", "content": "Say OK"}]
        )
        print(f"✅ Claude: {response.content[0].text}")
    except Exception as e:
        print(f"❌ Claude: {e}")

    # Test Grok
    try:
        import requests
        headers = {'Authorization': f'Bearer {os.getenv("XAI_API_KEY")}', 'Content-Type': 'application/json'}
        data = {"model": "grok-4-fast-reasoning", "messages": [{"role": "user", "content": "Say OK"}], "max_tokens": 5}
        response = requests.post('https://api.x.ai/v1/chat/completions', headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()['choices'][0]['message']['content']
            print(f"✅ Grok: {result}")
        else:
            print(f"❌ Grok: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Grok: {e}")

    # Test Gemini
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Say OK")
        print(f"✅ Gemini: {response.text}")
    except Exception as e:
        print(f"❌ Gemini: {e}")

    # Test OpenAI
    try:
        import openai
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[{"role": "user", "content": "Say OK"}],
            max_completion_tokens=5
        )
        print(f"✅ OpenAI: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ OpenAI: {e}")

if __name__ == "__main__":
    test_all_4_models()