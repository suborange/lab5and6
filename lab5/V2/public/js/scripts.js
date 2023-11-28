// alert("script file successful!");
// const fetch = require('node-fetch');
// import fetch from 'node-fetch';

// event listeners
let authorLinks = document.querySelectorAll("a");
for (link of authorLinks) {
  link.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
  const myModal = new bootstrap.Modal(document.getElementById('authorModal'));
  myModal.show();

  // or
  // const myModalAlternative = new bootstrap.Modal('#myModal', options)
  let url = `/api/author/${this.id}`; // send the a link id to this
  let response = await fetch(url);
  let data = await response.json();

  // console.log( "data: " + data[0].firstName);
  console.dir(data);

  let authorInfo = document.querySelector("#authorInfo");
  authorInfo.innerHTML = 
    `<h1> ${data[0].firstName} ${data[0].lastName} </h1>`;
  authorInfo.innerHTML += 
    `<img src="${data[0].portrait}" width="200"><br>`;

  let details = document.querySelector("#authorDetails");
  details.innerHTML =
    `<p> <strong>DOB:</strong> ${data[0].dob}</p> 
      <p> <strong>DOD:</strong> ${data[0].dod}</p> 
        <p><strong>Sex:</strong> ${data[0].sex}</p> 
          <p> <strong>Profession:</strong> ${data[0].profession}</p>
            <p> <strong>Country:</strong> ${data[0].country}</p> 
              <p><strong>Biography:</strong> ${data[0].biography}</p> ` ;
  
}