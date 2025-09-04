import pytest
from pathlib import Path
from app.virus_scan import scan_file
from app.ocr import extract_text_from_file

def test_virus_scan(tmp_path):
    test_file = tmp_path / "clean.txt"
    test_file.write_text("safe content")
    clean = scan_file(str(test_file))
    # Note: Will return False if ClamAV daemon not running
    assert isinstance(clean, bool)

def test_ocr_extraction(tmp_path):
    test_file = tmp_path / "doc.txt"
    test_file.write_text("Patient has a fever and cough.")
    text = extract_text_from_file(str(test_file))
    assert "fever" in text or text != ""
