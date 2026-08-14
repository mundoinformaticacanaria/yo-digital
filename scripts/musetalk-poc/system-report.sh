#!/usr/bin/env bash
set -euo pipefail

section() {
  printf '\n== %s ==\n' "$1"
}

section "Yo-digital MuseTalk PoC system report"
date -Iseconds 2>/dev/null || date
uname -a

section "NVIDIA"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,driver_version,memory.total,memory.free --format=csv,noheader || nvidia-smi
else
  echo "nvidia-smi: unavailable"
fi

section "Memory"
if command -v free >/dev/null 2>&1; then
  free -h
else
  echo "free: unavailable"
fi

section "Disk"
df -h . || true

section "Python"
python3 --version 2>&1 || echo "python3: unavailable"

section "FFmpeg"
if command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -version 2>&1 | head -n 1
else
  echo "ffmpeg: unavailable"
fi

section "PyTorch / CUDA"
python3 - <<'PY' || true
try:
    import torch
except Exception as exc:
    print(f"torch: unavailable ({type(exc).__name__}: {exc})")
else:
    print("torch:", torch.__version__)
    print("cuda_runtime:", torch.version.cuda)
    print("cuda_available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        try:
            props = torch.cuda.get_device_properties(0)
            print("device:", torch.cuda.get_device_name(0))
            print("vram_total_mb:", round(props.total_memory / 1024**2, 1))
            print("vram_allocated_mb:", round(torch.cuda.memory_allocated(0) / 1024**2, 1))
            print("vram_reserved_mb:", round(torch.cuda.memory_reserved(0) / 1024**2, 1))
        except Exception as exc:
            print(f"cuda_device_details_error: {type(exc).__name__}: {exc}")
PY

section "Privacy"
echo "This report contains system metrics only. Do not add private avatar/audio paths or biometric files to GitHub."
