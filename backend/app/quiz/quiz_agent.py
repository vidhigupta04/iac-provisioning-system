import os
import random
from langchain_groq import ChatGroq
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

# ✅ GROQ MODEL (UPDATED - WORKING)
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",   # ✅ WORKING MODEL
    temperature=0.3
)

# ✅ LOAD KNOWLEDGE BASE
def setup_db():
    loader = TextLoader("farming_tips.txt")
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = splitter.split_documents(docs)

    return Chroma.from_documents(splits, embedding=None)

db = setup_db()


# 🎯 GENERATE QUESTION
# 🎯 GENERATE QUESTIONS (Updated to give a list)
def generate_questions():
    topics = ["crop", "soil", "irrigation", "fertilizer"]
    topic = random.choice(topics)

    # Search for more context to get better variety
    docs = db.similarity_search(topic, k=3)
    context = " ".join([d.page_content for d in docs])

    prompt = f"""
Context: {context}

Generate 10 simple agriculture MCQs. 
Format should be exactly like this for each question:
1. Question Text?
A) Option 1
B) Option 2
C) Option 3
D) Option 4

Do NOT use JSON format. Just plain text.
"""

    res = llm.invoke(prompt)

    # Hum poori string return karenge jise frontend parse kar sake
    return {
        "raw_text": res.content,
        "context": context
    }


# 🎯 EVALUATE ANSWER
def evaluate_answer(question, context, answer):
    prompt = f"""
    You are an Agriculture Expert. 
    
    Context: {context}
    Question: {question}
    User's Answer: {answer}

    Instruction:
    1. Check if the User's Answer is correct based on the Context.
    2. If correct, start with "Correct!" and explain why in 1-2 simple sentences.
    3. If incorrect, start with "Incorrect." and provide the correct answer with a clear explanation from the context.
    
    IMPORTANT: Provide the response in English. Do NOT generate new questions or JSON.
    """

    res = llm.invoke(prompt)
    return res.content