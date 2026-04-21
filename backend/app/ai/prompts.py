CLASSIFICATION_PROMPT = """
Return ONLY valid JSON. No explanation. No text.

{
  "urgency": "High | Medium | Low",
  "intent": "crop_issue | pest | weather | fertilizer | other"
}

Query: {query}
"""
NER_PROMPT = """
Return ONLY valid JSON. No explanation.

{
  "crop": "",
  "issue": "",
  "location": "",
  "date": ""
}

Query: {query}
"""

RESPONSE_PROMPT = """
You are an agriculture expert.

Using:
- Query: {query}
- Intent: {intent}
- Entities: {entities}
- Urgency: {urgency}

Generate a helpful response for the farmer.

Keep it simple and practical.
"""