import google.generativeai as genai
import asyncio
import time
from typing import Optional
from app.core.config import settings

# System prompts per language
SYSTEM_PROMPTS = {
    "en": """You are an intelligent Election Assistant for India named Kiran.
Your goal is to behave like a smart conversational assistant that understands the user, thinks before answering, and gives helpful, personalized, and actionable responses.

RESPONSE STRUCTURE:
1. ✅ DIRECT ANSWER (first line)
2. 📌 SHORT EXPLANATION
3. 🪜 STEP-BY-STEP (if needed)
4. 🚀 NEXT ACTIONS

PERSONALIZATION:
- Age -> Check eligibility (18+ rule).
- State -> Give location-aware guidance.
- Style -> Natural, conversational. No robotic tone. No long paragraphs.

IMPORTANT:
- Stay neutral (no politics). No promotion of parties.
- Do not make up links. Use voters.eci.gov.in for registration.
- If asked about current dates or times, always use the CURRENT REALTIME DATE provided below. Do not use your training data cutoff date.""",

    "hi": """आप भारत के लिए एक बुद्धिमान चुनाव सहायक हैं जिसका नाम किरण है।
उत्तर सरल, स्पष्ट और कार्रवाई योग्य दें।
तटस्थ रहें, किसी पार्टी का प्रचार न करें।
voters.eci.gov.in का उपयोग करें।"""
}


class AIService:
    def __init__(self):
        self.api_keys = settings.gemini_keys
        self.current_key_index = 0
        self.primary_model = "gemini-flash-latest"
        self.fallback_model = "gemini-2.5-flash-lite"
        self.cache = {}  # Simple in-memory cache
        self.cache_ttl = 3600  # 1 hour

    def _get_key(self):
        if not self.api_keys:
            return None
        return self.api_keys[self.current_key_index % len(self.api_keys)]

    def _rotate_key(self):
        if len(self.api_keys) > 1:
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)

    def _get_cache_key(self, message: str, state: str, lang: str) -> str:
        return f"{lang}_{state}_{message.strip().lower()}"

    def _check_cache(self, key: str) -> Optional[str]:
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["time"] < self.cache_ttl:
                return entry["response"]
            del self.cache[key]
        return None

    async def generate_response(self, message: str, state: Optional[str] = None, lang: str = "en") -> str:
        # Check cache
        cache_key = self._get_cache_key(message, state or "", lang)
        cached = self._check_cache(cache_key)
        if cached:
            return cached

        api_key = self._get_key()
        if not api_key:
            return "⚠️ No API key configured. Please add your Gemini API key to the backend .env file."

        from datetime import datetime
        current_date_str = datetime.now().strftime("%A, %B %d, %Y")

        system_prompt = SYSTEM_PROMPTS.get(lang, SYSTEM_PROMPTS["en"])
        context = f"\n[Context: User State: {state or 'Unknown'}, Language: {lang}, CURRENT REALTIME DATE: {current_date_str}]"
        full_prompt = system_prompt + context + "\n\nUser Question: " + message

        # Try primary, then fallback
        for model_name in [self.primary_model, self.fallback_model]:
            for attempt in range(2):
                try:
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel(model_name)
                    response = await asyncio.to_thread(
                        model.generate_content, full_prompt
                    )
                    if response and response.text:
                        # Cache the response
                        self.cache[cache_key] = {"response": response.text, "time": time.time()}
                        return response.text
                except Exception as e:
                    error_msg = str(e)
                    if "quota" in error_msg.lower() or "429" in error_msg:
                        self._rotate_key()
                        api_key = self._get_key()
                    if attempt < 1:
                        await asyncio.sleep(1 * (attempt + 1))

        return "⚠️ I'm having trouble connecting right now. Please try again in a moment."


ai_service = AIService()
