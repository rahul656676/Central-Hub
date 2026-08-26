import uuid
import hashlib
import platform

def get_hardware_fingerprint():
    """
    Generates a unique hardware fingerprint bound to this specific machine.
    Uses MAC address and OS platform details to simulate binding to Motherboard/GPU.
    """
    mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) 
                   for ele in range(0,8*6,8)][::-1])
    system_info = f"{platform.system()}-{platform.machine()}-{mac}"
    
    # Hash to create a clean license fingerprint
    fingerprint = hashlib.sha256(system_info.encode()).hexdigest()
    return fingerprint

def validate_license(license_key, expected_fingerprint):
    """
    In production, the license_key would be decrypted to verify it matches
    the expected_fingerprint of the local machine.
    """
    return license_key == expected_fingerprint

if __name__ == "__main__":
    fp = get_hardware_fingerprint()
    print(f"Hardware Fingerprint (GPU/Motherboard Bound): {fp}")
