#!/usr/bin/env python3
"""Generate a 6-digit password-reset OTP using the OS CSPRNG."""
from __future__ import annotations

import secrets
import sys


def generate_otp(digits: int = 6) -> str:
    if digits < 4 or digits > 10:
        raise ValueError("digits must be between 4 and 10")
    span = 10**digits
    return f"{secrets.randbelow(span):0{digits}d}"


def main() -> int:
    n = 6
    if len(sys.argv) > 1:
        n = int(sys.argv[1])
    sys.stdout.write(generate_otp(n))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
