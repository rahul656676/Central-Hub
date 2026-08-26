from cryptography.fernet import Fernet
import os

def load_encrypted_model_to_memory(encrypted_model_path, license_key_bytes):
    """
    Reads an encrypted TensorRT model from disk, decrypts it in RAM, 
    and returns the byte stream to be loaded by Triton or ONNX.
    Never writes the decrypted model to disk.
    """
    if not os.path.exists(encrypted_model_path):
        return None
        
    with open(encrypted_model_path, 'rb') as f:
        encrypted_data = f.read()
        
    # The license key (which is tied to hardware) acts as the decryption key
    cipher_suite = Fernet(license_key_bytes)
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    
    print("Model successfully decrypted into RAM.")
    return decrypted_data
