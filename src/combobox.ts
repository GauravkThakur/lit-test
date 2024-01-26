import { LitElement, css, html, nothing } from "lit";
import { property, query, queryAll, state } from "lit/decorators.js";

export class ComboboxComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      font-family: "system-ui";
      font-size: 16px;
      line-height: 24px;
      color: var(--test-lit-text-color, #000);
    }

    .combobox-wrapper {
      display: inline-block;
      position: relative;
      font-size: 16px;
    }

    .combobox-label {
      font-size: 14px;
      font-weight: bold;
      margin-right: 5px;
    }

    ul {
      width: 100%;
      background: white;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      z-index: 1;
    }

    ul li {
      cursor: default;
      display: flex;
      color: black;
      padding: 8px;
      gap: 8px;
      margin: 0;
    }

    ul li:hover {
      background: rgb(139, 189, 225);
      color: white;
    }

    ul li:focus,
    ul li.focused {
      background: rgb(139, 189, 225);
      color: white;
      outline: -webkit-focus-ring-color auto 1px;
    }

    .combobox-wrapper input {
      font-size: inherit;
      border: 1px solid #aaa;
      border-radius: 2px;
      line-height: 1.5em;
      padding: 4px;
      width: 200px;
    }

    .combobox-dropdown {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 0 2px;
      height: 1.5em;
      border-radius: 0 2px 2px 0;
      border: none;
    }
  `;

  @property({ type: Number })
  private readonly selectedIndex = 0;

  @property({ type: Array })
  private readonly items = [
    "This is the option 1",
    "This is the option 2",
    "This is the option 3",
  ];

  @state()
  isVisible = false;

  @state()
  activeIndex = this.selectedIndex;

  @queryAll("li")
  liElement!: HTMLLIElement[];

  @query("input")
  inputElement!: HTMLInputElement;

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      return;
    }

    this.isVisible = this.inputElement.value.trim() !== "";

    if (!this.isVisible) {
      this.resetElements();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.inputElement.value.trim() === "") return;

    if (event.key === "Enter") {
      this.onSelect(this.activeIndex);
    }

    if (event.key === "ArrowUp") {
      if (this.activeIndex <= 0) {
        this.activeIndex = this.items.length - 1;
      } else {
        this.activeIndex -= 1;
      }
    }

    if (event.key === "ArrowDown") {
      if (
        this.activeIndex === -1 ||
        this.activeIndex >= this.items.length - 1
      ) {
        this.activeIndex = 0;
      } else {
        this.activeIndex += 1;
      }
    }
  }

  onSelect(index: number) {
    const event = new CustomEvent("autosuggest-option-select", {
      detail: { value: this.items[index] },
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(event);
    this.resetElements();
  }

  resetElements() {
    this.isVisible = false;
    this.inputElement.value = "";
    this.activeIndex = this.selectedIndex;
  }

  protected render(): unknown {
    return html`
      <label for="combobox-input" class="combobox-label">
        Combobox Component
      </label>
      <div class="combobox-wrapper">
        <div
          role="combobox"
          aria-expanded="${this.isVisible}"
          aria-haspopup="listbox"
        >
          <input
            name="combobox-input"
            type="text"
            aria-activedescendant="${this.isVisible && this.activeIndex !== -1
              ? `${`item-${this.activeIndex}`}`
              : nothing}"
            @keyup="${this.onKeyUp}"
            @keydown="${this.onKeyDown}"
          />
        </div>
        ${this.isVisible
          ? html`<ul role="listbox" aria-label="suggestions">
              ${this.items.map(
                (item, index) =>
                  html`<li
                    role="option"
                    id="${`item-${index}`}"
                    tabindex="${index ? -1 : 0}"
                    class="result ${index === this.activeIndex
                      ? "focused"
                      : ""}"
                    aria-selected="${index === this.activeIndex}"
                    @click="${() => this.onSelect(index)}"
                  >
                    ${item}
                  </li>`
              )}
            </ul>`
          : html``}
      </div>
    `;
  }
}
