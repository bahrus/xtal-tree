export function addPropToOG(og, path, type, baseEl, callback) {
    let dialogEl = baseEl.querySelector('dialog');
    if (dialogEl === null) {
        dialogEl = document.createElement('dialog');
        dialogEl.innerHTML = String.raw `
        <form>
            <fieldset>
                <legend>Add property</legend>
                <label>
                    Name: <input class=name type=text>
                </label>
                <!-- <label class=primitive>
                    Value: <input class=value>
                </label>
                <label class=json>
                    Value: <textarea class=json-value></textarea>
                </label> -->
                <menu>
                    <button type=button value="cancel">Cancel</button>
                    <button type=button value="confirm">Confirm</button>
                </menu>
            </fieldset>
        </form>`;
        baseEl.appendChild(dialogEl);
        dialogEl.addEventListener('click', async (e) => {
            switch (e.target.value) {
                case 'cancel':
                    dialogEl.close();
                    break;
                case 'confirm':
                    dialogEl.close();
                    const currentType = dialogEl.dataset.type;
                    const name = dialogEl.querySelector('.name').value;
                    const valueEl = dialogEl.querySelector('.value');
                    const jsonValueEl = dialogEl.querySelector('.json-value');
                    let val = valueEl.value;
                    switch (currentType) {
                        case 'string':
                            val = '';
                            break;
                        case 'boolean':
                            val = false;
                            break;
                        case 'number':
                            val = 0;
                            break;
                        case 'object':
                            val = {};
                            break;
                        case 'arr':
                            val = [];
                            break;
                    }
                    const { getOGFromPath } = await import('./getOGFromPath.mjs');
                    let currentPath = dialogEl.dataset.path;
                    const ref = getOGFromPath(og, currentPath);
                    if (currentPath === '') {
                        //og[name] = val;
                        ref.baseValue[name] = val;
                    }
                    else {
                        const objRef = ref.baseValue[ref.prop];
                        if (Array.isArray(objRef)) {
                            objRef.push(val);
                        }
                        else {
                            objRef[name] = val;
                        }
                    }
                    callback(og);
            }
        });
    }
    const valEl = dialogEl.querySelector('.value');
    const nameEl = dialogEl.querySelector('.name');
    nameEl.value = '';
    const jsonEl = dialogEl.querySelector('.json-value');
    const jsonLabel = dialogEl.querySelector('label.json');
    const primitiveLabel = dialogEl.querySelector('label.primitive');
    valEl.setAttribute('type', typeLookup[type]);
    switch (type) {
        case 'string':
        case 'number':
        case 'boolean':
            jsonLabel.style.display = 'none';
            primitiveLabel.style.display = 'block';
            break;
        case 'object':
        case 'arr':
            jsonLabel.style.display = 'block';
            primitiveLabel.style.display = 'none';
            break;
    }
    switch (type) {
        case 'number':
            valEl.value = '0';
            break;
        case 'string':
            valEl.value = 'new string';
            break;
        case 'boolean':
            valEl.value = 'false';
            break;
        case 'object':
            jsonEl.value = '{}';
            break;
        case 'arr':
            jsonEl.value = '[]';
            break;
    }
    dialogEl.dataset.type = type;
    dialogEl.dataset.path = path;
    dialogEl.showModal();
}
const typeLookup = {
    string: 'text',
    number: 'number',
    boolean: 'checkbox',
    object: 'text',
    arr: 'text'
};
