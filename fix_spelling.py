import os
import re
from pathlib import Path

def fix_spelling_in_html():
    """Corrige les fautes d'orthographe dans le contenu HTML (pas dans les attributs)"""
    
    # Dictionnaire des corrections : faute -> correction
    corrections = {
        # Fautes d'accord
        r'Ma Contacts': 'Mes Contacts',
        r'ma contacts': 'mes contacts',
        r'Ma Contact': 'Mes Contacts',
        r'ma contact': 'mes contacts',
        
        # Fautes d'accentuation
        r'Etudiant': 'Étudiant',
        r'etudiant': 'étudiant',
        r'Etudiants': 'Étudiants',
        r'etudiants': 'étudiants',
        r'Selectionne': 'Sélectionne',
        r'selectionne': 'sélectionne',
        r'Selectionne un etudiant': 'Sélectionne un étudiant',
        r'Sélectionne un etudiant': 'Sélectionne un étudiant',
        
        # Autres fautes potentielles
        r'Professeurs': 'Professeurs',  # OK
        r'Utilisateur': 'Utilisateur',  # OK
    }
    
    html_files = list(Path('.').rglob('*.html'))
    fixed_count = 0
    total_corrections = 0
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            file_corrections = 0
            
            # Pour chaque correction, remplacer seulement dans le contenu texte (pas dans les attributs)
            # On utilise une regex qui trouve le texte entre les balises ou dans les balises de texte
            
            for mistake, correction in corrections.items():
                if mistake == correction:  # Skip les cas OK
                    continue
                    
                # Pattern pour trouver le texte dans les balises de contenu (<p>, <h1-6>, <span>, <li>, <td>, <th>, <a>, <label>, etc.)
                # mais pas dans les attributs (src=, href=, class=, id=, etc.)
                
                # Méthode 1: Remplacer dans les balises de texte uniquement
                # Pattern: >texte< ou >texte</balise
                pattern1 = re.compile(
                    r'(>)([^<>]*?)(' + re.escape(mistake) + r')([^<>]*?)(<)',
                    re.IGNORECASE | re.MULTILINE
                )
                
                def replace_in_content(match):
                    prefix = match.group(2)
                    mistake_text = match.group(3)
                    suffix = match.group(4)
                    # Remplacer la faute en préservant la casse
                    if mistake_text.isupper():
                        replacement = correction.upper()
                    elif mistake_text[0].isupper():
                        replacement = correction.capitalize()
                    else:
                        replacement = correction.lower()
                    return match.group(1) + prefix + replacement + suffix + match.group(5)
                
                content = pattern1.sub(replace_in_content, content)
                
                # Méthode 2: Remplacer dans les balises spécifiques (plus sûr)
                # Pour les balises <p>, <h1-6>, <span>, <li>, <td>, <th>, <label>, <option>, <a>
                tag_patterns = [
                    r'(<p[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</p>)',
                    r'(<h[1-6][^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</h[1-6]>)',
                    r'(<span[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</span>)',
                    r'(<li[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</li>)',
                    r'(<td[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</td>)',
                    r'(<th[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</th>)',
                    r'(<label[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</label>)',
                    r'(<option[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</option>)',
                    r'(<a[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</a>)',
                    r'(<strong[^>]*>)(.*?)(' + re.escape(mistake) + r')(.*?)(</strong>)',
                ]
                
                for pattern_str in tag_patterns:
                    pattern = re.compile(pattern_str, re.IGNORECASE | re.MULTILINE | re.DOTALL)
                    matches = pattern.findall(content)
                    if matches:
                        def replace_in_tag(match):
                            tag_open = match.group(1)
                            before = match.group(2)
                            mistake_text = match.group(3)
                            after = match.group(4)
                            tag_close = match.group(5)
                            
                            # Remplacer la faute en préservant la casse
                            if mistake_text.isupper():
                                replacement = correction.upper()
                            elif mistake_text and mistake_text[0].isupper():
                                replacement = correction.capitalize()
                            else:
                                replacement = correction.lower()
                            
                            return tag_open + before + replacement + after + tag_close
                        
                        content = pattern.sub(replace_in_tag, content)
                
                # Compter les corrections
                count = len(re.findall(re.escape(mistake), original_content, re.IGNORECASE))
                if count > 0:
                    file_corrections += count
            
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                fixed_count += 1
                total_corrections += file_corrections
                print(f"✓ Modifié: {html_file} ({file_corrections} corrections)")
                
        except Exception as e:
            print(f"✗ Erreur avec {html_file}: {e}")
    
    print(f"\nTotal de fichiers modifiés: {fixed_count}")
    print(f"Total de corrections: {total_corrections}")

if __name__ == '__main__':
    fix_spelling_in_html()


