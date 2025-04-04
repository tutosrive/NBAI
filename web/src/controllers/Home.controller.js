document.addEventListener("DOMContentLoaded", function () {
    // inciializar bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  
    // tablero para cada rango
    const boardSizeOptions = {
      Cadet: [
        { value: "10x10", text: "10x10" },
        { value: "11x11", text: "11x11" },
        { value: "12x12", text: "12x12" },
      ],
      Seafarer: [
        { value: "13x13", text: "13x13" },
        { value: "14x14", text: "14x14" },
      ],
      Commander: [
        { value: "15x15", text: "15x15" },
        { value: "16x16", text: "16x16" },
      ],
      Captain: [
        { value: "17x17", text: "17x17" },
        { value: "18x18", text: "18x18" },
      ],
      Admiral: [
        { value: "19x19", text: "19x19" },
        { value: "20x20", text: "20x20" },
      ],
    };
  
    const boardSizeSelect = document.getElementById("board");
    const rankCheckboxes = document.querySelectorAll('input[name="rank"]');
  
    /**
     * Generates HTML options for a select element
     * @param {Object} options - Configuration object
     * @param {Array} options.items - Array of objects to create options from
     * @param {string} options.value - Property name to use as option value
     * @param {string} options.text - Property name to use as option text
     * @param {string} options.selected - Value that should be marked as selected
     * @param {string} options.firstOption - Optional first option text (empty value)
     * @returns {string} HTML string with option elements
     */
    function toOptionList({
      items = [],
      value = "value",
      text = "text",
      selected = "",
      firstOption = "",
    } = {}) {
      let optionsHTML = "";
  
      if (firstOption) {
        optionsHTML += `<option value="">${firstOption}</option>`;
      }
  
      items.forEach((item) => {
        const isSelected = item[value] == selected;
        optionsHTML += `<option value="${item[value]}" ${
          isSelected ? "selected" : ""
        }>${item[text]}</option>`;
      });
  
      return optionsHTML;
    }
  
    /**
     * actualizar las opciones de tamaño del tablero según el rango seleccionado
     * @param {*} selectedRank
     */
    function updateBoardSizes(selectedRank) {
      const sizes = boardSizeOptions[selectedRank];
  
      boardSizeSelect.innerHTML = toOptionList({
        items: sizes,
        value: "value",
        text: "text",
        firstOption: "Select size...",
      });
    }
  
    // Change event for rank selection
    rankCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          // Desmarcar otros checkboxes
          rankCheckboxes.forEach((cb) => {
            if (cb !== this) cb.checked = false;
          });
  
          updateBoardSizes(this.value);
        }
      });
    });
  
    // Set default selection
    const firstRankCheckbox = document.querySelector('input[name="rank"]');
    if (firstRankCheckbox) {
      firstRankCheckbox.checked = true;
      updateBoardSizes(firstRankCheckbox.value);
    }
  
    // Start button functionality
    const startButton = document.querySelector(".btn-start");
    startButton.addEventListener("click", function () {
      const selectedMap = document.querySelector('input[name="map"]:checked');
      const selectedRank = document.querySelector('input[name="rank"]:checked');
      const selectedSize = boardSizeSelect.value;
  
      if (!selectedMap) {
        alert("Please select a map");
        return;
      }
  
      if (!selectedRank) {
        alert("Please select a rank");
        return;
      }
  
      if (!selectedSize) {
        alert("Please select a board size");
        return;
      }
  
      alert(
        `Game starting with:\nMap: ${selectedMap.value}\nRank: ${selectedRank.value}\nBoard Size: ${selectedSize}`
      );
    });
  });
  