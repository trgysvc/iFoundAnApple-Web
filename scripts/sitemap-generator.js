import fs from 'fs';
import path from 'path';

/**
 * Sitemap Generator
 * Generates a sitemap.xml file for the iFoundAnApple website
 * with current date as lastmod for all URLs
 */

const DOMAIN = 'https://ifoundanapple.com';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Define sitemap entries with their properties
const sitemapEntries = [
  {
    loc: '/',
    changefreq: 'weekly',
    priority: '1.0',
    description: 'Homepage - Highest Priority'
  },
  {
    loc: '/login',
    changefreq: 'monthly',
    priority: '0.7',
    description: 'Login Page'
  },
  {
    loc: '/register',
    changefreq: 'monthly',
    priority: '0.7',
    description: 'Register Page'
  },
  {
    loc: '/privacy',
    changefreq: 'monthly',
    priority: '0.6',
    description: 'Privacy Policy'
  },
  {
    loc: '/terms',
    changefreq: 'monthly',
    priority: '0.6',
    description: 'Terms of Service'
  },
  {
    loc: '/contact',
    changefreq: 'monthly',
    priority: '0.8',
    description: 'Contact Page'
  },
  {
    loc: '/faq',
    changefreq: 'monthly',
    priority: '0.8',
    description: 'FAQ Page'
  }
];

/**
 * Generate the sitemap XML content
 */
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;
  
  sitemapEntries.forEach((entry, index) => {
    xml += `  <!-- ${entry.description} -->\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${entry.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += `  </url>\n`;
    
    // Add blank line between entries except for the last one
    if (index < sitemapEntries.length - 1) {
      xml += `\n`;
    }
  });
  
  xml += `\n</urlset>\n`;
  
  return xml;
}

/**
 * Generate and write sitemap to file
 */
function generateSitemapFile() {
  try {
    console.log('🔄 Generating sitemap...');
    
    // Generate XML content
    const sitemapXml = generateSitemap();
    
    // Ensure the public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log(`📁 Created directory: ${publicDir}`);
    }
    
    // Write to file
    fs.writeFileSync(OUTPUT_PATH, sitemapXml, 'utf-8');
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📄 Location: ${OUTPUT_PATH}`);
    console.log(`🌐 Sitemap URL: ${DOMAIN}/sitemap.xml`);
    console.log(`📊 Total URLs: ${sitemapEntries.length}`);
    
    // Show summary
    console.log('\n📋 Included URLs:');
    sitemapEntries.forEach(entry => {
      console.log(`   - ${DOMAIN}${entry.loc} (Priority: ${entry.priority})`);
    });
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
// Check if this is the main module
const isMainModule = import.meta.url.includes('sitemap-generator.js');
if (isMainModule) {
  generateSitemapFile();
}

export { generateSitemap, generateSitemapFile };

