#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validation HTML rapide"""

import sys
from pathlib import Path
from html.parser import HTMLParser

# Force UTF-8 pour Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

class QuickValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = 0
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['br', 'hr', 'img', 'input', 'link', 'meta']:
            self.stack.append(tag)
    
    def handle_endtag(self, tag):
        if tag in ['br', 'hr', 'img', 'input', 'link', 'meta']:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors += 1

# Fichiers critiques
critical_files = [
    'pages/niveau.html',
    'pages/roles.html',
    'pages/administration/niveau.html',
    'pages/administration/roles.html',
    'pages/administration/note.html',
    'pages/administration/users.html',
    'pages/student/notes.html',
    'pages/teacher/notes.html'
]

print("\n" + "="*60)
print("VALIDATION HTML RAPIDE - Fichiers Critiques")
print("="*60 + "\n")

valid = 0
invalid = 0

for file_str in critical_files:
    path = Path(file_str)
    if not path.exists():
        print(f"X {file_str:<45} - FICHIER INTROUVABLE")
        continue
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        validator = QuickValidator()
        validator.feed(content)
        
        unclosed = len(validator.stack)
        errors = validator.errors
        
        if unclosed == 0 and errors == 0:
            print(f"OK {file_str:<45} - VALIDE")
            valid += 1
        else:
            print(f"!! {file_str:<45} - {unclosed} non fermees, {errors} erreurs")
            invalid += 1
            
    except Exception as e:
        print(f"X  {file_str:<45} - ERREUR: {e}")
        invalid += 1

print("\n" + "="*60)
print(f"RESULTAT: {valid} valides, {invalid} avec problemes")
print("="*60 + "\n")

