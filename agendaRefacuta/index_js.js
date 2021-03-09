
let url = "https://contactapp-bedd5-default-rtdb.europe-west1.firebasedatabase.app/"
let contacte = {};
let indexEditare = -1;

async function getContacte() {
    contacte = await ajax(url);
    if (contacte === null) {
        contacte = {};
    }
    draw();
}
async function ajax(url, method, body) {

    let response = await fetch(url + ".json", {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return await response.json();

}
function draw() {
    let str = "";
    for (let [i, contact] of Object.entries(contacte)) {
        str +=
            `<tr>
            <td>${contact.nume}</td>
            <td>${contact.telefon}</td>
            <td>
                <button class="modificare" onclick="modifica('${i}');">Modifica</button>
            </td>
            <td>
                <button class="sterge" onclick="sterge('${i}')">Sterge</button>
            </td>
        </tr>`;
    }
    document.querySelector(".agenda tbody").innerHTML = str;
}
async function adauga() {
    let nume = document.querySelector("#numele").value;
    let telefon = document.querySelector("#telefonul").value;
    await ajax(
        url + contacte.length,
        "PUT",
        {
            "nume": nume,
            "telefon": telefon

        }),
       await getContacte();

    document.querySelector("form").reset();
}
function modifica(idx) {
    let contact = contacte[idx];
    document.querySelector("#numele").value = contact.nume;
    document.querySelector("#telefonul").value = contact.telefon;
    indexEditare = idx;
}
async function modificaPasul2() {
    if (indexEditare === -1) {
        adauga();
    }
    await ajax(
        url + indexEditare,
        "PUT",
        {
            "nume": document.querySelector("#numele").value,
            "telefon": document.querySelector("#telefonul").value,

        }
    );
    await getContacte();
    document.querySelector("form").reset();
    cancel();
}
function cancel(){
    indexEditare = -1;
    document.querySelector("form").reset();
} 
async function sterge(idx) {
    if (confirm(`Esti sigur ca vrei sa stergi contactul ${contacte[idx].nume} ?`)) {
        await ajax(url + idx, "DELETE");
        await getContacte();
    }
}

function telInput(elem, event) {
    if (event.keyCode === 13) {
        return modificaPasul2();
    }
}

