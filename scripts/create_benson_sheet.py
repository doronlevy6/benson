#!/usr/bin/env python3
"""
Create a Google Spreadsheet named 'Benson' and seed tracker rows.

This script reuses OAuth client config from:
  /Users/dwrwnlwy/projects/anomalies/config/credentials.json

It stores a dedicated token at:
  /Users/dwrwnlwy/projects/anomalies/config/token_sheets_benson.json
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
]

CREDENTIALS_PATH = "/Users/dwrwnlwy/projects/anomalies/config/credentials.json"
TOKEN_PATH = "/Users/dwrwnlwy/projects/anomalies/config/token_sheets_benson.json"

STATUS_PATTERN = ["not_started", "in_progress", "completed"]

BUILDINGS = [
    ("benson-heights-a", ["A101", "A102", "A103", "A104", "A105"]),
    ("benson-heights-b", ["B101", "B102", "B103", "B104", "B105"]),
    ("oak-tower", ["201", "202", "203", "204"]),
]

TRADES = ["plaster", "rebar", "plumbing", "electrical", "painting", "aluminum"]


def load_client_config() -> dict:
    with open(CREDENTIALS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "gmail" not in data or "web" not in data["gmail"]:
        raise RuntimeError("Expected gmail.web OAuth client config in credentials.json")

    return {"web": data["gmail"]["web"]}


def get_credentials() -> Credentials:
    creds: Credentials | None = None

    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    if creds and creds.valid and creds.has_scopes(SCOPES):
        return creds

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        if creds.has_scopes(SCOPES):
            with open(TOKEN_PATH, "w", encoding="utf-8") as token_file:
                token_file.write(creds.to_json())
            return creds

    # One-time manual auth if token is missing or doesn't include Sheets scopes.
    client_config = load_client_config()
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)

    redirect_uris = client_config["web"].get("redirect_uris", [])
    localhost_redirect = next(
        (uri for uri in redirect_uris if uri.startswith("http://localhost")),
        None,
    )

    if not localhost_redirect:
        raise RuntimeError("OAuth client has no localhost redirect URI.")

    flow.redirect_uri = localhost_redirect
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    print("Open this URL in your browser and authorize access:")
    print(auth_url)
    print("\nPaste the full callback URL after authorization:")
    callback_url = input().strip()

    if "code=" not in callback_url:
        raise RuntimeError("Callback URL does not contain an authorization code.")

    flow.fetch_token(authorization_response=callback_url)
    creds = flow.credentials

    with open(TOKEN_PATH, "w", encoding="utf-8") as token_file:
        token_file.write(creds.to_json())

    return creds


def seed_rows():
    rows = [["buildingId", "apartmentId", "tradeId", "status", "updatedAt"]]
    now = datetime.now(timezone.utc)

    for building_index, (building_id, apartments) in enumerate(BUILDINGS):
        for apartment_index, apartment_id in enumerate(apartments):
            for trade_index, trade_id in enumerate(TRADES):
                status = STATUS_PATTERN[(building_index + apartment_index + trade_index) % len(STATUS_PATTERN)]
                days_ago = (building_index + apartment_index + trade_index) % 5
                updated_at = (now - timedelta(days=days_ago)).isoformat()
                rows.append([building_id, apartment_id, trade_id, status, updated_at])

    return rows


def main():
    creds = get_credentials()

    sheets_service = build("sheets", "v4", credentials=creds)

    spreadsheet = (
        sheets_service.spreadsheets()
        .create(body={"properties": {"title": "Benson"}}, fields="spreadsheetId,spreadsheetUrl")
        .execute()
    )

    spreadsheet_id = spreadsheet["spreadsheetId"]
    spreadsheet_url = spreadsheet["spreadsheetUrl"]

    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="A1",
        valueInputOption="RAW",
        body={"values": seed_rows()},
    ).execute()

    print(f"Spreadsheet created: {spreadsheet_url}")
    print(f"Spreadsheet ID: {spreadsheet_id}")


if __name__ == "__main__":
    main()
