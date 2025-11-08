#!/usr/bin/env python3
"""
Script pour corriger le placement des modales dans les fichiers HTML
Les modales doivent être AVANT les scripts, pas après
"""

import re
from pathlib import Path

def fix_modal_placement(file_path):
    """Déplace les modales avant les scripts"""
    print(f"\n📄 Traitement de {file_path.name}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Chercher les modales qui sont après les scripts
        # Pattern : scripts ... modal ... plus de scripts ... </body>
        pattern = re.compile(
            r'(<!-- Kaiadmin DEMO methods.*?-->\s*<script[^>]*>.*?</script>\s*)'
            r'(<!-- Modal:.*?(?:</div>\s*){3,4})\s*'
            r'(<script>)',
            re.DOTALL
        )
        
        if pattern.search(content):
            print("   ⚠️  Modales trouvées après les scripts")
            
            # Extraire les modales
            modal_section_pattern = re.compile(
                r'(</script>\s*)'
                r'((?:<!-- Modal:.*?</div>\s*</div>\s*</div>\s*)+)',
                re.DOTALL
            )
            
            match = modal_section_pattern.search(content)
            if match:
                # Trouver où placer les modales (avant les scripts)
                script_start = content.find('<!--   Core JS Files   -->')
                if script_start == -1:
                    script_start = content.find('<script src=')
                
                if script_start > 0:
                    modals = match.group(2)
                    
                    # Retirer les modales de leur position actuelle
                    new_content = content.replace(match.group(0), match.group(1))
                    
                    # Insérer les modales avant les scripts
                    new_content = new_content[:script_start] + '\n' + modals + '\n' + new_content[script_start:]
                    
                    # Sauvegarder
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print("   ✅ Modales déplacées avant les scripts")
                    return True
        else:
            print("   ℹ️  Pas de modales mal placées détectées")
            return False
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

def fix_form_closing_in_modal(file_path):
    """Corrige les balises form/div mal ordonnées dans les modales"""
    print(f"📄 Correction des balises form dans {file_path.name}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern pour détecter : </div> \n </form> \n </div>
        # Devrait être : </form> \n </div> \n </div>
        pattern = re.compile(
            r'(</div>\s*)'  # Ferme modal-footer ou modal-body
            r'(</div>\s*)'  # Ferme modal-content (ERREUR ici!)
            r'(</form>\s*)'  # Ferme form (APRÈS modal-content - ERREUR!)
            r'(</div>)',    # Ferme modal-dialog
            re.MULTILINE
        )
        
        # Remplacer par l'ordre correct
        content = pattern.sub(r'\1\3\2\4', content)  # Inverser </div> et </form>
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print("   ✅ Ordre des balises corrigé")
            return True
        else:
            print("   ℹ️  Ordre des balises correct")
            return False
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("\n" + "="*70)
    print("🔧 CORRECTION DU PLACEMENT DES MODALES")
    print("="*70)
    
    base_path = Path('pages')
    html_files = sorted(base_path.rglob('*.html'))
    
    # Fichiers critiques identifiés
    critical_files = [
        'pages/niveau.html',
        'pages/roles.html',
        'pages/administration/niveau.html',
        'pages/administration/roles.html'
    ]
    
    print(f"\n🎯 Correction des {len(critical_files)} fichiers critiques...")
    
    fixed_count = 0
    for file_str in critical_files:
        file_path = Path(file_str)
        if file_path.exists():
            # Corriger l'ordre des balises form/div
            if fix_form_closing_in_modal(file_path):
                fixed_count += 1
    
    print("\n" + "="*70)
    print(f"✨ Terminé! {fixed_count} fichiers corrigés")
    print("="*70)

if __name__ == "__main__":
    main()


