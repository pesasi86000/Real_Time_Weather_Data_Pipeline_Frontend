#!/usr/bin/env python3
"""
weather_collector.py
--------------------
Scheduled weather data collector for the WeatherPro frontend.

Fetches live weather from your Flask backend on a configurable interval
and appends records to  public/weather_history.csv  so the History page
can display them immediately (no server restart needed).

Usage
-----
  # Install dependencies once:
  pip install -r requirements_collector.txt

  # Collect once (good for testing):
  python weather_collector.py --once

  # Run continuously every 30 minutes (default):
  python weather_collector.py

  # Custom interval and cities:
  python weather_collector.py --interval 60 --cities London Tokyo Sydney

  # Custom CSV output path:
  python weather_collector.py --csv path/to/other.csv
"""

import argparse
import csv
import logging
import sys
import time
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit(
        "ERROR: 'requests' is not installed.\n"
        "Run:  pip install -r requirements_collector.txt"
    )

try:
    import schedule
except ImportError:
    sys.exit(
        "ERROR: 'schedule' is not installed.\n"
        "Run:  pip install -r requirements_collector.txt"
    )

# ── Defaults ───────────────────────────────────────────────────────────────────
DEFAULT_API_URL  = "http://127.0.0.1:5000/weather"
DEFAULT_CSV_PATH = Path(__file__).parent / "public" / "weather_history.csv"
DEFAULT_CITIES   = ["London", "New York", "Tokyo", "Sydney", "Paris", "Dubai"]
DEFAULT_INTERVAL = 30    # minutes
REQUEST_TIMEOUT  = 10    # seconds

CSV_HEADERS = [
    "Date",
    "Time",
    "Location",
    "Temperature (°C)",
    "Humidity (%)",
    "Wind Speed (km/h)",
    "Pressure (hPa)",
    "Condition",
]

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("weather_collector")


# ── Helpers ────────────────────────────────────────────────────────────────────

def fetch_weather(city: str, api_url: str) -> dict | None:
    """
    Call the Flask backend for one city.
    Returns a CSV-ready dict on success, or None on any error.
    The backend may return different field names depending on the weather
    provider, so we try multiple key names.
    """
    try:
        resp = requests.get(
            api_url,
            params={"city": city},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        temp      = data.get("temperature") or data.get("temp", "")
        humidity  = data.get("humidity") or data.get("humidity_percent", "")
        wind      = data.get("wind_speed", "")
        pressure  = data.get("pressure") or data.get("pressure_hpa", "")
        condition = data.get("condition") or data.get("weather", "Unknown")
        location  = (
            data.get("city") or data.get("location") or
            data.get("title") or city
        )

        now = datetime.now()
        return {
            "Date":              now.strftime("%Y-%m-%d"),
            "Time":              now.strftime("%H:%M"),
            "Location":          location,
            "Temperature (°C)":  temp,
            "Humidity (%)":      humidity,
            "Wind Speed (km/h)": wind,
            "Pressure (hPa)":    pressure,
            "Condition":         condition,
        }

    except requests.exceptions.ConnectionError:
        log.warning(
            "  ✗  %-20s  Cannot reach backend at %s — is Flask running?",
            city, api_url,
        )
    except requests.exceptions.Timeout:
        log.warning("  ✗  %-20s  Request timed out after %ds", city, REQUEST_TIMEOUT)
    except requests.exceptions.HTTPError as exc:
        log.warning("  ✗  %-20s  HTTP %s", city, exc.response.status_code)
    except Exception as exc:                           # noqa: BLE001
        log.error("  ✗  %-20s  Unexpected error: %s", city, exc)

    return None


def ensure_csv(csv_path: Path) -> None:
    """Create the CSV file with headers if it does not already exist."""
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    if not csv_path.exists():
        with open(csv_path, "w", newline="", encoding="utf-8") as fh:
            csv.DictWriter(fh, fieldnames=CSV_HEADERS).writeheader()
        log.info("Created  %s", csv_path)


def append_rows(csv_path: Path, rows: list[dict]) -> None:
    """Append a list of weather dicts to the CSV."""
    with open(csv_path, "a", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_HEADERS, extrasaction="ignore")
        for row in rows:
            writer.writerow(row)


# ── Core collection task ───────────────────────────────────────────────────────

def collect_all(cities: list[str], api_url: str, csv_path: Path) -> None:
    """
    Fetch weather for every city and append results to the CSV.
    Called once immediately on start, then on each scheduled tick.
    """
    log.info("─── Collection run started (%d cities) ───────────────────", len(cities))

    rows: list[dict] = []
    for city in cities:
        record = fetch_weather(city, api_url)
        if record:
            rows.append(record)
            log.info(
                "  ✓  %-20s  %s°C  /  %s%%  /  %s km/h  —  %s",
                record["Location"],
                record["Temperature (°C)"],
                record["Humidity (%)"],
                record["Wind Speed (km/h)"],
                record["Condition"],
            )

    if rows:
        append_rows(csv_path, rows)
        log.info(
            "─── Appended %d/%d records to %s ───────────────────────",
            len(rows), len(cities), csv_path,
        )
    else:
        log.warning(
            "─── No records collected this run (backend may be offline) ───"
        )


# ── Entry-point ────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="WeatherPro scheduled data collector",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--interval", type=int, default=DEFAULT_INTERVAL, metavar="MINUTES",
        help="How often to collect data (minutes)",
    )
    parser.add_argument(
        "--cities", nargs="+", default=DEFAULT_CITIES, metavar="CITY",
        help="Cities to collect weather for",
    )
    parser.add_argument(
        "--api", default=DEFAULT_API_URL, metavar="URL",
        help="Flask backend base URL",
    )
    parser.add_argument(
        "--csv", type=Path, default=DEFAULT_CSV_PATH, metavar="PATH",
        help="Output CSV file path",
    )
    parser.add_argument(
        "--once", action="store_true",
        help="Collect once immediately and exit (useful for testing)",
    )
    args = parser.parse_args()

    ensure_csv(args.csv)

    # ── Single-run mode ────────────────────────────────────────────────────────
    if args.once:
        log.info("Running in single-collection mode (--once)")
        collect_all(args.cities, args.api, args.csv)
        log.info("Done.")
        return

    # ── Continuous scheduler mode ──────────────────────────────────────────────
    log.info("WeatherPro Collector starting")
    log.info("  Cities   : %s", ", ".join(args.cities))
    log.info("  Interval : every %d minutes", args.interval)
    log.info("  CSV      : %s", args.csv)
    log.info("  API      : %s", args.api)
    log.info("Press Ctrl+C to stop.\n")

    # Run one collection immediately so the CSV has data right away
    collect_all(args.cities, args.api, args.csv)

    # Schedule recurring collections
    schedule.every(args.interval).minutes.do(
        collect_all, args.cities, args.api, args.csv
    )

    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        log.info("\nCollector stopped by user.")


if __name__ == "__main__":
    main()
