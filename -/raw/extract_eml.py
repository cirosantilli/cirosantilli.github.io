#!/usr/bin/env python3
from email import policy
from email.parser import BytesParser
from pathlib import Path
import argparse
import re


def safe_name(name):
    name = Path(name).name.replace("\x00", "")
    return name or "attachment"


def unique_path(directory, name):
    path = directory / safe_name(name)
    if not path.exists():
        return path

    stem = path.stem
    suffix = path.suffix
    index = 1
    while True:
        candidate = directory / f"{stem}-{index}{suffix}"
        if not candidate.exists():
            return candidate
        index += 1


def standalone_html(html):
    if re.search(r"<html(?:\s|>)", html, flags=re.IGNORECASE):
        return html
    return (
        "<!doctype html>\n"
        "<html>\n"
        '<head><meta charset="utf-8"><title>Email message</title></head>\n'
        "<body>\n"
        f"{html}\n"
        "</body>\n"
        "</html>\n"
    )


def main():
    parser = argparse.ArgumentParser(
        description="Extract an .eml message body and named attachments."
    )
    parser.add_argument("eml", type=Path, help="Input .eml file")
    parser.add_argument("outdir", type=Path, help="Directory for extracted files")
    args = parser.parse_args()

    args.outdir.mkdir(parents=True, exist_ok=True)
    msg = BytesParser(policy=policy.default).parsebytes(args.eml.read_bytes())

    html_body = None
    text_body = None
    saved = []

    for part in msg.walk():
        if part.is_multipart():
            continue

        content_type = part.get_content_type()
        disposition = part.get_content_disposition()
        filename = part.get_filename()

        if disposition == "attachment" or (filename and disposition != "inline"):
            path = unique_path(args.outdir, filename or "attachment.bin")
            path.write_bytes(part.get_payload(decode=True) or b"")
            saved.append(path.name)
            continue

        if disposition in (None, "inline") and content_type == "text/plain":
            if text_body is None:
                text_body = part.get_content()
        elif disposition in (None, "inline") and content_type == "text/html":
            if html_body is None:
                html_body = part.get_content()

    if html_body is not None:
        (args.outdir / "message.html").write_text(
            standalone_html(html_body), encoding="utf-8"
        )
        saved.insert(0, "message.html")

    if text_body is not None:
        (args.outdir / "message.txt").write_text(text_body, encoding="utf-8")
        insert_at = 1 if saved and saved[0] == "message.html" else 0
        saved.insert(insert_at, "message.txt")

    for name in saved:
        print(name)


if __name__ == "__main__":
    main()
