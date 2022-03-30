import { getOGFromPath } from './getOGFromPath.mjs';

declare class DialogElement extends HTMLElement {
    showModal(): void;
    close(): void;
}



export function addPropToOG(og: any, path: string, type: 'string' | 'boolean' | 'number' | 'object' | 'arr', baseEl: HTMLElement) {
    let dialogEl = baseEl.querySelector('dialog') as DialogElement;
    if (dialogEl === null) {
        dialogEl = document.createElement('dialog') as DialogElement;
        dialogEl.innerHTML = String.raw`
        <form>
            <fieldset>
                <legend>Add property</legend>
                <label>
                    Name: <input class=name type=text>
                </label>
                <label>
                    Value: <input class=value>
                </label>
                <menu>
                    <button value="cancel">Cancel</button>
                    <button value="confirm">Confirm</button>
                </menu>
            </fieldset>
        </form>`;
        baseEl.appendChild(dialogEl);
        dialogEl.addEventListener('click', async e => {
            switch ((e.target as HTMLButtonElement).value) {
                case 'cancel':
                    dialogEl.close();
                    break;
                case 'confirm':
                    const name = (dialogEl.querySelector('.name') as HTMLInputElement).value;
                    let valueEl = dialogEl.querySelector('.value') as HTMLInputElement;
                    let val: any = valueEl.value;
                    switch (type) {
                        case 'string':
                            val = valueEl.value;
                            break;
                        case 'boolean':
                            val = valueEl.checked;
                            break;
                        case 'number':
                            val = valueEl.valueAsNumber;
                            break;
                        case 'object':
                            val = JSON.parse(valueEl.value);
                            break;
                        case 'arr':
                            val = JSON.parse(valueEl.value);
                            break;

                    }
                    const { getOGFromPath } = await import('./getOGFromPath.mjs');
                    const ref = getOGFromPath(og, path);
                    ref.baseValue[name] = val;
            }

        })
    }
    const valEl = dialogEl.querySelector('.value') as HTMLInputElement;
    valEl.setAttribute('type', typeLookup[type]);
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
            valEl.value = '{}';
            break;
        case 'arr':
            valEl.value = '[]';
            break;


    }

    dialogEl.showModal();
}

const typeLookup = {
    string: 'text',
    number: 'number',
    boolean: 'checkbox',
    object: 'text',
    arr: 'text'
};