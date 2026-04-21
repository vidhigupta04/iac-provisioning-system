import json
from app.ai.agents import classification_agent, ner_agent, response_agent

def safe_json_parse(text):
    try:
        return json.loads(text)
    except:
        # fallback if LLM returns bad format
        return {}

def process_query(query):
    try:
        # 1. Classification
        classification_raw = classification_agent(query)
        classification_data = safe_json_parse(classification_raw)

        # 2. NER
        entities_raw = ner_agent(query)
        entities_data = safe_json_parse(entities_raw)

        # 3. Response
        response = response_agent(
            query,
            classification_data.get("intent", "general"),
            entities_data,
            classification_data.get("urgency", "medium")
        )

        return {
            "classification": classification_data,
            "entities": entities_data,
            "response": response
        }

    except Exception as e:
        print("🔥 AI ERROR:", str(e))
        return {
            "response": "⚠️ AI processing error. Please try again."
        }