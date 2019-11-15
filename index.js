const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf")
const path = require("path")
inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    axios.get(queryUrl).then(function(res) {
      const repoNames = res.data.map(function(repo) {
        return repo.name;
      });
      const repoNamesStr = repoNames.join("\n");
      return htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
</head>
<body>
      <div>${repoNamesStr}</div>
</body>
</html>
`;
    })
    .then(htmlStr => {
      fs.writeFile("index.html", htmlStr, () => {
      });
    })
    .then(() => {
      /* read the file from filesystem */
      /* convert to pdf */
      const run = async () => {
        const html5ToPDF = new HTML5ToPDF({
          inputPath: path.join(__dirname, "index.html"),
          outputPath: path.join(__dirname, "great.pdf"),
          options: { printBackground: true }
        });
        await html5ToPDF.start();
        await html5ToPDF.build();
        await html5ToPDF.close();
        console.log("DONE");
        process.exit(0);
      };
      return run();
    });
  });