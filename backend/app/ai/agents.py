from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",   
    temperature=0.3
)

# ✅ Classification (Keep as is)
def classification_agent(query):
    prompt = f"""Return ONLY JSON.\n{{\n  "urgency": "High | Medium | Low",\n  "intent": "crop_issue | pest | weather | fertilizer | other"\n}}\nQuery: {query}"""
    return llm.invoke([HumanMessage(content=prompt)]).content

# ✅ NER (Keep as is)
def ner_agent(query):
    prompt = f"""Return ONLY JSON.\n{{\n  "crop": "",\n  "issue": "",\n  "location": "",\n  "date": ""\n}}\nQuery: {query}"""
    return llm.invoke([HumanMessage(content=prompt)]).content

# ✅ Response (UPDATED FOR STRUCTURED OUTPUT)
def response_agent(query, intent, entities, urgency):
    prompt = f"""
You are an expert Agriculture Assistant. Provide a highly structured, professional, and point-wise response for a farmer.

Context:
- Query: {query}
- Intent: {intent}
- Detected Entities: {entities}
- Urgency Level: {urgency}

Formatting Instructions:
1. Use a clear Heading with an emoji.
2. Provide a brief expert introduction.
3. Use Bold Bullet Points for specific crop/pest information.
4. Use a Numbered List for "Prevention and Control Measures".
5. End with a "Remember" or "Expert Tip" note.
6. Use Markdown for bolding and structure.

Answer the query now:
"""
    return llm.invoke([HumanMessage(content=prompt)]).content