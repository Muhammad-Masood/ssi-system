from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import joblib
from datetime import datetime
import numpy as np
from sklearn.preprocessing import LabelEncoder

app = FastAPI(title="SSI AI API")

model = joblib.load("certificate_verification_model.pkl")
issuer_encoder = joblib.load("issuer_encoder.pkl")
institution_encoder = joblib.load("institution_encoder.pkl")

KNOWN_ISSUERS = {"medical council of uk", "indian medical association", "canadian medical board", "ama (usa)", "australian health practitioner regulation agency"}
KNOWN_INSTITUTIONS = {"harvard medical school", "aiims delhi", "university of toronto medical faculty", "oxford medical college", "sydney medical school"}
VALID_PREFIXES = ['ACC-', 'CERT-', 'MD-', 'LIC-']

class CertificateRequest(BaseModel):
    doctor_name: str
    license_number: str
    issuer: str
    institution: str
    issue_date: str  # format: YYYY-MM-DD
    expiration_date: str
    accreditation_code: str

def compute_days_valid(issue: str, expiry: str):
    issue_dt: datetime = datetime.strptime(issue, "%Y-%m-%d")
    expiry_dt: datetime = datetime.strptime(expiry, "%Y-%m-%d")
    return (expiry_dt - issue_dt).days

def check_valid_issuer(issuer: str):
    return issuer.lower().strip() in KNOWN_ISSUERS

def check_valid_institution(inst: str):
    return inst.lower().strip() in KNOWN_INSTITUTIONS

def check_accreditation_code(code: str):
    return any(code.startswith(prefix) for prefix in VALID_PREFIXES)

'''
request body -> cert: {
  "doctor_name": "Dr. Emily Carter",
  "license_number": "REG-123456",
  "issuer": "Medical Council of UK",
  "institution": "Harvard Medical School",
  "issue_date": "2020-01-01",
  "expiration_date": "2025-01-01",
  "accreditation_code": "ACC-123456"
}
'''
@app.post("/verify_certificate_ai")
def verify_certificate(cert: CertificateRequest):
    # Derive new fields
    days_valid = compute_days_valid(cert.issue_date, cert.expiration_date)
    valid_issuer = check_valid_issuer(cert.issuer)
    valid_institution = check_valid_institution(cert.institution)
    accreditation_valid = check_accreditation_code(cert.accreditation_code)
    
    try:
        issuer_encoded = issuer_encoder.transform([cert.issuer])[0]
    except:
        issuer_encoded = -1  # unknown category
    
    try:
        institution_encoded = institution_encoder.transform([cert.institution])[0]
    except:
        institution_encoded = -1

    X = np.array([[days_valid, int(valid_issuer), int(valid_institution),
                   int(accreditation_valid), issuer_encoded, institution_encoded]])

    prediction = model.predict(X)[0]
    print(prediction)

    return {
        "prediction": "Legitimate" if prediction else "Fraudulent",
        "features_used": {
        "days_valid": int(days_valid),
        "valid_issuer": bool(valid_issuer),
        "valid_institution": bool(valid_institution),
        "accreditation_valid": bool(accreditation_valid),
        "issuer_encoded": int(issuer_encoded),
        "institution_encoded": int(institution_encoded)
    }
    }