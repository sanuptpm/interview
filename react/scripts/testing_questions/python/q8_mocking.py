from pathlib import Path
import pytest

Path("test_posts.py").write_text('''
import json, urllib.request
from unittest.mock import patch

URL = "https://jsonplaceholder.typicode.com/posts"

def get_posts():                     # the real network call
    with urllib.request.urlopen(URL) as resp:
        return json.load(resp)

def first_title():
    return get_posts()[0]["title"]

def test_with_patch():
    with patch("test_posts.get_posts", return_value=[{"title": "hi"}]) as fake:
        assert first_title() == "hi"
    fake.assert_called_once()

def test_with_monkeypatch(monkeypatch):
    monkeypatch.setattr("test_posts.get_posts", lambda: [{"title": "yo"}])
    assert first_title() == "yo"
''')

pytest.main(["-v", "--no-header", "test_posts.py"])
