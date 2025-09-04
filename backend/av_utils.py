import pyclamd

def scan_file(file_path: str) -> bool:
    """
    Scan file with ClamAV.
    Returns True if file is clean, False if infected.
    """
    try:
        cd = pyclamd.ClamdNetworkSocket(host="localhost", port=3310)
        result = cd.scan_file(file_path)
        if result is None:
            return True  # clean
        return False   # infected
    except Exception as e:
        print(f"Virus scan failed: {e}")
        return False
