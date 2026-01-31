
import sys
import os
from pathlib import Path
import traceback

# Setup path
ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

print(f"Root path: {ROOT}")

try:
    print("Importing ClaritasModel...")
    from ai import ClaritasModel
    
    print("Initializing ClaritasModel...")
    model = ClaritasModel()
    print("✅ SUCCESS: Model loaded!")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    traceback.print_exc()
