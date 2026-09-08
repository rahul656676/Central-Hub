#!/bin/bash
# ==========================================
# AWS EC2 Setup & Start Script for Central-Hub
# ==========================================

echo "[*] Setting up Central-Hub Backend on AWS EC2..."

# 1. Ensure Python & Pip are installed
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv tmux

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Backend Dependencies
echo "[*] Installing backend dependencies..."
cd backend/backend_api
pip install -r requirements.txt

# 4. Set Environment Variable
export EDGE_TOKEN="9f8a3e7b2d5c1f0a4e6b8c9d1a3f5b7e2c4d6a8f0b1c3e5d7f9a2b4c6e8d0f1a"

# 5. Start Backend in Tmux (so it runs in the background even if SSH closes)
echo "[*] Starting FastAPI Backend on Port 10000 inside a tmux session named 'backend'..."
tmux new-session -d -s backend "export EDGE_TOKEN='9f8a3e7b2d5c1f0a4e6b8c9d1a3f5b7e2c4d6a8f0b1c3e5d7f9a2b4c6e8d0f1a'; uvicorn main:app --host 0.0.0.0 --port 10000"

# 6. Install AI/Edge Agent Dependencies
echo "[*] Installing AI Detection dependencies..."
cd ../../
pip install ultralytics opencv-python requests

echo ""
echo "=========================================================="
echo "? SUCCESS! Backend is running in the background."
echo ""
echo "To view backend logs, type: tmux attach -t backend"
echo "(To exit logs without killing the server, press Ctrl+B, then D)"
echo ""
echo "Next steps:"
echo "1. Run your AI Agent: python aws_ppe_agent.py"
echo "2. Don't forget to open Port 10000 in your AWS EC2 Security Group!"
echo "3. Go to Vercel Dashboard -> Environment Variables -> Set VITE_API_URL to http://<YOUR_AWS_PUBLIC_IP>:10000"
echo "=========================================================="
