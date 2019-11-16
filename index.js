  
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf");
const path = require("path");
inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username",
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(res => {
      const name = res.data.name;
      const pic = res.data.avatar_url;
      const bio = res.data.bio;
      const repos = res.data.public_repos;
      const blog = res.data.blog;
      const repoName = res.data.login;
      return htmlStr = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" type="text/css" href="./style.css" />
            <title>${repoName}</title>
      </head>
      <body>
            <div class="contentWrapper">
            <div class="name"><h1>${name}</h1></div>
            <div><img src="${pic}" height="200" width="200"></div>
            <div><h3>${bio}</h3></div>
            <div><h3>${repos}</h3></div>
            <div><h3>${blog}</h3></div>
            </div>
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
      const createPDF = async () => {
        const html5ToPDF = new HTML5ToPDF({
          inputPath: path.join(__dirname, `./index.html`),
          outputPath: path.join(__dirname, `./${username}.pdf`),
          include: [
            path.join(__dirname, `./style.css`)
          ],
          options: { printBackground: true }
        });
        await html5ToPDF.start();
        await html5ToPDF.build();
        await html5ToPDF.close();
        console.log("DONE");
        process.exit(0);
      };
    return { html: htmlStr, pdf: createPDF() }
    });
  });
