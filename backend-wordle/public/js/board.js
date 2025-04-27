const boardContainer = document.getElementById("boardContainer");

for (let row = 1; row <= 6; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.id = `boardRowContainer${row}`;
    rowDiv.innerHTML = `
    <div class="inputBoxContainer">
      ${[...Array(5)].map(() => `
        <div class="tile">
          <div class="tile-inner">
            <div class="tile-front">
              <input type="text" maxlength="1" class="tile-input" style="caret-color: transparent;" ${row > 1 ? 'disabled' : ''} />
            </div>
            <div class="tile-back"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
    boardContainer.appendChild(rowDiv);
}
