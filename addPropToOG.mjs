export function addPropToOG(og, path, value, baseEl) {
    let dialogEl = baseEl.querySelector('dialog');
    if (dialogEl === null) {
        dialogEl = document.createElement('dialog');
        baseEl.appendChild(dialogEl);
        dialogEl.addEventListener('click', e => {
            if (e.target.value === 'cancel') {
                dialogEl.close();
            }
        });
    }
    dialogEl.innerHTML = String.raw `
<label>
    Name: <input type=text>
</label>
<label>
    Value: <input type=checkbox>
</label>
<menu>
    <button value="cancel">Cancel</button>
    <button value="default">Confirm</button>
</menu>
    `;
    dialogEl.showModal();
}
