#!/usr/bin/env python3
"""
Script de validation HTML pour détecter les balises mal fermées
"""

from pathlib import Path
from html.parser import HTMLParser
import re

class HTMLValidator(HTMLParser):
    """Parser HTML pour détecter les balises mal fermées"""
    
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.warnings = []
        self.line_number = 1
        self.self_closing_tags = {
            'br', 'hr', 'img', 'input', 'link', 'meta', 
            'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'
        }
        self.optional_closing = {'li', 'p', 'td', 'th', 'tr', 'option'}
        
    def handle_starttag(self, tag, attrs):
        """Gère les balises ouvrantes"""
        if tag not in self.self_closing_tags:
            self.stack.append((tag, self.getpos()[0]))
    
    def handle_endtag(self, tag):
        """Gère les balises fermantes"""
        if tag in self.self_closing_tags:
            return
            
        if not self.stack:
            self.errors.append(f"Ligne {self.getpos()[0]}: Balise fermante </{tag}> sans ouvrante correspondante")
            return
        
        # Chercher la balise correspondante dans la pile
        found = False
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                # Vérifier si des balises sont entre-deux
                if i < len(self.stack) - 1:
                    between = self.stack[i+1:]
                    # Filtrer les balises avec fermeture optionnelle
                    unclosed = [t for t in between if t[0] not in self.optional_closing]
                    if unclosed:
                        self.warnings.append(
                            f"Ligne {self.getpos()[0]}: Fermeture de <{tag}> avec {len(unclosed)} balise(s) non fermée(s): {[t[0] for t in unclosed]}"
                        )
                # Retirer la balise et toutes celles au-dessus
                self.stack = self.stack[:i]
                found = True
                break
        
        if not found:
            self.errors.append(f"Ligne {self.getpos()[0]}: Balise fermante </{tag}> sans ouvrante correspondante")
    
    def get_unclosed_tags(self):
        """Retourne les balises qui n'ont pas été fermées"""
        # Filtrer les balises optionnelles
        return [(tag, line) for tag, line in self.stack if tag not in self.optional_closing]

def validate_html_file(file_path):
    """Valide un fichier HTML"""
    print(f"\n{'='*70}")
    print(f"📄 Validation de: {file_path.name}")
    print('='*70)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        validator = HTMLValidator()
        
        try:
            validator.feed(content)
        except Exception as e:
            print(f"⚠️  Erreur de parsing: {e}")
        
        # Résultats
        has_issues = False
        
        # Erreurs critiques
        if validator.errors:
            has_issues = True
            print(f"\n🔴 {len(validator.errors)} ERREUR(S) CRITIQUE(S):")
            for error in validator.errors[:10]:  # Limiter à 10
                print(f"   • {error}")
            if len(validator.errors) > 10:
                print(f"   ... et {len(validator.errors) - 10} autres erreurs")
        
        # Balises non fermées
        unclosed = validator.get_unclosed_tags()
        if unclosed:
            has_issues = True
            print(f"\n🟠 {len(unclosed)} BALISE(S) NON FERMÉE(S):")
            for tag, line in unclosed[:10]:  # Limiter à 10
                print(f"   • <{tag}> ouverte à la ligne {line}")
            if len(unclosed) > 10:
                print(f"   ... et {len(unclosed) - 10} autres balises")
        
        # Avertissements
        if validator.warnings:
            print(f"\n🟡 {len(validator.warnings)} AVERTISSEMENT(S):")
            for warning in validator.warnings[:5]:  # Limiter à 5
                print(f"   • {warning}")
            if len(validator.warnings) > 5:
                print(f"   ... et {len(validator.warnings) - 5} autres avertissements")
        
        # Statistiques
        total_lines = content.count('\n') + 1
        
        if not has_issues:
            print(f"\n✅ HTML VALIDE - {total_lines} lignes, aucun problème détecté")
        else:
            print(f"\n❌ HTML INVALIDE - {total_lines} lignes, problèmes détectés")
        
        return not has_issues
        
    except FileNotFoundError:
        print(f"❌ Fichier introuvable: {file_path}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def check_common_issues(file_path):
    """Vérifie les problèmes courants de HTML"""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier les balises qui ne se ferment jamais
        if '<div' in content and '</div>' not in content:
            issues.append("⚠️  Balises <div> présentes mais aucune </div> trouvée")
        
        # Vérifier les balises form
        open_forms = len(re.findall(r'<form[^>]*>', content))
        close_forms = content.count('</form>')
        if open_forms != close_forms:
            issues.append(f"⚠️  Nombre de <form> ({open_forms}) ≠ nombre de </form> ({close_forms})")
        
        # Vérifier les balises modal
        open_modals = len(re.findall(r'<div[^>]*modal', content))
        if open_modals > 0:
            # Compter les </div> après la première modal
            modal_pos = content.find('modal')
            if modal_pos > 0:
                divs_after = content[modal_pos:].count('</div>')
                if divs_after < open_modals * 3:  # Chaque modal a au moins 3 div
                    issues.append(f"⚠️  Possibles balises </div> manquantes dans les modales")
        
        # Vérifier doctype
        if not content.strip().startswith('<!DOCTYPE html>'):
            issues.append("⚠️  DOCTYPE HTML manquant ou mal placé")
        
        # Vérifier balise html fermante
        if '</html>' not in content:
            issues.append("🔴 Balise </html> manquante")
        
        # Vérifier balise body fermante
        if '<body' in content and '</body>' not in content:
            issues.append("🔴 Balise </body> manquante")
        
        return issues
        
    except Exception as e:
        return [f"❌ Erreur lors de la vérification: {e}"]

def main():
    """Fonction principale"""
    print("\n" + "="*70)
    print("🔍 VALIDATION HTML - Dialektos Application")
    print("="*70)
    
    base_path = Path('pages')
    html_files = sorted(base_path.rglob('*.html'))
    
    print(f"\n📊 {len(html_files)} fichiers HTML trouvés\n")
    
    valid_count = 0
    invalid_count = 0
    critical_files = []
    
    # Vérifier chaque fichier
    for html_file in html_files:
        is_valid = validate_html_file(html_file)
        
        # Vérifier les problèmes courants
        common_issues = check_common_issues(html_file)
        if common_issues:
            print(f"\n📋 Problèmes courants détectés:")
            for issue in common_issues:
                print(f"   {issue}")
        
        if is_valid and not common_issues:
            valid_count += 1
        else:
            invalid_count += 1
            if any('🔴' in issue for issue in common_issues):
                critical_files.append(html_file.name)
    
    # Résumé
    print("\n" + "="*70)
    print("📊 RÉSUMÉ DE LA VALIDATION")
    print("="*70)
    print(f"\n✅ Fichiers valides: {valid_count}")
    print(f"❌ Fichiers avec problèmes: {invalid_count}")
    
    if critical_files:
        print(f"\n🔴 Fichiers critiques à corriger en priorité:")
        for filename in critical_files[:10]:
            print(f"   • {filename}")
    
    print("\n" + "="*70)
    
    # Vérifier quelques fichiers importants en détail
    important_files = [
        'pages/administration/note.html',
        'pages/administration/users.html',
        'pages/administration/courses.html',
        'pages/student/notes.html',
        'pages/teacher/notes.html'
    ]
    
    print("\n🎯 VÉRIFICATION DÉTAILLÉE DES PAGES IMPORTANTES:")
    print("="*70)
    
    for file_path in important_files:
        path = Path(file_path)
        if path.exists():
            validate_html_file(path)

if __name__ == "__main__":
    main()


