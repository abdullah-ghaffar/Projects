# saver.py - Results ko JSON file mein save karo

import json
from datetime import datetime

def save_results(data, filename=None):
    """
    Extracted data ko JSON file mein save karta hai
    
    data = dictionary jo agent ne nikali
    filename = file ka naam (optional)
    """
    
    # ─────────────────────────
    # Agar filename nahi diya
    # Toh date se banao
    # ─────────────────────────
    if filename is None:
        # Abhi ka time lo
        now = datetime.now()
        # Format: 2024-01-15_14-30-25
        time_str = now.strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"result_{time_str}.json"
    
    # ─────────────────────────
    # File mein save karo
    # ─────────────────────────
    
    # Report banao
    report = {
        "status": "SUCCESS",
        "extracted_at": str(datetime.now()),
        "data": data
    }
    
    # JSON file likho
    with open(filename, "w") as file:
        json.dump(report, file, indent=4)
    
    print(f"💾 Result saved: {filename}")
    
    return filename


def save_all_results(results_list):
    """
    Multiple results ek file mein save karo
    
    results_list = list of dictionaries
    """
    
    now = datetime.now()
    time_str = now.strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"all_results_{time_str}.json"
    
    report = {
        "status": "SUCCESS",
        "total_documents": len(results_list),
        "extracted_at": str(datetime.now()),
        "results": results_list
    }
    
    with open(filename, "w") as file:
        json.dump(report, file, indent=4)
    
    print(f"💾 All results saved: {filename}")
    print(f"📊 Total documents: {len(results_list)}")
    
    return filename


# ─────────────────────────
# TEST
# ─────────────────────────

if __name__ == "__main__":
    
    # Test data
    test_data = {
        "Patient ka naam": "Ahmed Khan",
        "Doctor ka naam": "Dr. Sarah Johnson",
        "Hospital ka naam": "City Medical Center",
        "Date": "2024-01-15",
        "Total amount": 125,
        "Diagnosis (bimari ka naam)": "Acute Bronchitis"
    }
    
    # Save karo
    save_results(test_data)
    print("✅ Test complete!")