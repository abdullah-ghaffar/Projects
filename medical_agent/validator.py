# validator.py
# Yeh check karega ke agent ka 
# output sahi hai ya nahi

import json

def validate_output(agent_output):
    """
    Agent ka output check karta hai
    
    agent_output = agent ne jo text diya
    Returns: (True/False, data/error message)
    """
    
    # ─────────────────────────────
    # STEP 1: JSON hai ya nahi?
    # ─────────────────────────────
    try:
        # JSON ke extra backticks hatao
        # Agent kabhi kabhi ```json ``` likhta hai
        clean_output = agent_output.strip()
        
        if clean_output.startswith("```"):
            # Pehli line hatao ```json
            lines = clean_output.split("\n")
            # Pehli aur aakhri line hatao
            lines = lines[1:-1]
            clean_output = "\n".join(lines)
        
        # String ko Python dictionary banao
        data = json.loads(clean_output)
        
        print("✅ JSON format sahi hai!")
        
    except json.JSONDecodeError:
        print("❌ JSON format galat hai!")
        return False, "Invalid JSON"
    
    # ─────────────────────────────
    # STEP 2: Zaroori fields hain?
    # ─────────────────────────────
    
    # Yeh fields honi chahiye
    required_fields = [
        "Patient ka naam",
        "Doctor ka naam",
        "Hospital ka naam",
        "Date",
        "Total amount",
        "Diagnosis (bimari ka naam)"
    ]
    
    missing_fields = []  # khali list
    
    for field in required_fields:
        if field not in data:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"❌ Yeh fields missing hain: {missing_fields}")
        return False, missing_fields
    
    print("✅ Sari fields mojood hain!")
    
    # ─────────────────────────────
    # STEP 3: Values khali toh nahi?
    # ─────────────────────────────
    
    empty_fields = []
    
    for field, value in data.items():
        if value == "" or value is None:
            empty_fields.append(field)
    
    if empty_fields:
        print(f"❌ Yeh fields khali hain: {empty_fields}")
        return False, empty_fields
    
    print("✅ Sari values bhari hain!")
    
    # Sab theek hai!
    return True, data


# ─────────────────────────────
# TEST
# ─────────────────────────────

# Yeh wahi output hai jo agent ne diya tha
test_output = """
{
"Patient ka naam": "Ahmed Khan",
"Doctor ka naam": "Dr. Sarah Johnson",
"Hospital ka naam": "City Medical Center",
"Date": "2024-01-15",
"Total amount": 125,
"Diagnosis (bimari ka naam)": "Acute Bronchitis"
}
"""

print("🔍 Validation Shuru...\n")
is_valid, result = validate_output(test_output)

if is_valid:
    print("\n🎉 Output bilkul sahi hai!")
    print(f"\nData: {result}")
else:
    print(f"\n💀 Output mein masla hai: {result}")