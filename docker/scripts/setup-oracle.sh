#!/bin/bash
set -euo pipefail

# ══════════════════════════════════════════════════════════════
# ComfortAir Pro — Oracle Cloud + Coolify Setup Script
# Run this AFTER you have SSH access to the Oracle Cloud VM.
# Usage: ssh ubuntu@YOUR_VM_IP 'bash -s' < docker/scripts/setup-oracle.sh
# ══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════"
echo "  ComfortAir Pro — Server Setup"
echo "═══════════════════════════════════════════════════"

# ── 1. System Updates ──────────────────────────────────
echo "[1/6] Updating system packages..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

# ── 2. Open Firewall Ports ─────────────────────────────
echo "[2/6] Configuring firewall..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || sudo sh -c 'iptables-save > /etc/iptables/rules.v4'

# ── 3. Install Coolify ─────────────────────────────────
echo "[3/6] Installing Coolify..."
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# ── 4. Create Docker network for Coolify/Traefik ──────
echo "[4/6] Creating Docker network..."
sudo docker network create web 2>/dev/null || true

# ── 5. Install useful tools ────────────────────────────
echo "[5/6] Installing utilities..."
sudo apt-get install -y -qq htop curl wget git

# ── 6. Kernel tuning for PostgreSQL & Redis ────────────
echo "[6/6] Tuning kernel parameters..."
cat <<'SYSCTL' | sudo tee /etc/sysctl.d/99-hvac.conf > /dev/null
# PostgreSQL
vm.overcommit_memory = 1
vm.swappiness = 10

# Network performance
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_tw_reuse = 1

# File descriptors
fs.file-max = 2097152
SYSCTL
sudo sysctl -p /etc/sysctl.d/99-hvac.conf 2>/dev/null

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  Coolify dashboard: http://$(curl -s ifconfig.me):8000"
echo "  VM public IP: $(curl -s ifconfig.me)"
echo ""
echo "  Next steps:"
echo "  1. Open http://YOUR_IP:8000 in your browser"
echo "  2. Create your Coolify admin account"
echo "  3. Follow the deployment guide in ORACLE_DEPLOY.md"
echo "═══════════════════════════════════════════════════"
