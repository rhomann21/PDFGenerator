  
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
      <div>${name}</div>
      <div>${pic}</div>
      <div>${bio}</div>
      <div>${repos}</div>
      <div>${blog}</div>
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
          inputPath: path.join(__dirname, "./index.html"),
          outputPath: path.join(__dirname, "repos.pdf"),
          //include: [
        //    path.join(__dirname, "./node_modules/frow/dist/frow.min.css"),
        //    path.join(__dirname, "./styles.css")
        //  ],
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