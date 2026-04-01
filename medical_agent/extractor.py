# extractor.py - Self Correcting Agent

from groq import Groq
from config import API_KEY

# ─────────────────────────────────
# SETUP
# ─────────────────────────────────

client = Groq(api_key=API_KEY)

# ─────────────────────────────────
# AGENT FUNCTION - SELF CORRECTING
# ─────────────────────────────────

def extract_medical_data(document_text, max_retries=3):
    """
    Medical document se data nikalta hai
    Agar galat output aaye toh retry karta hai
    
    max_retries = kitni baar try kare
    """
    
    prompt = f"""
    Tu ek medical document analyzer hai.
    
    STRICT RULES:
    - Sirf JSON format mein jawab do
    - JSON ke andar sirf yeh 6 keys honi chahiye:
      1. "Patient ka naam"
      2. "Doctor ka naam"
      3. "Hospital ka naam"
      4. "Date"
      5. "Total amount"
      6. "Diagnosis (bimari ka naam)"
    - Koi extra key mat dena
    - Kuch extra text mat likhna
    - Sirf JSON do, kuch nahi
    
    Document:
    {document_text}
    """
    
    for attempt in range(1, max_retries + 1):
        
        print(f"🤖 Agent kaam kar raha hai... (Try {attempt}/{max_retries})")
        
        # AI ko call karo
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """Tu ek medical document analyzer hai.
                    Hamesha sirf JSON return kar.
                    Hamesha exact yeh 6 keys use kar:
                    - Patient ka naam
                    - Doctor ka naam
                    - Hospital ka naam
                    - Date
                    - Total amount
                    - Diagnosis (bimari ka naam)"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1  # Kam creativity = zyada consistent
        )
        
        output = response.choices[0].message.content
        
        # ──────────────────────
        # Quick Check: 6 keys?
        # ──────────────────────
        required_keys = [
            "Patient ka naam",
            "Doctor ka naam",
            "Hospital ka naam",
            "Date",
            "Total amount",
            "Diagnosis (bimari ka naam)"
        ]
        
        all_found = True
        for key in required_keys:
            if key not in output:
                all_found = False
                print(f"   ⚠️ '{key}' nahi mila - Retry...")
                break
        
        if all_found:
            print(f"   ✅ Sab keys mil gayi!")
            return output
    
    # Sab retries fail
    print("   ❌ Max retries reached!")
    return output