const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const templatePath = path.join(__dirname, '_templates', 'article.html');
const markdownDir = path.join(__dirname, '_markdown');
const outputDir = path.join(__dirname, 'articles');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
        console.error('Error reading template file:', err);
        return;
    }

    fs.readdir(markdownDir, (err, files) => {
        if (err) {
            console.error('Error reading markdown directory:', err);
            return;
        }

        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const markdownFilePath = path.join(markdownDir, file);
                const outputFileName = file.replace('.md', '.html');
                const outputPath = path.join(outputDir, outputFileName);

                fs.readFile(markdownFilePath, 'utf8', (err, markdown) => {
                    if (err) {
                        console.error(`Error reading markdown file ${file}:`, err);
                        return;
                    }

                    // Extract title from the first line of markdown
                    const titleLine = markdown.split('\n')[0];
                    const title = titleLine.startsWith('# ') ? titleLine.substring(2) : 'Untitled Article';
                    
                    // Convert markdown to HTML
                    const content = marked(markdown);

                    // Replace placeholders in the template
                    let output = template.replace(/{{title}}/g, title);
                    output = output.replace('{{content}}', content);

                    fs.writeFile(outputPath, output, 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing output file ${outputFileName}:`, err);
                            return;
                        }
                        console.log(`Successfully built ${outputFileName}`);
                    });
                });
            }
        });
    });
});

