import { html, css, LitElement } from "lit";
import { queryAll, state } from "lit/decorators.js";

export class TestLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      font-family: "system-ui";
      font-size: 16px;
      line-height: 24px;
      color: var(--test-lit-text-color, #000);
    }
    ul {
      margin: 0;
      padding: 0;
      cursor: pointer;
    }
    ul li {
      display: flex;
      color: black;
      list-style: none;
      padding: 8px;
      gap: 8px;
      margin: 0;
    }
    ul li:focus {
      background-color: green;
      color: white;
    }
  `;

  @queryAll("li")
  liElement!: HTMLLIElement[];

  @state()
  list = [
    "This is the option 1",
    "This is the option 2",
    "This is the option 3",
  ];

  @state()
  selectedIndex = 0;

  onMouseDown(item: string) {
    const event = new CustomEvent("autosuggest-option-select", {
      detail: { value: item },
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  onKeydown(event: KeyboardEvent, item: string) {
    const listLength = this.list.length;
    const activeElementId = this.shadowRoot?.activeElement?.id.slice(-1);
    const activeId = parseInt(activeElementId as string, 10);
  
    if (event.key === "Enter") {
      this.onMouseDown(item);
      return;
    }

    if (event.key === "ArrowDown") {
      if (activeId <= listLength && this.selectedIndex < listLength - 1) {
        this.selectedIndex += 1;
      } else {
        this.selectedIndex = 0;
      }
    }

    if (event.key === "ArrowUp") {
      if (activeId <= listLength && this.selectedIndex > 0) {
        this.selectedIndex -= 1;
      } else {
        this.selectedIndex = listLength - 1;
      }
    }

    this.liElement[this.selectedIndex]?.focus();
  }

  render() {
    return html`
      <ul role="listbox" aria-label="suggestions">
        ${this.list.map(
          (item, index) =>
            html`<li
              role="option"
              id="${`item-${index}`}"
              tabindex="${index ? -1 : 0}"
              aria-selected="${index === this.selectedIndex}"
              @mousedown="${() => this.onMouseDown(item)}"
              @keydown="${(event: KeyboardEvent) =>
                this.onKeydown(event, item)}"
            >
              ${item}
            </li>`
        )}
      </ul>
    `;
  }
}
