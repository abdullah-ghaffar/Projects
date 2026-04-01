# main.py - Master Controller

from extractor import extract_medical_data
from validator import validate_output
from saver import save_results, save_all_results

# ─────────────────────────────
# MAIN AGENT PIPELINE
# ─────────────────────────────

def run_agent(document_text):
    """
    Poora pipeline:
    Document → Extract → Validate → Save
    """
    
    print("=" * 40)
    print("🏥 MEDICAL DOCUMENT AGENT")
    print("=" * 40)
    
    # STEP 1: Extract
    print("\n📄 STEP 1: Extracting...")
    agent_output = extract_medical_data(document_text)
    print("✅ Extraction Complete!")
    
    # STEP 2: Validate
    print("\n🔍 STEP 2: Validating...")
    is_valid, result = validate_output(agent_output)
    
    # STEP 3: Save
    print("\n📊 STEP 3: Result")
    print("-" * 40)
    
    if is_valid:
        print("✅ STATUS: SUCCESS\n")
        
        # Data dikhao
        for key, value in result.items():
            print(f"   {key}: {value}")
        
        # Save karo
        print()
        save_results(result)
        
        return result
    else:
        print("❌ STATUS: FAILED")
        print(f"   Masla: {result}")
        return None

# ─────────────────────────────
# TEST DOCUMENTS
# ─────────────────────────────

document1 = """
    Patient Name: Ahmed Khan
    Doctor: Dr. Sarah Johnson
    Hospital: City Medical Center
    Date: 2024-01-15
    Diagnosis: Acute Bronchitis
    - Consultation Fee: $50
    - Medicines: $30
    - Lab Tests: $45
    Total Amount: $125
"""

document2 = """
    Patient Name: Fatima Ali
    Doctor: Dr. Hassan Sheikh
    Hospital: Shifa International
    Date: 2024-02-20
    Diagnosis: Type 2 Diabetes
    - Consultation Fee: $80
    - Medicines: $120
    - Lab Tests: $200
    Total Amount: $400
"""

document3 = """
    Patient Name: Bilal Hussain
    Doctor: Dr. Ayesha Malik
    Hospital: Aga Khan University Hospital
    Date: 2024-03-10
    Diagnosis: Kidney Stones
    - Consultation Fee: $100
    - Surgery: $2000
    - Medicines: $150
    - Room Charges: $500
    Total Amount: $2750
"""

# ─────────────────────────────
# CHALAO - Ek Ek Karke
# ─────────────────────────────

all_results = []

print("\n🔵 TEST 1: Ahmed Khan")
r1 = run_agent(document1)
if r1:
    all_results.append(r1)

print("\n\n🔵 TEST 2: Fatima Ali")
r2 = run_agent(document2)
if r2:
    all_results.append(r2)

print("\n\n🔵 TEST 3: Bilal Hussain")
r3 = run_agent(document3)
if r3:
    all_results.append(r3)

# ─────────────────────────────
# SARE RESULTS EK FILE MEIN
# ─────────────────────────────

print("\n\n" + "=" * 40)
print("📦 SAVING ALL RESULTS...")
save_all_results(all_results)
print("=" * 40)
print("🎉 DONE! Sab kuch complete!")