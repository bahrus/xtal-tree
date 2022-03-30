import {getOGFromPath} from './getOGFromPath.mjs';

declare class DialogElement extends HTMLElement{
    showModal(): void;
    close(): void;
}

export function addPropToOG(og: any, path: string, value: string, baseEl: HTMLElement){
    let dialogEl = baseEl.querySelector('dialog') as DialogElement;
    if(dialogEl === null){
        dialogEl = document.createElement('dialog') as DialogElement;
        baseEl.appendChild(dialogEl);
        dialogEl.addEventListener('click', e => {
            if((e.target as HTMLButtonElement).value==='cancel'){
                dialogEl.close();
            }
        })
    }
    dialogEl.innerHTML = String.raw`
<form>
    <fieldset>
        <legend>Add property</legend>
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
    </fieldset>
</form>
    `;
    dialogEl.showModal();
}