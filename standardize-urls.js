/**
 * Script pour standardiser l'utilisation des URLs dans les fichiers JavaScript
 * Ce script identifie les URLs en dur et les remplace par les variables CONFIG
 */

const fs = require('fs');
const path = require('path');

// Mapping des endpoints
const endpointMappings = {
  '/api/dj_rest_auth/login/': 'CONFIG.ENDPOINTS.AUTH.LOGIN',
  '/api/dj_rest_auth/logout/': 'CONFIG.ENDPOINTS.AUTH.LOGOUT',
  '/api/user/me/complete-info': 'CONFIG.ENDPOINTS.AUTH.USER_INFO',
  '/api/user/me/': 'CONFIG.ENDPOINTS.AUTH.USER_ME',
  '/api/users/': 'CONFIG.ENDPOINTS.USERS',
  '/api/students/': 'CONFIG.ENDPOINTS.STUDENTS',
  '/api/teachers/': 'CONFIG.ENDPOINTS.TEACHERS',
  '/api/classes/': 'CONFIG.ENDPOINTS.CLASSES',
  '/api/courses/': 'CONFIG.ENDPOINTS.COURSES',
  '/api/courses-affectation/': 'CONFIG.ENDPOINTS.COURSES_AFFECTATION',
  '/api/homework/': 'CONFIG.ENDPOINTS.HOMEWORK',
  '/api/result-homework/': 'CONFIG.ENDPOINTS.RESULTS',
  '/api/Questions/': 'CONFIG.ENDPOINTS.QUESTIONS',
  '/api/categorie/': 'CONFIG.ENDPOINTS.CATEGORIES',
  '/api/level/': 'CONFIG.ENDPOINTS.LEVELS',
  '/api/roles/': 'CONFIG.ENDPOINTS.ROLES',
  '/api/affectationStudents/': 'CONFIG.ENDPOINTS.AFFECTATION_STUDENTS',
  '/api/sendEmail/': 'CONFIG.ENDPOINTS.SEND_EMAIL'
};

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remplacer les URLs en dur par les variables CONFIG
    for (const [url, configVar] of Object.entries(endpointMappings)) {
      const patterns = [
        `CONFIG.BASE_URL + '${url}'`,
        `CONFIG.BASE_URL + "${url}"`,
        `'${url}'`,
        `"${url}"`
      ];
      
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          content = content.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `CONFIG.BASE_URL + ${configVar}`);
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Modifié: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let modifiedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      modifiedCount += processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      if (processFile(filePath)) {
        modifiedCount++;
      }
    }
  }
  
  return modifiedCount;
}

// Exécution du script
console.log('🔍 Recherche et standardisation des URLs...');
const apiDir = path.join(__dirname, 'assets', 'js', 'API');
const modifiedCount = processDirectory(apiDir);

console.log(`\n✅ Standardisation terminée !`);
console.log(`📊 ${modifiedCount} fichiers modifiés`);
console.log('\n📋 Résumé des changements:');
console.log('- URLs en dur remplacées par CONFIG.BASE_URL + CONFIG.ENDPOINTS.*');
console.log('- Amélioration de la maintenabilité du code');
console.log('- Centralisation de la configuration des endpoints');


