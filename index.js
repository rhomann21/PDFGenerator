  
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf");
const path = require("path");
let starCount = 0;
inquirer
  .prompt([{
    message: "Enter your GitHub username:",
    name: "username",
  },
  {
    message: "What is your favorite color?",
    name: "color",
  }])
  .then(function({ username, color }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(res => {
      const name = res.data.name;
      const pic = res.data.avatar_url;
      const bio = res.data.bio;
      const repos = res.data.public_repos;
      const blog = res.data.blog;
      const followers = res.data.followers;
      const following = res.data.following;
      const location = res.data.location;
      const repoName = res.data.html_url;
      const stars = `https://api.github.com/users/${username}/repos`;


      axios.get(stars).then(res => {

          res.data.forEach(element => {
              starCount += element.stargazers_count;
          })

          htmlStr = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link rel="stylesheet" type="text/css" href="./style.css" />
                <title>${name}</title>
          </head>
          <body style="background-color:${color}">
                <div class="contentWrapper">
                <div class="name"><h1>${name}</h1></div>
                <div><img src="${pic}" height="200" width="200"></div>
                <div><h3><a href src="${repoName}">GitHub Link</a></h3></div>
                <div><h3>Located in ${location}</h3></div>
                <div><h3>Bio: ${bio}</h3></div>
                <div><h3>Number of public repos: ${repos}</h3></div>
                <div><h3>Blog: ${blog}</h3></div>
                <div><h3>Number of followers: ${followers}</h3></div>
                <div><h3>Number of following: ${following}</h3></div>
                <div><h3>Starred repos: ${starCount}</h3></div>
                </div>
                </body>
          </html>`


      fs.writeFile(`${username}.html`, htmlStr, () => {
      /* read the file from filesystem */
      /* convert to pdf */
      const createPDF = async () => {
        const html5ToPDF = new HTML5ToPDF({
          inputPath: path.join(__dirname, `./${username}.html`),
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
});
  });
