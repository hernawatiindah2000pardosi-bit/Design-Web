const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("search");
const emptyState = document.getElementById("emptyState");
const submitBtn = document.getElementById("submitBtn");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;

function saveToLocalStorage(){
localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts(){

contactList.innerHTML = "";

if(contacts.length === 0){
emptyState.style.display = "block";
return;
}else{
emptyState.style.display = "none";
}

contacts.forEach((contact,index)=>{

const card = document.createElement("div");
card.className = "contact-card";

const avatar = contact.name.charAt(0).toUpperCase();

card.innerHTML = `
<div class="contact-info">

<div class="avatar">${avatar}</div>

<div class="contact-text">
<div class="contact-name">${contact.name}</div>
<div class="contact-phone">${contact.phone}</div>
</div>

</div>

<div class="actions">
<button class="editBtn">Edit</button>
<button class="deleteBtn">Delete</button>
</div>
`;

card.querySelector(".deleteBtn").onclick = () =>{
contacts.splice(index,1);
saveToLocalStorage();
renderContacts();
};

card.querySelector(".editBtn").onclick = () =>{

nameInput.value = contact.name;
phoneInput.value = contact.phone;

editIndex = index;

submitBtn.textContent = "Update Contact";

};

contactList.appendChild(card);

});

}

form.addEventListener("submit", function(e){

e.preventDefault();

const name = nameInput.value;
const phone = phoneInput.value;

if(editIndex !== null){

contacts[editIndex] = {name,phone};
editIndex = null;
submitBtn.textContent = "Add Contact";

}else{

contacts.push({name,phone});

}

saveToLocalStorage();
renderContacts();

form.reset();

});

searchInput.addEventListener("keyup",function(){

const keyword = searchInput.value.toLowerCase();

const filtered = contacts.filter(contact =>
contact.name.toLowerCase().includes(keyword) ||
contact.phone.includes(keyword)
);

contactList.innerHTML="";

filtered.forEach(contact=>{

const card = document.createElement("div");
card.className="contact-card";

const avatar = contact.name.charAt(0).toUpperCase();

card.innerHTML=`
<div class="contact-info">

<div class="avatar">${avatar}</div>

<div class="contact-text">
<div class="contact-name">${contact.name}</div>
<div class="contact-phone">${contact.phone}</div>
</div>

</div>
`;

contactList.appendChild(card);

});

});

renderContacts();