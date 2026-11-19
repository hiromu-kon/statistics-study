"""src/lib/stats.ts の分布関数が scipy と一致するかを確かめる。

分布表ページの値や問題の数値はこの関数から作るので、ライブラリを変えたら必ず実行する。
"""

import json
import subprocess
import sys
from pathlib import Path

from scipy import stats as st

ROOT = Path(__file__).resolve().parent.parent
TOLERANCE = 1e-9

js = json.loads(subprocess.check_output(["node", str(ROOT / "scripts/stats-values.ts")], text=True))

reference = {
    "normalCdf": [st.norm.cdf(x) for x in [-3, -1.96, -1, 0, 0.5, 1, 1.645, 1.96, 2.576, 3.5]],
    "normalQ": [st.norm.ppf(p) for p in [0.9, 0.95, 0.975, 0.995]],
    "tQ": [st.t.ppf(p, d) for p, d in [(0.975, 1), (0.975, 5), (0.95, 10), (0.975, 29), (0.995, 120)]],
    "tCdf": [st.t.cdf(x, d) for x, d in [(-2, 3), (1.5, 8)]],
    "chi2Q": [st.chi2.ppf(p, d) for p, d in [(0.025, 1), (0.975, 1), (0.95, 3), (0.05, 10), (0.975, 30), (0.99, 100)]],
    "fQ": [st.f.ppf(p, a, b) for p, a, b in [(0.95, 2, 10), (0.975, 5, 8), (0.99, 1, 20), (0.95, 10, 3)]],
    "binom": [st.binom.pmf(3, 10, 0.3)],
    "pois": [st.poisson.pmf(4, 2.5)],
}

worst = 0.0
for key, expected in reference.items():
    actual = js[key] if isinstance(js[key], list) else [js[key]]
    for a, e in zip(actual, expected):
        err = abs(a - e) / max(1.0, abs(e))
        worst = max(worst, err)
        if err > TOLERANCE:
            print(f"NG {key}: stats.ts={a} scipy={e}")

print(f"最大の相対誤差: {worst:.2e}")
sys.exit(0 if worst <= TOLERANCE else 1)
